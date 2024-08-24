import request from '@/utils/request'

export function getList() {
  return request({
    url: '/manage/sys/dict/list',
    method: 'get',
  })
}
