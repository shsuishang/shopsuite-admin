import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userTagBase.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userTagBase.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userTagBase.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.account.userTagBase.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.account.userTagBase.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.account.userTagBase.remove,
    method: 'post',
    data,
  })
}


