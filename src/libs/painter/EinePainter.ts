import { createWriteStream } from "fs";
import {
  Canvas,
  CanvasGradient,
  createCanvas,
  JpegConfig,
  NodeCanvasRenderingContext2D,
  PngConfig,
  registerFont,
  loadImage,
} from "canvas";
import imageSize from "image-size";

import Eine from "../..";
import EineLogger from "../logger/EineLogger";
import { PainterType } from "../../common/types";

export default class EinePainter {
  private logger: EineLogger;

  private canvas: Canvas | null = null;
  private ctx: NodeCanvasRenderingContext2D | null = null;

  private width: number = 0;
  private height: number = 0;
  private canvasFillColor: PainterType.Color = "#ffffff";
  private buffer: PainterType.Buffer[] = [];
  private fontStyle: PainterType.FontStyle = {
    fontSize: 16,
    fontFamily: "sans-serif",
    fontWeight: "",
  };
  private lineStyle: PainterType.LineStyle = {
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "inherit",
    lineHeight: 20,
  };
  private lastLinePosX = 0;
  private lastLinePosY = 0;

  private shouldAutoAdjustHeight: boolean = false;

  private static fontList: Map<string, PainterType.Font> = new Map();

  /**
   * 导入字体
   * @param path 字体路径，支持 ttf, woff2, ttc, ...
   * @param name 字体名称 (font-family)
   * @param weight 字重 (normal, bold)
   * @param style 样式 (italic)
   */
  public static importFont(path: string, name: string, weight?: string, style?: string) {
    if (this.fontList.has(name)) return;
    const font: PainterType.Font = {
      path,
      family: name,
      weight,
      style,
    };
    registerFont(path, font);
    this.fontList.set(name, font);
  }

  public importFont = EinePainter.importFont;

  constructor(eine: Eine) {
    this.logger = eine.logger;
  }

  /** 获取 node-canvas 2D 上下文 */
  public get context() {
    return this.ctx;
  }

  /** 获取当前画布尺寸 */
  public get size() {
    return [this.width, this.height];
  }

  /** 获取上一行文字的结束位置 */
  public get lastline() {
    return [this.lastLinePosX, this.lastLinePosY];
  }

  /** 上下文属性赋值辅助函数 */
  private assign = (target: any, key: string, value: any) => {
    target[key] = value;
  };

  /**
   * 将颜色转换为 CSS 字符串表示
   * @param color 支持各种类型，如 "white", "#fff", [0,0,0], [255,255,255,0.3]
   */
  private parseColor = (color: PainterType.Color | CanvasGradient) => {
    if (color instanceof CanvasGradient) return color;
    if (typeof color === "string") return color;
    const type = color.length === 3 ? "rgb" : "rgba";
    return `${type}(${color.join(",")})`;
  };

  /**
   * 设置当内容超出画布时，是否自动调整画布大小
   * @param autoAdjust
   */
  public setAutoAdjustHeight = (autoAdjust: boolean) => {
    this.shouldAutoAdjustHeight = autoAdjust;
    return this;
  };

  /**
   * 添加指令序列
   * @param command 指令函数
   * @param args 函数参数
   */
  public add(command: ((...args: any[]) => any) | undefined, args: any[] = [], thisRef: any = null) {
    if (!command) {
      return this;
    }

    this.buffer.push({ command, args, thisRef });
    return this;
  }

  /**
   * 创建画布
   * @param width 画布宽度
   * @param height 画布高度
   * @param backgroundFill
   */
  public create(width: number, height: number, backgroundFill: PainterType.Color = "#ffffff") {
    this.canvas = createCanvas((this.width = width), (this.height = height));
    this.ctx = this.canvas.getContext("2d");
    this.buffer = [];
    this.canvasFillColor = backgroundFill;

    this.backgroundColor(this.parseColor(this.canvasFillColor));
    this.rect(0, 0, width, height);
    this.backgroundColor("#000000");

    return this;
  }

  /**
   * 擦除矩形区域，从 (fromX, fromY) 开始，宽度为 width, 高度为 height 的矩形
   * @param fromX
   * @param fromY
   * @param width
   * @param height
   */
  public erase = (fromX: number, fromY: number, width: number, height: number) =>
    this.add(this.ctx?.clearRect, [fromX, fromY, width, height]);
  public clearRect = this.erase;

  /** 开始绘制路径 */
  public begin = () => this.add(this.ctx?.beginPath, []);
  public beginPath = this.begin;

  /**
   * 将当前笔触落点移动到 (x, y)
   * @param x
   * @param y
   */
  public move = (x: number, y: number) => this.add(this.ctx?.moveTo, [x, y]);
  public moveTo = this.move;

  /**
   * 从当前笔触落点直线移动到 (x, y)
   * @param x
   * @param y
   */
  public line = (x: number, y: number) => this.add(this.ctx?.lineTo, [x, y]);
  public lineTo = this.line;

  /** 闭合路径，结束绘制 */
  public close = () => this.add(this.ctx?.closePath, []);
  public closePath = this.close;

  /** 填充闭合路径图形 */
  public fill = () => this.add(this.ctx?.fill, []);

  /** 绘制路径轮廓 */
  public stroke = () => this.add(this.ctx?.stroke, []);

  /**
   * 绘制矩形，起点 (fromX, fromY)，宽度和高度分别为 (width, height)
   * @param fromX
   * @param fromY
   * @param width
   * @param height
   * @param fill 填充颜色 (true) 或只绘制边框 (false)
   */
  public rect = (fromX: number, fromY: number, width: number, height: number, fill: boolean = true) =>
    this.add(fill ? this.ctx?.fillRect : this.ctx?.strokeRect, [fromX, fromY, width, height]);
  public fillRect = this.rect;

  /**
   * 绘制矩形（仅边框），起点 (fromX, fromY)，宽度和高度分别为 (width, height)
   * @param fromX
   * @param fromY
   * @param width
   * @param height
   */
  public borderRect = (fromX: number, fromY: number, width: number, height: number) =>
    this.add(this.ctx?.strokeRect, [fromX, fromY, width, height]);
  public strokeRect = this.borderRect;

  /**
   * 绘制圆弧，圆心为 (x, y)、半径为 radius，角度为 [startAngle, endAngle]
   * @param x
   * @param y
   * @param radius
   * @param startAngle 圆弧起始角度
   * @param endAngle 圆弧结束角度
   * @param anticlockwise 是否逆时针绘制
   */
  public arc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean) =>
    this.add(this.ctx?.arc, [x, y, radius, startAngle, endAngle, anticlockwise]);

  /**
   * 贝塞尔曲线，支持 2-3 个控制点，以 [[x1,y1], [x2,y2], ...] 形式传入
   * @param controlPoints
   */
  public bezier = (...controlPoints: [number, number][]) => {
    if (controlPoints.length <= 1) return this;
    if (controlPoints.length === 2)
      return this.add(this.ctx?.quadraticCurveTo, [...controlPoints[0], ...controlPoints[1]]);
    return this.add(this.ctx?.bezierCurveTo, [...controlPoints[0], ...controlPoints[1], ...controlPoints[2]]);
  };

  /**
   * 根据三点绘制三角形
   * @param p1
   * @param p2
   * @param p3
   * @param fill 填充颜色 (true) 或只绘制边框 (false)
   */
  public triangle = (p1: [number, number], p2: [number, number], p3: [number, number], fill: boolean = true) => {
    this.begin();
    this.move(...p1);
    this.line(...p2);
    this.line(...p3);
    return fill ? this.fill() : this.stroke();
  };

  /**
   * 绘制圆
   * @param center 圆心 [x, y]
   * @param radius 半径
   * @param fill 填充颜色 (true) 或只绘制边框 (false)
   */
  public circle = (center: [number, number], radius: number, fill: boolean = true, sample = 200) => {
    const [x, y] = center,
      endAngle = Math.PI * 2.0,
      step = endAngle / sample;
    this.begin();
    this.move(x + radius, y);
    for (let angle = 0; angle < endAngle; angle += step)
      this.line(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    return fill ? this.fill() : this.stroke();
  };

  /**
   * 绘制圆角矩形，起点 (fromX, fromY)，尺寸 width * height，圆角半径为 radius
   * @param fromX
   * @param fromY
   * @param width
   * @param height
   * @param radius 圆角半径
   * @param fill 填充颜色 (true) 或只绘制边框 (false)
   */
  public roundedRect(
    fromX: number,
    fromY: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean = true
  ) {
    this.begin();
    this.move(fromX, fromY + radius);
    this.line(fromX, fromY + height - radius);
    this.bezier([fromX, fromY + height], [fromX + radius, fromY + height]);
    this.line(fromX + width - radius, fromY + height);
    this.bezier([fromX + width, fromY + height], [fromX + width, fromY + height - radius]);
    this.line(fromX + width, fromY + radius);
    this.bezier([fromX + width, fromY], [fromX + width - radius, fromY]);
    this.line(fromX + radius, fromY);
    this.bezier([fromX, fromY], [fromX, fromY + radius]);
    return fill ? this.fill() : this.stroke();
  }

  /**
   * 设置背景填充颜色
   * @param color 颜色值
   */
  public backgroundColor = (color: CanvasGradient | PainterType.Color) =>
    this.add(this.assign, [this.ctx, "fillStyle", this.parseColor(color)], this);
  public fillColor = this.backgroundColor;
  public fontColor = this.backgroundColor; // todo: fontColor as distinct color
  public set fillStyle(color: string | PainterType.RGB | PainterType.RGBA) {
    this.backgroundColor(color);
  }

  /**
   * 设置边框填充颜色
   * @param color 颜色值
   */
  public borderColor = (color: CanvasGradient | PainterType.Color) =>
    this.add(this.assign, [this.ctx, "strokeStyle", this.parseColor(color)], this);
  public strokeColor = this.borderColor;
  public set strokeStyle(color: string | PainterType.RGB | PainterType.RGBA) {
    this.borderColor(color);
  }

  /**
   * 设置透明度
   * @param alpha 透明度值
   */
  public alpha = (alpha: number) => this.add(this.assign, [this.ctx, "globalAlpha", alpha], this);
  public set globalAlpha(alpha: number) {
    this.alpha(alpha);
  }

  /**
   * 设置绘制线宽
   * @param value 线宽 (px)
   */
  public lineWidth = (value: number) => this.add(this.assign, [this.ctx, "lineWidth", value], this);

  public lineCap = (type: CanvasLineCap) => this.add(this.assign, [this.ctx, "lineCap", type], this);

  public lineJoin = (type: CanvasLineJoin) => this.add(this.assign, [this.ctx, "lineJoin", type], this);

  public lineDashOffset = (value: number) => this.add(this.assign, [this.ctx, "lineDashOffset", value], this);

  public setLineDash = (segments: number[]) => this.add(this.ctx?.setLineDash, [segments]);

  /**
   * 绘制线段，从 [fromX, fromY] 到 [toX, toY] 的线段
   * @param fromX 
   * @param fromY 
   * @param toX 
   * @param toY 
   * @returns 
   */
  public segment = (fromX: number, fromY: number, toX: number, toY: number) => {
    this.begin();
    this.move(fromX, fromY);
    this.line(toX, toY);
    return this.close();
  };

  /**
   * 绘制虚线，从 [fromX, fromY] 到 [toX, toY]，间隔为 dashInterval
   * @param fromX 
   * @param fromY 
   * @param toX 
   * @param toY 
   * @param dashInterval 
   * @param dashOffset 
   */
  public dash = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    dashInterval: number[] = [1, 1],
    dashOffset: number = 0
  ) => {
    this.setLineDash(dashInterval);
    this.lineDashOffset(dashOffset);
    this.segment(fromX, fromY, toX, toY);
    this.setLineDash([]);
    this.lineDashOffset(0);
  };

  /**
   * 创建线性渐变
   * @param from 渐变起始点
   * @param to 渐变终点
   * @param stops 渐变颜色插值点
   */
  public linearGradient = (from: [number, number], to: [number, number], stops: PainterType.GradientStop[]) => {
    const [fx, fy] = from,
      [tx, ty] = to;
    const gradient = this.ctx!.createLinearGradient(fx, fy, tx, ty);
    stops.forEach((stop) => gradient?.addColorStop(stop.position, this.parseColor(stop.color) as string));
    this.backgroundColor(gradient);
    this.borderColor(gradient);
    return this;
  };

  /**
   * 创建圆形渐变
   * @param from 渐变起始圆圆心、半径
   * @param to 渐变终止圆圆心、半径
   * @param stops 渐变颜色插值点
   */
  public radialGradient = (
    from: [number, number, number],
    to: [number, number, number],
    stops: PainterType.GradientStop[]
  ) => {
    const [fx, fy, fr] = from,
      [tx, ty, tr] = to;
    const gradient = this.ctx!.createRadialGradient(fx, fy, fr, tx, ty, tr);
    stops.forEach((stop) => gradient?.addColorStop(stop.position, this.parseColor(stop.color) as string));
    this.backgroundColor(gradient);
    this.borderColor(gradient);
    return this;
  };

  /**
   * 设置阴影
   * @param offsetX 阴影在 x 轴延伸的距离
   * @param offsetY 阴影在 y 轴延伸的距离
   * @param blur 阴影的模糊程度
   * @param shadowColor 阴影颜色
   */
  public shadow = (offsetX: number, offsetY: number, blur: number, shadowColor: PainterType.Color) => {
    this.assign(this.ctx, "shadowOffsetX", offsetX);
    this.assign(this.ctx, "shadowOffsetY", offsetY);
    this.assign(this.ctx, "shadowBlur", blur);
    this.assign(this.ctx, "shadowColor", this.parseColor(shadowColor));
    return this;
  };

  /**
   * 应用字体设置到 context
   * @private
   */
  private applyCurrentFontSetting() {
    if (!this.ctx) return;
    this.ctx.font = `${this.fontStyle.fontWeight.length ? `${this.fontStyle.fontWeight} ` : ""} ${
      this.fontStyle.fontSize
    }px ${this.fontStyle.fontFamily}`;
    this.ctx.textAlign = this.lineStyle.textAlign;
    this.ctx.textBaseline = this.lineStyle.textBaseline;
    this.ctx.direction = this.lineStyle.direction;
  }

  /**
   * 缓存当前 context 字体设置
   * @private
   */
  private cacheCurrentFontSetting(): PainterType.CanvasFontStyle {
    return {
      font: this.ctx!.font,
      textAlign: this.ctx!.textAlign,
      textBaseline: this.ctx!.textBaseline,
      direction: this.ctx!.direction,
    };
  }

  /**
   * 恢复 context 字体设置
   * @param fontSetting
   * @private
   */
  private restoreFontSetting(fontSetting: PainterType.CanvasFontStyle) {
    this.ctx!.font = fontSetting.font;
    this.ctx!.textAlign = fontSetting.textAlign;
    this.ctx!.textBaseline = fontSetting.textBaseline;
    this.ctx!.direction = fontSetting.direction;
  }

  /**
   * 设置文字样式 (fontSize, fontFamily)
   * @param style
   */
  public setFontStyle = (style: Partial<PainterType.FontStyle>) => {
    this.fontStyle = { ...this.fontStyle, ...style };
    this.add(
      this.assign,
      [
        this.ctx,
        "font",
        `${this.fontStyle.fontWeight.length ? `${this.fontStyle.fontWeight} ` : ""} ${this.fontStyle.fontSize}px ${
          this.fontStyle.fontFamily
        }`,
      ],
      this
    );
    return this;
  };

  /**
   * 设置行样式 (textAlign, textBaseline, direction, lineHeight)
   * @param style
   */
  public setLineStyle = (style: Partial<PainterType.LineStyle>) => {
    this.lineStyle = { ...this.lineStyle, ...style };
    this.add(this.assign, [this.ctx, "textAlign", this.lineStyle.textAlign], this);
    this.add(this.assign, [this.ctx, "textBaseline", this.lineStyle.textBaseline], this);
    this.add(this.assign, [this.ctx, "direction", this.lineStyle.direction], this);
    return this;
  };

  /**
   * 绘制单行文字（填充）
   * @param text 文字内容
   * @param x 起始位置 x 坐标
   * @param y 起始位置 y 坐标
   * @param maxWidth 行最大宽度，用于缩放
   */
  public fillText = (text: string, x: number, y: number, maxWidth?: number) => {
    return this.add(this.ctx?.fillText, [text, x, y, maxWidth]);
  };

  /**
   * 绘制单行文字（边框）
   * @param text 文字内容
   * @param x 起始位置 x 坐标
   * @param y 起始位置 y 坐标
   * @param maxWidth 行最大宽度，用于缩放
   */
  public strokeText = (text: string, x: number, y: number, maxWidth?: number) => {
    return this.add(this.ctx?.strokeText, [text, x, y, maxWidth]);
  };

  /**
   * 绘制并排版文字，绘制结束的位置保存在 this.lastline 中
   * @param text 文字
   * @param fromX 绘制起点 x 坐标
   * @param fromY 绘制起点 y 坐标
   * @param maxWidth 行最大宽度
   * @param fill 填充绘制 (true) 或边框绘制 (false)
   */
  public text = (
    text: string,
    fromX: number = this.lastLinePosX,
    fromY: number = this.lastLinePosY,
    maxWidth?: number,
    fill: boolean = true
  ) => {
    if (fromX > this.width || !this.ctx || !text.length) return this;
    const currentFontSetting = this.cacheCurrentFontSetting();
    this.applyCurrentFontSetting();

    const symX =
      this.lineStyle.textAlign === "right"
        ? this.width - fromX
        : this.lineStyle.textAlign === "center"
        ? Math.max(fromX, this.width - fromX)
        : fromX;

    const lineWidth =
      maxWidth !== undefined
        ? maxWidth > 0
          ? maxWidth
          : this.width - symX
        : this.width - symX * 2 > 0
        ? this.width - symX * 2
        : this.width - symX;

    const characterMeasure = this.ctx.measureText("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = characterMeasure;
    const actualBoxHeight = actualBoundingBoxAscent + Math.abs(actualBoundingBoxDescent);
    const lineHeight = Math.max(this.lineStyle.lineHeight, 1.2 * actualBoxHeight);

    let currentY = fromY + actualBoundingBoxAscent;
    const cmdBuffer: PainterType.Buffer[] = [];

    const lines = text.split("\n");
    for (const line of lines) {
      if (line.length === 0) {
        currentY += lineHeight;
        continue;
      }

      let currentLine: string[] = [];
      let to = 0;
      let currentX = 0;

      const appendLine = () => {
        fill
          ? this.fillText(currentLine.join(""), fromX, currentY)
          : this.strokeText(currentLine.join(""), fromX, currentY);

        currentLine = [];
        currentX = 0;
        currentY += lineHeight;
      };

      while (to < line.length) {
        const nextCharWidth = this.ctx.measureText(line[to]).width;
        if (currentX + nextCharWidth <= lineWidth || !currentLine.length) {
          currentLine.push(line[to]);
          currentX += this.lineStyle.textAlign === "center" ? nextCharWidth / 2 : nextCharWidth;
          to++;
        } else {
          appendLine();
        }
      }

      if (currentLine.length) {
        appendLine();
      }
      this.lastLinePosX = fromX;
      this.lastLinePosY = currentY;
    }
    if (this.shouldAutoAdjustHeight && this.lastLinePosY > this.height)
      this.add(this.requestResizeCanvas, [this.width, this.lastLinePosY], this);

    this.buffer = this.buffer.concat(cmdBuffer);

    this.restoreFontSetting(currentFontSetting);
    return this;
  };

  /**
   * (内部 API) 保存当前 canvas context 状态
   * @private
   */
  private cacheCurrentContextState = (): PainterType.CanvasState => {
    const contextState: any = {};
    for (const key of PainterType.canvasStateProps) {
      contextState[key] = (this.ctx as any)[key];
    }
    return contextState as PainterType.CanvasState;
  };

  /**
   * (内部 API) 恢复 canvas context 状态
   * @param state
   */
  private restoreContextState = (state: PainterType.CanvasState) => {
    for (const key in state) {
      if (!state.hasOwnProperty(key)) continue;
      if (key === "lineDash") {
        this.ctx?.setLineDash(state.lineDash);
      } else {
        (this.ctx as any)[key] = state[key as keyof PainterType.CanvasState];
      }
    }
  };

  /**
   * 放大 canvas 画板，注意：此方法是立即执行的，并且会丢失部分 canvas context 状态！
   * @param width 新画板宽度
   * @param height 新画板高度
   */
  public requestResizeCanvas = (width: number, height: number) => {
    if (!this.canvas || !this.ctx) {
      return this.create(width, height);
    }
    const currentContextState = this.cacheCurrentContextState();
    const lastWidth = this.width,
      lastHeight = this.height;
    if (width < lastWidth || height < lastHeight) {
      this.logger.warn(
        "requestResizeCanvas @ EinePainter: new canvas size ({}, {}) is smaller than current size ({}, {}), ignore resize request.",
        width,
        height,
        lastWidth,
        lastHeight
      );
      return this;
    }

    const newCanvas = createCanvas(width, height);
    const newContext = newCanvas.getContext("2d");

    this.logger.verbose("requestResizeCanvas @ EinePainter: canvas resized to ({}, {})", width, height);

    newContext.fillStyle = this.parseColor(this.canvasFillColor);
    newContext.fillRect(0, 0, width, height);
    newContext.drawImage(this.canvas, 0, 0);

    this.width = width;
    this.height = height;
    this.canvas = newCanvas;
    this.ctx = newContext;

    this.restoreContextState(currentContextState);
  };

  /**
   * 获取图片尺寸 (width * height)
   * @param image 图片来源
   */
  public getImageSize(image: string | Buffer) {
    return imageSize(image);
  }

  /**
   * 在指定位置绘制图片
   * @param source 图片来源
   * @param fromX 图片左上角位置 x 坐标
   * @param fromY 图片左上角位置 y 坐标
   * @param width 图片缩放宽度
   * @param height 图片缩放高度
   */
  public image(source: string | Buffer, fromX: number, fromY: number, width?: number, height?: number) {
    return this.add(this.drawImage, [source, fromX, fromY, width, height], this);
  }

  /**
   * 在当前行位置绘制图片
   * @param source 图片来源
   * @param align 对齐方式
   * @param margin 边距
   */
  public imageBlock(
    source: string | Buffer,
    align: CanvasTextAlign = "center",
    margin: Partial<PainterType.PainterMargin> = {}
  ) {
    const actualMargin = {
      top: this.lastLinePosY,
      left: this.lastLinePosX,
      right: 0,
      bottom: 0,
      ...margin,
    };
    const size = this.getImageSize(source);
    if (!size.width || !size.height) return this;
    let fx =
      align === "start" || align === "left"
        ? actualMargin.left
        : align === "center"
        ? (this.width - size.width) / 2.0
        : this.width - size.width + actualMargin.right;
    let fy = actualMargin.top;

    this.lastLinePosX = actualMargin.left;
    this.lastLinePosY = fy + size.height + actualMargin.bottom;
    return this.add(this.drawImage, [source, fx, fy, size.width, size.height], this);
  }

  /**
   * 执行图片绘制
   * @param source 图片来源
   * @param fromX 图片左上角位置 x 坐标
   * @param fromY 图片左上角位置 y 坐标
   * @param width 图片缩放宽度
   * @param height 图片缩放高度
   */
  public async drawImage(source: string | Buffer, fromX: number, fromY: number, width?: number, height?: number) {
    const image = await loadImage(source);
    if (!width || !height) this.ctx?.drawImage(image, fromX, fromY);
    else this.ctx?.drawImage(image, fromX, fromY, width, height);
  }

  // 变换

  /** 保存 canvas 状态 */
  public save = () => this.add(this.ctx?.save, []);

  /** 恢复 canvas 状态 */
  public restore = () => this.add(this.ctx?.restore, []);

  /**
   * 平移变换
   * @param x x 方向平移距离
   * @param y y 方向平移距离
   */
  public translate = (x: number, y: number) => this.add(this.ctx?.translate, [x, y]);

  /**
   * 旋转变换
   * @param angle 旋转角度
   */
  public rotate = (angle: number) => this.add(this.ctx?.rotate, [angle]);

  /**
   * 缩放变换
   * @param x x 方向缩放比例
   * @param y y 方向缩放比例
   */
  public scale = (x: number, y: number) => this.add(this.ctx?.scale, [x, y]);

  /**
   * 推入变换矩阵
   * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
   */
  public transform = (mat: number[][]) => this.add(this.ctx?.transform, [mat[0][0], mat[1][0], mat[0][1], mat[1][1], mat[0][2], mat[1][2]]);

  /**
   * 设置（替换）当前变换矩阵
   * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
   */
  public setTransform = (mat: number[][]) => this.add(this.ctx?.setTransform, [mat[0][0], mat[1][0], mat[0][1], mat[1][1], mat[0][2], mat[1][2]]);

  /**
   * 重设变换矩阵为单位阵 [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
   */
  public resetTransform = () => this.add(this.ctx?.resetTransform,  []);

  /**
   * 设置合成方式 https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing
   * @param compositionType
   */
  public setComposition = (compositionType: string) => this.add(this.assign, [this.ctx, compositionType], this);

  /** 裁剪路径选中的图像 */
  public clip = () => this.add(this.ctx?.clip, []);

  /** 执行绘图操作，清空绘图指令缓冲区 */
  public async exec() {
    for (const bufferItem of this.buffer) {
      await bufferItem.command.apply(bufferItem.thisRef ? bufferItem.thisRef : this.ctx, bufferItem.args);
    }
    this.buffer = [];
  }

  /**
   * 输出为 PNG 文件
   * @param path 输出路径
   */
  public saveAsPNG(path: string) {
    return new Promise((resolve, reject) => {
      if (!this.canvas) {
        this.logger.error("saveAsPNG @ EinePainter failed: canvas not created");
        reject("canvas is not created");
        return;
      }
      const output = createWriteStream(path);
      const stream = this.canvas!.createPNGStream();
      stream.pipe(output);
      output.on("finish", () => {
        this.logger.verbose("saveAsPNG @ EinePainter: paint successfully saved to {}", path);
        resolve(stream);
      });
    });
  }

  /**
   * 输出为 JPG 文件
   * @param path 输出路径
   */
  public saveAsJPG(path: string) {
    return new Promise((resolve, reject) => {
      if (!this.canvas) {
        this.logger.error("saveAsJPG @ EinePainter failed: canvas not created");
        reject("canvas not created");
        return;
      }
      const output = createWriteStream(path);
      const stream = this.canvas!.createJPEGStream();
      stream.pipe(output);
      output.on("finish", () => {
        this.logger.verbose("saveAsJPG @ EinePainter: paint successfully saved to {}", path);
        resolve(stream);
      });
    });
  }

  /**
   * (同步) 输出为 PNG Buffer
   * @param mimeType image/png
   * @param config
   */
  public toPNGBufferSync(mimeType: "image/png", config?: PngConfig) {
    if (!this.canvas) return new Buffer("");
    return this.canvas.toBuffer(mimeType, config);
  }

  /**
   * (同步) 输出为 JPG Buffer
   * @param mimeType image/jpeg
   * @param config
   */
  public toJPEGBufferSync(mimeType: "image/jpeg", config?: JpegConfig) {
    if (!this.canvas) return new Buffer("");
    return this.canvas.toBuffer(mimeType, config);
  }

  /**
   * (异步) 输出为 Buffer
   */
  public toBuffer(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (this.canvas === null) {
        reject(Error("canvas not created"));
        return;
      }
      this.canvas.toBuffer((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
