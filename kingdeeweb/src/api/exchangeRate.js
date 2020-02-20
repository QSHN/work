import axios from '@/libs/api.request'

// 创建/更新
export const updateExchangeRateType = (data) => {
  return axios.request({
    url: 'api/exchangeRate/type/update',
    method: 'post',
    data
  })
}

// 查询
export const queryExchangeRateType = (data) => {
  return axios.request({
    url: 'api/exchangeRate/type/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteExchangeRateType = (data) => {
  return axios.request({
    url: 'api/exchangeRate/type/delete',
    method: 'delete',
    data
  })
}

// 创建/更新
export const updateExchangeRate = (data) => {
  return axios.request({
    url: 'api/exchangeRate/rate/update',
    method: 'post',
    data
  })
}

// 查询
export const queryExchangeRate = (data) => {
  return axios.request({
    url: 'api/exchangeRate/rate/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteExchangeRate = (data) => {
  return axios.request({
    url: 'api/exchangeRate/rate/delete',
    method: 'delete',
    data
  })
}
