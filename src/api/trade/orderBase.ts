import request from '@/utils/request'
import { URL } from '@/config'

export function exportFile(params: any) {
  return request({
    url: URL.trade.orderBase.exportFile,
    method: 'get',
    params,
  })
}

export function getDetail(params: any) {
  return request({
    url: URL.trade.orderBase.detail,
    method: 'get',
    params,
  })
}

export function getList(params: any) {
  return request({
    url: URL.trade.orderBase.list,
    method: 'get',
    params,
  })
}


export function doAdd(data: any) {
  return request({
    url: URL.trade.orderBase.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.trade.orderBase.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.trade.orderBase.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.trade.orderBase.remove,
    method: 'post',
    data,
  })
}

export function cancel(data: any) {
  return request({
    url: URL.trade.orderBase.cancel,
    method: 'post',
    data,
  })
}

export function review(data: any) {
  return request({
    url: URL.trade.orderBase.review,
    method: 'post',
    data,
  })
}

export function finance(data: any) {
  return request({
    url: URL.trade.orderBase.finance,
    method: 'post',
    data,
  })
}

export function picking(data: any) {
  return request({
    url: URL.trade.orderBase.picking,
    method: 'post',
    data,
  })
}

export function shipping(data: any) {
  return request({
    url: URL.trade.orderBase.shipping,
    method: 'post',
    data,
  })
}

export function receive(data: any) {
  return request({
    url: URL.trade.orderBase.receive,
    method: 'post',
    data,
  })
}

export function transferToSupplier(params: any) {
  return request({
    url: URL.trade.orderBase.transferToSupplier,
    method: 'get',
    params,
  })
}

export function listStateLog(params: any) {
  return request({
    url: URL.trade.orderBase.listStateLog,
    method: 'get',
    params,
  })
}

export function editShoppingFee(data: any) {
  return request({
    url: URL.trade.orderBase.editShoppingFee,
    method: 'post',
    data,
  })
}
