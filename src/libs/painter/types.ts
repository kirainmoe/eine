export namespace EinePainterType {
  export interface Font {
    family: string;
    path: string;
    weight?: string;
    style?: string;
  }

  export interface Buffer {
    command: (...args: any) => any;
    args: any[];
    thisRef: any;
  }

  export enum FillMode {
    FILL,
    STROKE
  }

  export type RGB = [number, number, number];
  export type RGBA = [number, number, number, number];
  export type Color = string | RGB | RGBA;

  export interface GradientStop {
    position: number;
    color: Color;
  }

  export interface FontStyle {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
  }

  export interface LineStyle {
    lineHeight: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    direction: CanvasDirection;
  }

  export interface CanvasFontStyle {
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    direction: CanvasDirection;
  }

  export interface CanvasState extends CanvasFontStyle {
    lineWidth: number;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
    miterLimit: number;
    lineDash: number[];
    lineDashOffset: number;

    fillStyle: string;
    strokeStyle: string;

    shadowBlur: number;
    shadowColor: number;
    shadowOffsetX: number;
    shadowOffsetY: number;

    globalAlpha: number;
  }

  export const canvasStateProps = [
    "font",
    "textAlign",
    "textBaseline",
    "direction",
    "lineWidth",
    "lineCap",
    "lineJoin",
    "miterLimit",
    "lineDash",
    "lineDashOffset",
    "fillStyle",
    "strokeStyle",
    "shadowBlur",
    "shadowColor",
    "shadowOffsetX",
    "shadowOffsetY",
    "globalAlpha"
  ];

  export interface PainterImageParam {
    align?: CanvasTextAlign;
    fromX?: number;
    fromY?: number;
    width?: number;
    height?: number;
  }

  export interface PainterMargin {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }
}

export default EinePainterType;
