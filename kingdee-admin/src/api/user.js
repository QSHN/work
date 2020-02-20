import axios from '@/libs/api.request'

// 注册
export const register = (data) => {
  return axios.request({
    url: 'api/_backstage/registerAdmin',
    method: 'post',
    data
  })
}

// 登录
export const login = (data) => {
  return axios.request({
    url: 'api/_backstage/loginAdmin',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getUser = (token) => {
  axios.setAuthorization(token)
  return axios.request({
    url: 'api/_backstage/currentAdmin',
    method: 'get'
  })
}

// 更新用户信息
export const updateUser = (data) => {
  return axios.request({
    url: 'api/_backstage/updateAdmin',
    method: 'post',
    data
  })
}

// 获取用户列表
export const queryAdmin = (data) => {
  return axios.request({
    url: 'api/_backstage/queryAdmin',
    method: 'post',
    data
  })
}

// 职位
export const queryClerk = (data) => {
  return axios.request({
    url: 'api/_backstage/queryClerk',
    method: 'post',
    data
  })
}

// 创建/更新职位
export const updateClerk = (data) => {
  return axios.request({
    url: 'api/_backstage/updateClerk',
    method: 'post',
    data
  })
}

// 删除职位
export const deleteClerk = (data) => {
  return axios.request({
    url: 'api/_backstage/deleteClerk',
    method: 'post',
    data
  })
}

// App版本
export const queryApp = (data) => {
  return axios.request({
    url: 'api/_backstage/queryApp',
    method: 'post',
    data
  })
}

// 创建/更新App版本
export const updateApp = (data) => {
  return axios.request({
    url: 'api/_backstage/updateApp',
    method: 'post',
    data
  })
}

// 删除App版本
export const deleteApp = (data) => {
  return axios.request({
    url: 'api/_backstage/deleteApp',
    method: 'post',
    data
  })
}

// 客户
export const queryClient = (data) => {
  return axios.request({
    url: 'api/_backstage/queryClient',
    method: 'post',
    data
  })
}

// 创建/更新客户
export const updateClient = (data) => {
  return axios.request({
    url: 'api/_backstage/updateClient',
    method: 'post',
    data
  })
}

// 跟进记录
export const updateRecords = (data) => {
  return axios.request({
    url: 'api/_backstage/updateRecords',
    method: 'post',
    data
  })
}

// 功能管理
export const functionManage = (data) => {
  return axios.request({
    url: 'api/_backstage/functionManage',
    method: 'post',
    data
  })
}

// 用户管理
export const userManage = (data) => {
  return axios.request({
    url: 'api/_backstage/userManage',
    method: 'post',
    data
  })
}

// 附件管理
export const filesManage = (data) => {
  return axios.request({
    url: 'api/_backstage/filesManage',
    method: 'post',
    data
  })
}
