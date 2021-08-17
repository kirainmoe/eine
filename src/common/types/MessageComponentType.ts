import { ReadStream } from "fs";

export enum MessageComponentTypeStr {
  SOURCE = "Source",
  QUOTE = "Quote",
  AT = "At",
  AT_ALL = "AtAll",
  FACE = "Face",
  PLAIN = "Plain",
  IMAGE = "Image",
  FLASH_IMAGE = "FlashImage",
  VOICE = "Voice",
  XML = "Xml",
  JSON = "Json",
  APP = "App",
  POKE = "Poke",
  DICE = "Dice",
  MUSIC_SHARE = "MusicShare",
  FORWARD_MESSAGE = "ForwardMessage",
  FILE = "File",

  PRELOAD = "Preload",
}

/** 戳一戳类型 */
export enum PokeType {
  POKE = "Poke",                // 戳一戳
  SHOW_LOVE = "ShowLove",       // 比心
  LIKE = "Like",                // 点赞
  HEARTBROKEN = "Heartbroken",  // 心碎
  SIX_SIX_SIX = "SixSixSix",    // 666
  FANG_DA_ZHAO = "FangDaZhao"   // 放大招
}

/** 支持的消息类型 */
export type MessageComponentType =
  | Source
  | Quote
  | At
  | AtAll
  | Face
  | Plain
  | Image
  | FlashImage
  | Voice
  | Xml
  | Json
  | App
  | Poke
  | Dice
  | MusicShare
  | ForwardMessage
  | File
  | PreloadFile;

/** 消息链数组 */
export type MessageChain = (string | MessageComponentType)[];

/** 转发消息节点元素 */
export interface ForwardNodeListItem {
  /** 发送人 QQ 号 */
  senderId: number;

  /** 发送时间 */
  time: number;

  /** 显示名称 */
  senderName: string;

  /** 消息数组 */
  messageChain: MessageChain;

  /** 消息识别号 */
  sourceId: number;
}

/** 转发消息节点 */
export type ForwardNodeList = ForwardNodeListItem[];

/** 消息来源 */
export interface Source {
  type: MessageComponentTypeStr.SOURCE;

  /** 消息的识别号，用于引用回复（Source 类型永远为 chain 的第一个元素） */
  id: number;

  /** 时间戳 */
  time: number;
}

/** 引用消息 */
export interface Quote {
  type: MessageComponentTypeStr.QUOTE;

  /** 被引用回复的原消息的 messageId */
  id: number;
  
  /** 被引用回复的原消息所接收的群号，当为好友消息时为 0 */
  groupId: number;
  
  /** 被引用回复的原消息的发送者的 QQ 号 */
  senderId: number;
  
  /** 被引用回复的原消息的接收者者的 QQ 号（或群号） */
  targetId: number;
  
  /** 被引用回复的原消息的 MessageChain 对象 */
  origin: MessageChain;
}

/** at 成员信息 */
export interface At {
  type: MessageComponentTypeStr.AT;
  
  /** 群员 QQ 号 */
  target: number;
  
  /** At 时显示的文字，发送消息时无效，自动使用群名片 */
  display: string;
}

/** at 全体成员 信息 */
export interface AtAll {
  type: MessageComponentTypeStr.AT_ALL;
}

/** QQ 表情 */
export interface Face {
  type: MessageComponentTypeStr.FACE;
  
  /** 表情编号，可选，优先高于 name */
  faceId?: number;
  
  /** 表情拼音，可选 */
  name?: string;
}

/** 文字信息 */
export interface Plain {
  type: MessageComponentTypeStr.PLAIN;
  
  /** 文字消息内容 */
  text: string;
}

/** 图片信息，出现多个参数时，按照 imageId > url > path > base64 的优先级 */
export interface Image {
  type: MessageComponentTypeStr.IMAGE;
  
  /** 图片的 imageId，群图片与好友图片格式不同。不为空时将忽略 url 属性 */
  imageId?: string;
  
  /** 图片的 URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载 */
  url?: string | null;
  
  /** 图片的路径，发送本地图片，相对路径于 plugins/MiraiAPIHTTP/images */
  path?: string | null;
  
  /** 图片的 Base64 编码 */
  base64?: string | null;
}

/** 闪照信息 */
export interface FlashImage {
  type: MessageComponentTypeStr.FLASH_IMAGE;
  
  /** 图片的 imageId，群图片与好友图片格式不同。不为空时将忽略 url 属性 */
  imageId?: string;
  
  /** 图片的 URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载 */
  url?: string | null;
  
  /** 图片的路径，发送本地图片，相对路径于 plugins/MiraiAPIHTTP/images */
  path?: string | null;
  
  /** 图片的 Base64 编码 */
  base64?: string | null;
}

/** 语音信息，出现多个参数时，按照 voiceId > url > path > base64 的优先级 */
export interface Voice {
  type: MessageComponentTypeStr.VOICE;
  
  /** 语音的 voiceId，不为空时将忽略 url 属性 */
  voiceId?: string;
  
  /** 语音的 URL，发送时可作网络语音的链接；接收时为腾讯语音服务器的链接，可用于语音下载 */
  url?: string;
  
  /** 语音的路径，发送本地语音，相对路径于 plugins/MiraiAPIHTTP/voices */
  path?: string;
  
  /** 语音的 Base64 编码 */
  base64?: string;
}

/** XML 类型信息 */
export interface Xml {
  type: MessageComponentTypeStr.XML;
  
  /** XML 文本 */
  xml: string;
}

/** JSON 类型信息 */
export interface Json {
  type: MessageComponentTypeStr.JSON;
  
  /** JSON 文本 */
  json: string;
}

/** 小程序类型信息 */
export interface App {
  type: MessageComponentTypeStr.APP;
  
  /** App 内容 */
  app: string;
}

/** 戳一戳 */
export interface Poke {
  type: MessageComponentTypeStr.POKE;

  /** 戳一戳的类型 */
  name: PokeType;
}

/** 骰子 */
export interface Dice {
  type: MessageComponentTypeStr.DICE;

  /** 骰子点数 */
  value: number;
}

/** 音乐分享（点歌） */
export interface MusicShare {
  type: MessageComponentTypeStr.MUSIC_SHARE;

  /** 分享类型，如 NeteaseCloudMusic = 网易云音乐; QQMusic = QQ 音乐 等 */
  kind: string;

  /** 音乐标题 */
  title: string;

  /** 音乐专辑名称或概括 */
  summary: string;

  /** 点击跳转地址 */
  jumpUrl: string;

  /** 封面图片地址 */
  pictureUrl: string;

  /** 音源地址 */
  musicUrl: string;

  /** 简介，如 "[分享] 歌名" */
  brief: string;
}

/** 转发消息 */
export interface ForwardMessage {
  type: MessageComponentTypeStr.FORWARD_MESSAGE;

  /** 转发消息节点 */
  nodeList: ForwardNodeList;
}

/** 文件消息 */
export interface File {
  type: MessageComponentTypeStr.FILE;

  /** 文件识别 ID */
  id: string;

  /** 文件名 */
  name: string;

  /** 文件大小 */
  size: number;
}


export interface PreloadFile {
  type: MessageComponentTypeStr.PRELOAD;

  originType:
    | MessageComponentTypeStr.IMAGE
    | MessageComponentTypeStr.FLASH_IMAGE
    | MessageComponentTypeStr.VOICE
    | MessageComponentTypeStr.FILE;

  file: string | ReadStream | Buffer;

  filename?: string;

  path?: string;
}