import request from '@/utils/request'
import { URL } from '@/config'

export function getProductTimeLine(params: any) {
  return request({
    url: URL.analytics.product.getProductTimeLine,
    method: 'get',
    params,
  })
}

export function getProductNum(params: any) {
  return request({
    url: URL.analytics.product.getProductNum,
    method: 'get',
    params,
  })
}

