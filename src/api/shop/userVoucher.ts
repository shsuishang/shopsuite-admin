import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.shop.shopUserVoucher.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.shop.shopUserVoucher.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.shop.shopUserVoucher.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.shop.shopUserVoucher.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.shop.shopUserVoucher.edit,
    method: 'post',
    data,
  })
}
