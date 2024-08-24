import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.shop.storeTransportItem.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.shop.storeTransportItem.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.shop.storeTransportItem.remove,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.shop.storeTransportItem.edit,
    method: 'post',
    data,
  })
}
