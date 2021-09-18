import request from '@/utils/request'

export function request_debug(data) {
  return request({
    url: '/request/request_debug',
    method: 'post',
    data
  })
}
