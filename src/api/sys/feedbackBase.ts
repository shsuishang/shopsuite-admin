import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.feedbackBase.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.feedbackBase.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.feedbackBase.edit,
    method: 'post',
    data,
  })
}

export function editAnswer(data: any) {
  return request({
    url: URL.sys.feedbackBase.editAnswer,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.sys.feedbackBase.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.feedbackBase.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.sys.feedbackBase.remove,
    method: 'post',
    data,
  })
}

