import request from '@/utils/request'

export function updatePermission(data) {
  return request({
    url: '/permission/updatePermission',
    method: 'post',
    data
  })
}

export function queryPermission(data) {
  return request({
    url: '/permission/queryPermission',
    method: 'post',
    data
  })
}
