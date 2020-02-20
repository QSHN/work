import axios from '@/libs/api.request'

// 查询
export const detailPurchaseReport = (data) => {
  return axios.request({
    url: 'api/purchaseReport/detailPurchaseReport',
    method: 'post',
    data
  })
}

export const summaryPurchaseReport = (data) => {
  return axios.request({
    url: 'api/purchaseReport/summaryPurchaseReport',
    method: 'post',
    data
  })
}

export const trackingPurchaseReport = (data) => {
  return axios.request({
    url: 'api/purchaseReport/trackingPurchaseReport',
    method: 'post',
    data
  })
}
