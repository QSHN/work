import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseOut = (data) => {
  return axios.request({
    url: 'api/warehouseOut/updateWarehouseOut',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseOut = (data) => {
  return axios.request({
    url: 'api/warehouseOut/queryWarehouseOut',
    method: 'post',
    data
  })
}

export const batchWarehouseOut = (data) => {
  return axios.request({
    url: 'api/warehouseOut/batchWarehouseOut',
    method: 'post',
    data
  })
}

export const parameterWarehouseOut = (data) => {
  return axios.request({
    url: 'api/warehouseOut/parameterWarehouseOut',
    method: 'post',
    data
  })
}
