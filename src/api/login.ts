import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { URL, loginRSA } from '@/config'

export async function login(data: any) {
  if (loginRSA) {
    const password = await encryptedData(data.password)

    data = Object.assign({}, data)
    data.password = password
    data.encrypt = true
  }

  return request({
    url: URL.login,
    method: 'post',
    data,
  })
}

export function register(data: any) {
  return request({
    url: URL.register,
    method: 'post',
    data,
  })
}


export function logout() {
  return request({
    url: URL.logout,
    method: 'get',
  })
}

export async function socialLogin(data: any) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}
