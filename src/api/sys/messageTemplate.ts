import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.messageTemplate.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.messageTemplate.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.messageTemplate.edit,
    method: 'post',
    data,
  })
}

export function editEnable(data: any) {
  return request({
    url: URL.sys.messageTemplate.editEnable,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.sys.messageTemplate.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.messageTemplate.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.sys.messageTemplate.remove,
    method: 'post',
    data,
  })
}

