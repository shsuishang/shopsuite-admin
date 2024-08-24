import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.page.app.getList,
    method: 'get',
    params,
  })
}

export function setThemes(data: any) {
  return request({
    url: URL.page.app.setThemes,
    method: 'post',
    data,
  })
}

export function editApp(data: any) {
  return request({
    url: URL.page.app.editApp,
    method: 'post',
    data,
  })
}
