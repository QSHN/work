import request from '@/utils/request'

export function getOssRole(data) {
  return request({
    url: '/utils/getOssRole',
    method: 'get',
    data
  })
}
