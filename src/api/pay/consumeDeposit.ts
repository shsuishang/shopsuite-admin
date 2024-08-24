import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pay.consumeDeposit.list,
    method: 'get',
    params,
  })
}

export function doOfflinePay(data: any) {
  return request({
    url: URL.pay.consumeDeposit.offline,
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pay.consumeDeposit.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pay.consumeDeposit.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pay.consumeDeposit.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pay.consumeDeposit.edit,
    method: 'post',
    data,
  })
}

export function editReview(data: any) {
  return request({
    url: URL.pay.consumeDeposit.editReview,
    method: 'post',
    data,
  })
}

