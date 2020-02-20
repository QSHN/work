import axios from '@/libs/api.request'

/**
 * 用户组
 */
// 创建/更新
export const updateUserGroup = (data) => {
  return axios.request({
    url: 'api/userManage/updateUserGroup',
    method: 'post',
    data
  })
}

// 查询
export const queryUserGroup = (data) => {
  return axios.request({
    url: 'api/userManage/queryUserGroup',
    method: 'post',
    data
  })
}

// 删除
export const deleteUserGroup = (data) => {
  return axios.request({
    url: 'api/userManage/deleteUserGroup',
    method: 'delete',
    data
  })
}

/**
 * 用户权限
 */
// 创建/更新
export const updateUserPermission = (data) => {
  return axios.request({
    url: 'api/userManage/updateUserPermission',
    method: 'post',
    data
  })
}

// 查询
export const queryUserPermission = (data) => {
  return axios.request({
    url: 'api/userManage/queryUserPermission',
    method: 'post',
    data
  })
}
