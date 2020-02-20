import axios from '@/libs/api.request'

// 创建/更新
export const updateSalesOrder = (data) => {
  return axios.request({
    url: 'api/salesOrder/updateSalesOrder',
    method: 'post',
    data
  })
}

// 查询
export const querySalesOrder = (data) => {
  return axios.request({
    url: 'api/salesOrder/querySalesOrder',
    method: 'post',
    data
  })
}

export const batchSalesOrder = (data) => {
  return axios.request({
    url: 'api/salesOrder/batchSalesOrder',
    method: 'post',
    data
  })
}

export const parameterSalesOrder = (data) => {
  return axios.request({
    url: 'api/salesOrder/parameterSalesOrder',
    method: 'post',
    data
  })
}
