import axios from '@/libs/api.request'

// 创建/更新
export const updateWarehouseDiskDeficient = (data) => {
  return axios.request({
    url: 'api/warehouseDiskDeficient/updateWarehouseDiskDeficient',
    method: 'post',
    data
  })
}

// 查询
export const queryWarehouseDiskDeficient = (data) => {
  return axios.request({
    url: 'api/warehouseDiskDeficient/queryWarehouseDiskDeficient',
    method: 'post',
    data
  })
}

export const batchWarehouseDiskDeficient = (data) => {
  return axios.request({
    url: 'api/warehouseDiskDeficient/batchWarehouseDiskDeficient',
    method: 'post',
    data
  })
}

export const parameterWarehouseDiskDeficient = (data) => {
  return axios.request({
    url: 'api/warehouseDiskDeficient/parameterWarehouseDiskDeficient',
    method: 'post',
    data
  })
}
