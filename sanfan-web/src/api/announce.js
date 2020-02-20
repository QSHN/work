import axios from '@/libs/api.request'

// 获取公告栏信息
export const getAnnounce = () => {
  return axios.request({
    url: `/office/information/getInformationList`,
    method: 'get'
  })
}

// 设置公告栏信息
export const setAnnounce = data => {
  return axios.request({
    url: `/office/information/information`,
    method: 'post',
    data: data
  })
}

// 删除公告
export const deleteAnnounce = id => {
  return axios.request({
    url: `/office/information/del/${id}`,
    method: 'delete'
  })
}
