import axios from '@/libs/api.request'
// 查询
export const funPermissionQuery = (data) => {
  return axios.request({
    url: 'api/funPermission/funPermissionQuery',
    method: 'post',
    data
  })
}
