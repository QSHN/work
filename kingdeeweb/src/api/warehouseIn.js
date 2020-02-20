import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseIn = (data) => {
  return axios.request({
    url: 'api/warehouseIn/updateWarehouseIn',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseIn = (data) => {
  return axios.request({
    url: 'api/warehouseIn/queryWarehouseIn',
    method: 'post',
    data
  })
}

export const batchWarehouseIn = (data) => {
  return axios.request({
    url: 'api/warehouseIn/batchWarehouseIn',
    method: 'post',
    data
  })
}

export const parameterWarehouseIn = (data) => {
  return axios.request({
    url: 'api/warehouseIn/parameterWarehouseIn',
    method: 'post',
    data
  })
}
