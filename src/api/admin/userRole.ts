import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.admin.userRole.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.admin.userRole.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.admin.userRole.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.admin.userRole.remove,
    method: 'post',
    data,
  })
}
export function doRemoveBatch(data: any) {
  return request({
    url: URL.admin.userRole.remove,
    method: 'post',
    data,
  })
}

