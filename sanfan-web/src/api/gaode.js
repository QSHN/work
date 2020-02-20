import axios from '@/libs/api.request'
// GET /finace/saveTrid 公司的所有单据
export const saveTrid = (id) => {
  return axios.requestById({
    url: '/office/gaode/saveTrid/' + id,
    method: 'get',
    params
  })
}
export const getTridsById = (id) => {
  return axios.request({
    url: ' /office/gaode/getTrids/' + id,
    method: 'get',
    params
  })
}
export const getTrids = (data) => {
  return axios.request({
    url: '/office/gaode/getTrids',
    method: 'post',
    data
  })
}
export const lastpoint = (data) => {
  return axios.request({
    url: '/office/gaode/lastpoint',
    method: 'post',
    data
  })
}

export const trsearch = (data) => {
  return axios.request({
    url: '/office/gaode/trsearch',
    method: 'post',
    data
  })
}
