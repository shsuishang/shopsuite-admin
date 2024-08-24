import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pt.productComment.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productComment.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productComment.remove,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productComment.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.pt.productComment.editState,
    method: 'post',
    data,
  })
}
