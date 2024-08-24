import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.account.userInfo.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.account.userInfo.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.account.userInfo.edit,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.account.userInfo.editState,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.account.userInfo.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.account.userInfo.remove,
    method: 'post',
    data,
  })
}

export function getUserData(params: any) {
  return request({
    url: URL.account.userInfo.getUserData,
    method: 'get',
    params,
  })
}

export function passWordEdit(data: any) {
  return request({
    url: URL.account.userInfo.passWordEdit,
    method: 'post',
    data,
  })
}

export function addTags(data: any) {
  return request({
    url: URL.account.userInfo.addTags,
    method: 'post',
    data,
  })
}

export function addVouchers(data: any) {
  return request({
    url: URL.account.userInfo.addVouchers,
    method: 'post',
    data,
  })
}

export function exportFile(data) {
  return request({
    url: URL.account.userInfo.exportFile,
    method: 'post',
    data,
    responseType: 'blob',
  })
}

export function exportTemp(data) {
  return request({
    url: URL.account.userInfo.exportTemp,
    method: 'get',
    data,
    responseType: 'blob',
  })
}

