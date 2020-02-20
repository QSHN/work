import http from '../../vmeitime-http/interface.js'

//获取当前会员未开票订单列表
export function getNoInvoiceBills() {
	return http.request({
		url: '/nursing-admin/oms/invoice/currentVipNonInvoicedBills',
		method: 'GET'
	})
}

// //获取当前会员已开票订单列表
// export function getInvoiceBills() {
// 	return http.request({
// 		url: '/nursing-admin/oms/invoice/currentVipAlreadyInvoicedBills',
// 		method: 'GET'
// 	})
// }

//新增发票
export function createInvoice(obj,billIds) {
	return http.request({
		url: '/nursing-admin/oms/invoice/vip' + billIds,
		method: 'POST',
		data: obj
	})
}

//开具发票
export function submitInvoice(id) {
	return http.request({
		url: '/nursing-admin/oms/invoice/commit/' + id,
		method: 'PUT'
	})
}

//查询开票历史
export function getInvoiceList() {
	return http.request({
		// url: '/nursing-admin/oms/invoice/currentVipAlreadyInvoicedList',
		url: '/nursing-admin/oms/invoice/vip',
		method: 'GET'
	})
}

//获取已开具发票订单列表
export function getInvoiceBills(id) {
	return http.request({
		url: '/nursing-admin/oms/invoice/items/' + id,
		method: 'GET'
	})
}