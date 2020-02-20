import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
import { getToken } from './util'

// import store from '@/store'
// import { disposeError } from './error'
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const {
//     statusText,
//     status,
//     request: { responseURL }
//   } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) {
//     store.dispatch('addErrorLog', info)
//   }
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 客户端请求头
        clientSystem: 'PC',
        token: getToken()
      }
    }
    return config
  }
  setAuthorization (token) {
    axios.defaults.headers.common['token'] = token
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url)
        const { data, status } = res
        return { data, status }
      },
      error => {
        // this.destroy(url)
        // let errorInfo = error.response
        // if (!errorInfo) {
        //   const {
        //     request: { statusText, status },
        //     config
        //   } = JSON.parse(JSON.stringify(error))
        //   errorInfo = {
        //     statusText,
        //     status,
        //     request: { responseURL: config.url }
        //   }
        // }
        //
        // addErrorLog(errorInfo)
        //
        // // 错误码处理
        // if (errorInfo.data && errorInfo.data.errorCode) {
        //   let callback = disposeError(errorInfo.data)
        //   if (callback === 'stop') return Promise.reject(error)// 中止执行
        // }

        return Promise.reject(error.response.data)
      }
    )
  }
  request (options) {
    options = Object.assign(this.getInsideConfig(), options)
    let instance
    if (options.cache) {
      const cache = setupCache(options.cache)
      instance = axios.create({ adapter: cache.adapter })
      delete options.cache
    } else {
      instance = axios.create()
    }
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
