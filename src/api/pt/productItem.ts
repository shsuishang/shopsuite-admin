import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pt.productItem.list,
    method: 'get',
    params,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productItem.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.pt.productItem.editState,
    method: 'post',
    data,
  })
}


export function editStock(data: any) {
  return request({
    url: URL.pt.productItem.editStock,
    method: 'post',
    data,
  })
}

export function getStockBillItemList(params: any) {
  return request({
    url: URL.pt.productItem.getStockBillItems,
    method: 'get',
    params,
  })
}

export function getStockWarningItemList(params: any) {
  return request({
    url: URL.pt.productItem.getStockWarningItems,
    method: 'get',
    params,
  })
}

export function exportTemp(data) {
  return request({
    url: URL.pt.productItem.exportTemp,
    method: 'get',
    data,
    responseType: 'blob',
  })
}

