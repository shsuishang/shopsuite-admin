import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.trade.orderReturn.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.trade.orderReturn.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.trade.orderReturn.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.trade.orderReturn.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.trade.orderReturn.remove,
    method: 'post',
    data,
  })
}

export function getByReturnId(params: any) {
  return request({
    url: URL.trade.orderReturn.getByReturnId,
    method: 'get',
    params,
  })
}

export function refused(data: any) {
  return request({
    url: URL.trade.orderReturn.refused,
    method: 'post',
    data,
  })
}

export function review(data: any) {
  return request({
    url: URL.trade.orderReturn.review,
    method: 'post',
    data,
  })
}

export function receive(data: any) {
  return request({
    url: URL.trade.orderReturn.receive,
    method: 'post',
    data,
  })
}

export function refund(data: any) {
  return request({
    url: URL.trade.orderReturn.refund,
    method: 'post',
    data,
  })
}
