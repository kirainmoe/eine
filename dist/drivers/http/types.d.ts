import { Adapter } from "../../common/types";
/** HttpDriver 实例化选项 */
export interface HttpDriverOptions extends Adapter.HttpAdapterSetting {
    qq: number;
    verifyKey: string;
    enableVerify: boolean;
    singleMode: boolean;
}
/** 会话状态 */
export declare enum HttpSessionState {
    IDLE = 0,
    VERIFIED = 1,
    BOUND = 2
}
