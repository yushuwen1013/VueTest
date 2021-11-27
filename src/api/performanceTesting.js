import request from '@/utils/request'

//上传文件
export function upload_file(method, data) {
  if (method == 'get') {
    return request({
      url: 'fileUpload/upload/',
      method: method,
      params: data
    })
  } else {
    return request({
      url: 'fileUpload/upload/',
      method: method,
      data
    })
  }
}
//下载文件
export function dowload_file(data) {
    return request({
      url: 'fileUpload/upload/',
      method: "get",
      params: data,
      responseType: 'blob'
    })
}


//脚本
export function jmx_script(method, data) {
  if (method == 'get') {
    return request({
      url: '/script/jmx_script/',
      method: method,
      params: data
    })
  } else {
    return request({
      url: '/script/jmx_script/',
      method: method,
      data
    })
  }
}

// 执行脚本
export function run_jmx_script(method, data) {
  return request({
    url: '/script/run_jmx_script/',
    method: method,
    data
  })
}

// 执行结果
export function jmx_script_results(method, data) {
  if (method == 'get') {
    return request({
      url: '/script/jmx_script_results/',
      method: method,
      params: data
    })
  } else {
    return request({
      url: '/script/jmx_script_results/',
      method: method,
      data
    })
  }
}


// 执行结果报告
export function jmx_script_results_report(method, data) {
  if (method == 'get') {
    return request({
      url: '/script/jmx_script_results_report/',
      method: method,
      params: data
    })
  } else {
    return request({
      url: '/script/jmx_script_results_report/',
      method: method,
      data
    })
  }
}