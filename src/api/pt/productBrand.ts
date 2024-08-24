import request from '@/utils/request'
import { URL } from '@/config'

export function getBrandTree(params: any) {
  return request({
    url: URL.pt.productBrand.tree,
    method: 'get',
    params,
  })
}

export function getList(params: any) {
  return request({
    url: URL.pt.productBrand.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productBrand.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productBrand.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productBrand.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pt.productBrand.remove,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.pt.productBrand.editState,
    method: 'post',
    data,
  })
}


