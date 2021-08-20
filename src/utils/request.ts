import axios from "axios";
import cluster from "cluster";
import FormData from "form-data";
import { createWriteStream, WriteStream } from "fs";
import { promisify } from "util";
import * as stream from "stream";

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
export const post = <T extends object, P extends object>(url: string, data: T, headers?: P) => {
  return axios.post(url, data, {
    headers: Object.assign({}, presetHeaders, headers),
  });
};

/**
 * 发起 GET 请求
 * @param url 请求 URL
 * @param params GET 参数
 * @param headers 自定义请求头 (optional)
 * @returns Promise<AxiosResponse<any>>
 */
export const get = <T extends object, P extends object>(url: string, params: T, headers?: P) => {
  return axios.get(url, {
    params,
    headers: Object.assign({}, presetHeaders, headers),
  });
}

/**
 * 上传文件 (multipart/form-data)
 * @param url 请求 URL
 * @param form FormData
 * @param headers 自定义请求头 (options)
 * @returns Promise<AxiosResponse<any>>
 */
export const upload = <P extends object>(url: string, form: FormData, headers?: P) => {
  return axios.post(url, form, {
    headers: Object.assign({}, presetHeaders, headers, form.getHeaders()),
  });
};

export const wrappedPost = <T extends object, P extends object>(url: string, data: T, headers?: P) => {
  return post(url, data, headers)
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

export const wrappedGet = <T extends object, P extends object>(url: string, params: T, headers?: P) => {
  return get(url, params, headers)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      if (response.data.code !== undefined && response.data.code !== 0) {
        if (cluster.isWorker && response.data.code === 5) {
          return {
            data: null,
            headers: response.headers,
            payload: null
          };
        }
        
        throw new Error(`${response.data.msg} (${response.data.code})`);
      }

      return {
        data: response.data.data,
        headers: response.headers,
        payload: response.data,
      };
    });
}

const finished = promisify(stream.finished);

export const download = <P extends object>(url: string, output: string, header?: P) => {
  let writer: WriteStream = createWriteStream(output);
  return axios.get(url, {
    headers: header,
    responseType: "stream"
  })
  .then(async response  => {
    response.data.pipe(writer);
    return finished(writer);
  });
};