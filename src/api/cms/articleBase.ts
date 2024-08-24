import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.cms.articleBase.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.cms.articleBase.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.cms.articleBase.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.cms.articleBase.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.cms.articleBase.edit,
    method: 'post',
    data,
  })
}

export function doEditState(data: any) {
  return request({
    url: URL.cms.articleBase.editState,
    method: 'post',
    data,
  })
}
