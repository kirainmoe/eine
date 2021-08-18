import { MessageChain } from "../common/types/MessageComponentType";
import asStr from "./asStr";

export const serializeMessage = (messageChain: MessageChain) => {
  return messageChain.map(message => asStr(message)).filter(item => item.length > 0).join(' ');
}

export default serializeMessage;