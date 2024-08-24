import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pay.consumeTrade.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pay.consumeTrade.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pay.consumeTrade.remove,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pay.consumeTrade.edit,
    method: 'post',
    data,
  })
}

