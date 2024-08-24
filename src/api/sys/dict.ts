
import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.dict.list,
    method: 'get',
    params,
  })
}

export function getTree(params: any) {
  return request({
    url: URL.sys.dict.tree,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.dict.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.dict.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.dict.remove,
    method: 'post',
    data,
  })
}

// dict item

export function getListItem(params: any) {
  return request({
    url: URL.sys.dict.listItem,
    method: 'get',
    params,
  })
}

export function doAddItem(data: any) {
  return request({
    url: URL.sys.dict.addItem,
    method: 'post',
    data,
  })
}

export function doEditItem(data: any) {
  return request({
    url: URL.sys.dict.editItem,
    method: 'post',
    data,
  })
}

export function doRemoveItem(data: any) {
  return request({
    url: URL.sys.dict.removeItem,
    method: 'post',
    data,
  })
}
