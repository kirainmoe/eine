"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrappedGet = exports.wrappedPost = exports.upload = exports.get = exports.post = void 0;
var axios_1 = __importDefault(require("axios"));
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
//# sourceMappingURL=request.js.map