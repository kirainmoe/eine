import { createReadStream, ReadStream } from "fs";
import FormData from "form-data";

import Eine from "../../index";
import EineLogger from "../../libs/logger/EineLogger";

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
  MessageEventType,
  MessageType,
  MessageTypeStr,
  PreloadFile,
  Profile,
} from "../../common/types";

import { upload, wrappedGet, wrappedPost } from "../../utils/request";
import { HttpDriverOptions, HttpSessionState } from "./types";
import { FriendTarget, GroupTarget, TempTarget } from "../../common/sender";
import { Plain } from "../../common/component";

/**
 * mirai-api-http: Http Adapter Driver
 */
export default class HttpDriver {
  /** HttpDriver 实例化选项 */
  private options: HttpDriverOptions;

  /** Eine 实例 */
  private eine: Eine;

  /** Eine Logger 日志处理器 */
  private _logger: EineLogger;
  public get logger() {
    return this._logger;
  }

  /** mirai-api-http HTTP 适配器 API 地址 */
  private apiHost: string;

  private _session: string;
  private _sessionState: HttpSessionState;
  private _pollingInterval: ReturnType<typeof setInterval> | undefined = undefined;

  /** sessionKey */
  get session() {
    return this._session;
  }

  /** 会话状态 */
  get sessionState() {
    return this._sessionState;
  }

  constructor(options: HttpDriverOptions, parent: Eine) {
    this.options = options;
    this.eine = parent;
    this._logger = parent.logger;

    const { host, port } = options;
    this.apiHost =
      host.startsWith("http://") || host.startsWith("https://") ? `${host}:${port}` : `http://${host}:${port}`;
    this._session = "";
    this._sessionState = HttpSessionState.IDLE;

    this.logger.verbose("HttpDriver: baseUrl = {}", this.apiHost);
  }

  /**
   * 拼接 API 请求地址
   * @param path 请求 API 的路径
   * @returns 返回请求地址
   */
  public api(path: string): string {
    return `${this.apiHost}/${path}`;
  }

  /**
   * 设置实例身份（QQ 号）
   * @param qq
   */
  public setIdentity(qq: number) {
    this.options.qq = qq;
  }

  public startPollingMessage(interval: number) {
    this._pollingInterval = setInterval(async () => {
      const messages = await this.fetchMessage();
      this.eine.resolveMessageAndEvent(messages);
    }, interval);
  }

  public stopPollingMessage() {
    this._pollingInterval && clearInterval(this._pollingInterval);
  }

  /**
   * 会话认证流程
   * @returns Promise<string>
   */
  public async verify() {
    if (!this.options.enableVerify) {
      this.logger.verbose("verify @ HttpDriver: verify is disabled, skipping.");
    }

    try {
      const response = await wrappedPost(this.api("verify"), {
        verifyKey: this.options.verifyKey,
      });
      this._session = response.payload.session;
      this._sessionState = HttpSessionState.VERIFIED;
      this.logger.verbose("HttpDriver: successfully verified, current session is {}", this.session);

      this.eine.dispatch(EineEventTypeStr.AFTER_HTTP_VERIFY, this.session);

      return this.session;
    } catch (err) {
      this.logger.error("verify @ HttpDriver, {}", err);
      throw new Error(err);
    }
  }

  /**
   * 会话与账号身份绑定流程
   * @returns Promise<boolean>
   */
  public async bind() {
    if (this.options.singleMode) {
      this.logger.verbose("bind @ HttpDriver: single mode is enabled, skipping.");
    }

    try {
      await wrappedPost(this.api("bind"), {
        sessionKey: this.session,
        qq: this.options.qq,
      });

      this.logger.verbose("HttpDriver: session {} successfully binded with QQ: {}", this.session, this.options.qq);

      this.eine.dispatch(EineEventTypeStr.AFTER_HTTP_BIND, null);

      return true;
    } catch (err) {
      this.logger.error("bind @ HttpDriver, {}", err);
      throw new Error(err);
    }
  }

  /**
   * 结束会话
   * @returns Promise<boolean>
   */
  public async release() {
    if (!this.options.enableVerify) {
      this.logger.verbose("release @ HttpDriver: verify is disabled, skipping.");
    }

    try {
      await wrappedPost(this.api("release"), {
        sessionKey: this.session,
        qq: this.options.qq,
      });

      this.logger.verbose("Session {} successfully released.", this.session);
      this._session = "";
      this._sessionState = HttpSessionState.IDLE;

      // todo: trigger `released`, `httpReleased` event

      return true;
    } catch (err) {
      this.logger.error("release @ HttpDriver, {}", err);
      return false;
    }
  }

  /**
   * 获取未读缓存消息的数量
   * @returns Promise<number>
   */
  public async countMessage(): Promise<number | any> {
    try {
      const response = await wrappedGet(this.api("countMessage"), { sessionKey: this.session });
      return response.data as number;
    } catch (err) {
      this.logger.error("countMessage @ HttpDriver, {}", err);
      return 0;
    }
  }

  /**
   * 按时间顺序获取消息并从消息队列中移除
   * @returns Promise<MessageEventType[]>
   */
  public async fetchMessage() {
    try {
      return (
        await wrappedGet(this.api("fetchMessage"), {
          sessionKey: this.session,
          count: 10,
        })
      ).data as MessageEventType[];
    } catch (err) {
      this.logger.error("fetchMessage @ HttpDriver, {}", err);
      return [];
    }
  }

  /**
   * 获取插件版本
   */
  public async about() {
    try {
      const response = await wrappedGet(this.api("about"), {});
      return response.data as { version: string };
    } catch (err) {
      this.logger.error("about @ HttpDriver, {}", err);
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
      const response = await wrappedGet(this.api("messageFromId"), {
        sessionKey: this.session,
        id: messageId,
      });
      return response.data as MessageType;
    } catch (err) {
      this.logger.error("messageFromId @ HttpDriver: {}", err);
      return null;
    }
  }

  /**
   * 获取好友列表
   * @returns Promise<Friend[]>
   */
  public async friendList() {
    try {
      const response = await wrappedGet(this.api("friendList"), {
        sessionKey: this.session,
      });
      return response.data as Friend[];
    } catch (err) {
      this.logger.error("friendList @ HttpDriver: {}", err);
      return [];
    }
  }

  /**
   * 获取群列表
   * @returns Promise<Group[]>
   */
  public async groupList() {
    try {
      const response = await wrappedGet(this.api("groupList"), {
        sessionKey: this.session,
      });
      return response.data as GroupInfo[];
    } catch (err) {
      this.logger.error("groupList @ HttpDriver: {}", err);
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
      const response = await wrappedGet(this.api("memberList"), {
        sessionKey: this.session,
        target: groupId,
      });
      return response.data as GroupMember[];
    } catch (err) {
      this.logger.error("memberList @ HttpDriver: {}", err);
      return [];
    }
  }

  /**
   * 获取 BOT 资料
   * @returns Promise<Profile | null>
   */
  public async botProfile() {
    try {
      const response = await wrappedGet(this.api("botProfile"), { sessionKey: this.session });
      return response.payload as Profile;
    } catch (err) {
      this.logger.error("botProfile @ HttpDriver: {}", err);
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
      const response = await wrappedGet(this.api("friendProfile"), {
        sessionKey: this.session,
        target: friendId,
      });
      return response.payload as Profile;
    } catch (err) {
      this.logger.error("friendProfile @ HttpDriver: {}", err);
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
      const response = await wrappedGet(this.api("memberProfile"), {
        sessionKey: this.session,
        target: groupId,
        memberId,
      });
      return response.payload as Profile;
    } catch (err) {
      this.logger.error("memberProfile @ HttpDriver: {}", err);
      return null;
    }
  }

  /**
   * 上传图片
   * @param target
   * @param type
   * @returns Promise
   */
  public async uploadImage(target: string | PreloadFile, type: ContextType) {
    try {
      const file: ReadStream | Buffer =
        typeof target === "string"
          ? createReadStream(target)
          : typeof target.file === "string"
          ? createReadStream(target.file)
          : target.file;

      const form = new FormData();
      form.append("sessionKey", this.session);
      form.append("type", type);
      form.append("img", file, file instanceof Buffer ? { filename: "payload.jpg" } : undefined);

      const response = await upload(this.api("uploadImage"), form);
      return {
        imageId: response.data.imageId,
        url: response.data.url,
      };
    } catch (err) {
      this.logger.error(
        "uploadImage @ HttpDriver: Cannot upload image file from {}, {}",
        typeof target === "string" ? target : target.file,
        err
      );
      return null;
    }
  }

  /**
   * 上传语音文件
   * @param target
   * @param type
   * @returns Promise
   */
  public async uploadVoice(target: string | PreloadFile, type: ContextType) {
    try {
      const file: ReadStream | Buffer =
        typeof target === "string"
          ? createReadStream(target)
          : typeof target.file === "string"
          ? createReadStream(target.file)
          : target.file;

      const form = new FormData();
      form.append("sessionKey", this.session);
      form.append("type", type);
      form.append("voice", file, file instanceof Buffer ? { filename: "payload.amr" } : undefined);

      const response = await upload(this.api("uploadVoice"), form);
      return {
        voiceId: response.data.voiceId,
        url: response.data.url,
      };
    } catch (err) {
      this.logger.error(
        "uploadVoice @ HttpDriver: Cannot upload voice file from {}, {}",
        typeof target === "string" ? target : target.file,
        err
      );
      return null;
    }
  }

  /**
   * 上传群文件
   * @param target 目标文件，路径或使用 File.from(string | Buffer | ReadStream) 构造
   * @param type 上传类型，目前只支持 group
   * @param path 上传目录，空为根目录
   * @returns Promise
   */
  public async uploadFile(target: string | PreloadFile, type: string, path: string = "") {
    try {
      const file: ReadStream | Buffer =
        typeof target === "string"
          ? createReadStream(target)
          : typeof target.file === "string"
          ? createReadStream(target.file)
          : target.file;
      const form = new FormData();
      form.append("sessionKey", this.session);
      form.append("type", "group");
      form.append("path", path);
      form.append("file", file);

      const response = await upload(this.api("file/upload"), form);
      return null;
    } catch (err) {
      this.logger.error(
        "uploadFile @ HttpDriver: Cannot upload file from {}, {}",
        typeof target === "string" ? target : target.file,
        err
      );
    }
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
      const component =  messageChain[index];
      if (typeof component === 'string') {
        processed.push(Plain(component));
      } else {
        // 处理未上传的文件
        if (component.type === MessageComponentTypeStr.PRELOAD) {
          const pendingFile = component as PreloadFile;
          const uploadResult = await (pendingFile.originType === MessageComponentTypeStr.VOICE
            ? this.uploadVoice(pendingFile, type)
            : this.uploadImage(pendingFile, type));

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
   * 发送好友消息
   * @param friendId 好友 QQ 号
   * @param messageChain 消息内容
   * @param quote 引用的消息 ID
   * @returns Promise<number | boolean> 返回消息标识 ID
   */
  public async sendFriendMessage(friendId: number, messageChain: MessageChain, quote?: number) {
    try {
      const processedMessage = await this.processMessageChain(messageChain, ContextType.FRIEND);
      const response = await wrappedPost(this.api("sendFriendMessage"), {
        sessionKey: this.session,
        target: friendId,
        messageChain: processedMessage,
        quote,
      });

      this.eine.dispatch(EineEventTypeStr.SEND_MESSAGE, {
        target: FriendTarget(friendId),
        type: MessageTypeStr.FRIEND_MESSAGE,
        messageChain: processedMessage,
      });

      return response.payload.messageId as number;
    } catch (err) {
      this.logger.error("sendFriendMessage @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("sendGroupMessage"), {
        sessionKey: this.session,
        target: groupId,
        messageChain: processedMessage,
        quote,
      });

      this.eine.dispatch(EineEventTypeStr.SEND_MESSAGE, {
        target: GroupTarget(groupId),
        type: MessageTypeStr.GROUP_MESSAGE,
        messageChain: processedMessage,
      });

      return response.payload.messageId as number;
    } catch (err) {
      this.logger.error("sendGroupMessage @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("sendTempMessage"), {
        sessionKey: this.session,
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

      return response.payload.messageId as number;
    } catch (err) {
      this.logger.error("sendTempMessage @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("sendNudge"), {
        sessionKey: this.session,
        target,
        subject,
        kind,
      });
      return true;
    } catch (err) {
      this.logger.error("sendNudge @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("recall"), {
        sessionKey: this.session,
        target: targetMessageId,
      });
      return true;
    } catch (err) {
      this.logger.error("recall @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("deleteFriend"), {
        sessionKey: this.session,
        target: friendId,
      });
      return true;
    } catch (err) {
      this.logger.error("deleteFriend @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("mute"), {
        sessionKey: this.session,
        target: groupId,
        memberId,
        time: Math.max(0, Math.min(2_592_000, time)),
      });
      return true;
    } catch (err) {
      this.logger.error("mute @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("unmute"), {
        sessionKey: this.session,
        target: groupId,
        memberId,
      });
      return true;
    } catch (err) {
      this.logger.error("unmute @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("kick"), {
        sessionKey: this.session,
        target: groupId,
        memberId,
        msg,
      });
      return true;
    } catch (err) {
      this.logger.error("kick @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("quit"), {
        sessionKey: this.session,
        target: groupId,
      });
      return true;
    } catch (err) {
      this.logger.error("quit @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("muteAll"), {
        sessionKey: this.session,
        target: groupId,
      });
      return true;
    } catch (err) {
      this.logger.error("muteAll @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("unmuteAll"), {
        sessionKey: this.session,
        target: groupId,
      });
      return true;
    } catch (err) {
      this.logger.error("unmuteAll @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("setEssence"), {
        sessionKey: this.session,
        target,
      });
      return true;
    } catch (err) {
      this.logger.error("setEssence @ HttpDriver: {}", err);
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
      const response = await wrappedGet(this.api("groupConfig"), {
        sessionKey: this.session,
        target: groupId,
      });
      return response.payload as GroupConfig;
    } catch (err) {
      this.logger.error("getGroupConfig @ HttpDriver: {}", err);
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
      await wrappedPost(this.api("groupConfig"), {
        sessionKey: this.session,
        target: groupId,
        config: groupConfig,
      });
      return true;
    } catch (err) {
      this.logger.error("setGroupConfig @ HttpDriver: {}", err);
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
      const response = await wrappedGet(this.api("memberInfo"), {
        sessionKey: this.session,
        target: groupId,
        memberId,
      });
      return response.payload as GroupMember;
    } catch (err) {
      this.logger.error("getMemberInfo @ HttpDriver: {}", err);
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
      await wrappedPost(this.api("memberInfo"), {
        sessionKey: this.session,
        target: groupId,
        memberId,
        info,
      });
      return true;
    } catch (err) {
      this.logger.error("setMemberInfo @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("resp/newFriendRequestEvent"), {
        sessionKey: this.session,
        eventId,
        fromId,
        groupId,
        operate,
        message,
      });
      return true;
    } catch (err) {
      this.logger.error("respondNewFriendRequest @ HttpDriver: {}", err);
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
      const response = await wrappedPost(this.api("resp/memberJoinRequestEvent"), {
        sessionKey: this.session,
        eventId,
        fromId,
        groupId,
        opearte,
        message,
      });
      return true;
    } catch (err) {
      this.logger.error("respondMemberJoinRequest @ HttpDriver: {}", err);
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
      const respone = await wrappedPost(this.api("resp/botInvitedJoinGroupRequestEvent"), {
        sessionKey: this.session,
        eventId,
        fromId,
        groupId,
        operate,
        message,
      });
      return true;
    } catch (err) {
      this.logger.error("respondInvitedJoinGroupRequest @ HttpDriver: {}", err);
    }
  }
}
