/// <reference types="node" />
import { ReadStream } from 'fs';
import * as ComponentType from './types/MessageComponentType';
export declare const At: (target: number) => ComponentType.At;
export declare const AtAll: () => ComponentType.AtAll;
export declare const Face: (face: number | string) => {
    faceId: number;
    type: ComponentType.MessageComponentTypeStr;
} | {
    name: string;
    type: ComponentType.MessageComponentTypeStr;
};
export declare const Plain: (text: string) => ComponentType.Plain;
export declare const Image: (image: Partial<Omit<ComponentType.Image, 'type'>>) => {
    base64?: string | null | undefined;
    imageId?: string | undefined;
    url?: string | null | undefined;
    path?: string | null | undefined;
    type: ComponentType.MessageComponentTypeStr;
};
export declare const ImageFrom: (file: string | ReadStream | Buffer) => ComponentType.PreloadFile;
export declare const FlashImage: (flashImage: Partial<Omit<ComponentType.FlashImage, 'type'>>) => {
    base64?: string | null | undefined;
    imageId?: string | undefined;
    url?: string | null | undefined;
    path?: string | null | undefined;
    type: ComponentType.MessageComponentTypeStr;
};
export declare const FlashImageFrom: (file: string | ReadStream | Buffer) => ComponentType.PreloadFile;
export declare const Voice: (voice: Partial<Omit<ComponentType.Voice, 'type'>>) => ComponentType.Voice;
export declare const VoiceFrom: (file: string | ReadStream | Buffer) => ComponentType.PreloadFile;
export declare const Xml: (xml: string) => ComponentType.Xml;
export declare const Json: (json: string) => ComponentType.Json;
export declare const App: (app: string) => ComponentType.App;
export declare const Poke: (name: ComponentType.PokeType) => ComponentType.Poke;
export declare const Dice: (value: number) => ComponentType.Dice;
export declare const MusicShare: (kind: string, title: string, summary: string, jumpUrl: string, pictureUrl: string, musicUrl: string, brief: string) => ComponentType.MusicShare;
export declare const ForwardMessage: (nodeList: ComponentType.ForwardNodeList) => ComponentType.ForwardMessage;
export declare const File: (id: string, name: string, size: number) => ComponentType.File;
export declare const FileFrom: (file: string | ReadStream | Buffer, uploadPath: string, filename: string) => ComponentType.PreloadFile;
