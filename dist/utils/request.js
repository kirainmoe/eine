"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.wrappedGet = exports.wrappedPost = exports.upload = exports.get = exports.post = void 0;
var axios_1 = __importDefault(require("axios"));
var cluster_1 = __importDefault(require("cluster"));
var fs_1 = require("fs");
var util_1 = require("util");
var stream = __importStar(require("stream"));
var presetHeaders = {
    'User-Agent': 'Mozilla/5.0 (Eine)',
    'X-Requested-With': 'XMLHttpRequest'
};
/**
 * 发起 POST 请求
 * @param url 请求 URL
 * @param data POST 数据
 * @param headers 自定义请求头 (optional)
 * @returns Promise<AxiosResponse<any>>
 */
var post = function (url, data, headers) {
    return axios_1.default.post(url, data, {
        headers: Object.assign({}, presetHeaders, headers),
    });
};
exports.post = post;
/**
 * 发起 GET 请求
 * @param url 请求 URL
 * @param params GET 参数
 * @param headers 自定义请求头 (optional)
 * @returns Promise<AxiosResponse<any>>
 */
var get = function (url, params, headers) {
    return axios_1.default.get(url, {
        params: params,
        headers: Object.assign({}, presetHeaders, headers),
    });
};
exports.get = get;
/**
 * 上传文件 (multipart/form-data)
 * @param url 请求 URL
 * @param form FormData
 * @param headers 自定义请求头 (options)
 * @returns Promise<AxiosResponse<any>>
 */
var upload = function (url, form, headers) {
    return axios_1.default.post(url, form, {
        headers: Object.assign({}, presetHeaders, headers, form.getHeaders()),
    });
};
exports.upload = upload;
var wrappedPost = function (url, data, headers) {
    return exports.post(url, data, headers)
        .then(function (response) {
        if (response.status !== 200) {
            throw new Error(response.statusText);
        }
        if (response.data.code !== 0) {
            throw new Error(response.data.msg + " (" + response.data.code + ")");
        }
        return {
            data: response.data.data,
            headers: response.headers,
            payload: response.data,
        };
    });
};
exports.wrappedPost = wrappedPost;
var wrappedGet = function (url, params, headers) {
    return exports.get(url, params, headers)
        .then(function (response) {
        if (response.status !== 200) {
            throw new Error(response.statusText);
        }
        if (response.data.code !== undefined && response.data.code !== 0) {
            if (cluster_1.default.isWorker && response.data.code === 5) {
                return {
                    data: null,
                    headers: response.headers,
                    payload: null
                };
            }
            throw new Error(response.data.msg + " (" + response.data.code + ")");
        }
        return {
            data: response.data.data,
            headers: response.headers,
            payload: response.data,
        };
    });
};
exports.wrappedGet = wrappedGet;
var finished = util_1.promisify(stream.finished);
var download = function (url, output, header) {
    var writer = fs_1.createWriteStream(output);
    return axios_1.default.get(url, {
        headers: header,
        responseType: "stream"
    })
        .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            response.data.pipe(writer);
            return [2 /*return*/, finished(writer)];
        });
    }); });
};
exports.download = download;
//# sourceMappingURL=request.js.map