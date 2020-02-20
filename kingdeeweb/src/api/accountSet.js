import axios from '@/libs/api.request'

// 创建/更新/启用/停用账套
export const updateAccountSet = (data) => {
  return axios.request({
    url: 'api/accountSet/update',
    method: 'post',
    data
  })
}

// 查询账套
export const queryAccountSet = (data) => {
  return axios.request({
    url: 'api/accountSet/query',
    method: 'post',
    data
  })
}
