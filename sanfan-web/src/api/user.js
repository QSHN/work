import axios from '@/libs/api.request'

export const login = ({ userName, password, companyId }) => {
  let phone = userName
  const data = {
    phone,
    password
  }
  if (companyId)data.companyId = companyId
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
