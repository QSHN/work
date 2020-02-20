import request from '@/utils/request'

export function updateBasicInfo(data) {
  return request({
    url: '/basicInfo/updateBasicInfo',
    method: 'post',
    data
  })
}

export function queryBasicInfo(data) {
  return request({
    url: '/basicInfo/queryBasicInfo',
    method: 'post',
    data
  })
}

export function updateBasicInfoGroup(data) {
  return request({
    url: '/basicInfo/updateBasicInfoGroup',
    method: 'post',
    data
  })
}

export function queryBasicInfoGroup(data) {
  return request({
    url: '/basicInfo/queryBasicInfoGroup',
    method: 'post',
    data
  })
}
