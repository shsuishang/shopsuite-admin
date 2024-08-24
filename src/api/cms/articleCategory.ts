import request from '@/utils/request'
import { URL } from '@/config'

export function getTree(params: any) {
  return request({
    url: URL.cms.articleCategory.tree,
    method: 'get',
    params,
  })
}

export function getList(params: any) {
  return request({
    url: URL.cms.articleCategory.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.cms.articleCategory.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.cms.articleCategory.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.cms.articleCategory.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.cms.articleCategory.edit,
    method: 'post',
    data,
  })
}
