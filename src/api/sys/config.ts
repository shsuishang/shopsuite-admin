
import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.config.list,
    method: 'get',
    params,
  })
}

export function getIndex(params: any) {
  return request({
    url: URL.sys.config.index,
    method: 'get',
    params,
  })
}

export function doEditSite(data: any) {
  return request({
    url: URL.sys.config.editSite,
    method: 'post',
    data,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.sys.config.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.sys.config.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.sys.config.remove,
    method: 'post',
    data,
  })
}

// config item

export function getListType(params: any) {
  return request({
    url: URL.sys.config.listType,
    method: 'get',
    params,
  })
}

export function doAddType(data: any) {
  return request({
    url: URL.sys.config.addType,
    method: 'post',
    data,
  })
}

export function doEditType(data: any) {
  return request({
    url: URL.sys.config.editType,
    method: 'post',
    data,
  })
}

export function doRemoveType(data: any) {
  return request({
    url: URL.sys.config.removeType,
    method: 'post',
    data,
  })
}

export function editState(data: any) {
  return request({
    url: URL.sys.config.editState,
    method: 'post',
    data,
  })
}

export function getPcHelp(data: any) {
  return request({
    url: URL.sys.config.getPcHelp,
    method: 'get',
    data,
  })
}

export function savePcHelp(data: any) {
  return request({
    url: URL.sys.config.savePcHelp,
    method: 'post',
    data,
  })
}

export function cacheClean(data: any) {
  return request({
    url: URL.sys.config.cacheClean,
    method: 'post',
    data,
  })
}

export function getConfigBase(params: any) {
  return request({
    url: URL.sys.config.getDetail,
    method: 'get',
    params,
  })
}

export function getSmsRecord(params: any) {
  return request({
    url: URL.sys.config.smsRecord,
    method: 'get',
    params,
  })
}
