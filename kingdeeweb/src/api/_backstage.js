import axios from '@/libs/api.request'

// 查询公司信息
export const queryCompany = (data) => {
  return axios.request({
    url: 'api/_backstage/queryClient',
    method: 'post',
    data
  })
}
