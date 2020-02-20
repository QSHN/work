import axios from '@/libs/api.request'

// 创建/更新
export const updateCustomer = (data) => {
  return axios.request({
    url: 'api/customer/customerUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryCustomer = (data) => {
  return axios.request({
    url: 'api/customer/customerQuery',
    method: 'post',
    data
  })
}

// 批量
export const batchCustomer = (data) => {
  return axios.request({
    url: 'api/customer/batchCustomer',
    method: 'post',
    data
  })
}

// 创建/更新
export const updateCustomerGroup = (data) => {
  return axios.request({
    url: 'api/customer/customerGroupUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryCustomerGroup = (data) => {
  return axios.request({
    url: 'api/customer/customerGroupQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteCustomerGroup = (data) => {
  return axios.request({
    url: 'api/customer/customerGroupDelete',
    method: 'delete',
    data
  })
}

export const customerUpdateSubject = (data) => {
  return axios.request({
    url: 'api/customer/customerUpdateSubject',
    method: 'post',
    data
  })
}
