import axios from '../libs/api.request'

export const getEnterpriseComboList = (params) => {
  return axios.request({
    url: '/trade/enterpriseCombo/getEnterpriseComboList',
    params,
    method: 'get'
  })
}

export const getEnterprisePrice = (params) => {
  return axios.request({
    url: '/trade/enterpriseCombo/getEnterprisePrice',
    params,
    method: 'get'
  })
}

export const createOrder = (data) => {
  return axios.request({
    url: '/trade/order/createOrder',
    data,
    method: 'post'
  })
}

export const createAddUserOrder = (params) => {
  return axios.request({
    url: '/trade/order/createAddUserOrder',
    params,
    method: 'get'
  })
}

export const orderNo = (orderNo) => {
  return axios.request({
    url: '/trade/order/status/' + orderNo,
    method: 'get'
  })
}
