import axios from '@/libs/api.request'

// 创建/更新
export const updateFeeDiscount = (data) => {
  return axios.request({
    url: 'api/feeDiscount/updateFeeDiscount',
    method: 'post',
    data
  })
}

// 查询
export const queryFeeDiscount = (data) => {
  return axios.request({
    url: 'api/feeDiscount/queryFeeDiscount',
    method: 'post',
    data
  })
}
