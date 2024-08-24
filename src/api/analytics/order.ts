import request from '@/utils/request'
import { URL } from '@/config'

export function getOrderNum(params: any) {
  return request({
    url: URL.analytics.order.getOrderNum,
    method: 'get',
    params,
  })
}

export function getOrderNumToday(params: any) {
  return request({
    url: URL.analytics.order.getOrderNumToday,
    method: 'get',
    params,
  })
}

export function getDashboardTimeLine(params: any) {
  return request({
    url: URL.analytics.order.getDashboardTimeLine,
    method: 'get',
    params,
  })
}

export function getOrderCustomerNumTimeline(params: any) {
  return request({
    url: URL.analytics.order.getOrderCustomerNumTimeline,
    method: 'get',
    params,
  })
}

export function getOrderNumTimeline(params: any) {
  return request({
    url: URL.analytics.order.getOrderNumTimeline,
    method: 'get',
    params,
  })
}


export function getSaleOrderAmount(params: any) {
  return request({
    url: URL.analytics.order.getSaleOrderAmount,
    method: 'get',
    params,
  })
}

export function getOrderAmount(params: any) {
  return request({
    url: URL.analytics.order.getOrderAmount,
    method: 'get',
    params,
  })
}

export function getRefundAmount(params: any) {
  return request({
    url: URL.analytics.order.getRefundAmount,
    method: 'get',
    params,
  })
}

export function getRefundNum(params: any) {
  return request({
    url: URL.analytics.order.getRefundNum,
    method: 'get',
    params,
  })
}

export function getOrderItemNumTimeLine(params: any) {
  return request({
    url: URL.analytics.order.getOrderItemNumTimeLine,
    method: 'get',
    params,
  })
}

export function listOrderItemNum(params: any) {
  return request({
    url: URL.analytics.order.listOrderItemNum,
    method: 'get',
    params,
  })
}

export function getOrderItemNum(params: any) {
  return request({
    url: URL.analytics.order.getOrderItemNum,
    method: 'get',
    params,
  })
}


