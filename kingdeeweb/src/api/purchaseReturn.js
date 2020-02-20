import axios from '@/libs/api.request'

// 创建/更新
export const updatePurchaseReturn = (data) => {
  return axios.request({
    url: 'api/purchaseReturn/updatePurchaseReturn',
    method: 'post',
    data
  })
}

// 查询
export const queryPurchaseReturn = (data) => {
  return axios.request({
    url: 'api/purchaseReturn/queryPurchaseReturn',
    method: 'post',
    data
  })
}

export const batchPurchaseReturn = (data) => {
  return axios.request({
    url: 'api/purchaseReturn/batchPurchaseReturn',
    method: 'post',
    data
  })
}

export const parameterPurchaseReturn = (data) => {
  return axios.request({
    url: 'api/purchaseReturn/parameterPurchaseReturn',
    method: 'post',
    data
  })
}
