import axios from '@/libs/api.request'

// GET /org/permission/employeePermissionList/{type} type: FINANCE("财务"), ADMINISTRATION("行政"), DEPARTMENT("部门管理员"), SUPERADMIN("超级管理员"), TEMPORARY("临时") 根据权限类型获取授权列表
export const employeePermissionList = (type) => {
  return axios.request({
    url: '/org/permission/employeePermissionList/' + type,
    method: 'get'
  })
}
// GET /org/permission/employeePermission/{id}
export const employeePermission = (id) => {
  return axios.request({
    url: '/org/permission/employeePermission/' + id,
    method: 'get'
  })
}

// GET /org/permission/getDefaultPermissions/{type}
export const getDefaultPermissions = (type) => {
  return axios.request({
    url: '/org/permission/getDefaultPermissions/' + type,
    method: 'get'
  })
}

// POST /org/permission/authorization 设置部门管理员：
export const authorization = (data) => {
  return axios.request({
    url: '/org/permission/authorization',
    method: 'post',
    data
  })
}

// DELETE /org/permission/employeePermission/{id}
export const deleteEmployeePermission = (id) => {
  return axios.request({
    url: '/org/permission/employeePermission/' + id,
    method: 'delete'
  })
}
