import http from '../vmeitime-http/interface.js'

//获取登录手机验证码
export function getLoginCode(mobile) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	return http.request({
		url: '/nursing-upms/mobile/' + mobile,
		method: 'GET'
	})
}

//获取登录图形验证码
export function getRandomCode(str) {
	return http.request({
		url: '/code?randomStr' + str,
		method: 'GET'
	})
}

//获取注册手机验证码
export function getRegisterCode(obj) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	return http.request({
		// url: '/nursing-admin/oms/vip/sendCode',
		url: '/nursing-admin/scs/account/vip/registcode?wechatBindAble=' + obj.wechatBindAble,
		method: 'POST',
		data: obj
	})
}

//提交注册
export function userRegister(obj) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	return http.request({
		// url: '/nursing-admin/oms/vip/registVip',
		url: '/nursing-admin/scs/account/vip/registVip',
		method: 'POST',
		data: obj
	})
}

//检测用户名的唯一性
export function checkUserName(userName) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	return http.request({
		// url: '/nursing-admin/oms/vip/userNameExist',
		url: '/nursing-admin/scs/account/phoneExist',
		method: 'GET',
		data: {
			userName: userName
		}
	})
}

//检测手机号码码的唯一性
export function checkPhone(phone) {
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization": "Basic cGlnOnBpZw=="
		}
	}
	return http.request({
		// url: '/nursing-admin/oms/vip/phoneExist',
		url: '/nursing-admin/scs/account/userNameExist',
		method: 'GET',
		data: {
			phone: phone
		}
	})
}

//自主注册获取验证码
export function userAutoRegister(obj) {
	let { userName,password,phone,wechatBindAble } = obj
	let user = {
		userName: userName ? userName : 'yjh' + randomStr(9),
		password: password ? password : randomStr(12),
		phone: phone,
		wechatBindAble: wechatBindAble ? wechatBindAble : 0
	}
	
	return new Promise( async (resolve,reject) => {
		let { data } = await checkUserName(user.userName)
		if(!data.data) {
			let params = Object.assign({},user,{
				passwordConfirm: user.password
			})
			
			let res = await getRegisterCode(params)
			
			if(res.data.data){
				resolve(params)
			}
			else{
				reject()
			}
		}
		else{
			reject()
		}
	})
}
// export function userAutoRegister(mobile) {
// 	let userName = 'yjh' + randomStr(9)
// 	let password = randomStr(12)
// 	
// 	return new Promise((resolve,reject) => {
// 		checkUserName(userName).then(response => {
// 			let data = response.data
// 			if(!data.data){
// 				let obj = {
// 					userName: userName,
// 					password: password,
// 					passwordConfirm: password,
// 					phone: mobile
// 				}
// 				getRegisterCode(obj).then(res => {
// 					if(res.data.data)
// 						resolve(obj)
// 					else
// 						reject()
// 				})
// 			}		
// 		})
// 	})
// }

//获取随机字符串
function randomStr(len){
	let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
	let maxPros = chars.length
	let str = ''
	
	for(let i=0; i<len; i++){
		str += chars.charAt(Math.floor(Math.random()*maxPros))
	}
	
	return str
}

//获取用户角色信息
export function getVipInfo() {
	// console.log('执行自己请求')
	return http.request({
		url: '/nursing-admin/oms/vip/my',
		method: 'GET'
	})
}

//获取当前登录账户信息
export function getUserInfo() {
	// console.log('执行自己请求')
	return http.request({
		// url: '/admin/user/info',
		url: '/nursing-admin/userinfo',
		method: 'GET'
	})
}

//修改密码获取验证码
export function getChangePswCode(phone) {
	// console.log('更改header为 Basic')
	// http.interceptor.request = (config) => {
	// 	config.header = Object.assign({},config.header,{
	// 		'Authorization': 'Basic cGlnOnBpZw=='
	// 	})
	// }
	
	return http.request({
		url: '/nursing-upms/user/getchangepswcodebyphone',
		method: 'POST',
		data: phone
	})
}

//修改密码
export function changePsw(obj) {
	return http.request({
		url: '/nursing-upms/user/changepsw',
		method: 'PUT',
		data: obj
	})
}

//注册成为会员
export function empowerAsVip() {
	return http.request({
		url: '/nursing-admin/vcs/account/empowerAsVip',
		method: 'POST'
	})
}

//忘记密码获取验证码
export function getValidateCode(userName) {
	return http.request({
		url: '/nursing-upms/user/getchangepswcodebyname',
		method: 'POST',
		data: userName
	})
}

//更换手机号码获取验证码
export function getChangePhoneCode(obj) {
	return http.request({
		url: '/nursing-admin/userinfo/sendChangePhoneCode',
		method: 'POST',
		data: obj
	})
}

//更换手机号码
export function changePhoneConfirm(obj) {
	return http.request({
		url: '/nursing-admin/userinfo/changePhoneConfirm',
		method: 'POST',
		data: obj
	})
}

//绑定微信发送验证码
export function getBindWechatCode() {
	return http.request({
		url: '/nursing-upms/user/applyForWechat',
		method: 'POST'
	})
}

//绑定微信
export function bindWechat(obj) {
	return http.request({
		url: '/nursing-upms/user/bindWechat',
		method: 'PUT',
		data: obj
	})
}

//解绑微信获取验证码
export function getUnbindWechatCode() {
	return http.request({
		url: '/nursing-upms/user/applyUnbindWechat',
		method: 'POST'
	})
}

//解绑微信
export function unBindWechat(obj) {
	return http.request({
		url: '/nursing-upms/user/unbindWechat',
		method: 'PUT',
		data: obj
	})
}