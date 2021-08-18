import { MessageComponentTypeStr } from "../common/types/MessageComponentType";

export const asStr = (target: any): string => {
  if (typeof target === 'string')
    return target;

  if (target.type) {
    switch (target.type) {
      case MessageComponentTypeStr.AT:
        return `@${target.display}`;

      case MessageComponentTypeStr.AT_ALL:
        return `@全体成员`;

      case MessageComponentTypeStr.FACE:
        return `[mirai:face:${target.faceId? target.faceId : target.name}]`;

      case MessageComponentTypeStr.PLAIN:
        return target.text;

      case MessageComponentTypeStr.IMAGE:
        return `[mirai:image:${target.url}]`;

      case MessageComponentTypeStr.FLASH_IMAGE:
        return `[mirai:flash-image:${target.url}]`;

      case MessageComponentTypeStr.VOICE:
        return `[mirai:voice:${target.url}]`;

      case MessageComponentTypeStr.XML:
        return `[mirai:xml:${target.xml}]`;

      case MessageComponentTypeStr.JSON:
        return `[mirai:json:${target.json}]`;

      case MessageComponentTypeStr.APP:
        return `[mirai:app:${target.app}]`;

      case MessageComponentTypeStr.POKE:
        return `[mirai:poke:${target.name}]`;

      case MessageComponentTypeStr.DICE:
        return `[mirai:dice:${target.value}]`;

      case MessageComponentTypeStr.MUSIC_SHARE:
        return `[mirai:music-share:${target.title},${target.summary},${target.musicUrl}]`;

      case MessageComponentTypeStr.FILE:
        return `[mirai:file:${target.name}]`;
        
      default:
        return '';
    }
  }

  if (target.toString)
    return target.toString();
  
  return '';
}

export default asStr;
