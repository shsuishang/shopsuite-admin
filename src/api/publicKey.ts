import request from '@/utils/request'

export function getPublicKey() {
  return request({
    url: '/front/sys/config/publicKey',
    method: 'get',
  })
}
