import request from '@/utils/request'
import { URL } from '@/config'

export function getTree(params: any) {
  return request({
    url: URL.sys.districtBase.tree,
    method: 'get',
    params,
  })
}

export function getList(params: any) {
  return request({
    url: URL.sys.districtBase.list,
    method: 'get',
    params,
  })
}


export function doAdd(data: any) {
  return request({
    url: URL.sys.districtBase.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.districtBase.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.sys.districtBase.removeBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.districtBase.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.sys.districtBase.editState,
    method: 'post',
    data,
  })
}
