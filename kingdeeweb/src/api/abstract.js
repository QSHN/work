import axios from '@/libs/api.request'

// 创建/更新
export const updateAbstract = (data) => {
  return axios.request({
    url: 'api/abstract/update',
    method: 'post',
    data
  })
}

// 查询
export const queryAbstract = (data) => {
  return axios.request({
    url: 'api/abstract/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteAbstract = (data) => {
  return axios.request({
    url: 'api/abstract/delete',
    method: 'delete',
    data
  })
}
