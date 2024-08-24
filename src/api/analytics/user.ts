import request from '@/utils/request'
import { URL } from '@/config'

export function getVisitor(params: any) {
  return request({
    url: URL.analytics.user.getVisitor,
    method: 'get',
    params,
  })
}

export function getRegUser(params: any) {
  return request({
    url: URL.analytics.user.getRegUser,
    method: 'get',
    params,
  })
}

export function getUserTimeLine(params: any) {
  return request({
    url: URL.analytics.user.getUserTimeLine,
    method: 'get',
    params,
  })
}

export function getUserNum(params: any) {
  return request({
    url: URL.analytics.user.getUserNum,
    method: 'get',
    params,
  })
}
