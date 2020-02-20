import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getCurrent() {
  return request({
    url: '/user/current',
    method: 'get'
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

export function queryUser(data) {
  return request({
    url: '/user/queryUser',
    method: 'post',
    data
  })
}

export function updateUserTemp(data) {
  return request({
    url: '/user/updateUserTemp',
    method: 'post',
    data
  })
}

export function queryUserTemp(data) {
  return request({
    url: '/user/queryUserTemp',
    method: 'post',
    data
  })
}

export function updateUserGroup(data) {
  return request({
    url: '/user/updateUserGroup',
    method: 'post',
    data
  })
}

export function queryUserGroup(data) {
  return request({
    url: '/user/queryUserGroup',
    method: 'post',
    data
  })
}
