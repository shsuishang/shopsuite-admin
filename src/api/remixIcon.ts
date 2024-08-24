import request from '@/utils/request'

export function getIconList(params: any) {
  return request({
    url: '/remixIcon/getList',
    method: 'get',
    params,
  })
}
