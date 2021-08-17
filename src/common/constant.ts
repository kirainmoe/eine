import { EineOption, LogLevel, MessagePullingMode } from "./types";

/** Framework 全局名称 */
export const EINE = "Eine";

/** Framework 版本 */
export const EINE_VERSION = "0.0.7";

/** Eine Framework 实例化默认选项 */
export const EINE_DEFAULT_OPTIONS: EineOption = {
  adapters: {},
  appDirectory: './workspace',
  botName: EINE,
  mongoConfig: {},
  enableDatabase: true,
  enableMessageLog: false,
  enableServer: true,
  enableVerify: true,
  logLevel: LogLevel.INFO,
  messagePullingMode: MessagePullingMode.PASSIVE_WS,
  pollInterval: 50,
  qq: -1,
  responseTimeout: 5000,
  singleMode: false,
  server: {
    host: '127.0.0.1',
    port: 9119,
  },
  verifyKey: '',
};
