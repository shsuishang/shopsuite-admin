import request from '@/utils/request'
import { URL } from '@/config'

export function getList() {
  return request({
    url: URL.router,
    method: 'get',
  })
}

export function getSysInfo(params: any) {
  return request({
    url: URL.sysInfo,
    method: 'get',
    params,
  })
}
