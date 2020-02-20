import axios from '@/libs/api.request'

// 创建/更新
export const updateDepartment = (data) => {
  return axios.request({
    url: 'api/department/departmentUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryDepartment = (data) => {
  return axios.request({
    url: 'api/department/departmentQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteDepartment = (data) => {
  return axios.request({
    url: 'api/department/deleteDepartment',
    method: 'delete',
    data
  })
}

export const batchDepartment = (data) => {
  return axios.request({
    url: 'api/department/batchDepartment',
    method: 'post',
    data
  })
}

export const departmentUpdateSubject = (data) => {
  return axios.request({
    url: 'api/department/departmentUpdateSubject',
    method: 'post',
    data
  })
}
