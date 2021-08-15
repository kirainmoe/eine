"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EinePainterType = void 0;
var EinePainterType;
(function (EinePainterType) {
    let FillMode;
    (function (FillMode) {
        FillMode[FillMode["FILL"] = 0] = "FILL";
        FillMode[FillMode["STROKE"] = 1] = "STROKE";
    })(FillMode = EinePainterType.FillMode || (EinePainterType.FillMode = {}));
    EinePainterType.canvasStateProps = [
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
})(EinePainterType = exports.EinePainterType || (exports.EinePainterType = {}));
exports.default = EinePainterType;
//# sourceMappingURL=types.js.map