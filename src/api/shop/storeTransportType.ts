import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.shop.storeTransportType.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.shop.storeTransportType.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.shop.storeTransportType.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.shop.storeTransportType.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.shop.storeTransportType.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.shop.storeTransportType.editState,
    method: 'post',
    data,
  })
}
