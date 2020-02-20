import axios from '@/libs/api.request'

// 创建/更新
export const formulaUpdate = (data) => {
  return axios.request({
    url: 'api/formula/formulaUpdate',
    method: 'post',
    data
  })
}

// 查询
export const formulaQuery = (data) => {
  return axios.request({
    url: 'api/formula/formulaQuery',
    method: 'post',
    data
  })
}

export const formulaDelete = (data) => {
  return axios.request({
    url: 'api/formula/formulaDelete',
    method: 'post',
    data
  })
}
