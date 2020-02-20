import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseDiskPoint = (data) => {
  return axios.request({
    url: 'api/warehouseDiskPoint/updateWarehouseDiskPoint',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseDiskPoint = (data) => {
  return axios.request({
    url: 'api/warehouseDiskPoint/queryWarehouseDiskPoint',
    method: 'post',
    data
  })
}

export const batchWarehouseDiskPoint = (data) => {
  return axios.request({
    url: 'api/warehouseDiskPoint/batchWarehouseDiskPoint',
    method: 'post',
    data
  })
}

export const parameterWarehouseDiskPoint = (data) => {
  return axios.request({
    url: 'api/warehouseDiskPoint/parameterWarehouseDiskPoint',
    method: 'post',
    data
  })
}
