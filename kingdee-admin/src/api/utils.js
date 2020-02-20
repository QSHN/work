import axios from '@/libs/api.request'

export const getOssRole = () => {
  return axios.request({
    url: 'api/utils/ossrole',
    method: 'get'
  })
}
