import axios from '@/libs/api.request'

// 创建/更新
export const updateBankAccount = (data) => {
  return axios.request({
    url: 'api/bankAccount/bankAccountUpdate',
    method: 'post',
    data
  })
}

// 查询
export const queryBankAccount = (data) => {
  return axios.request({
    url: 'api/bankAccount/bankAccountQuery',
    method: 'post',
    data
  })
}

// 删除
export const batchBankAccount = (data) => {
  return axios.request({
    url: 'api/bankAccount/batchBankAccount',
    method: 'delete',
    data
  })
}

export const bankAccountUpdateSubject = (data) => {
  return axios.request({
    url: 'api/bankAccount/bankAccountUpdateSubject',
    method: 'post',
    data
  })
}
