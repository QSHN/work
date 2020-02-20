import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/nursing/oms/informed/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/oms/informed',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/oms/informed/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/oms/informed/' + id,
    method: 'delete',
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/oms/informed',
    method: 'put',
    data: obj
  })
}
