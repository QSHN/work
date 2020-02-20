import axios from '@/libs/api.request'

// 创建/更新
export const updateCommodityInventory = (data) => {
  return axios.request({
    url: 'api/CommodityInventory/updateCommodityInventory',
    method: 'post',
    data
  })
}

// 查询
export const queryCommodityInventory = (data) => {
  return axios.request({
    url: 'api/CommodityInventory/queryCommodityInventory',
    method: 'post',
    data
  })
}

// 删除
export const batchCommodityInventory = (data) => {
  return axios.request({
    url: 'api/CommodityInventory/batchCommodityInventory',
    method: 'post',
    data
  })
}
