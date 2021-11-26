import request from '@/utils/request'

//更新或添加全局变量
export function update_global_variable(data) {
  return request({
    url: '/request/update_global_variable',
    method: 'post',
    data
  })
}

//获取全局变量列表
export function get_global_variable(data) {
  return request({
    url: '/request/get_global_variable',
    method: 'get',
    params: data
  })
}

//删除全局变量
export function delete_global_variable(data) {
  return request({
    url: '/request/delete_global_variable',
    method: 'post',
    data
  })
}

//更新或添加环境配置
export function update_environment_configuration(data) {
  return request({
    url: '/request/update_environment_configuration',
    method: 'post',
    data
  })
}

//获取环境配置列表
export function get_environment_configuration(data) {
  return request({
    url: '/request/get_environment_configuration',
    method: 'get',
    params: data
  })
}

//删除环境配置
export function delete_environment_configuration(data) {
  return request({
    url: '/request/delete_environment_configuration',
    method: 'post',
    data
  })
}

// 接口调试
export function request_debug(data) {
  return request({
    url: '/request/request_debug',
    method: 'post',
    data
  })
}

//获取文件列表
export function get_file_list(data) {
  return request({
    url: '/request/get_file_list',
    method: 'get',
    params: data
  })
}

//新增文件
export function create_file(data) {
  return request({
    url: '/request/create_file',
    method: 'post',
    data
  })
}

//删除文件
export function delete_file(data) {
  return request({
    url: '/request/delete_file',
    method: 'post',
    data
  })
}

//获去接口列表
export function get_request_list(data) {
  return request({
    url: '/request/get_request_list',
    method: 'get',
    params: data
  })
}

//添加或更新接口
export function update_request(data) {
  return request({
    url: '/request/update_request',
    method: 'post',
    data
  })
}

//删除接口
export function delete_request(data) {
  return request({
    url: '/request/delete_request',
    method: 'post',
    data
  })
}

//更新或新增用例
export function update_use_case(data) {
  return request({
    url: '/request/update_use_case',
    method: 'post',
    data
  })
}

//删除用例
export function delete_use_case(data) {
  return request({
    url: '/request/delete_use_case',
    method: 'post',
    data
  })
}

//获取用例列表
export function get_use_case(data) {
  return request({
    url: '/request/get_use_case',
    method: 'get',
    params: data
  })
}


//新增或更新接口用例
export function update_interface_use_case(data) {
  return request({
    url: '/request/update_interface_use_case',
    method: 'post',
    data
  })
}

//导入我的接口
export function import_interface_use_case(data) {
  return request({
    url: '/request/import_interface_use_case',
    method: 'post',
    data
  })
}

//删除接口用例
export function delete_interface_use_case(data) {
  return request({
    url: '/request/delete_interface_use_case',
    method: 'post',
    data
  })
}

//获取接口用例列表
export function get_interface_use_case(data) {
  return request({
    url: '/request/get_interface_use_case',
    method: 'get',
    params: data
  })
}

//更新接口用例顺序
export function update_interface_use_case_serial_number(data) {
  return request({
    url: '/request/update_interface_use_case_serial_number',
    method: 'post',
    data
  })
}

//更新请求默认值
export function update_request_defaults(data) {
  return request({
    url: '/request/update_request_defaults',
    method: 'post',
    data
  })
}

//获取请求默认值
export function get_request_defaults(data) {
  return request({
    url: '/request/get_request_defaults',
    method: 'get',
    params: data
  })
}



//更新项目
export function updata_project(data) {
  return request({
    url: '/request/updata_project',
    method: 'post',
    data
  })
}

//获取项目列表
export function get_project_list(data) {
  return request({
    url: '/request/get_project_list',
    method: 'get',
    params: data
  })
}

//删除项目
export function delete_project(data) {
  return request({
    url: '/request/delete_project',
    method: 'post',
    data
  })
}


//调试用例
export function debugging_use_cases(data) {
  return request({
    url: '/request/debugging_use_cases',
    method: 'get',
    params: data
  })
}

//获取提取参数
export function get_extract_parameter(data) {
  return request({
    url: '/request/get_extract_parameter',
    method: 'get',
    params: data
  })
}

//删除提取到的参数
export function delete_extract_parameter(data) {
  return request({
    url: '/request/delete_extract_parameter',
    method: 'post',
    data
  })
}

//新增或更新任务
export function update_task(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/request/update_task',
    method: 'post',
    data
  })
}

//获取任务列表
export function get_task(data) {
  return request({
    url: '/request/get_task',
    method: 'get',
    params: data
  })
}



//删除任务
export function delete_task(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/request/delete_task',
    method: 'post',
    data
  })
}

//执行任务
export function execute_task(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/request/execute_task',
    method: 'get',
    params: data
  })
}

//切换任务状态
export function switch_stake_state(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API_TIMED_TASK,
    url: '/request/switch_stake_state',
    method: 'get',
    params: data
  })
}

//获取执行结果
export function get_executive_outcomes(data) {
  return request({
    url: '/request/get_executive_outcomes',
    method: 'get',
    params: data
  })
}

//删除执行结果
export function delete_executive_outcomes(data) {
  return request({
    url: '/request/delete_executive_outcomes',
    method: 'post',
    data
  })
}

//获取文件接口
export function get_all_file(data) {
  return request({
    url: '/request/get_all_file',
    method: 'get',
    params: data
  })
}

//通过测试报告id获取报告详情
export function get_test_report(data) {
  return request({
    url: '/request/get_test_report',
    method: 'get',
    params: data,
  })
}


//通过测试报告id获取报告详情
export function fileUpload(data) {
  return request({
    url: 'fileUpload/upload/',
    method: 'post',
    data: data,
  })
}