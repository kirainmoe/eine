import { ReadStream } from 'fs';
import * as ComponentType from './types/MessageComponentType';
import { MessageComponentTypeStr } from './types/MessageComponentType';

export const At = (target: number): ComponentType.At => ({
  type: MessageComponentTypeStr.AT,
  target,
  display: '',
});

export const AtAll = (): ComponentType.AtAll => ({
  type: MessageComponentTypeStr.AT_ALL,
});

export const Face = (face: number | string) => ({
  type: MessageComponentTypeStr.FACE,
  ...(typeof face === 'number' ? { faceId: face } : { name: face })
});

export const Plain = (text: string): ComponentType.Plain => ({
  type: MessageComponentTypeStr.PLAIN,
  text,
});

export const Image = (image: Partial<Omit<ComponentType.Image, 'type'>>) => ({
  type: MessageComponentTypeStr.IMAGE,
  ...image,
});

Image.from = (file: string | ReadStream | Buffer): ComponentType.PreloadFile => {
  return {
    type: MessageComponentTypeStr.PRELOAD,
    originType: MessageComponentTypeStr.IMAGE,
    file,
  };
};

export const FlashImage = (flashImage: Partial<Omit<ComponentType.FlashImage, 'type'>>) => ({
  type: MessageComponentTypeStr.FLASH_IMAGE,
  ...flashImage,
});

FlashImage.from = (file: string | ReadStream | Buffer): ComponentType.PreloadFile => {
  return {
    type: MessageComponentTypeStr.PRELOAD,
    originType: MessageComponentTypeStr.FLASH_IMAGE,
    file,
  };
};

export const Voice = (voice: Partial<Omit<ComponentType.Voice, 'type'>>): ComponentType.Voice => ({
  type: MessageComponentTypeStr.VOICE,
  ...voice,
});

Voice.from = (file: string | ReadStream | Buffer): ComponentType.PreloadFile => {
  return {
    type: MessageComponentTypeStr.PRELOAD,
    originType: MessageComponentTypeStr.VOICE,
    file, 
  }
};

export const Xml = (xml: string): ComponentType.Xml => ({
  type: MessageComponentTypeStr.XML,
  xml,
});

export const Json = (json: string): ComponentType.Json => ({
  type: MessageComponentTypeStr.JSON,
  json,
});

export const App = (app: string): ComponentType.App => ({
  type: MessageComponentTypeStr.APP,
  app,
});

export const Poke = (name: ComponentType.PokeType): ComponentType.Poke => ({
  type: MessageComponentTypeStr.POKE,
  name,
})

export const Dice = (value: number): ComponentType.Dice => ({
  type: MessageComponentTypeStr.DICE,
  value,
});

export const MusicShare = (
  kind: string,
  title: string,
  summary: string,
  jumpUrl: string,
  pictureUrl: string,
  musicUrl: string,
  brief: string
): ComponentType.MusicShare => ({
  type: MessageComponentTypeStr.MUSIC_SHARE,
  kind,
  title,
  summary,
  jumpUrl,
  pictureUrl,
  musicUrl,
  brief,
});

export const ForwardMessage = (nodeList: ComponentType.ForwardNodeList): ComponentType.ForwardMessage => ({
  type: MessageComponentTypeStr.FORWARD_MESSAGE,
  nodeList
});

export const File = (id: string, name: string, size: number): ComponentType.File => ({
  type: MessageComponentTypeStr.FILE,
  id,
  name,
  size,
});

File.from = (file: string | ReadStream | Buffer, uploadPath: string, filename: string): ComponentType.PreloadFile => {
  return {
    type: MessageComponentTypeStr.PRELOAD,
    originType: MessageComponentTypeStr.FILE,
    file,
    filename,
    path: uploadPath,
  };
};
