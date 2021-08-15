"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const form_data_1 = __importDefault(require("form-data"));
const types_1 = require("../../common/types");
const request_1 = require("../../utils/request");
const types_2 = require("./types");
const sender_1 = require("../../common/sender");
const component_1 = require("../../common/component");
/**
 * mirai-api-http: Http Adapter Driver
 */
class HttpDriver {
    /** HttpDriver 实例化选项 */
    options;
    /** Eine 实例 */
    eine;
    /** Eine Logger 日志处理器 */
    _logger;
    get logger() {
        return this._logger;
    }
    /** mirai-api-http HTTP 适配器 API 地址 */
    apiHost;
    _session;
    _sessionState;
    _pollingInterval = undefined;
    /** sessionKey */
    get session() {
        return this._session;
    }
    /** 会话状态 */
    get sessionState() {
        return this._sessionState;
    }
    constructor(options, parent) {
        this.options = options;
        this.eine = parent;
        this._logger = parent.logger;
        const { host, port } = options;
        this.apiHost =
            host.startsWith("http://") || host.startsWith("https://") ? `${host}:${port}` : `http://${host}:${port}`;
        this._session = "";
        this._sessionState = types_2.HttpSessionState.IDLE;
        this.logger.verbose("HttpDriver: baseUrl = {}", this.apiHost);
    }
    /**
     * 拼接 API 请求地址
     * @param path 请求 API 的路径
     * @returns 返回请求地址
     */
    api(path) {
        return `${this.apiHost}/${path}`;
    }
    /**
     * 设置实例身份（QQ 号）
     * @param qq
     */
    setIdentity(qq) {
        this.options.qq = qq;
    }
    startPollingMessage(interval) {
        this._pollingInterval = setInterval(async () => {
            const messages = await this.fetchMessage();
            this.eine.resolveMessageAndEvent(messages);
        }, interval);
    }
    stopPollingMessage() {
        this._pollingInterval && clearInterval(this._pollingInterval);
    }
    /**
     * 会话认证流程
     * @returns Promise<string>
     */
    async verify() {
        if (!this.options.enableVerify) {
            this.logger.verbose("verify @ HttpDriver: verify is disabled, skipping.");
        }
        try {
            const response = await request_1.wrappedPost(this.api("verify"), {
                verifyKey: this.options.verifyKey,
            });
            this._session = response.payload.session;
            this._sessionState = types_2.HttpSessionState.VERIFIED;
            this.logger.verbose("HttpDriver: successfully verified, current session is {}", this.session);
            this.eine.dispatch(types_1.EineEventTypeStr.AFTER_HTTP_VERIFY, this.session);
            return this.session;
        }
        catch (err) {
            this.logger.error("verify @ HttpDriver, {}", err);
            throw new Error(err);
        }
    }
    /**
     * 会话与账号身份绑定流程
     * @returns Promise<boolean>
     */
    async bind() {
        if (this.options.singleMode) {
            this.logger.verbose("bind @ HttpDriver: single mode is enabled, skipping.");
        }
        try {
            await request_1.wrappedPost(this.api("bind"), {
                sessionKey: this.session,
                qq: this.options.qq,
            });
            this.logger.verbose("HttpDriver: session {} successfully binded with QQ: {}", this.session, this.options.qq);
            this.eine.dispatch(types_1.EineEventTypeStr.AFTER_HTTP_BIND, null);
            return true;
        }
        catch (err) {
            this.logger.error("bind @ HttpDriver, {}", err);
            throw new Error(err);
        }
    }
    /**
     * 结束会话
     * @returns Promise<boolean>
     */
    async release() {
        if (!this.options.enableVerify) {
            this.logger.verbose("release @ HttpDriver: verify is disabled, skipping.");
        }
        try {
            await request_1.wrappedPost(this.api("release"), {
                sessionKey: this.session,
                qq: this.options.qq,
            });
            this.logger.verbose("Session {} successfully released.", this.session);
            this._session = "";
            this._sessionState = types_2.HttpSessionState.IDLE;
            // todo: trigger `released`, `httpReleased` event
            return true;
        }
        catch (err) {
            this.logger.error("release @ HttpDriver, {}", err);
            return false;
        }
    }
    /**
     * 获取未读缓存消息的数量
     * @returns Promise<number>
     */
    async countMessage() {
        try {
            const response = await request_1.wrappedGet(this.api("countMessage"), { sessionKey: this.session });
            return response.data;
        }
        catch (err) {
            this.logger.error("countMessage @ HttpDriver, {}", err);
            return 0;
        }
    }
    /**
     * 按时间顺序获取消息并从消息队列中移除
     * @returns Promise<MessageEventType[]>
     */
    async fetchMessage() {
        try {
            return (await request_1.wrappedGet(this.api("fetchMessage"), {
                sessionKey: this.session,
                count: 10,
            })).data;
        }
        catch (err) {
            this.logger.error("fetchMessage @ HttpDriver, {}", err);
            return [];
        }
    }
    /**
     * 获取插件版本
     * @returns Promise<{version: string} | null>
     */
    async about() {
        try {
            const response = await request_1.wrappedGet(this.api("about"), {});
            return response.data;
        }
        catch (err) {
            this.logger.error("about @ HttpDriver, {}", err);
            return null;
        }
    }
    /**
     * 通过 messageId 获取消息
     * @param messageId 消息 ID
     * @returns Promise<MessageType | null>
     */
    async messageFromId(messageId) {
        try {
            const response = await request_1.wrappedGet(this.api("messageFromId"), {
                sessionKey: this.session,
                id: messageId,
            });
            return response.data;
        }
        catch (err) {
            this.logger.error("messageFromId @ HttpDriver: {}", err);
            return null;
        }
    }
    /**
     * 获取好友列表
     * @returns Promise<Friend[]>
     */
    async friendList() {
        try {
            const response = await request_1.wrappedGet(this.api("friendList"), {
                sessionKey: this.session,
            });
            return response.data;
        }
        catch (err) {
            this.logger.error("friendList @ HttpDriver: {}", err);
            return [];
        }
    }
    /**
     * 获取群列表
     * @returns Promise<Group[]>
     */
    async groupList() {
        try {
            const response = await request_1.wrappedGet(this.api("groupList"), {
                sessionKey: this.session,
            });
            return response.data;
        }
        catch (err) {
            this.logger.error("groupList @ HttpDriver: {}", err);
            return [];
        }
    }
    /**
     * 获取群成员列表
     * @param groupId 群号
     * @returns Promise<GroupMember[]>
     */
    async memberList(groupId) {
        try {
            const response = await request_1.wrappedGet(this.api("memberList"), {
                sessionKey: this.session,
                target: groupId,
            });
            return response.data;
        }
        catch (err) {
            this.logger.error("memberList @ HttpDriver: {}", err);
            return [];
        }
    }
    /**
     * 获取 BOT 资料
     * @returns Promise<Profile | null>
     */
    async botProfile() {
        try {
            const response = await request_1.wrappedGet(this.api("botProfile"), { sessionKey: this.session });
            return response.payload;
        }
        catch (err) {
            this.logger.error("botProfile @ HttpDriver: {}", err);
            return null;
        }
    }
    /**
     * 获取好友资料
     * @param friendId 好友 QQ 号
     * @returns Promise<Profile | null>
     */
    async friendProfile(friendId) {
        try {
            const response = await request_1.wrappedGet(this.api("friendProfile"), {
                sessionKey: this.session,
                target: friendId,
            });
            return response.payload;
        }
        catch (err) {
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
    async memberProfile(groupId, memberId) {
        try {
            const response = await request_1.wrappedGet(this.api("memberProfile"), {
                sessionKey: this.session,
                target: groupId,
                memberId,
            });
            return response.payload;
        }
        catch (err) {
            this.logger.error("memberProfile @ HttpDriver: {}", err);
            return null;
        }
    }
    /**
     * 上传图片
     * @param target
     * @param type
     * @returns
     */
    async uploadImage(target, type) {
        try {
            const file = typeof target === "string"
                ? fs_1.createReadStream(target)
                : typeof target.file === "string"
                    ? fs_1.createReadStream(target.file)
                    : target.file;
            const form = new form_data_1.default();
            form.append("sessionKey", this.session);
            form.append("type", type);
            form.append("img", file, file instanceof Buffer ? { filename: "payload.jpg" } : undefined);
            const response = await request_1.upload(this.api("uploadImage"), form);
            return {
                imageId: response.data.imageId,
                url: response.data.url,
            };
        }
        catch (err) {
            this.logger.error("uploadImage @ HttpDriver: Cannot upload image file from {}, {}", typeof target === "string" ? target : target.file, err);
            return null;
        }
    }
    /**
     * 上传语音文件
     * @param target
     * @param type
     * @returns
     */
    async uploadVoice(target, type) {
        try {
            const file = typeof target === "string"
                ? fs_1.createReadStream(target)
                : typeof target.file === "string"
                    ? fs_1.createReadStream(target.file)
                    : target.file;
            const form = new form_data_1.default();
            form.append("sessionKey", this.session);
            form.append("type", type);
            form.append("voice", file, file instanceof Buffer ? { filename: "payload.amr" } : undefined);
            const response = await request_1.upload(this.api("uploadVoice"), form);
            return {
                voiceId: response.data.voiceId,
                url: response.data.url,
            };
        }
        catch (err) {
            this.logger.error("uploadVoice @ HttpDriver: Cannot upload voice file from {}, {}", typeof target === "string" ? target : target.file, err);
            return null;
        }
    }
    /**
     * 上传群文件
     * @param target 目标文件，路径或使用 File.from(string | Buffer | ReadStream) 构造
     * @param type 上传类型，目前只支持 group
     * @param path 上传目录，空为根目录
     * @returns
     */
    async uploadFile(target, type, path = "") {
        try {
            const file = typeof target === "string"
                ? fs_1.createReadStream(target)
                : typeof target.file === "string"
                    ? fs_1.createReadStream(target.file)
                    : target.file;
            const form = new form_data_1.default();
            form.append("sessionKey", this.session);
            form.append("type", "group");
            form.append("path", path);
            form.append("file", file);
            const response = await request_1.upload(this.api("file/upload"), form);
            return null;
        }
        catch (err) {
            this.logger.error("uploadFile @ HttpDriver: Cannot upload file from {}, {}", typeof target === "string" ? target : target.file, err);
        }
    }
    /**
     * 处理待发送的信息，如上传未上传的图片等
     * @param messageChain 消息链
     * @param type 发送的信息类别
     * @returns MessageChain 处理后的消息链
     */
    async processMessageChain(messageChain, type) {
        const processed = [];
        for (let index = 0; index < messageChain.length; index++) {
            const component = messageChain[index];
            if (typeof component === 'string') {
                processed.push(component_1.Plain(component));
            }
            else {
                // 处理未上传的文件
                if (component.type === types_1.MessageComponentTypeStr.PRELOAD) {
                    const pendingFile = component;
                    const uploadResult = await (pendingFile.originType === types_1.MessageComponentTypeStr.VOICE
                        ? this.uploadVoice(pendingFile, type)
                        : this.uploadImage(pendingFile, type));
                    if (uploadResult === null)
                        continue;
                    processed.push({
                        type: pendingFile.originType,
                        ...uploadResult,
                    });
                }
                else {
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
    async sendFriendMessage(friendId, messageChain, quote) {
        try {
            const processedMessage = await this.processMessageChain(messageChain, types_1.ContextType.FRIEND);
            const response = await request_1.wrappedPost(this.api("sendFriendMessage"), {
                sessionKey: this.session,
                target: friendId,
                messageChain: processedMessage,
                quote,
            });
            this.eine.dispatch(types_1.EineEventTypeStr.SEND_MESSAGE, {
                target: sender_1.FriendTarget(friendId),
                type: types_1.MessageTypeStr.FRIEND_MESSAGE,
                messageChain: processedMessage,
            });
            return response.payload.messageId;
        }
        catch (err) {
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
    async sendGroupMessage(groupId, messageChain, quote) {
        try {
            const processedMessage = await this.processMessageChain(messageChain, types_1.ContextType.GROUP);
            const response = await request_1.wrappedPost(this.api("sendGroupMessage"), {
                sessionKey: this.session,
                target: groupId,
                messageChain: processedMessage,
                quote,
            });
            this.eine.dispatch(types_1.EineEventTypeStr.SEND_MESSAGE, {
                target: sender_1.GroupTarget(groupId),
                type: types_1.MessageTypeStr.GROUP_MESSAGE,
                messageChain: processedMessage,
            });
            return response.payload.messageId;
        }
        catch (err) {
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
    async sendTempMessage(groupId, memberId, messageChain, quote) {
        try {
            const processedMessage = await this.processMessageChain(messageChain, types_1.ContextType.GROUP);
            const response = await request_1.wrappedPost(this.api("sendTempMessage"), {
                sessionKey: this.session,
                qq: memberId,
                group: groupId,
                messageChain: processedMessage,
                quote,
            });
            this.eine.dispatch(types_1.EineEventTypeStr.SEND_MESSAGE, {
                target: sender_1.TempTarget(memberId, groupId),
                type: types_1.MessageTypeStr.TEMP_MESSAGE,
                messageChain: processedMessage,
            });
            return response.payload.messageId;
        }
        catch (err) {
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
    async sendNudge(target, subject, kind) {
        try {
            const response = await request_1.wrappedPost(this.api("sendNudge"), {
                sessionKey: this.session,
                target,
                subject,
                kind,
            });
            return true;
        }
        catch (err) {
            this.logger.error("sendNudge @ HttpDriver: {}", err);
            return false;
        }
    }
    /**
     * 撤回消息
     * @param targetMessageId 撤回消息的 ID
     * @returns Promise<boolean>
     */
    async recall(targetMessageId) {
        try {
            const response = await request_1.wrappedPost(this.api("recall"), {
                sessionKey: this.session,
                target: targetMessageId,
            });
            return true;
        }
        catch (err) {
            this.logger.error("recall @ HttpDriver: {}", err);
            return false;
        }
    }
    /**
     * 删除好友
     * @param friendId 要删除的好友 QQ 号
     * @returns Promise<boolean>
     */
    async deleteFriend(friendId) {
        try {
            const response = await request_1.wrappedPost(this.api("deleteFriend"), {
                sessionKey: this.session,
                target: friendId,
            });
            return true;
        }
        catch (err) {
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
    async mute(groupId, memberId, time) {
        try {
            const response = await request_1.wrappedPost(this.api("mute"), {
                sessionKey: this.session,
                target: groupId,
                memberId,
                time: Math.max(0, Math.min(2_592_000, time)),
            });
            return true;
        }
        catch (err) {
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
    async unmute(groupId, memberId) {
        try {
            const response = await request_1.wrappedPost(this.api("unmute"), {
                sessionKey: this.session,
                target: groupId,
                memberId,
            });
            return true;
        }
        catch (err) {
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
    async kick(groupId, memberId, msg) {
        try {
            const response = await request_1.wrappedPost(this.api("kick"), {
                sessionKey: this.session,
                target: groupId,
                memberId,
                msg,
            });
            return true;
        }
        catch (err) {
            this.logger.error("kick @ HttpDriver: {}", err);
            return false;
        }
    }
    /**
     * BOT 主动退群
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    async quit(groupId) {
        try {
            const response = await request_1.wrappedPost(this.api("quit"), {
                sessionKey: this.session,
                target: groupId,
            });
            return true;
        }
        catch (err) {
            this.logger.error("quit @ HttpDriver: {}", err);
            return false;
        }
    }
    /**
     * 开启全员禁言
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    async muteAll(groupId) {
        try {
            const response = await request_1.wrappedPost(this.api("muteAll"), {
                sessionKey: this.session,
                target: groupId,
            });
            return true;
        }
        catch (err) {
            this.logger.error("muteAll @ HttpDriver: {}", err);
            return false;
        }
    }
    /**
     * 关闭全员禁言
     * @param groupId 群号
     * @returns Promise<boolean>
     */
    async unmuteAll(groupId) {
        try {
            const response = await request_1.wrappedPost(this.api("unmuteAll"), {
                sessionKey: this.session,
                target: groupId,
            });
            return true;
        }
        catch (err) {
            this.logger.error("unmuteAll @ HttpDriver: {}", err);
            return false;
        }
    }
    /**
     * 设置精华信息
     * @param target 消息 messaegeId
     * @returns Promise<boolean>
     */
    async setEssence(target) {
        try {
            const response = await request_1.wrappedPost(this.api("setEssence"), {
                sessionKey: this.session,
                target,
            });
            return true;
        }
        catch (err) {
            this.logger.error("setEssence @ HttpDriver: {}", err);
            return false;
        }
    }
    /**
     * 获取群资料
     * @param groupId 群号
     * @returns Promise<GroupConfig | null>
     */
    async getGroupConfig(groupId) {
        try {
            const response = await request_1.wrappedGet(this.api("groupConfig"), {
                sessionKey: this.session,
                target: groupId,
            });
            return response.payload;
        }
        catch (err) {
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
    async setGroupConfig(groupId, groupConfig) {
        try {
            await request_1.wrappedPost(this.api("groupConfig"), {
                sessionKey: this.session,
                target: groupId,
                config: groupConfig,
            });
            return true;
        }
        catch (err) {
            this.logger.error("setGroupConfig @ HttpDriver: {}", err);
        }
    }
    /**
     * 获取群成员资料
     * @param groupId 群号
     * @param memberId 成员 QQ 号
     * @returns Promise<GroupMember | null>
     */
    async getMemberInfo(groupId, memberId) {
        try {
            const response = await request_1.wrappedGet(this.api("memberInfo"), {
                sessionKey: this.session,
                target: groupId,
                memberId,
            });
            return response.payload;
        }
        catch (err) {
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
    async setMemberInfo(groupId, memberId, info) {
        try {
            await request_1.wrappedPost(this.api("memberInfo"), {
                sessionKey: this.session,
                target: groupId,
                memberId,
                info,
            });
            return true;
        }
        catch (err) {
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
    async respondNewFriendRequest(eventId, fromId, groupId, operate, message = "") {
        try {
            const response = await request_1.wrappedPost(this.api("resp/newFriendRequestEvent"), {
                sessionKey: this.session,
                eventId,
                fromId,
                groupId,
                operate,
                message,
            });
            return true;
        }
        catch (err) {
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
    async respondMemberJoinRequest(eventId, fromId, groupId, opearte, message = "") {
        try {
            const response = await request_1.wrappedPost(this.api("resp/memberJoinRequestEvent"), {
                sessionKey: this.session,
                eventId,
                fromId,
                groupId,
                opearte,
                message,
            });
            return true;
        }
        catch (err) {
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
    async respondInvitedJoinGroupRequest(eventId, fromId, groupId, operate, message = "") {
        try {
            const respone = await request_1.wrappedPost(this.api("resp/botInvitedJoinGroupRequestEvent"), {
                sessionKey: this.session,
                eventId,
                fromId,
                groupId,
                operate,
                message,
            });
            return true;
        }
        catch (err) {
            this.logger.error("respondInvitedJoinGroupRequest @ HttpDriver: {}", err);
        }
    }
}
exports.default = HttpDriver;
//# sourceMappingURL=HttpDriver.js.map