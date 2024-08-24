import request from '@/utils/request'
import { URL } from '@/config'

export function getSalesAmount(params: any) {
  return request({
    url: URL.analytics.trade.getSalesAmount,
    method: 'get',
    params,
  })
}
