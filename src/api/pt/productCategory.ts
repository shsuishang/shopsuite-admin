import request from '@/utils/request'
import { URL } from '@/config'

export function getTree(params: any) {
  return request({
    url: URL.pt.productCategory.tree,
    method: 'get',
    params,
  })
}

export function getList(params: any) {
  return request({
    url: URL.pt.productCategory.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productCategory.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productCategory.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productCategory.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pt.productCategory.remove,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.pt.productCategory.editState,
    method: 'post',
    data,
  })
}

