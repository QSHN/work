import axios from '@/libs/api.request'

// 创建/更新
export const updateProofWords = (data) => {
  return axios.request({
    url: 'api/proofWords/proofWordsUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryProofWords = (data) => {
  return axios.request({
    url: 'api/proofWords/proofWordsQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteProofWords = (data) => {
  return axios.request({
    url: 'api/proofWords/deleteProofWords',
    method: 'delete',
    data
  })
}
