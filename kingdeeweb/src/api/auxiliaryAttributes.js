import axios from '@/libs/api.request'

// 创建/更新
export const updateAuxiliaryAttributes = (data) => {
  return axios.request({
    url: 'api/auxiliaryAttributes/updateAuxiliaryAttributes',
    method: 'post',
    data
  })
}

// 查询
export const queryAuxiliaryAttributes = (data) => {
  return axios.request({
    url: 'api/auxiliaryAttributes/queryAuxiliaryAttributes',
    method: 'post',
    data
  })
}

// 删除
export const batchAuxiliaryAttributes = (data) => {
  return axios.request({
    url: 'api/auxiliaryAttributes/batchAuxiliaryAttributes',
    method: 'delete',
    data
  })
}

// 创建/更新
export const updateAuxiliaryAttributesGroup = (data) => {
  return axios.request({
    url: 'api/auxiliaryAttributes/updateAuxiliaryAttributesGroup',
    method: 'post',
    data
  })
}

// 查询
export const queryAuxiliaryAttributesGroup = (data) => {
  return axios.request({
    url: 'api/auxiliaryAttributes/queryAuxiliaryAttributesGroup',
    method: 'post',
    data
  })
}

// 删除
export const deleteAuxiliaryAttributesGroup = (data) => {
  return axios.request({
    url: 'api/auxiliaryAttributes/deleteAuxiliaryAttributesGroup',
    method: 'delete',
    data
  })
}
