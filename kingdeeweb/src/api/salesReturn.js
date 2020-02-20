import axios from '@/libs/api.request'

// 创建/更新
export const updateSalesReturn = (data) => {
  return axios.request({
    url: 'api/salesReturn/updateSalesReturn',
    method: 'post',
    data
  })
}

// 查询
export const querySalesReturn = (data) => {
  return axios.request({
    url: 'api/salesReturn/querySalesReturn',
    method: 'post',
    data
  })
}

export const batchSalesReturn = (data) => {
  return axios.request({
    url: 'api/salesReturn/batchSalesReturn',
    method: 'post',
    data
  })
}

export const parameterSalesReturn = (data) => {
  return axios.request({
    url: 'api/salesReturn/parameterSalesReturn',
    method: 'post',
    data
  })
}
