import axios from '@/libs/api.request'

// 创建/更新
export const processTracking = (data) => {
  return axios.request({
    url: 'api/processTracking/processTracking',
    method: 'post',
    data
  })
}
