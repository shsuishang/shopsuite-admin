import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.admin.userAdmin.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.admin.userAdmin.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.admin.userAdmin.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.admin.userAdmin.remove,
    method: 'post',
    data,
  })
}
export function doRemoveBatch(data: any) {
  return request({
    url: URL.admin.userAdmin.removeBatch,
    method: 'post',
    data,
  })
}

