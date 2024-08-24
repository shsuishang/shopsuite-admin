import request from '@/utils/request'
import { URL } from '@/config'

export function getMpUrl(params: any) {
  return request({
    url: URL.sys.release.download,
    method: 'post',
    params,
  })
}


export function getWebUrl(params: any) {
  return request({
    url: URL.sys.release.download,
    method: 'post',
    params,
  })
}


export function getLicence(params: any) {
  return request({
    url: URL.sys.release.getLicence,
    method: 'get',
    params,
  })
}


