import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.crontabBase.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.crontabBase.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.crontabBase.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.crontabBase.remove,
    method: 'post',
    data,
  })
}


export function editState(data: any) {
  return request({
    url: URL.sys.crontabBase.editState,
    method: 'post',
    data,
  })
}

