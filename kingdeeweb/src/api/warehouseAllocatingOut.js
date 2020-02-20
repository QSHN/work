import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseAllocatingOut = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingOut/updateWarehouseAllocatingOut',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseAllocatingOut = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingOut/queryWarehouseAllocatingOut',
    method: 'post',
    data
  })
}

export const batchWarehouseAllocatingOut = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingOut/batchWarehouseAllocatingOut',
    method: 'post',
    data
  })
}

export const parameterWarehouseAllocatingOut = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingOut/parameterWarehouseAllocatingOut',
    method: 'post',
    data
  })
}

export const warehouseAllocatingDiff = (data) => {
  return axios.request({
    url: 'api/warehouseAllocatingOut/warehouseAllocatingDiff',
    method: 'post',
    data
  })
}
