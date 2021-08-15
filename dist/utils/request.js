"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrappedGet = exports.wrappedPost = exports.upload = exports.get = exports.post = void 0;
const axios_1 = __importDefault(require("axios"));
const presetHeaders = {
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
const post = (url, data, headers) => {
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
const get = (url, params, headers) => {
    return axios_1.default.get(url, {
        params,
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
const upload = (url, form, headers) => {
    return axios_1.default.post(url, form, {
        headers: Object.assign({}, presetHeaders, headers, form.getHeaders()),
    });
};
exports.upload = upload;
const wrappedPost = (url, data, headers) => {
    return exports.post(url, data, headers)
        .then(response => {
        if (response.status !== 200) {
            throw new Error(response.statusText);
        }
        if (response.data.code !== 0) {
            throw new Error(`${response.data.msg} (${response.data.code})`);
        }
        return {
            data: response.data.data,
            headers: response.headers,
            payload: response.data,
        };
    });
};
exports.wrappedPost = wrappedPost;
const wrappedGet = (url, params, headers) => {
    return exports.get(url, params, headers)
        .then(response => {
        if (response.status !== 200) {
            throw new Error(response.statusText);
        }
        if (response.data.code !== undefined && response.data.code !== 0) {
            throw new Error(`${response.data.msg} (${response.data.code})`);
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