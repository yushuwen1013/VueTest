import request from '@/utils/request'
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