import axios from '@/libs/api.request'

// 创建/更新
export const updateSalesWarehouse = (data) => {
  return axios.request({
    url: 'api/salesWarehouse/updateSalesWarehouse',
    method: 'post',
    data
  })
}

// 查询
export const querySalesWarehouse = (data) => {
  return axios.request({
    url: 'api/salesWarehouse/querySalesWarehouse',
    method: 'post',
    data
  })
}

export const batchSalesWarehouse = (data) => {
  return axios.request({
    url: 'api/salesWarehouse/batchSalesWarehouse',
    method: 'post',
    data
  })
}

export const parameterSalesWarehouse = (data) => {
  return axios.request({
    url: 'api/salesWarehouse/parameterSalesWarehouse',
    method: 'post',
    data
  })
}
