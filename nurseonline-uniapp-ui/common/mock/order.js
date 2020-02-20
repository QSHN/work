const orders = [
	{
		orderId: '1902270001',
		status: 0,
		type: '待付款',
		service: '普通伤口护理',
		hospital: '广东医科大学附属医院',
		serviceTime: '2019年5月7日 10：00-11：00',
		createTime: '2019年4月14日',
		total: 109
	},
	{
		orderId: '1902280001',
		status: 1,
		type: '待服务',
		service: '压疮护理',
		hospital: '广东医科大学附属医院',
		serviceTime: '2019年4月20日 10：00-11：00',
		createTime: '2019年4月7日',
		total: 109
	},
	{
		orderId: '1902280001',
		status: 1,
		type: '待服务',
		service: '普通伤口护理',
		hospital: '广东医科大学附属医院',
		serviceTime: '2019年4月16日 10：00-11：00',
		createTime: '2019年4月7日',
		total: 109
	},
	{
		orderId: '1902290001',
		status: 3,
		type: '已完成',
		service: '压疮护理',
		hospital: '广东医科大学附属医院',
		serviceTime: '2019年4月7日 10：00-11：00',
		createTime: '2019年4月1日',
		total: 109
	},
	{
		orderId: '1902270001',
		status: 2,
		type: '待确认',
		service: '普通伤口护理',
		hospital: '广东医科大学附属医院',
		serviceTime	: '2019年4月2日 10：00-11：00',
		createTime: '2019年4月1日',
		total: 109
	}
]

export function getOrders(){
	return new Promise((resolve,reject) => {
		resolve(orders)
	})
}

export function getOrder(id){
	let order = orders.filter(({orderId}) => orderId == id)
	return order[0]
// 	return new Promise((resolve,reject) => {
// 		let order = orders.filter(({orderId}) => orderId == id)
// 		resolve(order[0])
// 	})
}