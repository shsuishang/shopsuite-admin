import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userMessage.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userMessage.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userMessage.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.account.userMessage.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.account.userMessage.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.account.userMessage.remove,
    method: 'post',
    data,
  })
}

export function getNotice(params: any) {
  return request({
    url: URL.account.userMessage.getNotice,
    method: 'get',
    params,
  })
}

export function clearNotice(data: any) {
  return request({
    url: URL.account.userMessage.clearNotice,
    method: 'post',
    data,
  })
}
