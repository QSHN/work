const sickness = [
	{
		text: '口腔疾病',
		icon: 'kq'
	},
	{
		text: '糖尿病',
		icon: 'ng'
	},
	{
		text: '高血糖',
		icon: 'xb'
	},
	{
		text: '膀胱疾病',
		icon: 'bs'
	},
	{
		text: 'PICC置管',
		icon: 'picc'
	},
	{
		text: '需雾化患者',
		icon: 'qg'
	},
	{
		text: '脊髓损伤',
		icon: 'jm'
	},
	{
		text: '卒中后',
		icon: 'xt'
	}
]

export function getSickness () {
	return new Promise((resolve,reject) => {
		resolve(sickness)
	})
}