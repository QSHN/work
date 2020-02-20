import axios from '@/libs/api.request'

// 创建/更新
export const updateCommodityBrand = (data) => {
  return axios.request({
    url: 'api/commodityBrand/updateCommodityBrand',
    method: 'post',
    data
  })
}

// 查询
export const queryCommodityBrand = (data) => {
  return axios.request({
    url: 'api/commodityBrand/queryCommodityBrand',
    method: 'post',
    data
  })
}

// 删除
export const batchCommodityBrand = (data) => {
  return axios.request({
    url: 'api/commodityBrand/batchCommodityBrand',
    method: 'delete',
    data
  })
}

// 创建/更新
export const updateCommodityBrandGroup = (data) => {
  return axios.request({
    url: 'api/commodityBrand/updateCommodityBrandGroup',
    method: 'post',
    data
  })
}

// 查询
export const queryCommodityBrandGroup = (data) => {
  return axios.request({
    url: 'api/commodityBrand/queryCommodityBrandGroup',
    method: 'post',
    data
  })
}

// 删除
export const deleteCommodityBrandGroup = (data) => {
  return axios.request({
    url: 'api/commodityBrand/deleteCommodityBrandGroup',
    method: 'delete',
    data
  })
}
