import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pt.productTag.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productTag.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productTag.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productTag.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pt.productTag.remove,
    method: 'post',
    data,
  })
}

export function getTags(params: any) {
  return request({
    url: URL.pt.productTag.tag,
    method: 'get',
    params,
  })
}
