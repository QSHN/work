import axios from '@/libs/api.request'

// 注册
export const register = ({
  adminName,
  areaId,
  companyAccount,
  companyName,
  invitationCode,
  password,
  phone,
  jpushId,
  vercode
}) => {
  const data = {
    adminName,
    areaId,
    companyAccount,
    companyName,
    invitationCode,
    password,
    phone,
    jpushId,
    vercode
  }
  return axios.request({
    url: '/register',
    data,
    method: 'post'
  })
}

// 获取公司信息
export const getCompany = () => {
  return axios.request({
    url: `/org/company/getCompanyInfo`,
    method: 'get'
  })
}

// 获取组织架构(包括所有子部门)
export const getOrganizationTree = dId => {
  return axios.request({
    url: `/org/department/getOrganizationTree?departmentId=${dId || ''}`,
    method: 'get'
  })
}

// 新增/修改部门
export const setDepartment = data => {
  return axios.request({
    url: `/org/department/`,
    method: `${data.id ? 'put' : 'post'}`,
    data: data
  })
}

// 获取通讯录列表 {
// "searchText": "搜索参数"
export const getContacts = data => {
  return axios.request({
    url: `/org/employee/contacts`,
    method: 'post',
    data: data
  })
}

// 获取员工信息
export const getEmployee = id => {
  return axios.request({
    url: `/org/employee/${id}`,
    method: 'get'
  })
}

// 新增/修改员工
export const setEmployee = data => {
  return axios.request({
    url: `/org/employee/`,
    method: `${data.id ? 'put' : 'post'}`,
    data: data
  })
}

// 设置角色
/**
 *"ids": ["员工id","员工id"],
 *"role": "角色['超级管理员', '部门管理员', '普通员工']['SUPERADMIN','DEPARTMENTADMIN','EMPLOYEE']"
 **/
export const changeRole = data => {
  return axios.request({
    url: `/org/employee/changeRole`,
    method: `post`,
    data: data
  })
}

// 删除部门
export const deleteDepartment = id => {
  return axios.request({
    url: `/org/department/${id}`,
    method: 'delete'
  })
}

// 删除员工
export const deleteEmployee = ids => {
  return axios.request({
    url: `/org/employee/delete`,
    method: 'post',
    data: ids
  })
}

// 停用/启用账号
/**
 *"id": "员工ID",
 *"status": "状态'ENABLED','DISABLED'"
 */
export const changeAccountStatus = data => {
  return axios.request({
    url: `/org/employee/updateStatus`,
    method: 'post',
    data: data
  })
}

// 获取公司设置
/**
 * POSITION("职业类型")
   CLIENT_LEVEL("客户等级")
   CLIENT_TYPE("客户类型")
   INTENTION_TYPE("意向类型")
   PHOTO_TYPE("拍照类型")
   TASK_TYPE("任务类型")
 */
export const getCompanySetting = type => {
  return axios.request({
    url: `/org/company/getCompanySetting/${type}`,
    method: `get`
  })
}

// 新增企业设置
export const addCompanySetting = data => {
  return axios.request({
    url: `/org/company/companySettingModel`,
    method: `post`,
    data: data
  })
}

// 修改企业设置 data:{id,name}
export const setCompanySetting = data => {
  return axios.request({
    url: `/org/company/companySettingModel`,
    method: `put`,
    data: data
  })
}

// 删除企业设置
export const delCompanySetting = id => {
  return axios.request({
    url: `/org/company/companySettingModel/${id}`,
    method: `delete`
  })
}

// 设置薪资
export const setSalary = data => {
  return axios.request({
    url: `/org/employee/setSalary`,
    method: `post`,
    data: data
  })
}
