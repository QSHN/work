import axios from '@/libs/api.request'

// 创建/更新
export const queryAllList = (data) => {
  return axios.request({
    url: 'api/home/queryAllList',
    method: 'post',
    data
  })
}
