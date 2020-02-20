import axios from '@/libs/api.request'

// 修改模板
export const updateTemplate = (data) => {
  return axios.request({
    url: 'api/automaticTransfer/updateTemplate',
    method: 'post',
    data
  })
}

// 查询
export const queryTemplate = (data) => {
  return axios.request({
    url: 'api/automaticTransfer/queryTemplate',
    method: 'post',
    data
  })
}
