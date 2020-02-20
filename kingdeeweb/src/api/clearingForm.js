import axios from '@/libs/api.request'

// 创建/更新
export const updateClearingForm = (data) => {
  return axios.request({
    url: 'api/clearingForm/clearingFormUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryClearingForm = (data) => {
  return axios.request({
    url: 'api/clearingForm/clearingFormQuery',
    method: 'post',
    data
  })
}

// 删除
export const deleteClearingForm = (data) => {
  return axios.request({
    url: 'api/clearingForm/clearingFormDelete',
    method: 'delete',
    data
  })
}
