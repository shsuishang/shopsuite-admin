import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.pay.consumeWithdraw.list,
    method: 'get',
    params,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.pay.consumeWithdraw.edit,
    method: 'post',
    data,
  })
}
