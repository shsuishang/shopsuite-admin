import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.pageCategoryNav.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.pageCategoryNav.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.pageCategoryNav.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.sys.pageCategoryNav.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.pageCategoryNav.remove,
    method: 'post',
    data,
  })
}
