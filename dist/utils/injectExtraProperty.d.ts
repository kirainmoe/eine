import Eine from "..";
import { EineEventName, EventFilter, EventIterator, MessageChain } from "../common/types";
/**
 * 为事件注入冗余属性和方法，方便进行某些操作
 * @param event 事件名称
 * @param payload 事件携带
 * @param eineInstance Eine 实例
 * @returns
 */
export declare const injectExtraProperty: (event: EineEventName, payload: any, eineInstance: Eine) => {
    messageStr: string;
    reply: (messageChain: MessageChain) => any;
    quote: (messageChain: MessageChain) => any;
    recall: () => any;
    wait: (iterator: EventIterator, filter: EventFilter) => import("../common/types").EventHandleResult;
    accept?: undefined;
    deny?: undefined;
    ignore?: undefined;
} | {
    accept: () => any;
    deny: () => any;
    messageStr?: undefined;
    reply?: undefined;
    quote?: undefined;
    recall?: undefined;
    wait?: undefined;
    ignore?: undefined;
} | {
    accept: () => any;
    deny: () => any;
    ignore: () => any;
    messageStr?: undefined;
    reply?: undefined;
    quote?: undefined;
    recall?: undefined;
    wait?: undefined;
} | undefined;
export default injectExtraProperty;
