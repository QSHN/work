import axios from '@/libs/api.request'

// 创建/更新
export const updateSubject = (data) => {
  return axios.request({
    url: 'api/subject/subjectUpdate',
    method: 'post',
    data
  })
}

// 查询
export const querySubject = (data) => {
  return axios.request({
    url: 'api/subject/subjectQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteSubject = (data) => {
  return axios.request({
    url: 'api/subject/subjectDelete',
    method: 'delete',
    data
  })
}

// 初始化科目余额
export const saveSubject = (data) => {
  return axios.request({
    url: 'api/subject/subjectSave',
    method: 'post',
    data
  })
}

// 批量操作
export const subjectBatchOperation = (data) => {
  return axios.request({
    url: 'api/subject/subjectBatchOperation',
    method: 'post',
    data
  })
}

// 创建/更新
export const updateSubjectType = (data) => {
  return axios.request({
    url: 'api/subject/typeUpdate',
    method: 'post',
    data
  })
}

// 查询
export const querySubjectType = (data) => {
  return axios.request({
    url: 'api/subject/typeQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteSubjectType = (data) => {
  return axios.request({
    url: 'api/subject/typeDelete',
    method: 'delete',
    data
  })
}
