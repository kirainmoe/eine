"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const canvas_1 = require("canvas");
const image_size_1 = __importDefault(require("image-size"));
const types_1 = __importDefault(require("./types"));
class EinePainter {
    logger;
    canvas = null;
    ctx = null;
    width = 0;
    height = 0;
    canvasFillColor = "#ffffff";
    buffer = [];
    fontStyle = {
        fontSize: 16,
        fontFamily: "sans-serif",
        fontWeight: "",
    };
    lineStyle = {
        textAlign: "start",
        textBaseline: "alphabetic",
        direction: "inherit",
        lineHeight: 20,
    };
    lastLinePosX = 0;
    lastLinePosY = 0;
    shouldAutoAdjustHeight = false;
    static fontList = new Map();
    /**
     * 导入字体
     * @param path 字体路径，支持 ttf, woff2, ttc, ...
     * @param name 字体名称 (font-family)
     * @param weight 字重 (normal, bold)
     * @param style 样式 (italic)
     */
    static importFont(path, name, weight, style) {
        if (this.fontList.has(name))
            return;
        const font = {
            path,
            family: name,
            weight,
            style,
        };
        canvas_1.registerFont(path, font);
        this.fontList.set(name, font);
    }
    constructor(eine) {
        this.logger = eine.logger;
    }
    /** 获取 node-canvas 2D 上下文 */
    get context() {
        return this.ctx;
    }
    /** 获取当前画布尺寸 */
    get size() {
        return [this.width, this.height];
    }
    /** 获取上一行文字的结束位置 */
    get lastline() {
        return [this.lastLinePosX, this.lastLinePosY];
    }
    /** 上下文属性赋值辅助函数 */
    assign = (target, key, value) => (target[key] = value);
    /**
     * 将颜色转换为 CSS 字符串表示
     * @param color 支持各种类型，如 "white", "#fff", [0,0,0], [255,255,255,0.3]
     */
    parseColor = (color) => {
        if (color instanceof canvas_1.CanvasGradient)
            return color;
        if (typeof color === "string")
            return color;
        const type = color.length === 3 ? "rgb" : "rgba";
        return `${type}(${color.join(",")})`;
    };
    /**
     * 设置当内容超出画布时，是否自动调整画布大小
     * @param autoAdjust
     */
    setAutoAdjustHeight = (autoAdjust) => {
        this.shouldAutoAdjustHeight = autoAdjust;
        return this;
    };
    /**
     * 添加指令序列
     * @param command 指令函数
     * @param args 函数参数
     */
    add(command, args = [], thisRef = null) {
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
    create(width, height, backgroundFill = "#ffffff") {
        this.canvas = canvas_1.createCanvas((this.width = width), (this.height = height));
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
    erase = (fromX, fromY, width, height) => this.add(this.ctx?.clearRect, [fromX, fromY, width, height]);
    clearRect = this.erase;
    /** 开始绘制路径 */
    begin = () => this.add(this.ctx?.beginPath, []);
    beginPath = this.begin;
    /**
     * 将当前笔触落点移动到 (x, y)
     * @param x
     * @param y
     */
    move = (x, y) => this.add(this.ctx?.moveTo, [x, y]);
    moveTo = this.move;
    /**
     * 从当前笔触落点移动到 (x, y)
     * @param x
     * @param y
     */
    line = (x, y) => this.add(this.ctx?.lineTo, [x, y]);
    lineTo = this.line;
    /** 闭合路径，结束绘制 */
    close = () => this.add(this.ctx?.closePath, []);
    closePath = this.close;
    /** 填充闭合路径图形 */
    fill = () => this.add(this.ctx?.fill, []);
    /** 绘制路径轮廓 */
    stroke = () => this.add(this.ctx?.stroke, []);
    /**
     * 绘制矩形，起点 (fromX, fromY)，宽度和高度分别为 (width, height)
     * @param fromX
     * @param fromY
     * @param width
     * @param height
     * @param fill 填充颜色 (true) 或只绘制边框 (false)
     */
    rect = (fromX, fromY, width, height, fill = true) => this.add(fill ? this.ctx?.fillRect : this.ctx?.strokeRect, [fromX, fromY, width, height]);
    fillRect = this.rect;
    /**
     * 绘制矩形（仅边框），起点 (fromX, fromY)，宽度和高度分别为 (width, height)
     * @param fromX
     * @param fromY
     * @param width
     * @param height
     */
    borderRect = (fromX, fromY, width, height) => this.add(this.ctx?.strokeRect, [fromX, fromY, width, height]);
    strokeRect = this.borderRect;
    /**
     * 绘制圆弧，圆心为 (x, y)、半径为 radius，角度为 [startAngle, endAngle]
     * @param x
     * @param y
     * @param radius
     * @param startAngle 圆弧起始角度
     * @param endAngle 圆弧结束角度
     * @param anticlockwise 是否逆时针绘制
     */
    arc = (x, y, radius, startAngle, endAngle, anticlockwise) => this.add(this.ctx?.arc, [x, y, radius, startAngle, endAngle, anticlockwise]);
    /**
     * 贝塞尔曲线，支持 2-3 个控制点，以 [[x1,y1], [x2,y2], ...] 形式传入
     * @param controlPoints
     */
    bezier = (...controlPoints) => {
        if (controlPoints.length <= 1)
            return this;
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
    triangle = (p1, p2, p3, fill = true) => {
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
    circle = (center, radius, fill = true) => {
        const [x, y] = center, endAngle = Math.PI * 2.0;
        this.begin();
        this.move(x + radius, y);
        for (let angle = 0; angle < endAngle; angle++)
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
    roundedRect(fromX, fromY, width, height, radius, fill = true) {
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
    backgroundColor = (color) => this.add(this.assign, [this.ctx, "fillStyle", this.parseColor(color)], this);
    fillColor = this.backgroundColor;
    fontColor = this.backgroundColor; // todo: fontColor as distinct color
    set fillStyle(color) {
        this.backgroundColor(color);
    }
    borderColor = (color) => this.add(this.assign, [this.ctx, "strokeStyle", this.parseColor(color)], this);
    strokeColor = this.borderColor;
    set strokeStyle(color) {
        this.borderColor(color);
    }
    alpha = (alpha) => this.add(this.assign, [this.ctx, "globalAlpha", alpha], this);
    set globalAlpha(alpha) {
        this.alpha(alpha);
    }
    lineWidth = (value) => this.add(this.assign, [this.ctx, "lineWidth", value], this);
    lineCap = (type) => this.add(this.assign, [this.ctx, "lineCap", type], this);
    lineJoin = (type) => this.add(this.assign, [this.ctx, "lineJoin", type], this);
    lineDashOffset = (value) => this.add(this.assign, [this.ctx, "lineDashOffset", value], this);
    setLineDash = (segments) => this.add(this.ctx?.setLineDash, [segments]);
    segment = (fromX, fromY, toX, toY) => {
        this.begin();
        this.move(fromX, fromY);
        this.line(toX, toY);
        return this.close();
    };
    dash = (fromX, fromY, toX, toY, dashInterval = [1, 1], dashOffset = 0) => {
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
    linearGradient = (from, to, stops) => {
        const [fx, fy] = from, [tx, ty] = to;
        const gradient = this.ctx.createLinearGradient(fx, fy, tx, ty);
        stops.forEach((stop) => gradient?.addColorStop(stop.position, this.parseColor(stop.color)));
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
    radialGradient = (from, to, stops) => {
        const [fx, fy, fr] = from, [tx, ty, tr] = to;
        const gradient = this.ctx.createRadialGradient(fx, fy, fr, tx, ty, tr);
        stops.forEach((stop) => gradient?.addColorStop(stop.position, this.parseColor(stop.color)));
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
    shadow = (offsetX, offsetY, blur, shadowColor) => {
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
    applyCurrentFontSetting() {
        if (!this.ctx)
            return;
        this.ctx.font = `${this.fontStyle.fontWeight.length ? `${this.fontStyle.fontWeight} ` : ""} ${this.fontStyle.fontSize}px ${this.fontStyle.fontFamily}`;
        this.ctx.textAlign = this.lineStyle.textAlign;
        this.ctx.textBaseline = this.lineStyle.textBaseline;
        this.ctx.direction = this.lineStyle.direction;
    }
    /**
     * 缓存当前 context 字体设置
     * @private
     */
    cacheCurrentFontSetting() {
        return {
            font: this.ctx.font,
            textAlign: this.ctx.textAlign,
            textBaseline: this.ctx.textBaseline,
            direction: this.ctx.direction,
        };
    }
    /**
     * 恢复 context 字体设置
     * @param fontSetting
     * @private
     */
    restoreFontSetting(fontSetting) {
        this.ctx.font = fontSetting.font;
        this.ctx.textAlign = fontSetting.textAlign;
        this.ctx.textBaseline = fontSetting.textBaseline;
        this.ctx.direction = fontSetting.direction;
    }
    /**
     * 设置文字样式 (fontSize, fontFamily)
     * @param style
     */
    setFontStyle = (style) => {
        this.fontStyle = { ...this.fontStyle, ...style };
        this.add(this.assign, [
            this.ctx,
            "font",
            `${this.fontStyle.fontWeight.length ? `${this.fontStyle.fontWeight} ` : ""} ${this.fontStyle.fontSize}px ${this.fontStyle.fontFamily}`,
        ], this);
        return this;
    };
    /**
     * 设置行样式 (textAlign, textBaseline, direction, lineHeight)
     * @param style
     */
    setLineStyle = (style) => {
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
    fillText = (text, x, y, maxWidth) => {
        return this.add(this.ctx?.fillText, [text, x, y, maxWidth]);
    };
    /**
     * 绘制单行文字（边框）
     * @param text 文字内容
     * @param x 起始位置 x 坐标
     * @param y 起始位置 y 坐标
     * @param maxWidth 行最大宽度，用于缩放
     */
    strokeText = (text, x, y, maxWidth) => {
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
    text = (text, fromX = this.lastLinePosX, fromY = this.lastLinePosY, maxWidth, fill = true) => {
        if (fromX > this.width || !this.ctx || !text.length)
            return this;
        const currentFontSetting = this.cacheCurrentFontSetting();
        this.applyCurrentFontSetting();
        const lineWidth = maxWidth !== undefined
            ? maxWidth > 0
                ? maxWidth
                : this.width - fromX
            : this.width - fromX * 2 > 0
                ? this.width - fromX * 2
                : this.width - fromX;
        const characterMeasure = this.ctx.measureText("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
        const { actualBoundingBoxAscent, actualBoundingBoxDescent } = characterMeasure;
        const actualBoxHeight = actualBoundingBoxAscent + Math.abs(actualBoundingBoxDescent);
        const lineHeight = Math.max(this.lineStyle.lineHeight, 1.2 * actualBoxHeight);
        let currentY = fromY + actualBoundingBoxAscent;
        const cmdBuffer = [];
        const lines = text.split("\n");
        for (const line of lines) {
            if (line.length === 0) {
                currentY += lineHeight;
                continue;
            }
            let currentLine = [];
            let from = 0;
            let to = 0;
            let currentX = 0;
            const appendLine = () => {
                cmdBuffer.push({
                    command: fill ? this.fillText : this.strokeText,
                    args: [currentLine.join(""), fromX, currentY],
                });
                currentLine = [];
                currentX = 0;
                currentY += lineHeight;
            };
            while (to < line.length) {
                const nextCharWidth = this.ctx.measureText(line[to]).width;
                if (currentX + nextCharWidth <= lineWidth) {
                    currentLine.push(line[to]);
                    currentX += nextCharWidth;
                    to++;
                }
                else {
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
    cacheCurrentContextState = () => {
        const contextState = {};
        for (const key of types_1.default.canvasStateProps) {
            contextState[key] = this.ctx[key];
        }
        return contextState;
    };
    /**
     * (内部 API) 恢复 canvas context 状态
     * @param state
     */
    restoreContextState = (state) => {
        for (const key in state) {
            if (!state.hasOwnProperty(key))
                continue;
            if (key === "lineDash") {
                this.ctx?.setLineDash(state.lineDash);
            }
            else {
                this.ctx[key] = state[key];
            }
        }
    };
    /**
     * 放大 canvas 画板，注意：此方法是立即执行的，并且会丢失部分 canvas context 状态！
     * @param width 新画板宽度
     * @param height 新画板高度
     */
    requestResizeCanvas = (width, height) => {
        if (!this.canvas || !this.ctx) {
            return this.create(width, height);
        }
        const currentContextState = this.cacheCurrentContextState();
        const lastWidth = this.width, lastHeight = this.height;
        if (width < lastWidth || height < lastHeight) {
            this.logger.warn("requestResizeCanvas @ EinePainter: new canvas size ({}, {}) is smaller than current size ({}, {}), ignore resize request.", width, height, lastWidth, lastHeight);
            return this;
        }
        const newCanvas = canvas_1.createCanvas(width, height);
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
    getImageSize(image) {
        return image_size_1.default(image);
    }
    /**
     * 在指定位置绘制图片
     * @param source 图片来源
     * @param fromX 图片左上角位置 x 坐标
     * @param fromY 图片左上角位置 y 坐标
     * @param width 图片缩放宽度
     * @param height 图片缩放高度
     */
    image(source, fromX, fromY, width, height) {
        return this.add(this.drawImage, [source, fromX, fromY, width, height], this);
    }
    /**
     * 在当前行位置绘制图片
     * @param source 图片来源
     * @param align 对齐方式
     * @param margin 边距
     */
    imageBlock(source, align = "center", margin = {}) {
        const actualMargin = {
            top: this.lastLinePosY,
            left: this.lastLinePosX,
            right: 0,
            bottom: 0,
            ...margin,
        };
        const size = this.getImageSize(source);
        if (!size.width || !size.height)
            return this;
        let fx = align === "start" || align === "left"
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
    async drawImage(source, fromX, fromY, width, height) {
        const image = await canvas_1.loadImage(source);
        if (!width || !height)
            this.ctx?.drawImage(image, fromX, fromY);
        else
            this.ctx?.drawImage(image, fromX, fromY, width, height);
    }
    // 变换
    /** 保存 canvas 状态 */
    save = () => this.add(this.ctx?.save, []);
    /** 恢复 canvas 状态 */
    restore = () => this.add(this.ctx?.restore, []);
    /**
     * 平移变换
     * @param x x 方向平移距离
     * @param y y 方向平移距离
     */
    translate = (x, y) => this.add(this.ctx?.translate, [x, y]);
    /**
     * 旋转变换
     * @param angle 旋转角度
     */
    rotate = (angle) => this.add(this.ctx?.rotate, [angle]);
    /**
     * 缩放变换
     * @param x x 方向缩放比例
     * @param y y 方向缩放比例
     */
    scale = (x, y) => this.add(this.ctx?.scale, [x, y]);
    /**
     * 推入变换矩阵
     * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
     */
    transform = (mat) => this.add(this.ctx?.transform, [mat[0][0], mat[1][0], mat[0][1], mat[1][1], mat[0][2], mat[1][2]]);
    /**
     * 设置（替换）当前变换矩阵
     * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
     */
    setTransform = (mat) => this.add(this.ctx?.setTransform, [mat[0][0], mat[1][0], mat[0][1], mat[1][1], mat[0][2], mat[1][2]]);
    /**
     * 重设变换矩阵为单位阵 [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
     */
    resetTransform = () => this.add(this.ctx?.resetTransform, []);
    /**
     * 设置合成方式 https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing
     * @param compositionType
     */
    setComposition = (compositionType) => this.add(this.assign, [this.ctx, compositionType], this);
    /** 裁剪路径选中的图像 */
    clip = () => this.add(this.ctx?.clip, []);
    /** 执行绘图操作，清空绘图指令缓冲区 */
    async exec() {
        for (const bufferItem of this.buffer) {
            await bufferItem.command.apply(bufferItem.thisRef ? bufferItem.thisRef : this.ctx, bufferItem.args);
        }
        this.buffer = [];
    }
    /**
     * 输出为 PNG 文件
     * @param path 输出路径
     */
    saveAsPNG(path) {
        return new Promise((resolve, reject) => {
            if (!this.canvas) {
                this.logger.error("saveAsPNG @ EinePainter failed: canvas not created");
                reject("canvas is not created");
                return;
            }
            const output = fs_1.createWriteStream(path);
            const stream = this.canvas.createPNGStream();
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
    saveAsJPG(path) {
        return new Promise((resolve, reject) => {
            if (!this.canvas) {
                this.logger.error("saveAsJPG @ EinePainter failed: canvas not created");
                reject("canvas not created");
                return;
            }
            const output = fs_1.createWriteStream(path);
            const stream = this.canvas.createJPEGStream();
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
    toPNGBufferSync(mimeType, config) {
        if (!this.canvas)
            return new Buffer("");
        return this.canvas.toBuffer(mimeType, config);
    }
    /**
     * (同步) 输出为 JPG Buffer
     * @param mimeType image/jpeg
     * @param config
     */
    toJPEGBuffer(mimeType, config) {
        if (!this.canvas)
            return new Buffer("");
        return this.canvas.toBuffer(mimeType, config);
    }
    /**
     * (异步) 输出为 Buffer
     */
    toBuffer() {
        return new Promise((resolve, reject) => {
            if (this.canvas === null) {
                reject(Error("canvas not created"));
                return;
            }
            this.canvas.toBuffer((err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
}
exports.default = EinePainter;
//# sourceMappingURL=EinePainter.js.map