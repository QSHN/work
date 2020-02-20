import axios from '@/libs/api.request'

// 创建/更新
export const updateBank = (data) => {
  return axios.request({
    url: 'api/bank/update',
    method: 'post',
    data
  })
}

// 查询
export const queryBank = (data) => {
  return axios.request({
    url: 'api/bank/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteBank = (data) => {
  return axios.request({
    url: 'api/bank/delete',
    method: 'delete',
    data
  })
}
