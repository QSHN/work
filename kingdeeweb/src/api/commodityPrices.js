import axios from '@/libs/api.request'

// 创建/更新
export const commodityPricesUpdate = (data) => {
  return axios.request({
    url: 'api/commodityPrices/commodityPricesUpdate',
    method: 'post',
    data
  })
}

// 查询
export const commodityPricesQuery = (data) => {
  return axios.request({
    url: 'api/commodityPrices/commodityPricesQuery',
    method: 'post',
    data
  })
}

export const customerPricesUpdate = (data) => {
  return axios.request({
    url: 'api/commodityPrices/customerPricesUpdate',
    method: 'post',
    data
  })
}

export const customerPricesQuery = (data) => {
  return axios.request({
    url: 'api/commodityPrices/customerPricesQuery',
    method: 'post',
    data
  })
}

export const batchCustomerPrices = (data) => {
  return axios.request({
    url: 'api/commodityPrices/batchCustomerPrices',
    method: 'post',
    data
  })
}

export const strategyPricesUpdate = (data) => {
  return axios.request({
    url: 'api/commodityPrices/strategyPricesUpdate',
    method: 'post',
    data
  })
}

export const strategyPricesQuery = (data) => {
  return axios.request({
    url: 'api/commodityPrices/strategyPricesQuery',
    method: 'post',
    data
  })
}

export const commodityPricesHistory = (data) => {
  return axios.request({
    url: 'api/commodityPrices/commodityPricesHistory',
    method: 'post',
    data
  })
}
