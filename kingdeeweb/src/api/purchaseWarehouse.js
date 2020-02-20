import axios from '@/libs/api.request'

// 创建/更新
export const updatePurchaseWarehouse = (data) => {
  return axios.request({
    url: 'api/purchaseWarehouse/updatePurchaseWarehouse',
    method: 'post',
    data
  })
}

// 查询
export const queryPurchaseWarehouse = (data) => {
  return axios.request({
    url: 'api/purchaseWarehouse/queryPurchaseWarehouse',
    method: 'post',
    data
  })
}

export const batchPurchaseWarehouse = (data) => {
  return axios.request({
    url: 'api/purchaseWarehouse/batchPurchaseWarehouse',
    method: 'post',
    data
  })
}

export const parameterPurchaseWarehouse = (data) => {
  return axios.request({
    url: 'api/purchaseWarehouse/parameterPurchaseWarehouse',
    method: 'post',
    data
  })
}
