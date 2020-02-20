import axios from '@/libs/api.request'
// GET /finace/bill 公司的所有单据
export const getBill = (params) => {
  return axios.request({
    url: '/finace/bill',
    method: 'get',
    params
  })
}
// POST /finace/bill 增加财务单据
export const postBill = (data) => {
  return axios.request({
    url: '/finace/bill',
    method: 'post',
    data
  })
}
// GET /finace/bill/chargetype 查询当前员工的记账方式
export const getChargetype = (params) => {
  return axios.request({
    url: '/finace/bill/chargetype',
    method: 'get',
    params
  })
}
// POST /finace/bill/chargetype 新增记账方式
export const postChargetype = (data) => {
  return axios.request({
    url: ' /finace/bill/chargetype',
    method: 'post',
    data
  })
}
// POST /finace/bill/myApprove 查询我待审批的财务审批列表
export const getMyApprove = (data) => {
  return axios.request({
    url: '/finace/bill/myApprove',
    method: 'post',
    data
  })
}
// POST /finace/bill/billList/{biztype} 查询公司财务单据列表(某类)
export const postBillListByBiztype = (data) => {
  return axios.request({
    url: '/finace/bill/billList/',
    method: 'post',
    data
  })
}
// POST /finace/bill/billList/{biztype}/export 导出公司财务单据列表(某类)
export const postExportByBiztype = (data) => {
  return axios.request({
    url: '/finace/bill/billList/export',
    method: 'get',
    data
  })
}
// POST /finace/bill/myLaunch 查询我发起的财务审批列表
export const getMyLaunch = (data) => {
  return axios.request({
    url: '/finace/bill/myLaunch',
    method: 'post',
    data
  })
}
// POST /finace/bill/process 财务单据处理(审批,撤回等)
export const postProcess = (data) => {
  return axios.request({
    url: '/finace/bill/process',
    method: 'post',
    data
  })
}
// POST /finace/bill/process/confirm 财务单据结果处理
export const postConfirm = (data) => {
  return axios.request({
    url: '/finace/bill/process/confirm',
    method: 'post',
    data
  })
}
// POST /finace/bill/search 查询财务单据列表(根据dto条件)
export const postSearch = (data) => {
  return axios.request({
    url: '/finace/bill/search',
    method: 'post',
    data
  })
}
// GET /finace/bill/sum/balance 查询当日公司总账
export const getBalance = (params) => {
  return axios.request({
    url: '/finace/bill/sum/balance',
    method: 'get',
    params
  })
}
// POST /finace/bill/sum/basesearch 查询总账列表(根据借贷标记/日期)
export const postBasesearch = (data) => {
  return axios.request({
    url: '/finace/bill/sum/basesearch',
    method: 'post',
    data
  })
}
// POST /finace/bill/sum/basesearch/export 查询总账列表(根据借贷标记/日期)
export const postExport = (data) => {
  return axios.request({
    url: '/finace/bill/sum/basesearch/export',
    method: 'post',
    data
  })
}
// POST /finace/bill/sum/search 查询总账列表(根据dto)
export const postSumSearch = (data) => {
  return axios.request({
    url: '/finace/bill/sum/search',
    method: 'post',
    data
  })
}
// GET /finace/bill/sum/{id} 查询总账列表(根据dto)
export const getSumById = (id, params) => {
  return axios.request({
    url: '/finace/bill/sum/' + id,
    method: 'get',
    params
  })
}
// GET /finace/bill/{id} 查询某财务单据(根据ID)
export const getBillById = (id, params) => {
  return axios.request({
    url: '/finace/bill/' + id,
    method: 'get',
    params
  })
}
export const getSalary = (id, params) => {
  return axios.request({
    url: '/finace/getSalary',
    method: 'get',
    params
  })
}

export const setSalary = (data) => {
  return axios.request({
    url: '/finace/setSalary',
    method: 'post',
    data
  })
}
