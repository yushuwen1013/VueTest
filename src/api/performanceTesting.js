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



//新增或更新任务
export function update_task(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/timed_task/update_task',
    method: 'post',
    data
  })
}

//获取任务列表
export function get_task(data) {
  return request({
    url: '/timed_task/get_task',
    method: 'get',
    params: data
  })
}

//删除任务
export function delete_task(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/timed_task/delete_task',
    method: 'post',
    data
  })
}

//执行任务
export function execute_task(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/timed_task/execute_task',
    method: 'get',
    params: data
  })
}

//切换任务状态
export function switch_stake_state(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/timed_task/switch_stake_state',
    method: 'get',
    params: data
  })
}