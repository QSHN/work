import request from '@/utils/request'

export function updateSystemSet(data) {
  return request({
    url: '/systemSet/updateSystemSet',
    method: 'post',
    data
  })
}

export function querySystemSet(data) {
  return request({
    url: '/systemSet/querySystemSet',
    method: 'post',
    data
  })
}
