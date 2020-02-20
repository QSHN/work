import axios from '@/libs/api.request'

// 创建/更新
export const updateCost = (data) => {
  return axios.request({
    url: 'api/cost/update',
    method: 'post',
    data
  })
}

// 查询
export const queryCost = (data) => {
  return axios.request({
    url: 'api/cost/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteCost = (data) => {
  return axios.request({
    url: 'api/cost/delete',
    method: 'delete',
    data
  })
}
