
import request from '@/utils/request'
import { URL } from '@/config'

export function getListGallery(params: any) {
  return request({
    url: URL.sys.material.listGallery,
    method: 'get',
    params,
  })
}

export function getTreeGallery(params: any) {
  return request({
    url: URL.sys.material.treeGallery,
    method: 'get',
    params,
  })
}

export function doAddGallery(data: any) {
  return request({
    url: URL.sys.material.addGallery,
    method: 'post',
    data,
  })
}

export function doEditGallery(data: any) {
  return request({
    url: URL.sys.material.editGallery,
    method: 'post',
    data,
  })
}

export function doRemoveGallery(data: any) {
  return request({
    url: URL.sys.material.removeGallery,
    method: 'post',
    data,
  })
}

// material

export function getList(params: any) {
  return request({
    url: URL.sys.material.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.material.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.material.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.material.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.sys.material.removeBatch,
    method: 'post',
    data,
  })
}
