import request from '@/utils/request'
import {URL} from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pt.productType.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productType.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productType.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productType.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pt.productType.remove,
    method: 'post',
    data,
  })
}

export function getInfo(params: any) {
  return request({
    url: URL.pt.productType.info,
    method: 'get',
    params,
  })
}


