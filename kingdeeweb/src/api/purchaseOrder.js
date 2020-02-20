import axios from '@/libs/api.request'

// 创建/更新
export const updatePurchaseOrder = (data) => {
  return axios.request({
    url: 'api/purchaseOrder/updatePurchaseOrder',
    method: 'post',
    data
  })
}

// 查询
export const queryPurchaseOrder = (data) => {
  return axios.request({
    url: 'api/purchaseOrder/queryPurchaseOrder',
    method: 'post',
    data
  })
}

export const batchPurchaseOrder = (data) => {
  return axios.request({
    url: 'api/purchaseOrder/batchPurchaseOrder',
    method: 'post',
    data
  })
}

export const parameterPurchaseOrder = (data) => {
  return axios.request({
    url: 'api/purchaseOrder/parameterPurchaseOrder',
    method: 'post',
    data
  })
}
