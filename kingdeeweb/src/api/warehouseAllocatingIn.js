import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseAllocatingIn = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingIn/updateWarehouseAllocatingIn',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseAllocatingIn = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingIn/queryWarehouseAllocatingIn',
    method: 'post',
    data
  })
}

export const batchWarehouseAllocatingIn = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingIn/batchWarehouseAllocatingIn',
    method: 'post',
    data
  })
}

export const parameterWarehouseAllocatingIn = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingIn/parameterWarehouseAllocatingIn',
    method: 'post',
    data
  })
}
