import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userCompanyType.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userCompanyType.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userCompanyType.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.account.userCompanyType.remove,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.account.userCompanyType.editState,
    method: 'post',
    data,
  })
}
