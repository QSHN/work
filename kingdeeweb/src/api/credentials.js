import axios from '@/libs/api.request'

// 创建/更新
export const updateCredentials = (data) => {
  return axios.request({
    url: 'api/credentials/update',
    method: 'post',
    data
  })
}

// 查询
export const queryCredentials = (data) => {
  return axios.request({
    url: 'api/credentials/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteCredentials = (data) => {
  return axios.request({
    url: 'api/credentials/delete',
    method: 'delete',
    data
  })
}

// 查询最后一条信息
export const queryLastCredentials = (data) => {
  return axios.request({
    url: 'api/credentials/queryLastInfo',
    method: 'post',
    data
  })
}

// 过账
export const credentialsPost = (data) => {
  return axios.request({
    url: 'api/credentials/credentialsPost',
    method: 'post',
    data
  })
}

// 查询科目明细账
export const credentialsSubject = (data) => {
  return axios.request({
    url: 'api/credentials/credentialsSubject',
    method: 'post',
    data
  })
}

// 查询总分类账
export const generalLedger = (data) => {
  return axios.request({
    url: 'api/credentials/generalLedger',
    method: 'post',
    data
  })
}

// 查询核算项目分类总账
export const allAccounting = (data) => {
  return axios.request({
    url: 'api/credentials/allAccounting',
    method: 'post',
    data
  })
}

// 查询数量金额总账
export const numberAccounting = (data) => {
  return axios.request({
    url: 'api/credentials/numberAccounting',
    method: 'post',
    data
  })
}

// 查询日报表
export const dailyReport = (data) => {
  return axios.request({
    url: 'api/credentials/dailyReport',
    method: 'post',
    data
  })
}

// 摘要汇总表
export const abstractQuery = (data) => {
  return axios.request({
    url: 'api/credentials/abstractQuery',
    method: 'post',
    data
  })
}

// 核算项目余额表
export const accountingItemBalance = (data) => {
  return axios.request({
    url: 'api/credentials/accountingItemBalance',
    method: 'post',
    data
  })
}

// 核算项目明细表
export const accountingItemDetail = (data) => {
  return axios.request({
    url: 'api/credentials/accountingItemDetail',
    method: 'post',
    data
  })
}

// 核算项目汇总表
export const accountingItemSummary = (data) => {
  return axios.request({
    url: 'api/credentials/accountingItemSummary',
    method: 'post',
    data
  })
}

// 核算项目汇总表
export const accountingItemCombination = (data) => {
  return axios.request({
    url: 'api/credentials/accountingItemCombination',
    method: 'post',
    data
  })
}

// 核算项目科目组合表
export const accountingItemSubject = (data) => {
  return axios.request({
    url: 'api/credentials/accountingItemSubject',
    method: 'post',
    data
  })
}

// 期末核算
export const finalTuning = (data) => {
  return axios.request({
    url: 'api/credentials/finalTuning',
    method: 'post',
    data
  })
}

// 调汇历史
export const finalTuningHistory = (data) => {
  return axios.request({
    url: 'api/credentials/finalTuningHistory',
    method: 'post',
    data
  })
}

// 科目记息
export const interest = (data) => {
  return axios.request({
    url: 'api/credentials/interest',
    method: 'post',
    data
  })
}

// 结转损益
export const carrForward = (data) => {
  return axios.request({
    url: 'api/credentials/carrForward',
    method: 'post',
    data
  })
}

// 期末结账
export const invoicing = (data) => {
  return axios.request({
    url: 'api/credentials/invoicing',
    method: 'post',
    data
  })
}

// 自动转账
export const automaticTransfer = (data) => {
  return axios.request({
    url: 'api/credentials/automaticTransfer',
    method: 'post',
    data
  })
}

// 多栏账
export const moreColumn = (data) => {
  return axios.request({
    url: 'api/credentials/moreColumn',
    method: 'post',
    data
  })
}

// 反过账
export const credentialsUnPost = (data) => {
  return axios.request({
    url: 'api/credentials/credentialsUnPost',
    method: 'post',
    data
  })
}

// 处理断号凭证
export const credentialsBroken = (data) => {
  return axios.request({
    url: 'api/credentials/credentialsBroken',
    method: 'post',
    data
  })
}

// 成批审核凭证
export const credentialsListUpdate = (data) => {
  return axios.request({
    url: 'api/credentials/credentialsListUpdate',
    method: 'post',
    data
  })
}
