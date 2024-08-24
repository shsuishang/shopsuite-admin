import request from '@/utils/request'
import { URL } from '@/config'

export function getSpecTree(params: any) {
  return request({
    url: URL.pt.productSpec.tree,
    method: 'get',
    params,
  })
}

export function getList(params: any) {
  return request({
    url: URL.pt.productSpec.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productSpec.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productSpec.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productSpec.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pt.productSpec.remove,
    method: 'post',
    data,
  })
}


