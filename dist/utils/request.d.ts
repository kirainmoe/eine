import FormData from "form-data";
/**
 * 发起 POST 请求
 * @param url 请求 URL
 * @param data POST 数据
 * @param headers 自定义请求头 (optional)
 * @returns Promise<AxiosResponse<any>>
 */
export declare const post: <T extends object, P extends object>(url: string, data: T, headers?: P | undefined) => Promise<import("axios").AxiosResponse<any>>;
/**
 * 发起 GET 请求
 * @param url 请求 URL
 * @param params GET 参数
 * @param headers 自定义请求头 (optional)
 * @returns Promise<AxiosResponse<any>>
 */
export declare const get: <T extends object, P extends object>(url: string, params: T, headers?: P | undefined) => Promise<import("axios").AxiosResponse<any>>;
/**
 * 上传文件 (multipart/form-data)
 * @param url 请求 URL
 * @param form FormData
 * @param headers 自定义请求头 (options)
 * @returns Promise<AxiosResponse<any>>
 */
export declare const upload: <P extends object>(url: string, form: FormData, headers?: P | undefined) => Promise<import("axios").AxiosResponse<any>>;
export declare const wrappedPost: <T extends object, P extends object>(url: string, data: T, headers?: P | undefined) => Promise<{
    data: any;
    headers: any;
    payload: any;
}>;
export declare const wrappedGet: <T extends object, P extends object>(url: string, params: T, headers?: P | undefined) => Promise<{
    data: any;
    headers: any;
    payload: any;
}>;
