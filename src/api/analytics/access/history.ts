import request from '@/utils/request'
import { URL } from '@/config'

export function getAccessOs(params: any) {
  return request({
    url: URL.analytics.history.getAccessOs,
    method: 'get',
    params,
  })
}

export function getAccessBrowser(params: any) {
  return request({
    url: URL.analytics.history.getAccessBrowser,
    method: 'get',
    params,
  })
}

export function getAccessCountry(params: any) {
  return request({
    url: URL.analytics.history.getAccessCountry,
    method: 'get',
    params,
  })
}

export function getAccessDevice(params: any) {
  return request({
    url: URL.analytics.history.getAccessDevice,
    method: 'get',
    params,
  })
}

export function getAccessProvince(params: any) {
  return request({
    url: URL.analytics.history.getAccessProvince,
    method: 'get',
    params,
  })
}

export function getAccessItemTimeLine(params: any) {
  return request({
    url: URL.analytics.history.getAccessItemTimeLine,
    method: 'get',
    params,
  })
}

export function getAccessItemUserTimeLine(params: any) {
  return request({
    url: URL.analytics.history.getAccessItemUserTimeLine,
    method: 'get',
    params,
  })
}

export function getAccessVisitorTimeLine(params: any) {
  return request({
    url: URL.analytics.history.getAccessVisitorTimeLine,
    method: 'get',
    params,
  })
}

export function getAccessNum(params: any) {
  return request({
    url: URL.analytics.history.getAccessNum,
    method: 'get',
    params,
  })
}

export function getAccessVisitorNum(params: any) {
  return request({
    url: URL.analytics.history.getAccessVisitorNum,
    method: 'get',
    params,
  })
}


export function getAccessItemNum(params: any) {
  return request({
    url: URL.analytics.history.getAccessItemNum,
    method: 'get',
    params,
  })
}

export function getAccessItemUserNum(params: any) {
  return request({
    url: URL.analytics.history.getAccessItemUserNum,
    method: 'get',
    params,
  })
}

export function listAccessItem(params: any) {
  return request({
    url: URL.analytics.history.listAccessItem,
    method: 'get',
    params,
  })
}
