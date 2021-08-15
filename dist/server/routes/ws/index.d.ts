import { MessageChain, MessageTypeStr, SenderType } from '../../../common/types';
import { EineWebsocketHandlerType } from "../types";
export declare const pushMessage: ({ type, sender, messageChain, str }: {
    type: MessageTypeStr;
    sender: SenderType;
    messageChain: MessageChain;
    str: string;
}) => void;
export default function websocketHandler({ ws, eine, server, db, logger }: EineWebsocketHandlerType): void;
