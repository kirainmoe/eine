"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var canvas_1 = require("canvas");
var image_size_1 = __importDefault(require("image-size"));
var types_1 = require("../../common/types");
var EinePainter = /** @class */ (function () {
    function EinePainter(eine) {
        var _this = this;
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.canvasFillColor = "#ffffff";
        this.buffer = [];
        this.fontStyle = {
            fontSize: 16,
            fontFamily: "sans-serif",
            fontWeight: "",
        };
        this.lineStyle = {
            textAlign: "start",
            textBaseline: "alphabetic",
            direction: "inherit",
            lineHeight: 20,
        };
        this.lastLinePosX = 0;
        this.lastLinePosY = 0;
        this.shouldAutoAdjustHeight = false;
        this.importFont = EinePainter.importFont;
        /** 上下文属性赋值辅助函数 */
        this.assign = function (target, key, value) {
            target[key] = value;
        };
        /**
         * 将颜色转换为 CSS 字符串表示
         * @param color 支持各种类型，如 "white", "#fff", [0,0,0], [255,255,255,0.3]
         */
        this.parseColor = function (color) {
            if (color instanceof canvas_1.CanvasGradient)
                return color;
            if (typeof color === "string")
                return color;
            var type = color.length === 3 ? "rgb" : "rgba";
            return type + "(" + color.join(",") + ")";
        };
        /**
         * 设置当内容超出画布时，是否自动调整画布大小
         * @param autoAdjust
         */
        this.setAutoAdjustHeight = function (autoAdjust) {
            _this.shouldAutoAdjustHeight = autoAdjust;
            return _this;
        };
        /**
         * 擦除矩形区域，从 (fromX, fromY) 开始，宽度为 width, 高度为 height 的矩形
         * @param fromX
         * @param fromY
         * @param width
         * @param height
         */
        this.erase = function (fromX, fromY, width, height) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect, [fromX, fromY, width, height]); };
        this.clearRect = this.erase;
        /** 开始绘制路径 */
        this.begin = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath, []); };
        this.beginPath = this.begin;
        /**
         * 将当前笔触落点移动到 (x, y)
         * @param x
         * @param y
         */
        this.move = function (x, y) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.moveTo, [x, y]); };
        this.moveTo = this.move;
        /**
         * 从当前笔触落点移动到 (x, y)
         * @param x
         * @param y
         */
        this.line = function (x, y) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.lineTo, [x, y]); };
        this.lineTo = this.line;
        /** 闭合路径，结束绘制 */
        this.close = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.closePath, []); };
        this.closePath = this.close;
        /** 填充闭合路径图形 */
        this.fill = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.fill, []); };
        /** 绘制路径轮廓 */
        this.stroke = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.stroke, []); };
        /**
         * 绘制矩形，起点 (fromX, fromY)，宽度和高度分别为 (width, height)
         * @param fromX
         * @param fromY
         * @param width
         * @param height
         * @param fill 填充颜色 (true) 或只绘制边框 (false)
         */
        this.rect = function (fromX, fromY, width, height, fill) {
            var _a, _b;
            if (fill === void 0) { fill = true; }
            return _this.add(fill ? (_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect : (_b = _this.ctx) === null || _b === void 0 ? void 0 : _b.strokeRect, [fromX, fromY, width, height]);
        };
        this.fillRect = this.rect;
        /**
         * 绘制矩形（仅边框），起点 (fromX, fromY)，宽度和高度分别为 (width, height)
         * @param fromX
         * @param fromY
         * @param width
         * @param height
         */
        this.borderRect = function (fromX, fromY, width, height) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.strokeRect, [fromX, fromY, width, height]); };
        this.strokeRect = this.borderRect;
        /**
         * 绘制圆弧，圆心为 (x, y)、半径为 radius，角度为 [startAngle, endAngle]
         * @param x
         * @param y
         * @param radius
         * @param startAngle 圆弧起始角度
         * @param endAngle 圆弧结束角度
         * @param anticlockwise 是否逆时针绘制
         */
        this.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.arc, [x, y, radius, startAngle, endAngle, anticlockwise]); };
        /**
         * 贝塞尔曲线，支持 2-3 个控制点，以 [[x1,y1], [x2,y2], ...] 形式传入
         * @param controlPoints
         */
        this.bezier = function () {
            var _a, _b;
            var controlPoints = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                controlPoints[_i] = arguments[_i];
            }
            if (controlPoints.length <= 1)
                return _this;
            if (controlPoints.length === 2)
                return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.quadraticCurveTo, __spreadArray(__spreadArray([], controlPoints[0]), controlPoints[1]));
            return _this.add((_b = _this.ctx) === null || _b === void 0 ? void 0 : _b.bezierCurveTo, __spreadArray(__spreadArray(__spreadArray([], controlPoints[0]), controlPoints[1]), controlPoints[2]));
        };
        /**
         * 根据三点绘制三角形
         * @param p1
         * @param p2
         * @param p3
         * @param fill 填充颜色 (true) 或只绘制边框 (false)
         */
        this.triangle = function (p1, p2, p3, fill) {
            if (fill === void 0) { fill = true; }
            _this.begin();
            _this.move.apply(_this, p1);
            _this.line.apply(_this, p2);
            _this.line.apply(_this, p3);
            return fill ? _this.fill() : _this.stroke();
        };
        /**
         * 绘制圆
         * @param center 圆心 [x, y]
         * @param radius 半径
         * @param fill 填充颜色 (true) 或只绘制边框 (false)
         */
        this.circle = function (center, radius, fill) {
            if (fill === void 0) { fill = true; }
            var x = center[0], y = center[1], endAngle = Math.PI * 2.0;
            _this.begin();
            _this.move(x + radius, y);
            for (var angle = 0; angle < endAngle; angle++)
                _this.line(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
            return fill ? _this.fill() : _this.stroke();
        };
        /**
         * 设置背景填充颜色
         * @param color 颜色值
         */
        this.backgroundColor = function (color) {
            return _this.add(_this.assign, [_this.ctx, "fillStyle", _this.parseColor(color)], _this);
        };
        this.fillColor = this.backgroundColor;
        this.fontColor = this.backgroundColor; // todo: fontColor as distinct color
        /**
         * 设置边框填充颜色
         * @param color 颜色值
         */
        this.borderColor = function (color) {
            return _this.add(_this.assign, [_this.ctx, "strokeStyle", _this.parseColor(color)], _this);
        };
        this.strokeColor = this.borderColor;
        /**
         * 设置透明度
         * @param alpha 透明度值
         */
        this.alpha = function (alpha) { return _this.add(_this.assign, [_this.ctx, "globalAlpha", alpha], _this); };
        /**
         * 设置绘制线宽
         * @param value 线宽 (px)
         */
        this.lineWidth = function (value) { return _this.add(_this.assign, [_this.ctx, "lineWidth", value], _this); };
        this.lineCap = function (type) { return _this.add(_this.assign, [_this.ctx, "lineCap", type], _this); };
        this.lineJoin = function (type) { return _this.add(_this.assign, [_this.ctx, "lineJoin", type], _this); };
        this.lineDashOffset = function (value) { return _this.add(_this.assign, [_this.ctx, "lineDashOffset", value], _this); };
        this.setLineDash = function (segments) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.setLineDash, [segments]); };
        this.segment = function (fromX, fromY, toX, toY) {
            _this.begin();
            _this.move(fromX, fromY);
            _this.line(toX, toY);
            return _this.close();
        };
        this.dash = function (fromX, fromY, toX, toY, dashInterval, dashOffset) {
            if (dashInterval === void 0) { dashInterval = [1, 1]; }
            if (dashOffset === void 0) { dashOffset = 0; }
            _this.setLineDash(dashInterval);
            _this.lineDashOffset(dashOffset);
            _this.segment(fromX, fromY, toX, toY);
            _this.setLineDash([]);
            _this.lineDashOffset(0);
        };
        /**
         * 创建线性渐变
         * @param from 渐变起始点
         * @param to 渐变终点
         * @param stops 渐变颜色插值点
         */
        this.linearGradient = function (from, to, stops) {
            var fx = from[0], fy = from[1], tx = to[0], ty = to[1];
            var gradient = _this.ctx.createLinearGradient(fx, fy, tx, ty);
            stops.forEach(function (stop) { return gradient === null || gradient === void 0 ? void 0 : gradient.addColorStop(stop.position, _this.parseColor(stop.color)); });
            _this.backgroundColor(gradient);
            _this.borderColor(gradient);
            return _this;
        };
        /**
         * 创建圆形渐变
         * @param from 渐变起始圆圆心、半径
         * @param to 渐变终止圆圆心、半径
         * @param stops 渐变颜色插值点
         */
        this.radialGradient = function (from, to, stops) {
            var fx = from[0], fy = from[1], fr = from[2], tx = to[0], ty = to[1], tr = to[2];
            var gradient = _this.ctx.createRadialGradient(fx, fy, fr, tx, ty, tr);
            stops.forEach(function (stop) { return gradient === null || gradient === void 0 ? void 0 : gradient.addColorStop(stop.position, _this.parseColor(stop.color)); });
            _this.backgroundColor(gradient);
            _this.borderColor(gradient);
            return _this;
        };
        /**
         * 设置阴影
         * @param offsetX 阴影在 x 轴延伸的距离
         * @param offsetY 阴影在 y 轴延伸的距离
         * @param blur 阴影的模糊程度
         * @param shadowColor 阴影颜色
         */
        this.shadow = function (offsetX, offsetY, blur, shadowColor) {
            _this.assign(_this.ctx, "shadowOffsetX", offsetX);
            _this.assign(_this.ctx, "shadowOffsetY", offsetY);
            _this.assign(_this.ctx, "shadowBlur", blur);
            _this.assign(_this.ctx, "shadowColor", _this.parseColor(shadowColor));
            return _this;
        };
        /**
         * 设置文字样式 (fontSize, fontFamily)
         * @param style
         */
        this.setFontStyle = function (style) {
            _this.fontStyle = __assign(__assign({}, _this.fontStyle), style);
            _this.add(_this.assign, [
                _this.ctx,
                "font",
                (_this.fontStyle.fontWeight.length ? _this.fontStyle.fontWeight + " " : "") + " " + _this.fontStyle.fontSize + "px " + _this.fontStyle.fontFamily,
            ], _this);
            return _this;
        };
        /**
         * 设置行样式 (textAlign, textBaseline, direction, lineHeight)
         * @param style
         */
        this.setLineStyle = function (style) {
            _this.lineStyle = __assign(__assign({}, _this.lineStyle), style);
            _this.add(_this.assign, [_this.ctx, "textAlign", _this.lineStyle.textAlign], _this);
            _this.add(_this.assign, [_this.ctx, "textBaseline", _this.lineStyle.textBaseline], _this);
            _this.add(_this.assign, [_this.ctx, "direction", _this.lineStyle.direction], _this);
            return _this;
        };
        /**
         * 绘制单行文字（填充）
         * @param text 文字内容
         * @param x 起始位置 x 坐标
         * @param y 起始位置 y 坐标
         * @param maxWidth 行最大宽度，用于缩放
         */
        this.fillText = function (text, x, y, maxWidth) {
            var _a;
            return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.fillText, [text, x, y, maxWidth]);
        };
        /**
         * 绘制单行文字（边框）
         * @param text 文字内容
         * @param x 起始位置 x 坐标
         * @param y 起始位置 y 坐标
         * @param maxWidth 行最大宽度，用于缩放
         */
        this.strokeText = function (text, x, y, maxWidth) {
            var _a;
            return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.strokeText, [text, x, y, maxWidth]);
        };
        /**
         * 绘制并排版文字，绘制结束的位置保存在 this.lastline 中
         * @param text 文字
         * @param fromX 绘制起点 x 坐标
         * @param fromY 绘制起点 y 坐标
         * @param maxWidth 行最大宽度
         * @param fill 填充绘制 (true) 或边框绘制 (false)
         */
        this.text = function (text, fromX, fromY, maxWidth, fill) {
            if (fromX === void 0) { fromX = _this.lastLinePosX; }
            if (fromY === void 0) { fromY = _this.lastLinePosY; }
            if (fill === void 0) { fill = true; }
            if (fromX > _this.width || !_this.ctx || !text.length)
                return _this;
            var currentFontSetting = _this.cacheCurrentFontSetting();
            _this.applyCurrentFontSetting();
            var symX = _this.lineStyle.textAlign === "right"
                ? _this.width - fromX
                : _this.lineStyle.textAlign === "center"
                    ? Math.max(fromX, _this.width - fromX)
                    : fromX;
            var lineWidth = maxWidth !== undefined
                ? maxWidth > 0
                    ? maxWidth
                    : _this.width - symX
                : _this.width - symX * 2 > 0
                    ? _this.width - symX * 2
                    : _this.width - symX;
            var characterMeasure = _this.ctx.measureText("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
            var actualBoundingBoxAscent = characterMeasure.actualBoundingBoxAscent, actualBoundingBoxDescent = characterMeasure.actualBoundingBoxDescent;
            var actualBoxHeight = actualBoundingBoxAscent + Math.abs(actualBoundingBoxDescent);
            var lineHeight = Math.max(_this.lineStyle.lineHeight, 1.2 * actualBoxHeight);
            var currentY = fromY + actualBoundingBoxAscent;
            var cmdBuffer = [];
            var lines = text.split("\n");
            var _loop_1 = function (line) {
                if (line.length === 0) {
                    currentY += lineHeight;
                    return "continue";
                }
                var currentLine = [];
                var to = 0;
                var currentX = 0;
                var appendLine = function () {
                    fill
                        ? _this.fillText(currentLine.join(""), fromX, currentY)
                        : _this.strokeText(currentLine.join(""), fromX, currentY);
                    currentLine = [];
                    currentX = 0;
                    currentY += lineHeight;
                };
                while (to < line.length) {
                    var nextCharWidth = _this.ctx.measureText(line[to]).width;
                    if (currentX + nextCharWidth <= lineWidth || !currentLine.length) {
                        currentLine.push(line[to]);
                        currentX += _this.lineStyle.textAlign === "center" ? nextCharWidth / 2 : nextCharWidth;
                        to++;
                    }
                    else {
                        appendLine();
                    }
                }
                if (currentLine.length) {
                    appendLine();
                }
                _this.lastLinePosX = fromX;
                _this.lastLinePosY = currentY;
            };
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                _loop_1(line);
            }
            if (_this.shouldAutoAdjustHeight && _this.lastLinePosY > _this.height)
                _this.add(_this.requestResizeCanvas, [_this.width, _this.lastLinePosY], _this);
            _this.buffer = _this.buffer.concat(cmdBuffer);
            _this.restoreFontSetting(currentFontSetting);
            return _this;
        };
        /**
         * (内部 API) 保存当前 canvas context 状态
         * @private
         */
        this.cacheCurrentContextState = function () {
            var contextState = {};
            for (var _i = 0, _a = types_1.PainterType.canvasStateProps; _i < _a.length; _i++) {
                var key = _a[_i];
                contextState[key] = _this.ctx[key];
            }
            return contextState;
        };
        /**
         * (内部 API) 恢复 canvas context 状态
         * @param state
         */
        this.restoreContextState = function (state) {
            var _a;
            for (var key in state) {
                if (!state.hasOwnProperty(key))
                    continue;
                if (key === "lineDash") {
                    (_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.setLineDash(state.lineDash);
                }
                else {
                    _this.ctx[key] = state[key];
                }
            }
        };
        /**
         * 放大 canvas 画板，注意：此方法是立即执行的，并且会丢失部分 canvas context 状态！
         * @param width 新画板宽度
         * @param height 新画板高度
         */
        this.requestResizeCanvas = function (width, height) {
            if (!_this.canvas || !_this.ctx) {
                return _this.create(width, height);
            }
            var currentContextState = _this.cacheCurrentContextState();
            var lastWidth = _this.width, lastHeight = _this.height;
            if (width < lastWidth || height < lastHeight) {
                _this.logger.warn("requestResizeCanvas @ EinePainter: new canvas size ({}, {}) is smaller than current size ({}, {}), ignore resize request.", width, height, lastWidth, lastHeight);
                return _this;
            }
            var newCanvas = canvas_1.createCanvas(width, height);
            var newContext = newCanvas.getContext("2d");
            _this.logger.verbose("requestResizeCanvas @ EinePainter: canvas resized to ({}, {})", width, height);
            newContext.fillStyle = _this.parseColor(_this.canvasFillColor);
            newContext.fillRect(0, 0, width, height);
            newContext.drawImage(_this.canvas, 0, 0);
            _this.width = width;
            _this.height = height;
            _this.canvas = newCanvas;
            _this.ctx = newContext;
            _this.restoreContextState(currentContextState);
        };
        // 变换
        /** 保存 canvas 状态 */
        this.save = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.save, []); };
        /** 恢复 canvas 状态 */
        this.restore = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.restore, []); };
        /**
         * 平移变换
         * @param x x 方向平移距离
         * @param y y 方向平移距离
         */
        this.translate = function (x, y) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.translate, [x, y]); };
        /**
         * 旋转变换
         * @param angle 旋转角度
         */
        this.rotate = function (angle) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.rotate, [angle]); };
        /**
         * 缩放变换
         * @param x x 方向缩放比例
         * @param y y 方向缩放比例
         */
        this.scale = function (x, y) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.scale, [x, y]); };
        /**
         * 推入变换矩阵
         * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
         */
        this.transform = function (mat) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.transform, [mat[0][0], mat[1][0], mat[0][1], mat[1][1], mat[0][2], mat[1][2]]); };
        /**
         * 设置（替换）当前变换矩阵
         * @param mat 3*3 矩阵，最后一行为 [0, 0, 1]
         */
        this.setTransform = function (mat) { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.setTransform, [mat[0][0], mat[1][0], mat[0][1], mat[1][1], mat[0][2], mat[1][2]]); };
        /**
         * 重设变换矩阵为单位阵 [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
         */
        this.resetTransform = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.resetTransform, []); };
        /**
         * 设置合成方式 https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing
         * @param compositionType
         */
        this.setComposition = function (compositionType) { return _this.add(_this.assign, [_this.ctx, compositionType], _this); };
        /** 裁剪路径选中的图像 */
        this.clip = function () { var _a; return _this.add((_a = _this.ctx) === null || _a === void 0 ? void 0 : _a.clip, []); };
        this.logger = eine.logger;
    }
    /**
     * 导入字体
     * @param path 字体路径，支持 ttf, woff2, ttc, ...
     * @param name 字体名称 (font-family)
     * @param weight 字重 (normal, bold)
     * @param style 样式 (italic)
     */
    EinePainter.importFont = function (path, name, weight, style) {
        if (this.fontList.has(name))
            return;
        var font = {
            path: path,
            family: name,
            weight: weight,
            style: style,
        };
        canvas_1.registerFont(path, font);
        this.fontList.set(name, font);
    };
    Object.defineProperty(EinePainter.prototype, "context", {
        /** 获取 node-canvas 2D 上下文 */
        get: function () {
            return this.ctx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EinePainter.prototype, "size", {
        /** 获取当前画布尺寸 */
        get: function () {
            return [this.width, this.height];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EinePainter.prototype, "lastline", {
        /** 获取上一行文字的结束位置 */
        get: function () {
            return [this.lastLinePosX, this.lastLinePosY];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 添加指令序列
     * @param command 指令函数
     * @param args 函数参数
     */
    EinePainter.prototype.add = function (command, args, thisRef) {
        if (args === void 0) { args = []; }
        if (thisRef === void 0) { thisRef = null; }
        if (!command) {
            return this;
        }
        this.buffer.push({ command: command, args: args, thisRef: thisRef });
        return this;
    };
    /**
     * 创建画布
     * @param width 画布宽度
     * @param height 画布高度
     * @param backgroundFill
     */
    EinePainter.prototype.create = function (width, height, backgroundFill) {
        if (backgroundFill === void 0) { backgroundFill = "#ffffff"; }
        this.canvas = canvas_1.createCanvas((this.width = width), (this.height = height));
        this.ctx = this.canvas.getContext("2d");
        this.buffer = [];
        this.canvasFillColor = backgroundFill;
        this.backgroundColor(this.parseColor(this.canvasFillColor));
        this.rect(0, 0, width, height);
        this.backgroundColor("#000000");
        return this;
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
    EinePainter.prototype.roundedRect = function (fromX, fromY, width, height, radius, fill) {
        if (fill === void 0) { fill = true; }
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
    };
    Object.defineProperty(EinePainter.prototype, "fillStyle", {
        set: function (color) {
            this.backgroundColor(color);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EinePainter.prototype, "strokeStyle", {
        set: function (color) {
            this.borderColor(color);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EinePainter.prototype, "globalAlpha", {
        set: function (alpha) {
            this.alpha(alpha);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 应用字体设置到 context
     * @private
     */
    EinePainter.prototype.applyCurrentFontSetting = function () {
        if (!this.ctx)
            return;
        this.ctx.font = (this.fontStyle.fontWeight.length ? this.fontStyle.fontWeight + " " : "") + " " + this.fontStyle.fontSize + "px " + this.fontStyle.fontFamily;
        this.ctx.textAlign = this.lineStyle.textAlign;
        this.ctx.textBaseline = this.lineStyle.textBaseline;
        this.ctx.direction = this.lineStyle.direction;
    };
    /**
     * 缓存当前 context 字体设置
     * @private
     */
    EinePainter.prototype.cacheCurrentFontSetting = function () {
        return {
            font: this.ctx.font,
            textAlign: this.ctx.textAlign,
            textBaseline: this.ctx.textBaseline,
            direction: this.ctx.direction,
        };
    };
    /**
     * 恢复 context 字体设置
     * @param fontSetting
     * @private
     */
    EinePainter.prototype.restoreFontSetting = function (fontSetting) {
        this.ctx.font = fontSetting.font;
        this.ctx.textAlign = fontSetting.textAlign;
        this.ctx.textBaseline = fontSetting.textBaseline;
        this.ctx.direction = fontSetting.direction;
    };
    /**
     * 获取图片尺寸 (width * height)
     * @param image 图片来源
     */
    EinePainter.prototype.getImageSize = function (image) {
        return image_size_1.default(image);
    };
    /**
     * 在指定位置绘制图片
     * @param source 图片来源
     * @param fromX 图片左上角位置 x 坐标
     * @param fromY 图片左上角位置 y 坐标
     * @param width 图片缩放宽度
     * @param height 图片缩放高度
     */
    EinePainter.prototype.image = function (source, fromX, fromY, width, height) {
        return this.add(this.drawImage, [source, fromX, fromY, width, height], this);
    };
    /**
     * 在当前行位置绘制图片
     * @param source 图片来源
     * @param align 对齐方式
     * @param margin 边距
     */
    EinePainter.prototype.imageBlock = function (source, align, margin) {
        if (align === void 0) { align = "center"; }
        if (margin === void 0) { margin = {}; }
        var actualMargin = __assign({ top: this.lastLinePosY, left: this.lastLinePosX, right: 0, bottom: 0 }, margin);
        var size = this.getImageSize(source);
        if (!size.width || !size.height)
            return this;
        var fx = align === "start" || align === "left"
            ? actualMargin.left
            : align === "center"
                ? (this.width - size.width) / 2.0
                : this.width - size.width + actualMargin.right;
        var fy = actualMargin.top;
        this.lastLinePosX = actualMargin.left;
        this.lastLinePosY = fy + size.height + actualMargin.bottom;
        return this.add(this.drawImage, [source, fx, fy, size.width, size.height], this);
    };
    /**
     * 执行图片绘制
     * @param source 图片来源
     * @param fromX 图片左上角位置 x 坐标
     * @param fromY 图片左上角位置 y 坐标
     * @param width 图片缩放宽度
     * @param height 图片缩放高度
     */
    EinePainter.prototype.drawImage = function (source, fromX, fromY, width, height) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var image;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, canvas_1.loadImage(source)];
                    case 1:
                        image = _c.sent();
                        if (!width || !height)
                            (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.drawImage(image, fromX, fromY);
                        else
                            (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.drawImage(image, fromX, fromY, width, height);
                        return [2 /*return*/];
                }
            });
        });
    };
    /** 执行绘图操作，清空绘图指令缓冲区 */
    EinePainter.prototype.exec = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, bufferItem;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.buffer;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        bufferItem = _a[_i];
                        return [4 /*yield*/, bufferItem.command.apply(bufferItem.thisRef ? bufferItem.thisRef : this.ctx, bufferItem.args)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.buffer = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 输出为 PNG 文件
     * @param path 输出路径
     */
    EinePainter.prototype.saveAsPNG = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.canvas) {
                _this.logger.error("saveAsPNG @ EinePainter failed: canvas not created");
                reject("canvas is not created");
                return;
            }
            var output = fs_1.createWriteStream(path);
            var stream = _this.canvas.createPNGStream();
            stream.pipe(output);
            output.on("finish", function () {
                _this.logger.verbose("saveAsPNG @ EinePainter: paint successfully saved to {}", path);
                resolve(stream);
            });
        });
    };
    /**
     * 输出为 JPG 文件
     * @param path 输出路径
     */
    EinePainter.prototype.saveAsJPG = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.canvas) {
                _this.logger.error("saveAsJPG @ EinePainter failed: canvas not created");
                reject("canvas not created");
                return;
            }
            var output = fs_1.createWriteStream(path);
            var stream = _this.canvas.createJPEGStream();
            stream.pipe(output);
            output.on("finish", function () {
                _this.logger.verbose("saveAsJPG @ EinePainter: paint successfully saved to {}", path);
                resolve(stream);
            });
        });
    };
    /**
     * (同步) 输出为 PNG Buffer
     * @param mimeType image/png
     * @param config
     */
    EinePainter.prototype.toPNGBufferSync = function (mimeType, config) {
        if (!this.canvas)
            return new Buffer("");
        return this.canvas.toBuffer(mimeType, config);
    };
    /**
     * (同步) 输出为 JPG Buffer
     * @param mimeType image/jpeg
     * @param config
     */
    EinePainter.prototype.toJPEGBuffer = function (mimeType, config) {
        if (!this.canvas)
            return new Buffer("");
        return this.canvas.toBuffer(mimeType, config);
    };
    /**
     * (异步) 输出为 Buffer
     */
    EinePainter.prototype.toBuffer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.canvas === null) {
                reject(Error("canvas not created"));
                return;
            }
            _this.canvas.toBuffer(function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    };
    EinePainter.fontList = new Map();
    return EinePainter;
}());
exports.default = EinePainter;
//# sourceMappingURL=EinePainter.js.map