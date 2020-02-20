import axios from '@/libs/api.request'

// 创建/更新
export const updateCommodityInfo = (data) => {
  return axios.request({
    url: 'api/commodityInfo/commodityInfoUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryCommodityInfo = (data) => {
  return axios.request({
    url: 'api/commodityInfo/commodityInfoQuery',
    method: 'post',
    data
  })
}

export const queryCommodityInfoAndDetail = (data) => {
  return axios.request({
    url: 'api/commodityInfo/queryCommodityInfoAndDetail',
    method: 'post',
    data
  })
}

// 批量
export const batchCommodityInfo = (data) => {
  return axios.request({
    url: 'api/commodityInfo/batchCommodityInfo',
    method: 'post',
    data
  })
}

// 创建/更新
export const updateCommodityInfoGroup = (data) => {
  return axios.request({
    url: 'api/commodityInfo/commodityInfoGroupUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryCommodityInfoGroup = (data) => {
  return axios.request({
    url: 'api/commodityInfo/commodityInfoGroupQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteCommodityInfoGroup = (data) => {
  return axios.request({
    url: 'api/commodityInfo/commodityInfoGroupDelete',
    method: 'delete',
    data
  })
}

export const commodityInfoUpdateSubject = (data) => {
  return axios.request({
    url: 'api/commodityInfo/commodityInfoUpdateSubject',
    method: 'post',
    data
  })
}
