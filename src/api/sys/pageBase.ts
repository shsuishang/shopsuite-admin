import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.pageBase.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.pageBase.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.pageBase.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.sys.pageBase.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.pageBase.remove,
    method: 'post',
    data,
  })
}


