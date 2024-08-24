import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pt.productAssist.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.pt.productAssist.add,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pt.productAssist.edit,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.pt.productAssist.remove,
    method: 'post',
    data,
  })
}

export function doRemoveBatch(data: any) {
  return request({
    url: URL.pt.productAssist.remove,
    method: 'post',
    data,
  })
}


export function getAssistTree(params: any) {
  return request({
    url: URL.pt.productAssist.tree,
    method: 'get',
    params,
  })
}
