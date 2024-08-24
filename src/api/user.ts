import request from '@/utils/request'
import { URL } from '@/config'

export function getUserInfo() {
  return request({
    url: URL.userInfo,
    method: 'get',
  })
}
