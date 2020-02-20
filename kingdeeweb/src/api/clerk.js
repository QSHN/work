import axios from '@/libs/api.request'

// 创建/更新
export const updateClerk = (data) => {
  return axios.request({
    url: 'api/clerk/clerkUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryClerk = (data) => {
  return axios.request({
    url: 'api/clerk/clerkQuery',
    method: 'post',
    data
  })
}

// 删除
export const batchClerk = (data) => {
  return axios.request({
    url: 'api/clerk/batchClerk',
    method: 'post',
    data
  })
}
