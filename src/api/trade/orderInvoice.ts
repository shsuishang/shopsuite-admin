import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.trade.orderInvoice.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.trade.orderInvoice.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.trade.orderInvoice.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.trade.orderInvoice.editState,
    method: 'post',
    data,
  })
}

export function editStatus(data: any) {
  return request({
    url: URL.trade.orderInvoice.editStatus,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.trade.orderInvoice.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.trade.orderInvoice.remove,
    method: 'post',
    data,
  })
}
