import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.feedbackType.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.feedbackType.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.feedbackType.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.sys.feedbackType.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.feedbackType.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.sys.feedbackType.remove,
    method: 'post',
    data,
  })
}

