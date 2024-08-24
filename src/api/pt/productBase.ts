import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pt.productBase.list,
    method: 'get',
    params,
  })
}

export function doSave(data: any) {
  return request({
    url: URL.pt.productBase.save,
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productBase.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productBase.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.pt.productBase.editState,
    method: 'post',
    data,
  })
}

export function editEnable(data: any) {
  return request({
    url: URL.pt.productBase.editEnable,
    method: 'post',
    data,
  })
}

export function editCommissionRate(data: any) {
  return request({
    url: URL.pt.productBase.editCommissionRate,
    method: 'post',
    data,
  })
}

export function batchEditState(data: any) {
  return request({
    url: URL.pt.productBase.batchEditState,
    method: 'post',
    data,
  })
}

export function editSort(data: any) {
  return request({
    url: URL.pt.productBase.editSort,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productBase.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pt.productBase.remove,
    method: 'post',
    data,
  })
}

export function getProductDate(params: any) {
  return request({
    url: URL.pt.productBase.getProductDate,
    method: 'get',
    params,
  })
}

export function listItem(params: any) {
  return request({
    url: URL.pt.productItem.list,
    method: 'get',
    params,
  })
}

export function getProductItems(params: any) {
  return request({
    url: URL.pt.productBase.productItems,
    method: 'get',
    params,
  })
}

export function exportTemp(data) {
  return request({
    url: URL.pt.productBase.exportTemp,
    method: 'get',
    data,
    responseType: 'blob',
  })
}

