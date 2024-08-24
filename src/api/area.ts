import request from '@/utils/request'
import { URL } from '@/config'

export function getArea(params: any) {
  return request({
    url: URL.area,
    method: 'get',
    params,
  })
}
