import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.sys.log.error,
    method: 'get',
    params,
  })
}


