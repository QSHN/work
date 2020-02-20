import CryptoJS from "crypto-js"
import http from '@/common/vmeitime-http/interface'

//格式化时间
const formatDate = time => {
	const weeks = ["日", "一", "二", "三", "四", "五", "六"]
	const date = new Date(time)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	
	return {
		date: [year, month, day].map(formatNumber).join('-'),
		week: "星期" + weeks[date.getDay()]
	}
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 获取最近7天
export function getDays(count) {
	let daysArr = []
	
	for(let i=0; i<count; i++){
		let day = new Date()
		let timer = day.setTime(day.getTime() + (24 * 60 * 60 * 1000 * i))
		daysArr.push(formatDate(timer))
	}
	
	return daysArr
}


//获取一天所有时间段
export function getAllTimes() {
	let times = []
	
	for(let i=0; i<24; i++){
		times.push({
			time: formatNumber(i) + ':00',
			canChoose: true
		})
		// let time = 7 + i
		// times.push(time + ':00',time + ':30')
		// times.push({
		// 	time: time + ':00',
		// 	canChoose: true
		// },{
		// 	time: time + ':30',
		// 	canChoose: true
		// })
	}
	
	return times
}

//加密处理
export const encryption = (params) => {
  let { data,type,param,key} = params
	console.log(key)
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

//判断是否为空
export const validatenull = val => {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length == 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true
    return false
  }
  return false
}

//object转formData参数字符串
export const toFormData = obj => {
	if(obj instanceof Object){
		let params = ''
		Object.keys(obj).map((key,index) => {
			if(index > 0){
				params += '&' + key + '=' + obj[key]
			}
			else{
				params += '?' + key + '=' + obj[key] 
			}
		})
		return params
	}
	return false
}

//返回上一页方法封装
export async function successBack(res,msg,delta) {
	let data = res.data
	if(data.msg === 'success'){
		await utilToast(msg || '提交成功')
		
		await setTimeout(() => {
			uni.navigateBack({
				delta: -1 || delta
			})
		},800)
	}
}

//封装为promise对象的toast
export function utilToast(msg) {
	return new Promise((resolve,reject) => {
		uni.showToast({
			title: msg || 'success',
			icon: 'none',
			mask: true,
			success: () => {
				resolve()
			},
			fail: () => {
				reject()
			}
		})
	})
}

//封装为promise对象的modal
export function utilModal(msg,title) {
	return new Promise((resolve,reject) => {
		uni.showModal({
			title: title || '提示',
			content: msg,
			success: res => {
				resolve(res)
			},
			fail: () => {
				reject()
			}
		})
	})
}

export const switchTime = (val = +new Date(), dateType = 'YYYY-MM-DD hh:mm:ss') => {
	// 将字符串转换成数字
	const timeStamp = +new Date(val)

	// 如果转换成数字出错
	if (!timeStamp) {
		return val
	}
	let str
	// 得到时间字符串
	const dateStr = new Date(timeStamp)
	str = dateType.replace('YYYY', dateStr.getFullYear())
	str = str.replace('MM', (dateStr.getMonth() + 1 < 10 ? '0' : '') + (dateStr.getMonth() + 1))
	str = str.replace('DD', (dateStr.getDate() < 10 ? '0' : '') + dateStr.getDate())
	str = str.replace('hh', (dateStr.getHours() < 10 ? '0' : '') + dateStr.getHours())
	str = str.replace('mm', (dateStr.getMinutes() < 10 ? '0' : '') + dateStr.getMinutes())
	str = str.replace('ss', (dateStr.getSeconds() < 10 ? '0' : '') + dateStr.getSeconds())

	return str
}

// 计算年龄
export const calculateAge = (birthday) => {
	let result = -1

	let birthdayArr = birthday.split('-')
	let birthYear = parseInt(birthdayArr[0])
	let birthMonth = parseInt(birthdayArr[1])
	let birthDay = parseInt(birthdayArr[2])

	let now = new Date()
	let nowYear = now.getFullYear()
	let nowMonth = now.getMonth() + 1
	let nowDay = now.getDate()

	if (nowYear == birthYear) {
		result = 0
	} else if (nowYear > birthYear) {
		result = nowYear - birthYear
		if (nowMonth == birthMonth) {
			let dayDiff = nowDay - birthDay
			if (dayDiff < 0) {
				result --
			}
		} else {
			let monthDiff = nowMonth - birthMonth
			if (monthDiff < 0) {
				result --
			}
		}
	}

	return result
}

// 把部分内容转成*
export const plusStars = (str, frontLen, endLen) => {
    let len = str.length - frontLen - endLen
    let stars = ''
    for (let i = 0; i < len; i++) {
        stars += '*'
    }
    return str.substr(0, frontLen) + stars + str.substr(str.length - endLen);
}

