import axios from '@/libs/api.request'

export const getScore = data => {
  return axios.request({
    url: '/api/score',
    method: 'get',
    params: {
      q: JSON.stringify(data)
    }
  })
}

export const setScoreStatus = (id, data) => {
  return axios.request({
    url: '/api/score/scoreStatus/' + id,
    method: 'put',
    data: data
  })
}

export const delScoreStatus = (id) => {
  return axios.request({
    url: '/api/score/scoreRule/' + id,
    method: 'delete'
  })
}

export const setScoreRule = (data) => {
  return axios.request({
    url: '/api/score/scoreRule',
    method: 'post',
    data: data
  })
}

// get  /office/check/item/{module}
// 获取考核项列表(某模块)

export const getCheckItemModule = module => {
  return axios.request({
    url: '/office/check/item/' + module,
    method: 'get'
  })
}

// get  /office/check/modules
// 获取考核模块列表(编码和中文)

export const checkModules = params => {
  return axios.request({
    url: '/office/check/modules',
    method: 'get',
    params
  })
}

// post  /office/check/rule
// 新增考核规则

export const postCheckRule = data => {
  return axios.request({
    url: '/office/check/rule',
    method: 'post',
    data
  })
}

// post  /office/check/rule/search
// 考核规则搜索

export const postCheckRuleSearch = data => {
  return axios.request({
    url: '/office/check/rule/search',
    method: 'post',
    data
  })
}

// delete  /office/check/rule/{id}
// 删除考核规则

export const deleteCheckRuleById = (id) => {
  return axios.request({
    url: '/office/check/rule/' + id,
    method: 'delete'
  })
}

// get  /office/check/rule/{id}
// 查询考核规则详情

export const getCheckRule = (id, data) => {
  return axios.request({
    url: '/office/check/rule/' + id,
    method: 'get',
    data
  })
}

// get  /office/check/score
// 获取某人某月的考核分数

export const getCheckScore = (params) => {
  return axios.request({
    url: '/office/check/score',
    method: 'get',
    params
  })
}

// post  /office/check/score/detail
// 新增一条考核分数

export const getCheckScoreDetail = (data) => {
  return axios.request({
    url: '/office/check/score/detail',
    method: 'post',
    data
  })
}

// get  /office/check/score/{id}
// 获取考核分数详情

export const getCheckScoreById = (id, params) => {
  return axios.request({
    url: '/office/check/score/' + id,
    method: 'get',
    params
  })
}

// post  /office/check/score/{id}/process
// 考核分数处理(撤销/恢复)

export const postCheckScoreProcessById = (id, data) => {
  return axios.request({
    url: '/office/check/score/' + id + '/process',
    method: 'post',
    data
  })
}

// post  /office/check/score/search
// 查询考核分数列表

export const postCheckScoreSearch = (data) => {
  return axios.request({
    url: '/office/check/score/search',
    method: 'post',
    data
  })
}

// post  /office/check/score/sum
// 查询考核分数汇总

export const postCheckScoreSum = (data) => {
  return axios.request({
    url: '/office/check/score/sum',
    method: 'post',
    data
  })
}
