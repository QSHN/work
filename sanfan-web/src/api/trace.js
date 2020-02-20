import axios from '@/libs/api.request'

export const getTrace = data => {
  return axios.request({
    url: '/api/trace',
    method: 'get',
    params: {
      q: JSON.stringify(data)
    }
  })
}
export const getTraceCurrent = data => {
  return axios.request({
    url: '/api/trace/current',
    method: 'get',
    params: {
      q: JSON.stringify(data)
    }
  })
}
