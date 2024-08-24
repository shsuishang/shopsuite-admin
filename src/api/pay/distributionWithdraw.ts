import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pay.distributionWithdraw.list,
    method: 'get',
    params,
  })
}

export function editState(data: any) {
  return request({
    url: URL.pay.distributionWithdraw.editState,
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pay.distributionWithdraw.editState,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pay.distributionWithdraw.editState,
    method: 'post',
    data,
  })
}


