import Eine from "../../index";
import EineLogger from "../../libs/logger/EineLogger";
import { ContextType, EditableMemberInfo, Friend, FriendRequestOperate, GroupConfig, GroupInfo, GroupMember, InvitedJoinGroupRequestOperate, MemberJoinRequestOpearte, MessageEventType, MessageType, Profile } from "../../common/types";
import { MessageChain, PreloadFile } from "../../common/types/MessageComponentType";
import { HttpDriverOptions, HttpSessionState } from "./types";
/**
 * mirai-api-http: Http Adapter Driver
 */
export default class HttpDriver {
    /** HttpDriver 实例化选项 */
    private options;
    /** Eine 实例 */
    private eine;
    /** Eine Logger 日志处理器 */
    private _logger;
    get logger(): EineLogger;
    /** mirai-api-http HTTP 适配器 API 地址 */
    private apiHost;
    private _session;
    private _sessionState;
    private _pollingInterval;
    /** sessionKey */
    get session(): string;
    /** 会话状态 */
    get sessionState(): HttpSessionState;
    constructor(options: HttpDriverOptions, parent: Eine);
    /**
     * 拼接 API 请求地址
     * @param path 请求 API 的路径
     * @returns 返回请求地址
     */
    api(path: string): string;
    /**
     * 设置实例身份（QQ 号）
     * @param qq
     */
    setIdentity(qq: number): void;
    startPollingMessage(interval: number): void;
    stopPollingMessage(): void;
    /**
     * 会话认证流程
     * @returns Promise<string>
     */
    verify(knownSession?: string): Promise<string>;
    /**
     * 会话与账号身份绑定流程
     * @returns Promise<boolean>
     */
    bind(): Promise<boolean>;
    /**
     * 结束会话
     * @returns Promise<boolean>
     */
    release(): Promise<boolean>;
    /**
     * 获取未读缓存消息的数量
     * @returns Promise<number>
     */
    countMessage(): Promise<number | any>;
    /**
     * 按时间顺序获取消息并从消息队列中移除
     * @returns Promise<MessageEventType[]>
     */
    fetchMessage(): Promise<MessageEventType[]>;
    /**
     * 获取插件版本
     */
    about(): Promise<{
        version: string;
    } | null>;
    /**
     * 通过 messageId 获取消息
     * @param messageId 消息 ID
     * @returns Promise<MessageType | null>
     */
    messageFromId(messageId: number): Promise<MessageType | null>;
    /**
     * 获取好友列表
     * @returns Promise<Friend[]>
     */
    friendList(): Promise<Friend[]>;
    /**
     * 获取群列表
     * @returns Promise<Group[]>
     */
    groupList(): Promise<GroupInfo[]>;
    /**
     * 获取群成员列表
     * @param groupId 群号
     * @returns Promise<GroupMember[]>
     */
    memberList(groupId: number): Promise<GroupMember[]>;
    /**
     * 获取 BOT 资料
     * @returns Promise<Profile | null>
     */
    botProfile(): Promise<Profile | null>;
    /**
     * 获取好友资料
     * @param friendId 好友 QQ 号
     * @returns Promise<Profile | null>
     */
    friendProfile(friendId: number): Promise<Profile | null>;
    /**
     * 获取群成员资料
     * @param groupId 群号
     * @param memberId 成员 QQ 号
     * @returns Promise<Profile | null>
     */
    memberProfile(groupId: number, memberId: number): Promise<Profile | null>;
    /**
     * 上传图片
     * @param target
     * @param type
     * @returns Promise
     */
    uploadImage(target: string | PreloadFile, type: ContextType): Promise<{
        imageId: any;
        url: any;
    } | null>;
    /**
     * 上传语音文件
     * @param target
     * @param type
     * @returns Promise
     */
    uploadVoice(target: string | PreloadFile, type: ContextType): Promise<{
        voiceId: any;
        url: any;
    } | null>;
    /**
     * 上传群文件
     * @param target 目标文件，路径或使用 File.from(string | Buffer | ReadStream) 构造
     * @param type 上传类型，目前只支持 group
     * @param path 上传目录，空为根目录
     * @returns Promise
     */
    uploadFile(target: string | PreloadFile, type: string, path?: string): Promise<null | undefined>;
    /**
     * 处理待发送的信息，如上传未上传的图片等
     * @param messageChain 消息链
     * @param type 发送的信息类别
     * @returns MessageChain 处理后的消息链
     */
    processMessageChain(messageChain: MessageChain, type: ContextType): Promise<MessageChain>;
    /**
     * 发送好友消息
     * @param friendId 好友 QQ 号
     * @param messageChain 消息内容
     * @param quote 引用的消息 ID
     * @returns Promise<number | boolean> 返回消息标识 ID
     */
    sendFriendMessage(friendId: number, messageChain: MessageChain, quote?: number): Promise<number | false>;
    /**
     * 发送群消息
     * @param groupId 群号
     * @param messageChain 消息内容
     * @param quote 引用的消息 ID
     * @returns Promise<number | boolean> 返回消息标识 ID
     */
    sendGroupMessage(groupId: number, messageChain: MessageChain, quote?: number): Promise<number | false>;
    /**
     * 发送临时消息
     * @param groupId 群号
     * @param memberId 临时会话目标 QQ 号
     * @param messageChain 消息内容
     * @param quote 引用的消息 ID
     * @returns Promise<number | boolean> 返回消息标识 ID
     */
    sendTempMessage(groupId: number, memberId: number, messageChain: MessageChain, quote?: number): Promise<number | false>;
    /**
     * 发送戳一戳
     * @param target 要戳谁（QQ 号）？
     * @param subject 在哪发（群号 / QQ 号）？
     * @param kind 好友消息还是群消息？
     * @returns Promise<boolean>
     */
    sendNudge(target: number, subject: number, kind: ContextType): Promise<boolean>;
    /**
     * 撤回消息
     * @param targetMessageId 撤回消息的 ID
     * @returns Promise<boolean>
     */
    recall(targetMessageId: number): Promise<boolean>;
    /**
     * 删除好友
     * @param friendId 要删除的好友 QQ 号
     * @returns Promise<boolean>
     */
    deleteFriend(friendId: number): Promise<boolean>;
    /**
     * 禁言群成员（需要有管理员权限）
     * @param groupId 群号
     * @param memberId 禁言对象 QQ 号
     * @param time 禁言时间，0 秒 ~ 30 天
     * @returns Promise<boolean>
     */
    mute(groupId: number, memberId: number, time: number): Promise<boolean>;
    /**
     * 取消禁言群成员
     * @param groupId 群号
     * @param memberId 取消禁言的群成员 QQ
     * @returns Promise<boolean>
     */
    unmute(groupId: number, memberId: number): Promise<boolean>;
    /**
     * 将群成员请出群
     * @param groupId 群号
     * @param memberId 请出群的群成员 QQ
     * @param msg 退群信息
     * @returns Promise<boolean>
     */
    kick(groupId: string, memberId: number, msg?: string): Promise<boolean>;
    /**
     * BOT 主动退群
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    quit(groupId: number): Promise<boolean>;
    /**
     * 开启全员禁言
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    muteAll(groupId: number): Promise<boolean>;
    /**
     * 关闭全员禁言
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    unmuteAll(groupId: number): Promise<boolean>;
    /**
     * 设置精华信息
     * @param target 消息 messaegeId
     * @returns Promise<boolean>
     */
    setEssence(target: number): Promise<boolean>;
    /**
     * 获取群资料
     * @param groupId 群号
     * @returns Promise<GroupConfig | null>
     */
    getGroupConfig(groupId: number): Promise<GroupConfig | null>;
    /**
     * 设置/修改群资料
     * @param groupId 群号
     * @param groupConfig 需要修改的群资料字段
     * @returns Promise<boolean>
     */
    setGroupConfig(groupId: number, groupConfig: Partial<GroupConfig>): Promise<true | undefined>;
    /**
     * 获取群成员资料
     * @param groupId 群号
     * @param memberId 成员 QQ 号
     * @returns Promise<GroupMember | null>
     */
    getMemberInfo(groupId: number, memberId: number): Promise<GroupMember | null>;
    /**
     * 设置群成员资料
     * @param groupId 群号
     * @param memberId 成员 QQ 号
     * @param info 成员资料
     * @returns Promise<boolean>
     */
    setMemberInfo(groupId: number, memberId: number, info: EditableMemberInfo): Promise<boolean>;
    /**
     * 响应新好友请求
     * @param eventId 事件 ID
     * @param fromId 好友请求来源 QQ 号
     * @param groupId 好友请求来源群组，如果没有则传入 0
     * @param operate 响应操作
     * @param message 回复信息
     * @returns Promise<boolean>
     */
    respondNewFriendRequest(eventId: number, fromId: number, groupId: number, operate: FriendRequestOperate, message?: string): Promise<true | undefined>;
    /**
     * 响应新成员入群请求
     * @param eventId 事件 ID
     * @param fromId 加群请求成员 QQ 号
     * @param groupId 加群 ID
     * @param opearte 响应操作
     * @param message 回复信息
     * @returns Promise<boolean>
     */
    respondMemberJoinRequest(eventId: number, fromId: number, groupId: number, opearte: MemberJoinRequestOpearte, message?: string): Promise<true | undefined>;
    /**
     * 响应邀请加群请求
     * @param eventId 事件 ID
     * @param fromId 邀请来源成员 QQ 号
     * @param groupId 邀请群号
     * @param operate 响应操作
     * @param message 恢复信息
     * @returns Promise<boolean>
     */
    respondInvitedJoinGroupRequest(eventId: number, fromId: number, groupId: number, operate: InvitedJoinGroupRequestOperate, message?: string): Promise<true | undefined>;
}
