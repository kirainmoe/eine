import { WebsocketAdapterSetting } from "../../common/types";

/** WebsocketDriver 实例化选项 */
export interface WebsocketDriverOptions extends WebsocketAdapterSetting {
  qq: number;
  verifyKey: string;
  enableVerify: boolean;
}

/** 会话状态 */
export enum WebsocketSessionState {
  IDLE,
  VERIFIED,
}