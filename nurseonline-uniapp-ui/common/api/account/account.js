import http from '../../vmeitime-http/interface.js'

//修改用户信息
export function updateUserInfo(obj){
	return http.request({
		url: '/nursing-admin/oms/vip',
		method: 'PUT',
		data: obj
	})
}

//修改头像信息
export function updateAvatar(obj) {
	return http.request({
		url: '/nursing-upms/user/edit',
		method: 'PUT',
		data: obj
	})
}

//获取联系地址列表
export function getAddress() {
	return http.request({
		url: '/nursing-admin/oms/vipaddress/my',
		method: 'GET'
	})
}

//新增服务地址
export function createAddress(obj) {
// 	http.interceptor.request = (config) => {
// 		config.header = Object.assign({},config.header,{ 'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8' })
// 	}
	return http.request({
		url: '/nursing-admin/oms/vipaddress',
		method: 'POST',
		data: obj
	})
}

//删除服务地址
export function deleteAddress(id) {
	return http.request({
		url: '/nursing-admin/oms/vipaddress/' + id,
		method: 'DELETE'
	})
}

//编辑服务地址
export function updateAddress(obj) {
	return http.request({
		url: '/nursing-admin/oms/vipaddress',
		method: 'PUT',
		data: obj
	})
}

//获取实名认证信息
export function getVipCert() {
	return http.request({
		url: '/nursing-admin/oms/vipcert/isAuthentciated',
		method: 'GET'
	})
}

//获取实名认证校验规则
export function getCheckrule(type) {
	return http.request({
		url: '/nursing-admin/cert/checkrule/forcert?targetCode=vip&certType=' + type,
		method: 'GET'
	})
}


//提交实名认证信息
export function submitVipCert(obj) {
	return http.request({
		// url: '/nursing-admin/oms/vipcert/authenticate' + obj,
		url: '/nursing-admin/oms/vipcert/authenticate/message',
		method: 'POST',
		data: obj
	})
}

//获取区域树
export function getZoneTrees() {
	return http.request({
		url: '/nursing-admin/oms/zone/zone/trees',
		method: 'GET'
	})
}

//添加报警记录
export function sendMessage(obj) {
	return http.request({
		url: '/nursing-admin/oms/alarm/rec',
		method: 'POST',
		data: obj
	})
}