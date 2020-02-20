import axios from '@/libs/api.request'

// 创建/更新
export const updateIncomeCategory = (data) => {
  return axios.request({
    url: 'api/incomeCategory/incomeCategoryUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryIncomeCategory = (data) => {
  return axios.request({
    url: 'api/incomeCategory/incomeCategoryQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteIncomeCategory = (data) => {
  return axios.request({
    url: 'api/incomeCategory/deleteIncomeCategory',
    method: 'delete',
    data
  })
}

export const batchIncomeCategory = (data) => {
  return axios.request({
    url: 'api/incomeCategory/batchIncomeCategory',
    method: 'post',
    data
  })
}

export const incomeCategoryUpdateSubject = (data) => {
  return axios.request({
    url: 'api/incomeCategory/incomeCategoryUpdateSubject',
    method: 'post',
    data
  })
}
