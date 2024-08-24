import request from '@/utils/request'

export function expireToken() {
  return request({
    url: '/expireToken',
    method: 'get',
  })
}

export function refreshToken() {
  return request({
    url: '/refreshToken',
    method: 'get',
  })
}
