import axios from '@/libs/api.request'

// 创建/更新
export const updateCommodityLabel = (data) => {
  return axios.request({
    url: 'api/commodityLabel/updateCommodityLabel',
    method: 'post',
    data
  })
}

// 查询
export const queryCommodityLabel = (data) => {
  return axios.request({
    url: 'api/commodityLabel/queryCommodityLabel',
    method: 'post',
    data
  })
}

// 删除
export const batchCommodityLabel = (data) => {
  return axios.request({
    url: 'api/commodityLabel/batchCommodityLabel',
    method: 'delete',
    data
  })
}

// 创建/更新
export const updateCommodityLabelGroup = (data) => {
  return axios.request({
    url: 'api/commodityLabel/updateCommodityLabelGroup',
    method: 'post',
    data
  })
}

// 查询
export const queryCommodityLabelGroup = (data) => {
  return axios.request({
    url: 'api/commodityLabel/queryCommodityLabelGroup',
    method: 'post',
    data
  })
}

// 删除
export const deleteCommodityLabelGroup = (data) => {
  return axios.request({
    url: 'api/commodityLabel/deleteCommodityLabelGroup',
    method: 'delete',
    data
  })
}
