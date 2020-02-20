import axios from '@/libs/api.request'

// 查询
export const detailSalesReport = (data) => {
  return axios.request({
    url: 'api/salesReport/detailSalesReport',
    method: 'post',
    data
  })
}

export const trackingSalesReport = (data) => {
  return axios.request({
    url: 'api/salesReport/trackingSalesReport',
    method: 'post',
    data
  })
}

export const PSummarySalesReport = (data) => {
  return axios.request({
    url: 'api/salesReport/PSummarySalesReport',
    method: 'post',
    data
  })
}

export const summarySalesReport = (data) => {
  return axios.request({
    url: 'api/salesReport/summarySalesReport',
    method: 'post',
    data
  })
}

export const rankingSalesReport = (data) => {
  return axios.request({
    url: 'api/salesReport/rankingSalesReport',
    method: 'post',
    data
  })
}
