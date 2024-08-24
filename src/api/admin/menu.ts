import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.admin.menu.list,
    method: 'get',
    params,
  })
}
export function getTree(params: any) {
  return request({
    url: URL.admin.menu.tree,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.admin.menu.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.admin.menu.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.admin.menu.remove,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.admin.menu.editState,
    method: 'post',
    data,
  })
}
