import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userDistribution.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userDistribution.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userDistribution.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.account.userDistribution.editState,
    method: 'post',
    data,
  })
}
