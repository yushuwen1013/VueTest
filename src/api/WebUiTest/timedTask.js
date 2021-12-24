import request from '@/utils/request'


//新增或更新任务
export function update_task(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/WebUiTest/TimedTask/update_task',
    method: 'post',
    data
  })
}

//获取任务列表
export function get_task(data) {
  return request({
    url: '/WebUiTest/TimedTask/get_task',
    method: 'get',
    params: data
  })
}

//删除任务
export function delete_task(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/WebUiTest/TimedTask/delete_task',
    method: 'post',
    data
  })
}

//执行任务
export function execute_task(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/WebUiTest/TimedTask/execute_task',
    method: 'get',
    params: data
  })
}

//切换任务状态
export function switch_stake_state(data) {
  return request({
    // baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/WebUiTest/TimedTask/switch_stake_state',
    method: 'get',
    params: data
  })
}

//报告
export function Report(method, data) {
  if (method == 'get') {
    return request({
      url: '/WebUiTest/TimedTask/Report/',
      method: method,
      params: data
    })
  } else {
    return request({
      url: '/WebUiTest/TimedTask/Report/',
      method: method,
      data
    })
  }
}

//报告详情
export function ReportDetails(method, data) {
  if (method == 'get') {
    return request({
      url: '/WebUiTest/TimedTask/ReportDetails/',
      method: method,
      params: data
    })
  } else {
    return request({
      url: '/WebUiTest/TimedTask/ReportDetails/',
      method: method,
      data
    })
  }
}