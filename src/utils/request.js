import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 20000 // 请求超时
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 在发送请求之前的处理

    if (store.getters.token) {
    //让每个请求携带token
    //   // ['X-Token']是一个自定义key
    //   //请根据实际情况进行修改
      // config.headers['X-Token'] = getToken()
    // config.headers['Authorization'] = "JWT "+getToken()
    //    config.headers['Content-Type'] = 'pplication/json;charset=UTF-8'
    // }
    // config.headers = {'content-type': 'application/x-www-form-urlencoded'}
    }
    return config
  },
  error => {
    //处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
// 响应拦截器
// service.interceptors.response.use(res=>{
//   const code = res.data.code
//   if (code === 401) {
//     MessageBox.confirm(
//       '登录状态已过期，您可以继续留在该页面，或者重新登录',
//       '系统提示',
//       {
//         confirmButtonText: '重新登录',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }
//     ).then(() => {
//       store.dispatch('LogOut').then(() => {
//         location.reload() // 为了重新实例化vue-router对象 避免bug
//       })
//     })
//   } else if (code !== 200) {
//     Notification.error({
//       title: res.data.msg
//     })
//     return Promise.reject('error')
//   } else {
//     return res.data
//   }
// },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
export default service
