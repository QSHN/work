import http from '../vmeitime-http/interface.js'

//手机号码登录
export function loginByPhone(obj) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	return http.request({
		url: '/nursing-auth/mobile/token/sms' + obj,
		method: 'POST'
	})
}

//用户名密码登录
export function loginByUsername(obj) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	
	return http.request({
		url: '/nursing-auth/oauth/token' + obj,
		method: 'POST'
	})
}

//手机号密码登录
export function loginByUserPhone(obj) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	
	return http.request({
		url: '/nursing-auth/psw/mobile/token' + obj,
		method: 'POST'
	})
}

//微信登录(获取用户信息)
export function loginByWechat(obj) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	
	return http.request({
		url: '/nursing-auth/wechat/token?grant_type=wechat&client=0',
		method: 'POST',
		data: obj
	})
}

//微信登录(获取手机号)
export function loginPhone(obj) {
	// http.interceptor.request = (config) => {
	// 	config.header = {
	// 		"Authorization": "Basic cGlnOnBpZw=="
	// 	}
	// }
	
	// return http.request({
	// 	url: '/nursing-upms/user/getUnionId?grant_type=wechat&client=0',
	// 	method: 'POST',
	// 	data: obj
	// })
	
	return new Promise(async (resolve,reject) => {
		http.interceptor.request = (config) => {
			config.header = {
				"Authorization": "Basic cGlnOnBpZw=="
			}
		}
		let res = await http.request({
			url: '/nursing-upms/user/getUnionId?grant_type=wechat&client=0',
			method: 'POST',
			data: obj
		})
		if(res.data.code == 0){
			resolve(res.data)
		}else{
			reject(res.data)
		}
	})
}

//设置头部toeken
export function setHeader(token) {
	let _token = token

	return new Promise((resolve,reject) => {
		http.interceptor.request = (config) => {
			if(_token){
				config.header = Object.assign({}, config.header,{ 'Authorization': 'Bearer ' + _token})
				resolve()
			}
			else{
				reject()
			}
		}
	})
}