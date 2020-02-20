import axios from '@/libs/api.request'

// 创建/更新
export const updateMeasureUnit = (data) => {
  return axios.request({
    url: 'api/measureUnit/updateUnit',
    method: 'post',
    data
  })
}

// 查询
export const queryMeasureUnit = (data) => {
  return axios.request({
    url: 'api/measureUnit/queryUnit',
    method: 'post',
    data
  })
}

// 删除
export const deleteMeasureUnit = (data) => {
  return axios.request({
    url: 'api/measureUnit/deleteUnit',
    method: 'delete',
    data
  })
}

// 创建/更新
export const updateMeasureUnitGroup = (data) => {
  return axios.request({
    url: 'api/measureUnit/updateUnitGroup',
    method: 'post',
    data
  })
}

// 查询
export const queryMeasureUnitGroup = (data) => {
  return axios.request({
    url: 'api/measureUnit/queryUnitGroup',
    method: 'post',
    data
  })
}

// 删除
export const deleteMeasureUnitGroup = (data) => {
  return axios.request({
    url: 'api/measureUnit/deleteUnitGroup',
    method: 'delete',
    data
  })
}
