import axios from '@/libs/api.request'
// POST /org/employee 新增员工
// PUT /org/employee 修改员工
// POST /org/employee/changeRole 设置角色
// POST /org/employee/contacts 通讯录
// POST /org/employee/delete 批量删除员工
// GET /org/employee/getAllByDepartmentId/{departmentId} 根据部门ID获取所有员工（包括子部门）
// GET /org/employee/getAllEmployee 获取所有员工
// GET /org/employee/getByDepartmentId/{departmentId} 根据部门ID获取员工列表
// GET /org/employee/getDirectlyAdmin/{id} 获取直属领导
// GET /org/employee/getDirectlyEmployee/{id} 获取直属员工
// GET /org/employee/getSelfInfo 获取个人资料
// POST /org/employee/move 批量移动员工
// POST /org/employee/updateStatus 修改用户状态
// POST /org/employee/uploadAvatar 上传头像

export const addEmployee = (data) => {
  return axios.request({
    url: '/org/employee',
    method: 'post',
    data
  })
}

export const editEmployee = (data) => {
  return axios.request({
    url: '/org/employee',
    method: 'put',
    data
  })
}

export const changeRole = (data) => {
  return axios.request({
    url: '/org/employee/changeRole',
    method: 'post',
    data
  })
}

export const contacts = (data) => {
  return axios.request({
    url: '/org/employee/contacts',
    method: 'post',
    data
  })
}

export const deleteEmployee = (data) => {
  return axios.request({
    url: '/org/employee/',
    method: 'post',
    data
  })
}

export const getAllByDepartmentId = (departmentId, params) => {
  return axios.request({
    url: '/org/employee/getAllByDepartmentId/' + departmentId,
    method: 'get',
    params
  })
}

export const getAllEmployee = (params) => {
  return axios.request({
    url: '/org/employee/getAllEmployee',
    method: 'get',
    params,
    cache: {
      maxAge: 15 * 60 * 1000
    }
  })
}

export const getByDepartmentId = (departmentId, params) => {
  return axios.request({
    url: '/org/employee/getAllByDepartmentId/' + departmentId,
    method: 'get',
    params
  })
}

export const getDirectlyAdmin = (id, params) => {
  return axios.request({
    url: '/org/employee/getDirectlyAdmin/' + id,
    method: 'get',
    params
  })
}

export const getDirectlyEmployee = (id, params) => {
  return axios.request({
    url: '/org/employee/getDirectlyEmployee/' + id,
    method: 'get',
    params
  })
}

export const getFinancialEmployee = (params) => {
  return axios.request({
    url: '/org/employee/getFinancialEmployee',
    method: 'get',
    params
  })
}

export const getAdministrativeEmployee = (params) => {
  return axios.request({
    url: '/org/employee/getAdministrativeEmployee',
    method: 'get',
    params
  })
}

export const getAllManager = (params) => {
  return axios.request({
    url: '/org/employee/getAllManager',
    method: 'get',
    params
  })
}

export const getSelfInfo = () => {
  return axios.request({
    url: '/org/employee/getSelfInfo',
    method: 'get'
  })
}

export const move = (data) => {
  return axios.request({
    url: '/org/employee/move',
    method: 'post',
    data
  })
}

export const updateStatus = (data) => {
  return axios.request({
    url: '/org/employee/updateStatus',
    method: 'post',
    data
  })
}

export const uploadAvatar = (data) => {
  return axios.request({
    url: '/org/employee/uploadAvatar',
    method: 'post',
    data
  })
}
