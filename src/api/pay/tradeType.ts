import request from '@/utils/request'
import { URL } from '@/config'

export function getTradeTypeList(params: any) {
  return request({
    url: URL.pay.tradeType.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pay.tradeType.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pay.tradeType.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pay.tradeType.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pay.tradeType.edit,
    method: 'post',
    data,
  })
}
