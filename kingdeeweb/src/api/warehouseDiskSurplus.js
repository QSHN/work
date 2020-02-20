import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseDiskSurplus = (data) => {
  return axios.request({
    url: 'api/warehouseDiskSurplus/updateWarehouseDiskSurplus',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseDiskSurplus = (data) => {
  return axios.request({
    url: 'api/warehouseDiskSurplus/queryWarehouseDiskSurplus',
    method: 'post',
    data
  })
}

export const batchWarehouseDiskSurplus = (data) => {
  return axios.request({
    url: 'api/warehouseDiskSurplus/batchWarehouseDiskSurplus',
    method: 'post',
    data
  })
}

export const parameterWarehouseDiskSurplus = (data) => {
  return axios.request({
    url: 'api/warehouseDiskSurplus/parameterWarehouseDiskSurplus',
    method: 'post',
    data
  })
}
