import axios from '@/libs/api.request'

// 查询部门客户信息
/**
 * "clientGroup": "客户分组,客户:CLIENT;商家:MERCHANT,(必须的属性)"
 */
export const getDepartmentClient = data => {
  return axios.request({
    url: `/client/getDepartmentClient`,
    method: 'post',
    data: data
  })
}

// 查询个人私有客户信息
/**
 * "clientGroup": "客户分组,客户:CLIENT;商家:MERCHANT,(必须的属性)"
 */
export const getMyClient = data => {
  return axios.request({
    url: `/client/getMyClient`,
    method: 'post',
    data: data
  })
}

// 通过员工id获取其私有客户
/**
 * "belongToWhoID": "40288012696a519f01696bb12f2a0001(员工id)",
 * "clientGroup": "客户或商家;客户:CLIENT;商家:MERCHANT"
 */
export const getDirectlyClient = data => {
  return axios.request({
    url: `/client/directly`,
    method: 'post',
    data: data
  })
}

// 新增/修改客户
export const setClient = data => {
  return axios.request({
    url: `/client/${data.id ? 'update' : 'add'}`,
    method: `${data.id ? 'put' : 'post'}`,
    data: data
  })
}

// 删除客户信息
export const deleteClient = id => {
  return axios.request({
    url: `/client/${id}`,
    method: `delete`
  })
}

// 查询客户信息
export const getClient = data => {
  return axios.request({
    url: `/client`,
    method: `post`,
    data: data
  })
}

// 拜访设置
/**
 * "id": "设置id,id不为空时需要传该参数",
   "conversationTime": "电话拜访通话时间不少于该项(通话时长/分钟)",
   "visitingContentLong": "拜访内容字数不少于该项(字数/个)",
   "photoListLong": "拜访图片不少于该项(张数/张)",
   "visitingReportRequest": "是否需要填写拜访报告(true/false)",
   "visitingResultLong": "拜访报告字数(字数/个)"
 */
export const updateVisitSetting = data => {
  return axios.request({
    url: `/client/visiting/setting`,
    method: `put`,
    data: data
  })
}

// 获取拜访设置信息
export const getVisitSetting = () => {
  return axios.request({
    url: `/client/visiting/setting`,
    method: `get`
  })
}

// 添加拜访信息
export const addVisiting = data => {
  return axios.request({
    url: `/client/visiting`,
    method: `post`,
    data: data
  })
}

// 拜访图表
/**
  "clientVisitingTimeCycle": "统计周期:(近一周:WEEK;近一月:MONTH;近三月:THREE_MONTH;近半年:HALF_YEAR;近一年:YEAR)，必填",
  "clientVisitingType": "拜访方式(电话:TEL;走访:INTERVIEW)，必填",
  "departmentId": "部门id,(部门id和员工id都不填就是获取公司的拜访统计,填部门id则获取部门的拜访统计,填员工id则获取员工的拜访统计)",
  "employeeId": "员工id,(部门id和员工id都不填就是获取公司的拜访统计,填部门id则获取部门的拜访统计,填员工id则获取员工的拜访统计)"
 */
export const getVisitChart = data => {
  return axios.request({
    url: `/client/visiting/count`,
    method: `post`,
    data: data
  })
}

// 查询拜访信息
/**
 * "id":"拜访id，通过这个参数查询单个拜访记录的详情",
 "assignerId": "通过拜访任务指派人id查询",
 "clientGroup": "通过客户分组查询(客户:CLIENT;商家:MERCHANT)",
 "clientId": "通过客户id查询",
 "clientLinkmanId": "通过客户联系人id查询",
 "clientTypeId":"客户类型id，对应Client对象的typeId属性",
 "clientVisitingStatus": "通过拜访状态查询(已创建:CREATED;已完成:VISITED;已取消:CANCELED)",
 "createTime": "2019-03-18,通过创建时间查询,精确到日期",
 "deadline": "2019-03-18,通过截止日期查询",
 "visitorid": "通过拜访人id查询"
 */
export const getVisit = data => {
  return axios.request({
    url: `/client/visiting/search`,
    method: `post`,
    data: data
  })
}

// 取消拜访
export const deleteVisit = id => {
  return axios.request({
    url: `/client/visiting/${id}`,
    method: `DELETE`
  })
}
