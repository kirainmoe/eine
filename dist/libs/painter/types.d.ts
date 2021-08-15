export declare namespace EinePainterType {
    interface Font {
        family: string;
        path: string;
        weight?: string;
        style?: string;
    }
    interface Buffer {
        command: (...args: any) => any;
        args: any[];
        thisRef: any;
    }
    enum FillMode {
        FILL = 0,
        STROKE = 1
    }
    type RGB = [number, number, number];
    type RGBA = [number, number, number, number];
    type Color = string | RGB | RGBA;
    interface GradientStop {
        position: number;
        color: Color;
    }
    interface FontStyle {
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
    }
    interface LineStyle {
        lineHeight: number;
        textAlign: CanvasTextAlign;
        textBaseline: CanvasTextBaseline;
        direction: CanvasDirection;
    }
    interface CanvasFontStyle {
        font: string;
        textAlign: CanvasTextAlign;
        textBaseline: CanvasTextBaseline;
        direction: CanvasDirection;
    }
    interface CanvasState extends CanvasFontStyle {
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
    const canvasStateProps: string[];
    interface PainterImageParam {
        align?: CanvasTextAlign;
        fromX?: number;
        fromY?: number;
        width?: number;
        height?: number;
    }
    interface PainterMargin {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
}
export default EinePainterType;
