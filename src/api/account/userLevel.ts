import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userLevel.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userLevel.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userLevel.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.account.userLevel.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.account.userLevel.remove,
    method: 'post',
    data,
  })
}


