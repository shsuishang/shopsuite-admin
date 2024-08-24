import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pay.userResource.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pay.userResource.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pay.userResource.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pay.userResource.doRemoveBatch,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pay.userResource.edit,
    method: 'post',
    data,
  })
}

export function updateUserMoney(data: any) {
  return request({
    url: URL.pay.userResource.updateUserMoney,
    method: 'post',
    data,
  })
}


export function updatePoints(data: any) {
  return request({
    url: URL.pay.userResource.updatePoints,
    method: 'post',
    data,
  })
}

