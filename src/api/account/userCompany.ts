import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userCompany.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userCompany.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userCompany.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.account.userCompany.remove,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.account.userCompany.editState,
    method: 'post',
    data,
  })
}


