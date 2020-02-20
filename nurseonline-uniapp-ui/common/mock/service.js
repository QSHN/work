const serviceList = [
	{
		id: 0,
		serviceName: '常用临床护理',
		hospital: [
			{
				hospitalId: 'h01',
				hospitalName: '湛江市某某某医院',
				serviceItems: [
					{
						serviceItemId: 's01',
						text: '伤口护理',
						image: '',
						icon: 'tnb'
					},
					{
						serviceItemId: 's02',
						text: '监测血糖',
						image: '',
						icon: 'zz'
						
					},
					{
						serviceItemId: 's03',
						text: '更换尿管',
						image: '',
						icon: 'ng'
						
					},
					{
						serviceItemId: 's04',
						text: '一般灌肠',
						image: '',
						icon: 'xb'
						
					},
					{
						serviceItemId: 's05',
						text: '造口护理',
						image: '',
						icon: 'yw'
					},
					{
						serviceItemId: 's06',
						text: '压疮护理',
						image: '',
						icon: 'gc'
					},
					{
						serviceItemId: 's07',
						text: '皮下注射',
						image: '',
						icon: 'zs'
					},
					{
						serviceItemId: 's08',
						text: '肌肉注射',
						image: '',
						icon: 'xt'
					},
					{
						serviceItemId: 's09',
						text: '膀胱治疗',
						image: '',
						icon: 'js'
					},
					{
						serviceItemId: 's10',
						text: '注食',
						image: '',
						icon: 'hx'
					},
					{
						serviceItemId: 's11',
						text: '留置胃管',
						image: '',
						icon: 'ng'
					},
					{
						serviceItemId: 's12',
						text: '拔胃管',
						image: '',
						icon: 'lb'
					}
				],
				packageList: [
					{
						packageId: 'p01',
						text: '鼻饲护理',
						introduce: '护士上门提供鼻饲护理，包括拔胃管、留置胃管和注食服务。',
						price: '430'
					},
					{
						packageId: 'p02',
						text: '膀胱冲洗',
						introduce: '护士上门提供膀胱冲洗服务，包括清洁膀胱和膀胱治疗。',
						price: '450'
					}
				]
			},
			{
				hospitalId: 'h02',
				hospitalName: '湛江市某某某护理服务中心',
				serviceItems: [
					{
						serviceItemId: 's01',
						text: '伤口护理',
						image: '',
						icon: 'tnb'
					},
					{
						serviceItemId: 's02',
						text: '监测血糖',
						image: '',
						icon: 'zz'
						
					},
					{
						serviceItemId: 's03',
						text: '更换尿管',
						image: '',
						icon: 'ng'
						
					},
					{
						serviceItemId: 's04',
						text: '一般灌肠',
						image: '',
						icon: 'xb'
						
					},
					{
						serviceItemId: 's05',
						text: '造口护理',
						image: '',
						icon: 'yw'
					},
					{
						serviceItemId: 's06',
						text: '压疮护理',
						image: '',
						icon: 'gc'
					},
					{
						serviceItemId: 's07',
						text: '皮下注射',
						image: '',
						icon: 'zs'
					},
					{
						serviceItemId: 's08',
						text: '肌肉注射',
						image: '',
						icon: 'xt'
					},
					{
						serviceItemId: 's09',
						text: '膀胱治疗',
						image: '',
						icon: 'js'
					}
				],
				packageList: []
			}
		]
	}
]

export function getService(sId){
	console.log(sId)
	return new Promise((resolve,reject) => {
		let response = serviceList.filter(({id}) => id == sId)
		resolve(response)
// 		serviceList.map((value,index) => {
// 			if(value.id == id){
// 				resolve(value)
// 			}
// 		})
	})
}