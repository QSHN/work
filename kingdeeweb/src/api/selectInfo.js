import axios from '@/libs/api.request'

// 创建/更新
export const updateSelectInfo = (data) => {
  return axios.request({
    url: 'api/selectInfo/update',
    method: 'post',
    data
  })
}

// 查询
export const querySelectInfo = (data) => {
  return axios.request({
    url: 'api/selectInfo/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteSelectInfo = (data) => {
  return axios.request({
    url: 'api/selectInfo/delete',
    method: 'delete',
    data
  })
}
