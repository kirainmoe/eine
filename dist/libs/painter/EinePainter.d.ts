/// <reference types="node" />
import { CanvasGradient, JpegConfig, NodeCanvasRenderingContext2D, PngConfig } from "canvas";
import Eine from "../..";
import EinePainterType from "./types";
export default class EinePainter {
    private logger;
    private canvas;
    private ctx;
    private width;
    private height;
    private canvasFillColor;
    private buffer;
    private fontStyle;
    private lineStyle;
    private lastLinePosX;
    private lastLinePosY;
    private shouldAutoAdjustHeight;
    private static fontList;
    /**
     * 导入字体
     * @param path 字体路径，支持 ttf, woff2, ttc, ...
     * @param name 字体名称 (font-family)
     * @param weight 字重 (normal, bold)
     * @param style 样式 (italic)
     */
    static importFont(path: string, name: string, weight?: string, style?: string): void;
    constructor(eine: Eine);
    /** 获取 node-canvas 2D 上下文 */
    get context(): NodeCanvasRenderingContext2D | null;
    /** 获取当前画布尺寸 */
    get size(): number[];
    /** 获取上一行文字的结束位置 */
    get lastline(): number[];
    /** 上下文属性赋值辅助函数 */
    private assign;
    /**
     * 将颜色转换为 CSS 字符串表示
     * @param color 支持各种类型，如 "white", "#fff", [0,0,0], [255,255,255,0.3]
     */
    private parseColor;
    /**
     * 设置当内容超出画布时，是否自动调整画布大小
     * @param autoAdjust
     */
    setAutoAdjustHeight: (autoAdjust: boolean) => this;
    /**
     * 添加指令序列
     * @param command 指令函数
     * @param args 函数参数
     */
    add(command: ((...args: any[]) => any) | undefined, args?: any[], thisRef?: any): this;
    /**
     * 创建画布
     * @param width 画布宽度
     * @param height 画布高度
     * @param backgroundFill
     */
    create(width: number, height: number, backgroundFill?: EinePainterType.Color): this;
    /**
     * 擦除矩形区域，从 (fromX, fromY) 开始，宽度为 width, 高度为 height 的矩形
     * @param fromX
     * @param fromY
     * @param width
     * @param height
     */
    erase: (fromX: number, fromY: number, width: number, height: number) => this;
    clearRect: (fromX: number, fromY: number, width: number, height: number) => this;
    /** 开始绘制路径 */
    begin: () => this;
    beginPath: () => this;
    /**
     * 将当前笔触落点移动到 (x, y)
     * @param x
     * @param y
     */
    move: (x: number, y: number) => this;
    moveTo: (x: number, y: number) => this;
    /**
     * 从当前笔触落点移动到 (x, y)
     * @param x
     * @param y
     */
    line: (x: number, y: number) => this;
    lineTo: (x: number, y: number) => this;
    /** 闭合路径，结束绘制 */
    close: () => this;
    closePath: () => this;
    /** 填充闭合路径图形 */
    fill: () => this;
    /** 绘制路径轮廓 */
    stroke: () => this;
    /**
     * 绘制矩形，起点 (fromX, fromY)，宽度和高度分别为 (width, height)
     * @param fromX
     * @param fromY
     * @param width
     * @param height
     * @param fill 填充颜色 (true) 或只绘制边框 (false)
     */
    rect: (fromX: number, fromY: number, width: number, height: number, fill?: boolean) => this;
    fillRect: (fromX: number, fromY: number, width: number, height: number, fill?: boolean) => this;
    /**
     * 绘制矩形（仅边框），起点 (fromX, fromY)，宽度和高度分别为 (width, height)
     * @param fromX
     * @param fromY
     * @param width
     * @param height
     */
    borderRect: (fromX: number, fromY: number, width: number, height: number) => this;
    strokeRect: (fromX: number, fromY: number, width: number, height: number) => this;
    /**
     * 绘制圆弧，圆心为 (x, y)、半径为 radius，角度为 [startAngle, endAngle]
     * @param x
     * @param y
     * @param radius
     * @param startAngle 圆弧起始角度
     * @param endAngle 圆弧结束角度
     * @param anticlockwise 是否逆时针绘制
     */
    arc: (x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean) => this;
    /**
     * 贝塞尔曲线，支持 2-3 个控制点，以 [[x1,y1], [x2,y2], ...] 形式传入
     * @param controlPoints
     */
    bezier: (...controlPoints: [number, number][]) => this;
    /**
     * 根据三点绘制三角形
     * @param p1
     * @param p2
     * @param p3
     * @param fill 填充颜色 (true) 或只绘制边框 (false)
     */
    triangle: (p1: [number, number], p2: [number, number], p3: [number, number], fill?: boolean) => this;
    /**
     * 绘制圆
     * @param center 圆心 [x, y]
     * @param radius 半径
     * @param fill 填充颜色 (true) 或只绘制边框 (false)
     */
    circle: (center: [number, number], radius: number, fill?: boolean) => this;
    /**
     * 绘制圆角矩形，起点 (fromX, fromY)，尺寸 width * height，圆角半径为 radius
     * @param fromX
     * @param fromY
     * @param width
     * @param height
     * @param radius 圆角半径
     * @param fill 填充颜色 (true) 或只绘制边框 (false)
     */
    roundedRect(fromX: number, fromY: number, width: number, height: number, radius: number, fill?: boolean): this;
    backgroundColor: (color: CanvasGradient | EinePainterType.Color) => this;
    fillColor: (color: CanvasGradient | EinePainterType.Color) => this;
    fontColor: (color: CanvasGradient | EinePainterType.Color) => this;
    set fillStyle(color: string | EinePainterType.RGB | EinePainterType.RGBA);
    borderColor: (color: CanvasGradient | EinePainterType.Color) => this;
    strokeColor: (color: CanvasGradient | EinePainterType.Color) => this;
    set strokeStyle(color: string | EinePainterType.RGB | EinePainterType.RGBA);
    alpha: (alpha: number) => this;
    set globalAlpha(alpha: number);
    lineWidth: (value: number) => this;
    lineCap: (type: CanvasLineCap) => this;
    lineJoin: (type: CanvasLineJoin) => this;
    lineDashOffset: (value: number) => this;
    setLineDash: (segments: number[]) => this;
    segment: (fromX: number, fromY: number, toX: number, toY: number) => this;
    dash: (fromX: number, fromY: number, toX: number, toY: number, dashInterval?: number[], dashOffset?: number) => void;
    /**
     * 创建线性渐变
     * @param from 渐变起始点
     * @param to 渐变终点
     * @param stops 渐变颜色插值点
     */
    linearGradient: (from: [number, number], to: [number, number], stops: EinePainterType.GradientStop[]) => this;
    /**
     * 创建圆形渐变
     * @param from 渐变起始圆圆心、半径
     * @param to 渐变终止圆圆心、半径
     * @param stops 渐变颜色插值点
     */
    radialGradient: (from: [number, number, number], to: [number, number, number], stops: EinePainterType.GradientStop[]) => this;
    /**
     * 设置阴影
     * @param offsetX 阴影在 x 轴延伸的距离
     * @param offsetY 阴影在 y 轴延伸的距离
     * @param blur 阴影的模糊程度
     * @param shadowColor 阴影颜色
     */
    shadow: (offsetX: number, offsetY: number, blur: number, shadowColor: EinePainterType.Color) => this;
    /**
     * 应用字体设置到 context
     * @private
     */
    private applyCurrentFontSetting;
    /**
     * 缓存当前 context 字体设置
     * @private
     */
    private cacheCurrentFontSetting;
    /**
     * 恢复 context 字体设置
     * @param fontSetting
     * @private
     */
    private restoreFontSetting;
    /**
     * 设置文字样式 (fontSize, fontFamily)
     * @param style
     */
    setFontStyle: (style: Partial<EinePainterType.FontStyle>) => this;
    /**
     * 设置行样式 (textAlign, textBaseline, direction, lineHeight)
     * @param style
     */
    setLineStyle: (style: Partial<EinePainterType.LineStyle>) => this;
    /**
     * 绘制单行文字（填充）
     * @param text 文字内容
     * @param x 起始位置 x 坐标
     * @param y 起始位置 y 坐标
     * @param maxWidth 行最大宽度，用于缩放
     */
    fillText: (text: string, x: number, y: number, maxWidth?: number | undefined) => this;
    /**
     * 绘制单行文字（边框）
     * @param text 文字内容
     * @param x 起始位置 x 坐标
     * @param y 起始位置 y 坐标
     * @param maxWidth 行最大宽度，用于缩放
     */
    strokeText: (text: string, x: number, y: number, maxWidth?: number | undefined) => this;
    /**
     * 绘制并排版文字，绘制结束的位置保存在 this.lastline 中
     * @param text 文字
     * @param fromX 绘制起点 x 坐标
     * @param fromY 绘制起点 y 坐标
     * @param maxWidth 行最大宽度
     * @param fill 填充绘制 (true) 或边框绘制 (false)
     */
    text: (text: string, fromX?: number, fromY?: number, maxWidth?: number | undefined, fill?: boolean) => this;
    /**
     * (内部 API) 保存当前 canvas context 状态
     * @private
     */
    private cacheCurrentContextState;
    /**
     * (内部 API) 恢复 canvas context 状态
     * @param state
     */
    private restoreContextState;
    /**
     * 放大 canvas 画板，注意：此方法是立即执行的，并且会丢失部分 canvas context 状态！
     * @param width 新画板宽度
     * @param height 新画板高度
     */
    requestResizeCanvas: (width: number, height: number) => this | undefined;
    /**
     * 获取图片尺寸 (width * height)
     * @param image 图片来源
     */
    getImageSize(image: string | Buffer): import("image-size/dist/types/interface").ISizeCalculationResult;
    /**
     * 在指定位置绘制图片
     * @param source 图片来源
     * @param fromX 图片左上角位置 x 坐标
     * @param fromY 图片左上角位置 y 坐标
     * @param width 图片缩放宽度
     * @param height 图片缩放高度
     */
    image(source: string | Buffer, fromX: number, fromY: number, width?: number, height?: number): this;
    /**
     * 在当前行位置绘制图片
     * @param source 图片来源
     * @param align 对齐方式
     * @param margin 边距
     */
    imageBlock(source: string | Buffer, align?: CanvasTextAlign, margin?: Partial<EinePainterType.PainterMargin>): this;
    /**
     * 执行图片绘制
     * @param source 图片来源
     * @param fromX 图片左上角位置 x 坐标
     * @param fromY 图片左上角位置 y 坐标
     * @param width 图片缩放宽度
     * @param height 图片缩放高度
     */
    drawImage(source: string | Buffer, fromX: number, fromY: number, width?: number, height?: number): Promise<void>;
    /** 保存 canvas 状态 */
    save: () => this;
    /** 恢复 canvas 状态 */
    restore: () => this;
    /**
     * 平移变换
     * @param x x 方向平移距离
     * @param y y 方向平移距离
     */
    translate: (x: number, y: number) => this;
    /**
     * 旋转变换
     * @param angle 旋转角度
     */
    rotate: (angle: number) => this;
    /**
     * 缩放变换
     * @param x x 方向缩放比例
     * @param y y 方向缩放比例
     */
    scale: (x: number, y: number) => this;
    /**
     * 推入变换矩阵
     * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
     */
    transform: (mat: number[][]) => this;
    /**
     * 设置（替换）当前变换矩阵
     * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
     */
    setTransform: (mat: number[][]) => this;
    /**
     * 重设变换矩阵为单位阵 [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
     */
    resetTransform: () => this;
    /**
     * 设置合成方式 https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing
     * @param compositionType
     */
    setComposition: (compositionType: string) => this;
    /** 裁剪路径选中的图像 */
    clip: () => this;
    /** 执行绘图操作，清空绘图指令缓冲区 */
    exec(): Promise<void>;
    /**
     * 输出为 PNG 文件
     * @param path 输出路径
     */
    saveAsPNG(path: string): Promise<unknown>;
    /**
     * 输出为 JPG 文件
     * @param path 输出路径
     */
    saveAsJPG(path: string): Promise<unknown>;
    /**
     * (同步) 输出为 PNG Buffer
     * @param mimeType image/png
     * @param config
     */
    toPNGBufferSync(mimeType: "image/png", config?: PngConfig): Buffer;
    /**
     * (同步) 输出为 JPG Buffer
     * @param mimeType image/jpeg
     * @param config
     */
    toJPEGBuffer(mimeType: "image/jpeg", config?: JpegConfig): Buffer;
    /**
     * (异步) 输出为 Buffer
     */
    toBuffer(): Promise<Buffer>;
}
