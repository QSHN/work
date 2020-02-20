import http from '../../vmeitime-http/interface.js'

// const vipInfo = uni.getStorageSync('vip_info')
const getVipInfo = () => {
	return uni.getStorageSync('vip_info')
}

//获取服务工单列表
export function getFollowUpBillList(obj) {
	let vipInfo = getVipInfo()
	return http.request({
		url: '/nursing-admin/fup/bill/billByVip',
		method: 'GET',
		data: Object.assign({},obj,{
			vipId: vipInfo.vipId,
		})
	})
}

//查看服务工单详情
export function getFollowUpDetail(id) {
	return http.request({
		url: '/nursing-admin/fup/bill/' + id,
		method: 'GET'
	})
}

//撤销服务工单
export function cancelFollowUpBill(id) {
	let vipInfo = getVipInfo()
	
	return http.request({
		url: '/nursing-admin/fup/bill/cancel?billId=' + id + '&userId=' + vipInfo.userId + '&vipId=' + vipInfo.vipId,
		method: 'PUT'
	})
}

//服务工单确认
export function confirmFollowUpBill(id) {
	let vipInfo = getVipInfo()
	
	return http.request({
		url: '/nursing-admin/fup/bill/confirm?billId=' + id + '&userId=' + vipInfo.userId + '&vipId=' + vipInfo.vipId,
		method: 'PUT'
	})
}

//获取预约单列表
export function getBillTaskList(obj) {
	let vipInfo = getVipInfo()
	
	return http.request({
		url: '/nursing-admin/billtask/billTaskViewPageByVip',
		method: 'GET',
		data: Object.assign({},obj,{
			vipId: vipInfo.vipId,
			taskDateOrder: 'desc'
		})
	})
}

//新建服务工单预约
export function createBillTask(id) {
	return http.request({
		url: '/nursing-admin/billtask/newBillTaskPost/' + id,
		method: 'GET'
	})
}

//提交服务工单预约
export function submitBillTask(obj) {
	let vipInfo = getVipInfo()
	obj = obj + '&userId=' + vipInfo.userId
	
	return http.request({
		url: '/nursing-admin/billtask/submit' + obj,
		method: 'PUT',
		// data: obj
	})
}

//预约单确认已被服务
export function confirmBillTask(id) {
	let vipInfo = getVipInfo()
	
	return http.request({
		url: '/nursing-admin/billtask/confirm?vipId=' + vipInfo.vipId + '&userId=' + vipInfo.userId + '&taskId=' + id,
		method: 'PUT'
	})
}

//取消预约
export function cancelBillTask(id) {
	let vipInfo = getVipInfo()
	
	return http.request({
		url: '/nursing-admin/billtask/cancelTask?vipId=' + vipInfo.vipId + '&userId=' + vipInfo.userId + '&taskId=' + id,
		method: 'PUT'
	})
}

//查看预约工单详情
export function getBillTaskDetail(id) {
	return http.request({
		url: '/nursing-admin/billtask/' + id,
		method: 'GET'
	})
}

//查看预约工单详情(可以自定义、简化)
export function getBillTaskView(id) {
	return http.request({
		url: '/nursing-admin/billtask/billTaskView/' + id,
		method: 'GET'
	})
}

//工单支付
export function followUpBillPay(obj) {
	return http.request({
		url: '/nursing-admin/fup/bill/payment',
		method: 'POST',
		data: obj
	})
}

//获取预约单任务跟踪信息
export function getTrackLists(id) {
	return http.request({
		url: '/nursing-admin/fup/billtrack/' + id,
		method: 'GET'
	})
}

//获取订单评价
export function getBillRate(id) {
	return http.request({
		url: '/nursing-admin/oms/bill/review/billId/' + id,
		method: 'GET'
	})
}

//订单评价
export function submitBillRate(obj) {
	let vipInfo = getVipInfo()
	
	obj = Object.assign({},obj,{
		userId: vipInfo.userId,
		userName: vipInfo.userName
	})
	
	return http.request({
		url: '/nursing-admin/oms/bill/review',
		method: 'POST',
		data: obj
	})
}

//查看就医证明
export function getBillCerts(id) {
	return http.request({
		url: '/nursing-admin/bill/billcerts?billId=' + id,
		method: 'GET'
	})
}

//获取出诊费和保险费
export function getPrice(id) {
	return http.request({
		url: '/nursing-admin/oms/orgparam/commonParamsByOrg?orgId=' + id,
		method: 'GET'
	})
}

//获取订单倒计时时间
export function getTime(id) {
	return http.request({
		url: '/nursing-admin/bill/getunpaidbillexpiretime?billId=' + id,
		method: 'GET'
	})
}