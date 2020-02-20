import axios from '@/libs/api.request'

// 获取部门模板内容
export const getReportTemp = id => {
  return axios.request({
    url: `office/dataReport/template/${id}`,
    method: 'get'
  })
}

// 设置部门模板内容
export const setReportTemp = data => {
  return axios.request({
    url: `/office/dataReport/template`,
    method: 'post',
    data: data
  })
}

// 获取汇报数据列表
/**
 * "pageNum": "页数",
   "pageSize":"每页数量",
   "searchStartDate": "2019-01-12",
   "searchEndDate": "2019-03-14"
 */
export const getReportData = data => {
  return axios.request({
    url: `/office/dataReport/myHistory`,
    method: 'post',
    data: data
  })
}

// 获取员工汇报列表
/**
 * "employeeId": "员工ID",
   "pageNum": "页数",
   "pageSize":"每页数量",
   "searchStartDate": "2019-01-12",
   "searchEndDate": "2019-03-14"
 */
export const getReportDataById = data => {
  return axios.request({
    url: `/office/dataReport/${data.employeeId ? 'employee/findByEmployee' : 'getDirectlyEmployeeReport'}`,
    method: 'post',
    data: data
  })
}

// 提交汇报
export const submitReport = data => {
  return axios.request({
    url: `/office/dataReport/submitReport`,
    method: 'post',
    data: data
  })
}

// 撤回汇报
export const recallReport = id => {
  return axios.request({
    url: `/office/dataReport/recall/${id}`,
    method: 'post'
  })
}

// 是否具有审核汇报权限
export const checkAuditReport = id => {
  return axios.request({
    url: `/office/dataReport/checkAuditPermission/${id}`,
    method: 'post'
  })
}

// 审核汇报
/**
 *"id": "id",
  "status": "CONFIRM：确认，REJECT：驳回",
  "remark": "备注、驳回原因等"
*/
export const auditReport = data => {
  return axios.request({
    url: `/office/dataReport/audit`,
    method: 'post',
    data: data
  })
}

// 获取统计图表
/**
 * "departmentId": "部门ID",
   "employeeId": "员工ID",
   "timeCycle": "周期  WEEK('近一周'), MONTH('近一月'),SEASON('近三月'), HALF_YEAR('近半月'),YEAR('近一月')"
 */

export const getReportChart = data => {
  return axios.request({
    url: `/office/dataReport/statistics`,
    method: 'post',
    data: data
  })
}
