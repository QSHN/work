import http from '../../vmeitime-http/interface.js'

//获取服务对象列表
export function getCustList() {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust',
		method: 'GET'
	})
}

//删除服务对象
export function unbindCust(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/unbindCust',
		method: 'POST',
		data: obj
	})
}

//获取亲戚关系列表
export function getRelationTypes() {
	return http.request({
		url: '/nursing-admin/oms/aid/items/class/relation_type',
		method: 'GET'
	})
}

//创建服务对象
export function createCust(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust',
		method: 'POST',
		data: obj
	})
}

//向服务对象拥有者发送验证码
export function sendOwnerCode(id) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/sendAuthVerifCode',
		method: 'POST',
		data: {
			vipId : id
		}
	})
}

//绑定已存在的服务对象
export function bindCust(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/bindCust',
		method: 'POST',
		data: obj
	})
}

//维护服务对象的基本信息、详细信息
export function editCustBasic(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust',
		method: 'PUT',
		data: obj
	})
}

//获取服务对象健康信息
export function getCustDetail(id) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/detail',
		method: 'GET',
		data: {
			custId: id
		}
	})
}

//新增服务对象健康信息
export function createCustDetail(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/detail',
		method: 'POST',
		data: obj
	})
}

//编辑服务对象健康信息
export function editCustDetail(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/detail',
		method: 'PUT',
		data: obj
	})
}

//获取服务对象就诊信息
export function getCustTreatrec(id) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/treatrec',
		method: 'GET',
		data: {
			custId: id
		}
	})
}

//新增服务对象就诊信息
export function createCustTreatrec(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/treatrec',
		method: 'POST',
		data: obj
	})
}

//编辑服务对象就诊信息
export function editCustTreatrec(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/treatrec',
		method: 'PUT',
		data: obj
	})
}

//获取资质类型
export function getCustCertType() {
	return http.request({
		url: '/nursing-admin/cert/checkrule',
		method: 'GET',
		data: {
			targetCode: 'cust',
			targetType: 0
		}
	})
}

//获取服务对象资质信息
export function getCustCert(id) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/cert',
		method: 'GET',
		data: {
			custId: id
		}
	})
}

//新增服务对象资质信息
export function createCustCert(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/cert',
		method: 'POST',
		data: obj
	})
}

//编辑服务对象资质信息
export function editCustCert(obj) {
	return http.request({
		url: '/nursing-admin/vcs/vip/cust/cert',
		method: 'PUT',
		data: obj
	})
}

//获取民族列表
export function getNationList() {
	return http.request({
		url: '/nursing-admin/oms/aid/items/class/nation',
		method: 'GET'
	})
}

//获取医院列表
export function getHospitalList() {
	return http.request({
		url: '/nursing-admin/oms/org?queryKey=org_type&queryValue=0&queryType=EQ',
		method: 'GET'
	})
}

//获取医院的所有部门
export function getDeptList(id) {
	return http.request({
		url: '/nursing-admin/oms/org/dept',
		method: 'GET',
		data: {
			orgId: id
		}
	})
}