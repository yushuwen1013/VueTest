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