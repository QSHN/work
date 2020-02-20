import axios from '@/libs/api.request'

// 创建/更新
export const updateSpendingCategory = (data) => {
  return axios.request({
    url: 'api/spendingCategory/spendingCategoryUpdate',
    method: 'post',
    data
  })
}

// 查询
export const querySpendingCategory = (data) => {
  return axios.request({
    url: 'api/spendingCategory/spendingCategoryQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteSpendingCategory = (data) => {
  return axios.request({
    url: 'api/spendingCategory/deleteSpendingCategory',
    method: 'delete',
    data
  })
}

export const batchSpendingCategory = (data) => {
  return axios.request({
    url: 'api/spendingCategory/batchSpendingCategory',
    method: 'post',
    data
  })
}

export const spendingCategoryUpdateSubject = (data) => {
  return axios.request({
    url: 'api/spendingCategory/spendingCategoryUpdateSubject',
    method: 'post',
    data
  })
}
