import axios from '@/libs/api.request'

// 创建/更新
export const availableWarehouseReport = (data) => {
  return axios.request({
    url: 'api/warehouseReport/availableWarehouseReport',
    method: 'post',
    data
  })
}

export const queryWarehouseReport = (data) => {
  return axios.request({
    url: 'api/warehouseReport/queryWarehouseReport',
    method: 'post',
    data
  })
}

export const detailWarehouseReport = (data) => {
  return axios.request({
    url: 'api/warehouseReport/detailWarehouseReport',
    method: 'post',
    data
  })
}

export const summaryWarehouseReport = (data) => {
  return axios.request({
    url: 'api/warehouseReport/summaryWarehouseReport',
    method: 'post',
    data
  })
}
