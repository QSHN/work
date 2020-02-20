import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseReceipt = (data) => {
  return axios.request({
    url: 'api/warehouseReceipt/updateWarehouseReceipt',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseReceipt = (data) => {
  return axios.request({
    url: 'api/warehouseReceipt/queryWarehouseReceipt',
    method: 'post',
    data
  })
}

export const batchWarehouseReceipt = (data) => {
  return axios.request({
    url: 'api/warehouseReceipt/batchWarehouseReceipt',
    method: 'post',
    data
  })
}

export const parameterWarehouseReceipt = (data) => {
  return axios.request({
    url: 'api/warehouseReceipt/parameterWarehouseReceipt',
    method: 'post',
    data
  })
}
