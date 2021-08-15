"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const mongodb_1 = require("mongodb");
const types_1 = require("../../common/types");
class EineDB {
    config;
    mongoUrl;
    client;
    eine;
    botId = -1;
    db = null;
    logger;
    isConnected = false;
    constructor(config, eine) {
        this.config = {
            host: "localhost",
            port: 27017,
            username: "",
            password: "",
            dbName: "eine_defualt_db",
            ...config,
        };
        this.eine = eine;
        this.logger = eine.logger;
        this.botId = eine.getOption("qq");
        const { host, port, username, password } = this.config;
        this.mongoUrl = `mongodb://${username.length ? `${username}${password.length ? `:${password}` : ""}@` : ""}${host}:${port}`;
        this.client = new mongodb_1.MongoClient(this.mongoUrl);
    }
    ensureDatabaseConnected() {
        if (!this.isConnected || !this.db) {
            this.logger.error("EineDB: MongoDB is not connected. Cannot call any MongoDB method at this time.");
            throw new Error("MongoDB is not connected. Cannot call any DB method at this time.");
        }
    }
    getCollectionKey(type, sender, target) {
        const { botId } = this;
        const temp = sender.myself ? target : sender;
        let collectionKey;
        switch (type) {
            case types_1.MessageTypeStr.FRIEND_MESSAGE:
                collectionKey = `${botId}-friend-${temp.id}`;
                break;
            case types_1.MessageTypeStr.GROUP_MESSAGE:
                collectionKey = `${botId}-group-${temp.group.id}`;
                break;
            case types_1.MessageTypeStr.TEMP_MESSAGE:
                collectionKey = `${botId}-temp-${temp.id}`;
                break;
            case types_1.MessageTypeStr.STRANGER_MESSAGE:
                collectionKey = `${botId}-stranger-${temp.id}`;
                break;
            default:
                collectionKey = `${botId}-${type}`;
                break;
        }
        return collectionKey;
    }
    async connect() {
        this.logger.verbose("EineDB: establishing connection with MongoDB..");
        await this.client.connect();
        this.db = this.client.db(this.config.dbName);
        const { host, port, username, password } = this.config;
        const logMongoUrl = `mongodb://${username.length ? `${username}${password.length ? `:******` : ""}@` : ""}${host}:${port}`;
        this.logger.verbose("EineDB: connected to MongoDB: {}", logMongoUrl);
        this.isConnected = true;
        this.eine.dispatch(types_1.EineEventTypeStr.AFTER_MONGO_CONNECTED, {
            instance: this,
            client: this.client,
        });
    }
    async close() {
        await this.client.close();
        this.isConnected = false;
        this.eine.dispatch(types_1.EineEventTypeStr.AFTER_MONGO_CLOSE, null);
    }
    async saveIncomingMessage(type, sender, target, messageChain) {
        this.ensureDatabaseConnected();
        const collectionKey = this.getCollectionKey(type, sender, target);
        const collection = this.db.collection(collectionKey);
        return await collection.insertMany([
            {
                messageChain,
                sender,
                target,
                time: +new Date(),
                type: "incoming",
            },
        ]);
    }
    async saveOutgoingMessage(type, sender, target, messageChain) {
        this.ensureDatabaseConnected();
        const collectionKey = this.getCollectionKey(type, sender, target);
        const collection = this.db.collection(collectionKey);
        return await collection.insertMany([
            {
                messageChain,
                sender,
                target,
                time: +new Date(),
                type: "incoming",
            },
        ]);
    }
    findMessage(type, sourceOrDestination, direction, filterCond = {}) {
        this.ensureDatabaseConnected();
        const collectionKey = this.getCollectionKey(type, sourceOrDestination);
        const collection = this.db.collection(collectionKey);
        return collection.find({
            type: direction,
            ...filterCond,
        });
    }
    async dropMessage(type, sourceOrDestination) {
        this.ensureDatabaseConnected();
        const collectionKey = this.getCollectionKey(type, sourceOrDestination);
        const collection = this.db.collection(collectionKey);
        return await collection.drop();
    }
    // 用户相关：统计、鉴权、登录、注册
    /**
     * 统计符合条件的用户数量
     * @param filter 条件
     * @returns Promise<number>
     */
    async countUser(filter = {}) {
        this.ensureDatabaseConnected();
        return this.db.collection("user").find(filter).count();
    }
    async login(username, password) {
        const passwordHash = this.md5(password);
        const users = this.db.collection("user").find({
            username,
            password: passwordHash,
        });
        if (await users.count() <= 0)
            return false;
        const token = this.md5(`${username}-${password}-${+new Date() * Math.random()}`);
        const userArray = await users.toArray();
        const result = await this.updateAuthToken(userArray[0].uid, token);
        return result;
    }
    async expiresOutdatedAuthToken(uid) {
        await this.db.collection("authorization").deleteMany({
            expire: { $lte: +new Date() }
        });
    }
    async updateAuthToken(uid, authToken) {
        const expire = +new Date() + 15 * 86400000; // 15 days;
        const payload = {
            uid,
            authToken,
            expire
        };
        await this.expiresOutdatedAuthToken(uid);
        await this.db.collection("authorization").insertOne(payload);
        return payload;
    }
    async authenticate(uid, authToken) {
        await this.expiresOutdatedAuthToken(uid);
        return await this.db.collection("authorization").find({
            uid,
            authToken,
            expire: { $gt: +new Date() }
        }).count() >= 0;
    }
    /**
     * 创建用户
     * @param username 用户名
     * @param password 密码
     * @param role 角色
     * @returns Promise<{uid: number, payload: InsertManyResult<Document>}>
     */
    async createUser(username, password, role) {
        this.ensureDatabaseConnected();
        const userCount = await this.countUser();
        const result = await this.db.collection("user").insertMany([{
                uid: userCount + 1,
                username,
                password: this.md5(password),
                role,
            }]);
        this.logger.info("user created: username={}, role={}", username, role);
        return {
            uid: userCount + 1,
            payload: result,
        };
    }
    md5(target) {
        const hash = crypto_1.createHash('md5').update(target).digest('hex');
        return hash;
    }
}
exports.default = EineDB;
//# sourceMappingURL=EineDB.js.map