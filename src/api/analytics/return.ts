import request from '@/utils/request'
import { URL } from '@/config'

export function getReturnNum(params: any) {
  return request({
    url: URL.analytics.return.getReturnNum,
    method: 'get',
    params,
  })
}

export function getReturnCustomerNumTimeline(params: any) {
  return request({
    url: URL.analytics.return.getReturnCustomerNumTimeline,
    method: 'get',
    params,
  })
}

export function getReturnNumTimeline(params: any) {
  return request({
    url: URL.analytics.return.getReturnNumTimeline,
    method: 'get',
    params,
  })
}


export function getReturnAmountTimeline(params: any) {
  return request({
    url: URL.analytics.return.getReturnAmountTimeline,
    method: 'get',
    params,
  })
}

export function getReturnAmount(params: any) {
  return request({
    url: URL.analytics.return.getReturnAmount,
    method: 'get',
    params,
  })
}

export function getReturnItemNumTimeLine(params: any) {
  return request({
    url: URL.analytics.return.getReturnItemNumTimeLine,
    method: 'get',
    params,
  })
}

export function listReturnItemNum(params: any) {
  return request({
    url: URL.analytics.return.listReturnItemNum,
    method: 'get',
    params,
  })
}

export function getReturnItemNum(params: any) {
  return request({
    url: URL.analytics.return.getReturnItemNum,
    method: 'get',
    params,
  })
}


