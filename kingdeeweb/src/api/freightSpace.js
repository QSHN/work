import axios from '@/libs/api.request'

// 创建/更新
export const updateFreightSpace = (data) => {
  return axios.request({
    url: 'api/FreightSpace/space/update',
    method: 'post',
    data
  })
}

// 查询
export const queryFreightSpace = (data) => {
  return axios.request({
    url: 'api/FreightSpace/space/query',
    method: 'post',
    data
  })
}

// 创建/更新
export const updateFreightSpaceGroup = (data) => {
  return axios.request({
    url: 'api/FreightSpace/group/update',
    method: 'post',
    data
  })
}

// 查询
export const queryFreightSpaceGroup = (data) => {
  return axios.request({
    url: 'api/FreightSpace/group/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteFreightSpaceGroup = (data) => {
  return axios.request({
    url: 'api/FreightSpace/group/delete',
    method: 'delete',
    data
  })
}
