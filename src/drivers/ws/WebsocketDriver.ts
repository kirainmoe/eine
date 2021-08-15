import Websocket from "ws";

import Eine from "../..";

import {
  ContextType,
  EditableMemberInfo,
  EineEventTypeStr,
  Friend,
  FriendRequestOperate,
  GroupConfig,
  GroupInfo,
  GroupMember,
  InvitedJoinGroupRequestOperate,
  MemberJoinRequestOpearte,
  MessageChain,
  MessageComponentTypeStr,
  MessageType,
  MessageTypeStr,
  PreloadFile,
  Profile,
} from "../../common/types";

import EineLogger from "../../libs/logger";

import { Plain } from "../../common/component";

import { WebsocketDriverOptions, WebsocketSessionState } from "./types";
import { FriendTarget, GroupTarget, TempTarget } from "../../common/sender";

/**
 * mirai-api-http: Websocket Adapter Driver
 */
export default class WebsocketDriver {
  /** WebsocketDriver 实例化选项 */
  private options: WebsocketDriverOptions;

  /** Eine 实例 */
  private eine: Eine;

  /** Eine Logger 日志处理器 */
  private _logger: EineLogger;
  public get logger() {
    return this._logger;
  }

  /** mirai-api-http Websocket 适配器通信地址 */
  private apiHost: string;

  private _session: string;
  private _sessionState: WebsocketSessionState;

  /** Websocket 客户端实例 */
  private ws: Websocket | null = null;

  /** Websocket syncId */
  private syncId: number = 0;

  /** Websocket resolver map */
  private syncMap: Map<
    number,
    {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
    }
  > = new Map();

  /** sessionKey */
  get session() {
    return this._session;
  }

  /** 会话状态 */
  get sessionState() {
    return this._sessionState;
  }

  constructor(options: WebsocketDriverOptions, parent: Eine) {
    this.options = options;
    this.eine = parent;
    this._logger = parent.logger;

    const { host, port } = options;
    this.apiHost =
      host.startsWith("ws://") || host.startsWith("wss://") ? `${host}:${port}/all` : `ws://${host}:${port}/all`;

    this._session = "";
    this._sessionState = WebsocketSessionState.IDLE;

    this.logger.verbose("WebsocketDriver: baseUrl = {}", this.apiHost);
  }

  /**
   * 设置实例身份（QQ 号）
   * @param qq
   */
  public setIdentity(qq: number) {
    this.options.qq = qq;
  }

  /** 获取下一个标识信息的 ID */
  private get nextSyncId() {
    if (this.syncId >= Number.MAX_SAFE_INTEGER) return (this.syncId = 0);
    return this.syncId++;
  }

  /**
   * 通过 websocket 发送消息并等待响应
   * @param payload 消息内容
   * @returns
   */
  private sendAndWaitResponse(payload: any) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.ws) {
          this.logger.error("sendAndWaitResponse @ WebsocketDriver: failed to send because websocket is not created.");
          reject("Websocket not created");
          return;
        }

        const syncId = this.nextSyncId;

        // time limit for receiving websocket message
        const timeout = setTimeout(() => {
          this.syncMap.delete(syncId);
          reject("wait response timeout");
        }, this.eine.getOption("responseTimeout") as number);

        const resolveAndClean = (payload: any) => {
          clearTimeout(timeout);
          this.syncMap.delete(syncId);
          resolve(payload);
        };

        const rejectAndClean = (reason: any) => {
          clearTimeout(timeout);
          this.syncMap.delete(syncId);
          reject(reason);
        };

        this.syncMap.set(syncId, {
          resolve: resolveAndClean,
          reject: rejectAndClean,
        });

        this.ws.send(
          typeof payload === "string"
            ? payload
            : JSON.stringify({
                ...payload,
                syncId,
              })
        );
      } catch (err) {
        this.logger.error("sendAndWaitResponse @ WebsocketDriver: failed to send because {}", err);
        reject(err);
      }
    });
  }

  /**
   * 处理从 websocket 接受的消息
   * @param message 消息内容
   * @param resolve
   * @param reject
   * @returns
   */
  private resolveMessage = (
    message: string,
    resolve?: (value: unknown) => void,
    reject?: (reason: unknown) => void
  ) => {
    try {
      const payload = JSON.parse(message);

      if (payload.syncId === undefined || payload.syncId === "") {
        if (this.sessionState === WebsocketSessionState.IDLE) {
          if (payload.code && payload.code !== 0) {
            this.logger.error("WebsocketDriver: verify failed, Error: {} ({})", payload.msg, payload.code);

            reject?.(payload.msg);
          } else {
            this._session = payload.data.session;
            this._sessionState = WebsocketSessionState.VERIFIED;

            this.logger.verbose("WebsocketDriver: succesfully verified, current session is {}", this.session);
            this.logger.verbose(
              "WebsockerDriver: session {} successfully binded with QQ: {}",
              this.session,
              this.options.qq
            );
            resolve?.(this._sessionState);
          }
          return;
        }
        if (payload.data && payload.data.type) {
          this.eine.dispatch(payload.data.type, payload.data);
          return;
        }
        this.logger.warn("WebsocketDriver: received message with unknown type: {}", message);
      } else {
        const syndId = Number(payload.syncId);
        if (Number(syndId) === -1) {
          this.eine.resolveMessageAndEvent(payload.data);
          return;
        }
        if (payload.data.code !== undefined && payload.data.code !== 0) {
          this.syncMap.get(syndId)?.reject(payload.data.msg);
          return;
        }
        this.syncMap.get(syndId)?.resolve(payload.data ? payload.data : payload);
      }
    } catch (err) {
      this.logger.error("WebsocketDriver: parse incoming message failed, {}", err);
    }
  };

  /**
   * 会话认证流程，成功认证会由 resolve 返回 sessionID
   * @returns Promise<string>
   */
  public verify() {
    return new Promise((resolve, reject) => {
      this.ws = new Websocket(`${this.apiHost}?verifyKey=${this.options.verifyKey}&qq=${this.options.qq}`, {
        perMessageDeflate: false,
      });
      this.ws.on("message", (message: string) => {
        this.resolveMessage(message, resolve, reject);
      });
      this.ws.on("close", () => {
        this.logger.info("WebsocketDriver: websocket connection closed.");
      });
      this.ws.on("error", (err) => {
        this.logger.error("WebsocketDriver: connection error, {}", err);
      });
    });
  }

  /** 释放会话，关闭 websocket 连接 */
  public release() {
    this.ws?.close();
    this.logger.verbose("Session {} successfully released.", this.session);
  }

  /**
   * 处理待发送的信息，如上传未上传的图片等
   * @param messageChain 消息链
   * @param type 发送的信息类别
   * @returns MessageChain 处理后的消息链
   */
  public async processMessageChain(messageChain: MessageChain, type: ContextType) {
    const processed: MessageChain = [];
    for (let index = 0; index < messageChain.length; index++) {
      const component = messageChain[index];
      if (typeof component === "string") {
        processed.push(Plain(component));
      } else {
        // 处理未上传的文件
        if (component.type === MessageComponentTypeStr.PRELOAD) {
          const pendingFile = component as PreloadFile;

          if (!this.eine.http) {
            this.logger.warn(
              "processMessageChain @ WebsocketDriver: uploading file requires HttpDriver which cannot be found, skipping upload {}.",
              pendingFile.file
            );
            continue;
          }

          const uploadResult = await (pendingFile.originType === MessageComponentTypeStr.VOICE
            ? this.eine.http.uploadVoice(pendingFile, type)
            : this.eine.http.uploadImage(pendingFile, type));

          if (uploadResult === null) continue;

          processed.push({
            type: pendingFile.originType,
            ...uploadResult,
          } as any);
        } else {
          processed.push(component);
        }
      }
    }
    return processed;
  }

  /**
   * 通过 websocket 发送命令字和接口数据对象
   * @param command 命令字
   * @param content 数据对象
   * @param subCommand 子命令字，可为 null
   * @returns
   */
  public command = (command: string, content: any = {}, subCommand: string | null = null): Promise<any> =>
    this.sendAndWaitResponse({
      command,
      subCommand,
      content: {
        ...content,
        sessionKey: this.session,
      },
    });

  /**
   * 获取插件版本
   * @returns Promise<{version: string} | null>
   */
  public async about() {
    try {
      const response = await this.command("about");
      return response.data as { version: string };
    } catch (err) {
      this.logger.error("about @ WebsocketDriver, {}", err);
      return null;
    }
  }

  /**
   * 通过 messageId 获取消息
   * @param messageId 消息 ID
   * @returns Promise<MessageType | null>
   */
  public async messageFromId(messageId: number) {
    try {
      const response = await this.command("messageFromId", {
        id: messageId,
      });
      return response.data as MessageType;
    } catch (err) {
      this.logger.error("messageFromId @ WebsocketDriver: {}", err);
      return null;
    }
  }

  /**
   * 获取好友列表
   * @returns Promise<Friend[]>
   */
  public async friendList() {
    try {
      const response = await this.command("friendList");
      return response.data as Friend[];
    } catch (err) {
      this.logger.error("friendList @ WebsocketDriver: {}", err);
      return [];
    }
  }

  /**
   * 获取群列表
   * @returns Promise<Group[]>
   */
  public async groupList() {
    try {
      const response = await this.command("groupList");
      return response.data as GroupInfo[];
    } catch (err) {
      this.logger.error("groupList @ WebsocketDriver: {}", err);
      return [];
    }
  }

  /**
   * 获取群成员列表
   * @param groupId 群号
   * @returns Promise<GroupMember[]>
   */
  public async memberList(groupId: number) {
    try {
      const response = await this.command("memberList", {
        target: groupId,
      });
      return response.data as GroupMember[];
    } catch (err) {
      this.logger.error("memberList @ WebsocketDriver: {}", err);
      return [];
    }
  }

  /**
   * 获取 BOT 资料
   * @returns Promise<Profile | null>
   */
  public async botProfile() {
    try {
      const response = await this.command("botProfile");
      return response as Profile;
    } catch (err) {
      this.logger.error("botProfile @ WebsocketDriver: {}", err);
      return null;
    }
  }

  /**
   * 获取好友资料
   * @param friendId 好友 QQ 号
   * @returns Promise<Profile | null>
   */
  public async friendProfile(friendId: number) {
    try {
      const response = await this.command("friendProfile", {
        target: friendId,
      });
      return response as Profile;
    } catch (err) {
      this.logger.error("friendProfile @ WebsocketDriver: {}", err);
      return null;
    }
  }

  /**
   * 获取群成员资料
   * @param groupId 群号
   * @param memberId 成员 QQ 号
   * @returns Promise<Profile | null>
   */
  public async memberProfile(groupId: number, memberId: number) {
    try {
      const response = await this.command("memberProfile", {
        target: groupId,
        memberId,
      });
      return response as Profile;
    } catch (err) {
      this.logger.error("memberProfile @ WebsocketDriver: {}", err);
      return null;
    }
  }

  /**
   * 发送好友消息
   * @param friendId 好友 QQ 号
   * @param messageChain 消息内容
   * @param quote 引用的消息 ID
   * @returns Promise<number | boolean> 返回消息标识 ID
   */
  public async sendFriendMessage(friendId: number, messageChain: MessageChain, quote?: number) {
    try {
      const processedMessage = await this.processMessageChain(messageChain, ContextType.FRIEND);
      const response = await this.command("sendFriendMessage", {
        target: friendId,
        messageChain: processedMessage,
        quote,
      });

      this.eine.dispatch(EineEventTypeStr.SEND_MESSAGE, {
        target: FriendTarget(friendId),
        type: MessageTypeStr.FRIEND_MESSAGE,
        messageChain: processedMessage,
      });

      return response.messageId as number;
    } catch (err) {
      this.logger.error("sendFriendMessage @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 发送群消息
   * @param groupId 群号
   * @param messageChain 消息内容
   * @param quote 引用的消息 ID
   * @returns Promise<number | boolean> 返回消息标识 ID
   */
  public async sendGroupMessage(groupId: number, messageChain: MessageChain, quote?: number) {
    try {
      const processedMessage = await this.processMessageChain(messageChain, ContextType.GROUP);
      const response = await this.command("sendGroupMessage", {
        target: groupId,
        messageChain: processedMessage,
        quote,
      });

      this.eine.dispatch(EineEventTypeStr.SEND_MESSAGE, {
        target: GroupTarget(groupId),
        type: MessageTypeStr.GROUP_MESSAGE,
        messageChain: processedMessage,
      });

      return response.messageId as number;
    } catch (err) {
      this.logger.error("sendGroupMessage @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 发送临时消息
   * @param groupId 群号
   * @param memberId 临时会话目标 QQ 号
   * @param messageChain 消息内容
   * @param quote 引用的消息 ID
   * @returns Promise<number | boolean> 返回消息标识 ID
   */
  public async sendTempMessage(groupId: number, memberId: number, messageChain: MessageChain, quote?: number) {
    try {
      const processedMessage = await this.processMessageChain(messageChain, ContextType.GROUP);
      const response = await this.command("sendTempMessage", {
        qq: memberId,
        group: groupId,
        messageChain: processedMessage,
        quote,
      });

      this.eine.dispatch(EineEventTypeStr.SEND_MESSAGE, {
        target: TempTarget(memberId, groupId),
        type: MessageTypeStr.TEMP_MESSAGE,
        messageChain: processedMessage,
      });

      return response.messageId as number;
    } catch (err) {
      this.logger.error("sendTempMessage @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 发送戳一戳
   * @param target 要戳谁（QQ 号）？
   * @param subject 在哪发（群号 / QQ 号）？
   * @param kind 好友消息还是群消息？
   * @returns Promise<boolean>
   */
  public async sendNudge(target: number, subject: number, kind: ContextType) {
    try {
      const response = await this.command("sendNudge", {
        target,
        subject,
        kind,
      });
      return true;
    } catch (err) {
      this.logger.error("sendNudge @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 撤回消息
   * @param targetMessageId 撤回消息的 ID
   * @returns Promise<boolean>
   */
  public async recall(targetMessageId: number) {
    try {
      const response = await this.command("recall", {
        target: targetMessageId,
      });
      return true;
    } catch (err) {
      this.logger.error("recall @ WebsocketDriver: {}", err);
      return false;
    }
  }


  /**
   * 删除好友
   * @param friendId 要删除的好友 QQ 号
   * @returns Promise<boolean>
   */
   public async deleteFriend(friendId: number) {
    try {
      const response = await this.command("deleteFriend", {
        target: friendId,
      });
      return true;
    } catch (err) {
      this.logger.error("deleteFriend @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 禁言群成员（需要有管理员权限）
   * @param groupId 群号
   * @param memberId 禁言对象 QQ 号
   * @param time 禁言时间，0 秒 ~ 30 天
   * @returns Promise<boolean>
   */
  public async mute(groupId: number, memberId: number, time: number) {
    try {
      const response = await this.command("mute", {
        target: groupId,
        memberId,
        time: Math.max(0, Math.min(2_592_000, time)),
      });
      return true;
    } catch (err) {
      this.logger.error("mute @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 取消禁言群成员
   * @param groupId 群号
   * @param memberId 取消禁言的群成员 QQ
   * @returns Promise<boolean>
   */
  public async unmute(groupId: number, memberId: number) {
    try {
      const response = await this.command("unmute", {
        target: groupId,
        memberId,
      });
      return true;
    } catch (err) {
      this.logger.error("unmute @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 将群成员请出群
   * @param groupId 群号
   * @param memberId 请出群的群成员 QQ
   * @param msg 退群信息
   * @returns Promise<boolean>
   */
  public async kick(groupId: string, memberId: number, msg?: string) {
    try {
      const response = await this.command("kick", {
        target: groupId,
        memberId,
        msg,
      });
      return true;
    } catch (err) {
      this.logger.error("kick @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * BOT 主动退群
   * @param groupId 群号
   * @returns Promise<boolean>
   */
  public async quit(groupId: number) {
    try {
      const response = await this.command("quit", {
        target: groupId,
      });
      return true;
    } catch (err) {
      this.logger.error("quit @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 开启全员禁言
   * @param groupId 群号
   * @returns Promise<boolean>
   */
  public async muteAll(groupId: number) {
    try {
      const response = await this.command("muteAll", {
        target: groupId,
      });
      return true;
    } catch (err) {
      this.logger.error("muteAll @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 关闭全员禁言
   * @param groupId 群号
   * @returns Promise<boolean>
   */
  public async unmuteAll(groupId: number) {
    try {
      const response = await this.command("unmuteAll", {
        target: groupId,
      });
      return true;
    } catch (err) {
      this.logger.error("unmuteAll @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 设置精华信息
   * @param target 消息 messaegeId
   * @returns Promise<boolean>
   */
  public async setEssence(target: number) {
    try {
      const response = await this.command("setEssence", {
        target,
      });
      return true;
    } catch (err) {
      this.logger.error("setEssence @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 获取群资料
   * @param groupId 群号
   * @returns Promise<GroupConfig | null> 
   */
  public async getGroupConfig(groupId: number): Promise<GroupConfig | null> {
    try {
      const response = await this.command("groupConfig", {
        target: groupId,
      }, "get");
      return response as GroupConfig;
    } catch (err) {
      this.logger.error("getGroupConfig @ WebsocketDriver: {}", err);
      return null;
    }
  }

  /**
   * 设置/修改群资料
   * @param groupId 群号
   * @param groupConfig 需要修改的群资料字段
   * @returns Promise<boolean>
   */
  public async setGroupConfig(groupId: number, groupConfig: Partial<GroupConfig>) {
    try {
      await this.command("groupConfig", {
        target: groupId,
        config: groupConfig,
      }, "update");
      return true;
    } catch (err) {
      this.logger.error("setGroupConfig @ WebsocketDriver: {}", err);
    }
  }

  /**
   * 获取群成员资料
   * @param groupId 群号
   * @param memberId 成员 QQ 号
   * @returns Promise<GroupMember | null>
   */
  public async getMemberInfo(groupId: number, memberId: number) {
    try {
      const response = await this.command("memberInfo", {
        target: groupId,
        memberId,
      }, "get");
      return response as GroupMember;
    } catch (err) {
      this.logger.error("getMemberInfo @ WebsocketDriver: {}", err);
      return null;
    }
  }

  /**
   * 设置群成员资料
   * @param groupId 群号
   * @param memberId 成员 QQ 号
   * @param info 成员资料
   * @returns Promise<boolean>
   */
  public async setMemberInfo(groupId: number, memberId: number, info: EditableMemberInfo) {
    try {
      await this.command("memberInfo", {
        target: groupId,
        memberId,
        info,
      }, "update");
      return true;
    } catch (err) {
      this.logger.error("setMemberInfo @ WebsocketDriver: {}", err);
      return false;
    }
  }

  /**
   * 响应新好友请求
   * @param eventId 事件 ID
   * @param fromId 好友请求来源 QQ 号
   * @param groupId 好友请求来源群组，如果没有则传入 0
   * @param operate 响应操作
   * @param message 回复信息
   * @returns Promise<boolean>
   */
  public async respondNewFriendRequest(
    eventId: number,
    fromId: number,
    groupId: number,
    operate: FriendRequestOperate,
    message: string = ""
  ) {
    try {
      const response = await this.command("resp_NewFriendRequestEvent", {
        eventId,
        fromId,
        groupId,
        operate,
        message,
      });
      return true;
    } catch (err) {
      this.logger.error("respondNewFriendRequest @ WebsocketDriver: {}", err);
    }
  }

  /**
   * 响应新成员入群请求
   * @param eventId 事件 ID
   * @param fromId 加群请求成员 QQ 号
   * @param groupId 加群 ID
   * @param opearte 响应操作
   * @param message 回复信息
   * @returns Promise<boolean>
   */
  public async respondMemberJoinRequest(
    eventId: number,
    fromId: number,
    groupId: number,
    opearte: MemberJoinRequestOpearte,
    message: string = ""
  ) {
    try {
      const response = await this.command("resp_MemberJoinRequestEvent", {
        eventId,
        fromId,
        groupId,
        opearte,
        message,
      });
      return true;
    } catch (err) {
      this.logger.error("respondMemberJoinRequest @ WebsocketDriver: {}", err);
    }
  }

  /**
   * 响应邀请加群请求
   * @param eventId 事件 ID
   * @param fromId 邀请来源成员 QQ 号
   * @param groupId 邀请群号
   * @param operate 响应操作
   * @param message 恢复信息
   * @returns Promise<boolean>
   */
  public async respondInvitedJoinGroupRequest(
    eventId: number,
    fromId: number,
    groupId: number,
    operate: InvitedJoinGroupRequestOperate,
    message: string = ""
  ) {
    try {
      const respone = await this.command("resp_BotInvitedJoinGroupRequestEvent", {
        eventId,
        fromId,
        groupId,
        operate,
        message,
      });
      return true;
    } catch (err) {
      this.logger.error("respondInvitedJoinGroupRequest @ WebsocketDriver: {}", err);
    }
  }
}
