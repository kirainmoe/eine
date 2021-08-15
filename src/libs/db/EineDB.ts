import { createHash } from "crypto";
import { Db, Filter, MongoClient } from "mongodb";

import Eine from "../..";

import {
  EineEventTypeStr,
  FriendMessageSender,
  GroupMessageSender,
  MessageChain,
  MessageTypeStr,
  SenderType,
  SendTarget,
  StrangerMessageSender,
  TempMessageSender,
} from "../../common/types";

import EineLogger from "../logger";

import { MongoConfig } from "./types";

export default class EineDB {
  private config: MongoConfig;

  private mongoUrl: string;

  private client: MongoClient;

  private eine: Eine;

  private botId: number = -1;

  private db: Db | null = null;

  private logger: EineLogger;

  public isConnected: boolean = false;

  constructor(config: Partial<MongoConfig>, eine: Eine) {
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
    this.botId = eine.getOption("qq") as number;

    const { host, port, username, password } = this.config;
    this.mongoUrl = `mongodb://${
      username.length ? `${username}${password.length ? `:${password}` : ""}@` : ""
    }${host}:${port}`;

    this.client = new MongoClient(this.mongoUrl);
  }

  private ensureDatabaseConnected() {
    if (!this.isConnected || !this.db) {
      this.logger.error("EineDB: MongoDB is not connected. Cannot call any MongoDB method at this time.");
      throw new Error("MongoDB is not connected. Cannot call any DB method at this time.");
    }
  }

  public getCollectionKey(type: MessageTypeStr, sender: SenderType | SendTarget, target?: SenderType | SendTarget) {
    const { botId } = this;

    const temp = (sender as any).myself ? target : sender;

    let collectionKey;
    switch (type) {
      case MessageTypeStr.FRIEND_MESSAGE:
        collectionKey = `${botId}-friend-${(temp as FriendMessageSender).id}`;
        break;

      case MessageTypeStr.GROUP_MESSAGE:
        collectionKey = `${botId}-group-${(temp as GroupMessageSender).group.id}`;
        break;

      case MessageTypeStr.TEMP_MESSAGE:
        collectionKey = `${botId}-temp-${(temp as TempMessageSender).id}`;
        break;

      case MessageTypeStr.STRANGER_MESSAGE:
        collectionKey = `${botId}-stranger-${(temp as StrangerMessageSender).id}`;
        break;

      default:
        collectionKey = `${botId}-${type}`;
        break;
    }

    return collectionKey;
  }

  public async connect() {
    this.logger.verbose("EineDB: establishing connection with MongoDB..");

    await this.client.connect();
    this.db = this.client.db(this.config.dbName);

    const { host, port, username, password } = this.config;
    const logMongoUrl = `mongodb://${
      username.length ? `${username}${password.length ? `:******` : ""}@` : ""
    }${host}:${port}`;
    this.logger.verbose("EineDB: connected to MongoDB: {}", logMongoUrl);

    this.isConnected = true;
    this.eine.dispatch(EineEventTypeStr.AFTER_MONGO_CONNECTED, {
      instance: this,
      client: this.client,
    });
  }

  public async close() {
    await this.client.close();
    this.isConnected = false;

    this.eine.dispatch(EineEventTypeStr.AFTER_MONGO_CLOSE, null);
  }

  public async saveIncomingMessage(
    type: MessageTypeStr,
    sender: SenderType,
    target: SendTarget,
    messageChain: MessageChain
  ) {
    this.ensureDatabaseConnected();

    const collectionKey = this.getCollectionKey(type, sender, target);
    const collection = this.db!.collection(collectionKey);

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

  public async saveOutgoingMessage(
    type: MessageTypeStr,
    sender: SendTarget,
    target: SenderType,
    messageChain: MessageChain
  ) {
    this.ensureDatabaseConnected();

    const collectionKey = this.getCollectionKey(type, sender, target);
    const collection = this.db!.collection(collectionKey);

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

  public findMessage(
    type: MessageTypeStr,
    sourceOrDestination: SenderType | SendTarget,
    direction: "incoming | outgoing",
    filterCond: any = {}
  ) {
    this.ensureDatabaseConnected();

    const collectionKey = this.getCollectionKey(type, sourceOrDestination);
    const collection = this.db!.collection(collectionKey);
    return collection.find({
      type: direction,
      ...filterCond,
    });
  }

  public async dropMessage(type: MessageTypeStr, sourceOrDestination: SenderType | SendTarget) {
    this.ensureDatabaseConnected();

    const collectionKey = this.getCollectionKey(type, sourceOrDestination);
    const collection = this.db!.collection(collectionKey);
    return await collection.drop();
  }


  // 用户相关：统计、鉴权、登录、注册
  /**
   * 统计符合条件的用户数量
   * @param filter 条件
   * @returns Promise<number>
   */
  public async countUser(filter: Filter<Document> = {}) {
    this.ensureDatabaseConnected();
    return this.db!.collection("user").find(filter).count();
  }

  public async login(username: string, password: string) {
    const passwordHash = this.md5(password);
    const users = this.db!.collection("user").find({
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

  public async expiresOutdatedAuthToken(uid: number) {
    await this.db!.collection("authorization").deleteMany({
      expire: { $lte: +new Date() }
    });
  }

  public async updateAuthToken(uid: number, authToken: string) {
    const expire =  +new Date() + 15 * 86400000   // 15 days;
    const payload = {
      uid,
      authToken,
      expire
    };
    await this.expiresOutdatedAuthToken(uid);
    await this.db!.collection("authorization").insertOne(payload);
    return payload;
  }

  public async authenticate(uid: number, authToken: string) {
    await this.expiresOutdatedAuthToken(uid);
    return await this.db!.collection("authorization").find({
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
  public async createUser(username: string, password: string, role: number) {
    this.ensureDatabaseConnected();
    const userCount = await this.countUser();
    const result = await this.db!.collection("user").insertMany([{
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

  public md5(target: string) {
    const hash = createHash('md5').update(target).digest('hex');
    return hash;
  }
}
