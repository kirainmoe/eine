import Eine from "../../";

import HttpDriver from "../../drivers/http";
import WebsocketDriver from "../../drivers/ws/WebsocketDriver";
import { MongoConfig } from "../../libs/db/types";
import { EventType, EventTypeStr } from "./EventType";
import { MessageTypeStr, MessageType } from "./MessageType";

/** mirai-api-http 适配器 */
export namespace Adapter {
  /** 支持的适配器类型 = {HTTP, WS} */
  enum AdapterType {
    HTTP = 'http',
    WS = 'ws',
  }

  /** HTTP 适配器选项 */
  export interface HttpAdapterSetting {
    host: string;
    port: number;
  }

  /** WS (Websocket) 适配器选项 */
  export interface WebsocketAdapterSetting {
    host: string;
    port: number;
    reservedSyncId?: number;
  }

  /** 适配器设置集合 */
  export interface AdapterSetting {
    http?: HttpAdapterSetting;
    ws?: WebsocketAdapterSetting;
  }

  /** 适配器驱动实例集合 */
  export interface AdapterDriverInterface {
    http?: HttpDriver;
    ws?: WebsocketDriver;
  }
}

/** 日志等级 = {VERBOSE, INFO, WARNING, ERROR, NONE} */
export enum LogLevel {
  VERBOSE = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  NONE = 4,
}

/** 管理面板服务器选项 */
export interface EineServerOptions {
  host: string;
  port: number;
  cors?: string;
}

/** 信息拉取方式  = {POLLING, PASSIVE_WS} */
export enum MessagePullingMode {
  /** 使用 HTTP Adapter 主动拉取接口 */
  POLLING,

  /** 使用 Websocket Client 模式与服务器建立连接获取推送 */
  PASSIVE_WS,
}

/** Eine Framework 实例化选项 */
export interface EineOption {
  /** BOT 名称 */
  botName: string;

  /** BOT QQ 号 */
  qq: number;

  /** 身份认证使用的 Key */
  verifyKey: string;

  /** 是否开启认证流程，建议始终开启 */
  enableVerify: boolean;

  /** 是否开启单会话模式，请与 mirai-api-http 保持一致 */
  singleMode: boolean;

  /** 设置日志等级 */
  logLevel: LogLevel;

  /** 适配器信息设置 */
  adapters: Adapter.AdapterSetting;

  /** 信息拉取方式 */
  messagePullingMode: MessagePullingMode;

  /** 轮询模式下拉取消息的时间间隔，单位：ms */
  pollInterval: number;

  /** 是否 Log 收到的信息 */
  enableMessageLog: boolean;

  /** 是否启用数据库，当 enableDatabase = false 时，自动忽略 mongoConfig */
  enableDatabase: boolean;

  /** MongoDB 配置 */
  mongoConfig: Partial<MongoConfig>;

  /** 请求等待响应时间 */
  responseTimeout: number;

  /** App 工作目录 */
  appDirectory: string;

  /** 是否运行后台服务器，启用 Eine Admin Panel */
  enableServer: boolean;

  /** Eine Admin Panel 配置 */
  server: EineServerOptions;
}

export interface EventCallbackParams {
  name?: EineEventName | string;
  app?: Eine;
  [key: string]: any;
}

export enum EventHandleResult {
  DONE = 0,
  CONTINUE = 1,
}

export enum EineEventTypeStr {
  MESSAGE = 'Message',
  SEND_MESSAGE = 'SendMessage',

  BEFORE_VERIFY = 'BeforeVerify',
  AFTER_VERIFY = 'AfterVerify',
  BEFORE_BIND = 'BeforeBind',
  AFTER_BIND = 'AfterBind',

  AFTER_HTTP_VERIFY = 'AfterHttpVerify',
  AFTER_HTTP_BIND = 'AfterHttpBind',

  AFTER_MONGO_CONNECTED = 'AfterMongoConnected',
  AFTER_MONGO_CLOSE = 'AfterMongoClose',

  AFTER_SERVER_START = 'AfterServerStart',
}

export type EventCallback = (params: Partial<EventCallbackParams> | any) => (EventHandleResult | Promise<EventHandleResult>) | void;
export type EventIterator = Generator<any, EventHandleResult | void, any>;
export type EventGenerator = () => EventIterator;
export type EventFilter = (message: any, str?: string) => boolean;

export interface EventHandler {
  filters: EventFilter[];
  callback: EventCallback | EventGenerator;
}

export interface InterruptHandler {
  filter: EventFilter;
  iterator: EventIterator;
  triggerTime: number;
  lifetime: number;
}

export type EineEventName = EventTypeStr | MessageTypeStr | EineEventTypeStr | string;

export enum EineUserRole {
  MASTER = 0,
  ADMINISTRATOR = 1,
  USER = 2,
}
