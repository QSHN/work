import axios from '@/libs/api.request'

// 注册
export const register = (data) => {
  return axios.request({
    url: 'api/user/register',
    method: 'post',
    data
  })
}

// 登录
export const login = (data) => {
  return axios.request({
    url: 'api/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getUser = (token) => {
  axios.setAuthorization(token)
  return axios.request({
    url: 'api/user/current',
    method: 'get'
  })
}

// 更新用户信息
export const updateUser = (data) => {
  return axios.request({
    url: 'api/user/update',
    method: 'post',
    data
  })
}

// 获取用户列表
export const queryUserList = (data) => {
  return axios.request({
    url: 'api/user/queryUserList',
    method: 'post',
    data
  })
}
