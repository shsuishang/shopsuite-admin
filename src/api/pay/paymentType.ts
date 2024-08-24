import request from '@/utils/request'
import { URL } from '@/config'

export function getTypeList(params: any) {
  return request({
    url: URL.pay.paymentType.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pay.paymentType.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pay.paymentType.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pay.paymentType.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pay.paymentType.edit,
    method: 'post',
    data,
  })
}
