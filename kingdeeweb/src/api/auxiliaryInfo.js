import axios from '@/libs/api.request'

// 创建/更新
export const updateAuxiliaryInfo = (data) => {
  return axios.request({
    url: 'api/auxiliaryInfo/updateAuxiliaryInfo',
    method: 'post',
    data
  })
}

// 查询
export const queryAuxiliaryInfo = (data) => {
  return axios.request({
    url: 'api/auxiliaryInfo/queryAuxiliaryInfo',
    method: 'post',
    data
  })
}

// 删除
export const batchAuxiliaryInfo = (data) => {
  return axios.request({
    url: 'api/auxiliaryInfo/batchAuxiliaryInfo',
    method: 'delete',
    data
  })
}

// 创建/更新
export const updateAuxiliaryInfoGroup = (data) => {
  return axios.request({
    url: 'api/auxiliaryInfo/updateAuxiliaryInfoGroup',
    method: 'post',
    data
  })
}

// 查询
export const queryAuxiliaryInfoGroup = (data) => {
  return axios.request({
    url: 'api/auxiliaryInfo/queryAuxiliaryInfoGroup',
    method: 'post',
    data
  })
}

// 删除
export const deleteAuxiliaryInfoGroup = (data) => {
  return axios.request({
    url: 'api/auxiliaryInfo/deleteAuxiliaryInfoGroup',
    method: 'delete',
    data
  })
}
