import axios from '@/libs/api.request'
export const getCityData = () => {
  return axios.request({
    url: '/common/getCityData',
    method: 'get'
  })
}

export const getOssRole = () => {
  return axios.request({
    url: '/common/getOssRole',
    method: 'get'
  })
}
export const sendVercode = ({ code, phone }) => {
  return axios.request({
    url: '/common/sendVercode',
    method: 'post',
    data: { code, phone }
  })
}
