import http from '../../vmeitime-http/interface.js'

//获取城市列表
export function getCityList() {
	return http.request({
		url: '/nursing-admin/oms/zone/zone/secondLevelZone',
		method: 'GET'
	})
}

//获取城市对应的机构列表
export function getOrgList(id) {
	return http.request({
		url: '/nursing-admin/oms/org/zone/' + id,
		method: 'GET'
	})
}

//获取不同区域的机构列表
export function getZoneOrg(address) {
	return http.request({
		url: '/nursing-admin/oms/org/zoneName',
		method: 'GET',
		data: address
	})
}


//获取所有的机构列表
export function getAllOrg() {
	return http.request({
		url: '/nursing-admin/oms/org?queryKey=is_service&queryValue=1&queryType=EQ',
		method: 'GET'
	})
}

//获取某机构某一个服务项目的护理服务和护理套餐
export function getServiceList(obj) {
	return http.request({
		url: '/nursing-admin/scms/service/org/applet',
		method: 'GET',
		data: obj
	})
}

//获取护理服务详情
export function getOrgServiceDetail(id) {
	return http.request({
		url: '/nursing-admin/scms/service/org/' + id,
		method: 'GET'
	})
}

//获取护理服务明细
export function getServiceDetail(id) {
	return http.request({
		url: '/nursing-admin/oms/service/' + id,
		method: 'GET'
	})
}

//获取套餐服务项明细
// export function getPackageDetail(id) {
// 	return http.request({
// 		url: '/nursing-admin/scms/service/org/item',
// 		method: 'GET',
// 		data: {
// 			size: 20,
// 			orgServiceId: id
// 		}
// 	})
// }

//获取服务套餐明细
export function getPackageDetail(id) {
	return http.request({
		url: '/nursing-admin/scms/service/org/item/detail',
		method: 'GET',
		data: {
			orgServiceId: id
		}
	})
}

// 根据服务 id 返回知情书内容
export function getInformedContent(id) {
	return http.request({
		url: '/nursing-admin//oms/informed/service/' + id,
		method: 'GET',
	})
}

// 随访系统根据机构id 获取所有科室
export function getOfficeName(id) {
	return http.request({
		url: '/nursing-admin/oms/office/ofOrg/' + id,
		method: 'GET',
	})
}

// 随访系统根据科室 id 获取所有医生姓名
export function getDoctorName(id) {
	return http.request({
		url: '/nursing-admin/oms/office/getStaff/' + id,
		method: 'GET',
	})
}


// 随访系统用户提交订单
export function submitOrder(obj) {
	return http.request({
   		url: '/nursing-admin/fup/bill/submit',
  		method: 'POST',
   		data: obj,
   		header: {
    		'content-type': 'application/json'
    		}
  })

}

