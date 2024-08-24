import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pt.productCommentReply.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productCommentReply.add,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.pt.productCommentReply.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productCommentReply.remove,
    method: 'post',
    data,
  })
}
