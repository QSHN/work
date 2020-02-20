import axios from '@/libs/api.request'

// 创建/更新
export const updateSupplier = (data) => {
  return axios.request({
    url: 'api/supplier/supplierUpdate',
    method: 'post',
    data
  })
}

// 查询
export const querySupplier = (data) => {
  return axios.request({
    url: 'api/supplier/supplierQuery',
    method: 'post',
    data
  })
}

// 删除
export const batchSupplier = (data) => {
  return axios.request({
    url: 'api/supplier/batchSupplier',
    method: 'post',
    data
  })
}

// 创建/更新
export const updateSupplierGroup = (data) => {
  return axios.request({
    url: 'api/supplier/supplierGroupUpdate',
    method: 'post',
    data
  })
}

// 查询
export const querySupplierGroup = (data) => {
  return axios.request({
    url: 'api/supplier/supplierGroupQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteSupplierGroup = (data) => {
  return axios.request({
    url: 'api/supplier/supplierGroupDelete',
    method: 'delete',
    data
  })
}

export const supplierUpdateSubject = (data) => {
  return axios.request({
    url: 'api/supplier/supplierUpdateSubject',
    method: 'post',
    data
  })
}
