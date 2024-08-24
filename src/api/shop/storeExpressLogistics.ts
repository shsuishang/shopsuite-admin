import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.shop.storeExpressLogistics.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.shop.storeExpressLogistics.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.shop.storeExpressLogistics.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.shop.storeExpressLogistics.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.shop.storeExpressLogistics.edit,
    method: 'post',
    data,
  })
}

export function returnLogistics(params: any) {
  return request({
    url: URL.shop.storeExpressLogistics.returnLogistics,
    method: 'get',
    params,
  })
}

export function doEditState(data: any) {
  return request({
    url: URL.shop.storeExpressLogistics.editState,
    method: 'post',
    data,
  })
}
