import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouse = (data) => {
  return axios.request({
    url: 'api/warehouse/warehouseUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouse = (data) => {
  return axios.request({
    url: 'api/warehouse/warehouseQuery',
    method: 'post',
    data
  })
}

// 删除
export const batchWarehouse = (data) => {
  return axios.request({
    url: 'api/warehouse/batchWarehouse',
    method: 'post',
    data
  })
}

// 创建/更新
export const updateWarehouseGroup = (data) => {
  return axios.request({
    url: 'api/warehouse/warehouseGroupUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseGroup = (data) => {
  return axios.request({
    url: 'api/warehouse/warehouseGroupQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteWarehouseGroup = (data) => {
  return axios.request({
    url: 'api/warehouse/warehouseGroupDelete',
    method: 'delete',
    data
  })
}
