import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userTagGroup.list,
    method: 'get',
    params,
  })
}

export function tree(params: any) {
  return request({
    url: URL.account.userTagGroup.tree,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userTagGroup.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userTagGroup.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.account.userTagGroup.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.account.userTagGroup.remove,
    method: 'post',
    data,
  })
}


