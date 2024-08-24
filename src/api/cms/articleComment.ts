import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.cms.articleComment.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.cms.articleComment.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.cms.articleComment.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.cms.articleComment.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.cms.articleComment.edit,
    method: 'post',
    data,
  })
}

export function doEditState(data: any) {
  return request({
    url: URL.cms.articleComment.editState,
    method: 'post',
    data,
  })
}
