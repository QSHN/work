//注册、登录、认证相关
import http from './interface'
import Vue from 'vue'
import store from "../../../store";
Vue.prototype.$store = store;
let vm=new Vue()
let myBaseUrl=vm.$store.state.myBaseUrl//设置myBaseUrl
let devUrl=vm.$store.state.devUrl//开发devUrl
let nursing_auth=vm.$store.state.nursing_auth//nursing_auth
let nursing_upms=vm.$store.state.nursing_upms//nursing_upms

let hasRegOnPigX//是否在pigx平台注册 if(hasRegOnPigX==false){//在平台已注册
    //func loginRes 处理成功登录的返回信息 
let loginRes=async function(response){//loginRes
	let msg=response.errMsg
	let access_token;
	if(response.statusCode==200){//1.成功登录 2.判断是否是微信登录绑定 3.先判断是否是注册优佳护-医护版账户 4.判断是否审核/认证
		//缓存access_token
		access_token=response.data.access_token //access_token!!!
		// uni.setStorage({
		// 	key: 'access_token',
		// 	data: access_token,
		// 	success: function () {
		// 		console.log('缓存access_token成功');
		// 	}
		// });

		// 使用 setStorage 是一个异步，导致请求时，还是上一次的数据
		uni.setStorageSync('access_token', access_token)
		if(vm.$store.state.wechatBindRes){//判断：如果是微信绑定，则不判断登录逻辑,进行手机验证码校验
				let loginAndBindWechatCode=vm.$store.state.loginAndBindWechatCode
				vm.$store.state.wechatLoginCodeType=0
				wechatLoginfoo(loginAndBindWechatCode)
				return false;//直接返回
			}
		getInfoAndLoginJudge()	
	}else{
		let msg=response.data.msg
		if(msg=='用户名或密码错误'||msg=='Noop Bind Account(psw)'){
			uni.showToast({//前端已对用户名或手机号进行校验，用户名或手机号正常才能进行登录请求，所以具体定位到密码错误提示 20190626
				title: '密码错误！',
				icon: 'none',
				mask: true,
			})
		}else if(msg=='用户不存在'){//微信登录返回不存在不做操作
			
		}else{
			uni.showToast({//登录失败
				title: msg,
				icon: 'none',
				mask: true,
			})
		}
	}
}

let getInfoAndLoginJudge=()=>{//获取info，根据状态进入对应的界面
	let access_token = uni.getStorageSync('access_token');
	//Info
	var promiseInfo = new Promise(function(resolve, reject) {//resolve('');
		uni.request({
			url: myBaseUrl+devUrl+'/scs/account/info',
			data: {
			},
			header:{
				"Authorization":"Bearer " + access_token
			},
			method:"GET",
			success: (res) => {
				if(res.data.code==0){//是优佳护一医护版账号
					console.log("staffId",res.data.data.staffId);
					console.log("staffState",res.data.data.staffState);
					uni.setStorage({
						key: 'Info_init',
						data: res.data.data,
						success: function () {
							console.log('缓存Info成功');
						}
					});
					let staffState=res.data.data.staffState
					let isLocked=res.data.data.isLocked
					resolve({staffState:staffState,isLocked:isLocked});
				}else if(res.data.code==1){//该账户不是优佳护-医护版账户
					let msg=res.data.msg
					if(msg.indexOf('获取当前用户关联的服务人员信息失败')!=-1){//进行是否添加护士身份判断
						uni.showModal({
							title: '提示',
							content: '当前账号没有医护身份，确认要创建医护身份吗?',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								if(res.confirm){//确认要创建医护身份
									uni.request({
										url: myBaseUrl+devUrl+'/scs/account/empowerAsStaff',
										method: 'POST',
										data: {},
										header:{
											"Authorization":"Bearer " + access_token
										},
										success: res => {//添加护士身份后重新获取Info
											if(res.data.code==0){
												uni.showToast({
													title: '创建成功',
													icon:'none',
													complete: () => {
														uni.request({
															url: myBaseUrl+devUrl+'/scs/account/info',
															method: 'GET',
															data: {
															},
															header:{
																"Authorization":"Bearer " + access_token
															},
															success: res => {
																uni.setStorage({
																	key: 'Info_init',
																	data: res.data.data,
																	success: function () {
																		console.log('缓存Info成功');
																	}
																});
																let staffState=res.data.data.staffState
																resolve(staffState);
															},
															fail: () => {},
															complete: () => {}
														});
													}
												});
											}else{
												uni.showToast({
													title: '创建失败',
													icon:'none'
												});
											}
										},
										fail: () => {},
										complete: () => {}
									});
								}else{
									console.log('俺不想创建医护身份！')
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}else{
						// uni.showModal({//乱码问题20190806
						// 	title: '提示',
						// 	content: "问题定位测试1"+msg,
						// 	showCancel:false,
						// 	success: function (res) {
						// 		if (res.confirm) {
						// 			console.log('用户点击确定');
						// 		}
						// 	}
						// });
					}
				}
			}
		})
	});
	//staffState
	var staffState= promiseInfo.then(function(value) {
		let isLocked=value.isLocked
		if(isLocked==1){//禁用/锁定，0-否（默认），1-是
			uni.showModal({
				title: '提示',
				content: '当前账户已被冻结，如有疑问请联系客服',
				showCancel: false,
				cancelText: '',
				confirmText: '确定',
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
			return false;
		}
		let staffState=value.staffState
		if(staffState==0){//0：草稿（默认），1：已提交，2：审核通过；3：审核不通过
			uni.showModal({
				title: '提示',
				content: '您当前未验证身份，请前往验证',
				success: function (res) {
					if (res.confirm) {
						uni.redirectTo({
							url:'../../PersonalCenter/IdentityConfirm/index'
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			}); 
		}else if(staffState==1){//跳转到正在审核
			uni.reLaunch({
				url:'../../PersonalCenter/IdentityConfirm/waitReview'
			})
		}else if(staffState==2){//审核通过=>去看看/入驻机构 × 		审核通过=>首页 √190426
			uni.switchTab({
				url:'../../HomePage/index'
			})
		}else if(staffState==3){//跳转到审核不通过
			uni.reLaunch({
				url:'../../PersonalCenter/IdentityConfirm/reviewFail'
			})
		}
		});
}

let wechatLoginfoo=(loginAndBindWechatCode)=>{//loginAndBindWechatCode 登录和微信绑定验证码相同
	var me=this
	let encryptedData;
	let iv;
	let dataSubmit;
	uni.login({
	  provider: 'weixin',
	  success: async (loginRes) =>{
		// 获取用户信息
		let getUserInfoCode_pro=new Promise((resolve,reject)=>{
			uni.getUserInfo({
			  provider: 'weixin',
			  success: (infoRes) =>{
				console.log(infoRes);
				encryptedData=infoRes.encryptedData
				iv=infoRes.iv
				resolve(true)
			  }
			})
		}).then(async(val)=>{
			vm.$store.state.wechatCode=loginRes.code;
			vm.$store.state.wechatEncryptedData=encryptedData;
			vm.$store.state.wechatIv=iv;
			dataSubmit={
				"wechatCode":loginRes.code,
				"code":loginAndBindWechatCode,
				"clientId":1,
				"encryptedData":encryptedData,
				"iv":iv
			}
			let msg;
			let confirmtext;
			let res;
			let backDelta;
			try{
				res =await vm.$api.wechatBind(dataSubmit);
				msg=res.data.msg
				if(res.data.msg=='success'){
					msg='绑定成功'
				}
				backDelta=2
				uni.showModal({
					title: '提示',
					content: ' '+msg,
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
								getInfoAndLoginJudge()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}catch(e){
				//TODO handle the exception
				console.log(e)
				msg=e.data.msg
				uni.showModal({
					title: '提示',
					content: '错误信息：'+msg,
					showCancel: false,
					cancelText: '',
					confirmText: '确定',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			})
			}
		})
}

let autoReg=(validPhone,validCode)=>{//自动注册
	let regCodeVal//注册验证码和登录验证码一致
	let radomName//随机用户名
	let radomPsw//随机密码
	let radomPswConfirm//随机密码
	regCodeVal=validCode
	/*生成随机用户名、随机密码*/
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	　　var maxPos = $chars.length;
		radomName = '';
		radomPsw = '';
	　　for (var i = 0; i < 12; i++) {
	　　　　radomName += $chars.charAt(Math.floor(Math.random() * maxPos));
		   radomPsw  += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	radomPswConfirm=radomPsw
	/*注册请求*/
	uni.request({
		url: myBaseUrl+devUrl+'/scs/account/publish/register',
		method:'POST', 
		dataType: 'json',
		data: {
			userName:'yjh_'+radomName,
			password:'7'+radomPsw,
			passwordConfirm:'7'+radomPswConfirm,
			phone:validPhone,
			code:regCodeVal
		},
		success: (res) => {
			try{
				return http.request({
					baseUrl: myBaseUrl,
					url:nursing_auth+'/mobile/token/sms'+"?mobile=SMS@"+validPhone+"&code="+validCode+"&grant_type=mobile",
					method:'POST', 
					dataType: 'json',
					complete: () => {
						uni.hideLoading()
					}
				})
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					title:e.data.msg
				});
			}
		}
	})
}

//注册登录相关
export const onlyName = (data) => {//判断用户名唯一性
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Basic cGlnOnBpZw=="
		}
	}
	http.interceptor.response = (response) => {
		if(response.statusCode!=200){
			uni.showModal({
				title: '提示',
				content: '服务异常：'+response.statusCode,
				showCancel: true,
				cancelText: '确定',
				confirmText: '联系客服',
				success: res => {
					if(res.confirm){
						uni.makePhoneCall({
							phoneNumber:vm.$store.state.servePhone
						})
					}
				},
				fail: () => {},
				complete: () => {}
			});
		}else{
			let resData=JSON.parse(response.data).data
			return response;
		}
	}
	try{
		return http.request({
			baseUrl: myBaseUrl,
		    url: devUrl+'/scs/account/publish/checkUserName?userName='+data,
			dataType: 'text',
		    data,
			complete: (res) => {
				console.log(res)
			}
		})
	}catch(e){
		console.log(e)
	}
}	

export const onlyPhone = (data) => {//判断手机唯一性
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Basic cGlnOnBpZw=="
		}
	}
	http.interceptor.response = (response) => {
		if(response.statusCode!=200){
			uni.showModal({
				title: '提示',
				content: '服务异常：'+response.statusCode,
				showCancel: true,
				cancelText: '取消',
				confirmText: '联系客服',
				success: res => {
					if(res.confirm){
						uni.makePhoneCall({
							phoneNumber:vm.$store.state.servePhone
						})
					}
				},
				fail: () => {},
				complete: () => {}
			});
		}else{
			let resData=JSON.parse(response.data).data
			return response;
		}
	}
    return http.request({
		baseUrl: myBaseUrl,
        url: devUrl+'/scs/account/publish/checkPhone?phone='+data,
		dataType: 'text',
        data,
    })
}	
	
export const regGetCode = (data) => {//请求注册验证码 注册成功后自动登录190523
	http.interceptor.response = (response) => {
		let msg=JSON.parse(response.data).msg
		if(response.statusCode==200){
			uni.showToast({
				title: '请求成功',
				icon: 'success',
				mask: true
			})
		}else{
			uni.showToast({
				title: msg,
				icon: 'none',
				mask: true
			})
		}
		return response;
	}
    return http.request({
		baseUrl: myBaseUrl,
        url: devUrl+'/scs/account/publish/validCode',
		dataType: 'text',
        data,
    })
}

export const regFormSubmit = (data) => {//注册提交
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		let msg=response.data.msg
		if(response.data.code==0){
			uni.showToast({
				title: '注册成功',
				icon: 'success',
				mask: true,
				duration: 1500
			})
			console.log('注册成功辣，帮你登录辣')
			http.request({
				header:{"Authorization":"Basic cGlnOnBpZw=="},
				baseUrl: myBaseUrl,
				url:nursing_auth+'/mobile/token/sms'+"?mobile=SMS@"+data.phone+"&code="+data.code+"&grant_type=mobile",
				method:'POST', 
				dataType: 'json',
				success: (resdata) => {
					loginRes(resdata)
				}
			})
		}else{
			uni.showToast({
				title: msg,
				icon: 'none',
				mask: true
			})
		}
		//判断返回状态 执行相应操作
		return response;
	}
    return http.request({
		baseUrl: myBaseUrl,
        url: devUrl+'/scs/account/publish/register',
		method:'POST', 
		dataType: 'json',
        data,
    })
}

export const passwordLogin = (data) => {//账号密码登录!!!
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Basic cGlnOnBpZw=="
		}
	}
	http.interceptor.response = (response) => {
		loginRes(response)//登录
		return response;
	}
    return http.request({
		baseUrl: myBaseUrl,
        url: nursing_auth+'/oauth/token'+data,
		method:'POST', 
		dataType: 'json',
    })
}

export const phonePswLogin = (phone,pswEncode) => {//手机密码登录！！！ 20190626
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Basic cGlnOnBpZw=="
		}
	}
	http.interceptor.response = (response) => {
		loginRes(response)//登录
		return response;
	}
    return http.request({
		baseUrl: myBaseUrl,
        url: nursing_auth+'/psw/mobile/token'+'?mobile='+phone+'&password='+pswEncode+'&grant_type=mobile',
		method:'POST', 
		dataType: 'json',
    })
}

export const loginAndBindWechatGet = (mobile) => {//微信绑定用户获取验证码和登录自主注册验证码统一 190722
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Basic cGlnOnBpZw=="
		}
	}
	http.interceptor.response = (response) => {
		console.log("response.data.data",response.data.data)
		if(response.data.data==false){
			hasRegOnPigX=true;//在平台未注册	
			uni.request({
				url: myBaseUrl+devUrl+'/scs/account/publish/validCode'+'?wechatBindAble=1', 
				data: {
					phone: mobile
				},
				complete: (res) => {
					if(res.data.msg!='success'){
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
					}
				}
			});
		}else{
			hasRegOnPigX=false;//在平台已注册
		}
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: nursing_upms+'/mobile/'+mobile+'?wechatBindAble=1',
		method:'GET', 
		dataType: 'json',
	})
}

export const getCode = (mobileNum) => {//手机登录获取验证码
	http.interceptor.request = (config) => {
		//checkPhone
		var regpromise=new Promise((resolve, reject)=>{
			uni.request({
				url: myBaseUrl+devUrl+'/scs/account/publish/checkPhone?phone='+mobileNum,
				dataType: 'text',
				success: (res) => {
					resolve(res)
				}
			})
		})
		//validCode 获取验证码（可直接用来登录)
		var regpromise1=regpromise.then((res)=>{
			if(res.data.code==1){
				uni.showToast({
					title:'请求异常',
					icon:'none'
				})
				return false
			}
			hasRegOnPigX=JSON.parse(res.data).data
			console.log("手机号是否可用来注册（false-已注册过；true-还未注册）",hasRegOnPigX)
			if(hasRegOnPigX==false){//false 在平台已注册
			
			}else{//true 在平台未注册
				/*获取注册验证码*/
				return new Promise((resolve, reject)=>{
					uni.request({
						url: myBaseUrl+devUrl+'/scs/account/publish/validCode', 
						data: {
							phone: mobileNum
						},
						complete: (res) => {
							if(res.data.msg!='success'){
								uni.showToast({
									title: res.data.msg,
									icon:'none'
								});
							}
						}
					});
				})
			}
		})
	}
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		let msg=JSON.parse(response.data).msg
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: nursing_upms+'/mobile/'+mobileNum,
		dataType: 'text',
	})
}

export const mobileLogin = (validPhone,validCode) => {//手机验证码登录!!!
	//1.请求头
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Basic cGlnOnBpZw=="
		}
	}
	//3.请求响应后
	http.interceptor.response = (response) => {
		loginRes(response)
		return response;
	}
	//2.判断是否需要进行自动注册
	if(hasRegOnPigX==false){//在平台已注册
		try{
			return http.request({
				baseUrl: myBaseUrl,
				url:nursing_auth+'/mobile/token/sms'+"?mobile=SMS@"+validPhone+"&code="+validCode+"&grant_type=mobile",
				method:'POST', 
				dataType: 'json',
			})
		}catch(e){
			//TODO handle the exception
			uni.showToast({
				title:e.data.msg
			});
		}
	}else{//在平台未注册 => 则自动注册
		autoReg(validPhone,validCode);
	}	
}

export const wechatLogin = (data) => {//微信登录!!!
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Basic cGlnOnBpZw=="
		}
	}
	http.interceptor.response = (response) => {
		if(response.statusCode==200){
			vm.$store.state.wechatBindRes=false //执行登录，不执行发送验证码
		}
		loginRes(response)//登录
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: nursing_auth+'/wechat/token?grant_type=wechat&client=1',
		method:'POST', 
		dataType: 'json',
		data
	})
}

export const wechatBindGetCode = (data) => {//绑定微信和用户获取验证码
	let access_token=""
	try {
		const value = uni.getStorageSync('access_token');
		if (value) {	
				access_token=value//获取缓存
			}
	} catch (e) {
			console.log(e)
	}
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		let msg=response.data.msg
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: nursing_upms+'/user/applyForWechat',
		method:'POST', 
		dataType: 'json',
		data
	})
}

export const wechatBind = (data) => {//绑定微信和用户操作！
	let access_token=""
	try {
		const value = uni.getStorageSync('access_token');
		if (value) {	
				access_token=value//获取缓存
			}
	} catch (e) {
			console.log(e)
	}
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		let msg=response.data.msg
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: nursing_upms+'/user/bindWechat',
		method:'PUT', 
		dataType: 'json',
		data
	})
}

export const unWechatBindGetCode = (data) => {//解绑微信和用户获取验证码
	let access_token=""
	try {
		const value = uni.getStorageSync('access_token');
		if (value) {	
				access_token=value//获取缓存
			}
	} catch (e) {
			console.log(e)
	}
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		let msg=response.data.msg
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: nursing_upms+'/user/applyUnbindWechat',
		method:'POST', 
		dataType: 'json',
		data
	})
}

export const unWechatBind = (data) => {//解绑微信和用户
	let access_token=""
	try {
		const value = uni.getStorageSync('access_token');
		if (value) {	
				access_token=value//获取缓存
			}
	} catch (e) {
			console.log(e)
	}
	http.interceptor.request = (config) => {
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		let msg=response.data.msg
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: nursing_upms+'/user/unbindWechat',
		method:'PUT', 
		dataType: 'json',
		data
	})
}

export const addVip = (data) => {//添加护士身份(Post)
	http.interceptor.request = (config) => {
		let access_token=""
		try {
			const value = uni.getStorageSync('access_token');
			if (value) {	
					access_token=value//获取缓存
				}
		} catch (e) {
				console.log(e)
		}
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		let msg=response.data.msg
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: devUrl+'/scs/account/empowerAsStaff',
		method:'POST', 
		dataType: 'json',
	})

}

export const getchangepswcodebyphone= (data) => {//修改密码通过手机号获取验证码
		http.interceptor.request = (config) => {
			config.header = {
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: nursing_upms+'/user/getchangepswcodebyphone',
			method:'POST',
			dataType: 'json',
			data
		})	
}

export const getchangepswcodebyname= (data) => {//修改密码通过用户名获取验证码
		http.interceptor.request = (config) => {
			config.header = {
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: nursing_upms+'/user/getchangepswcodebyname',
			method:'POST',
			dataType: 'json',
			data
		})	
}

export const changePsw= (data) => {//修改密码
		http.interceptor.request = (config) => {
			config.header = {
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: nursing_upms+'/user/changepsw',
			method:'PUT',
			dataType: 'json',
			data
		})	
}

export const logOut= (data) => {//退出登录
		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: nursing_auth+'/token/logout',
			method:'DELETE', 
			dataType: 'json',
			data
		})	
}

export const sendChangePhoneCode= (data) => {//获取更换手机
		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/userinfo/sendChangePhoneCode',
			method:'POST', 
			dataType: 'json',
			data
		})	
}

export const changePhoneConfirm= (data) => {//确认修改电话号码 POST
		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/userinfo/changePhoneConfirm',
			method:'POST', 
			dataType: 'json',
			data
		})	
}

/********************这是一条分隔线，以上是登录相关******************************/

//身份认证相关
export const getInfo = (data) => {//获取身份验证1信息

	http.interceptor.request = (config) => {
		let access_token=""
		try {
			const value = uni.getStorageSync('access_token');
			if (value) {	
					access_token=value//获取缓存
				}
		} catch (e) {
				console.log(e)
		}
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		let msg=response.data.msg

		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: devUrl+'/scs/account/info',
		method:'GET', 
		dataType: 'json',
	})

}

export const confirmStep1 = (data) => {//身份验证1

	http.interceptor.request = (config) => {
		let access_token=""
		try {
			const value = uni.getStorageSync('access_token');
			if (value) {	
					access_token=value//获取缓存
				}
		} catch (e) {
				console.log(e)
		}
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		let msg=response.data.msg
			if(response.data.code!=0){
				uni.showToast({
					title:msg,
					icon:'none',
					mask:true
				})	
			}else{
				uni.showToast({
					title:msg,
					icon:'none',
					mask:true,
					success: () => {
						uni.navigateTo({
							url:'step2'
						})
					}
				})	
			}
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: devUrl+'/scs/authentication/basicInfo',
		method:'POST', 
		dataType: 'json',
		data,
	})

}

export const confirmRule= (type) => {//不同身份类型不同认证内容
	http.interceptor.request = (config) => {
		let access_token = uni.getStorageSync('access_token');
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: devUrl+'/cert/checkrule?targetCode=staff&targetType='+type,
		method:'GET', 
		dataType: 'json',
	})
}

export const confirmStep3= (data) => {//身份验证3
		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			let msg=response.data.msg
			if(response.data.code!=0){
				uni.showModal({
					title: '提示',
					content: "保存失败,错误信息："+msg,
					showCancel: false,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
					},
					fail: () => {},
					complete: () => {}
				});
			}else{
				uni.showToast({
					title:'保存成功',
					icon:'none',
					mask:true,
					success(res) {
							uni.reLaunch({
								url:'waitReview'
							})
					}
				})
			}
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/scs/authentication/authInfo',
			method:'POST', 
			dataType: 'json',
			data,
		})	
}

export const getOrgList= (data) => {//服务机构列表(可申请入驻的)

		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			if(response.data.code!=0){
				uni.showToast({
					title:'获取机构列表失败',
					icon:'none',
					mask:true
				})	
			}else{
				
			}
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/scs/org/relation/unjoinedOrgList',
			method:'GET', 
			dataType: 'json',
		})	
}

export const postOrgList= (data) => {//申请入驻机构

		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			if(response.data.code!=0){
				uni.showToast({
					title:'申请入驻机构失败',
					icon:'none',
					mask:true
				})	
			}else{
				vm.$store.state.orgRefresh++;//刷新orgList列表
				vm.$store.state.orgUnJoinedRefresh++;//刷新orgUnJoinedRefresh
				// uni.navigateTo({
				// 	url:'index'
				// })
			}
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/scs/org/relation/joinOrgs',
			method:'POST', 
			dataType: 'json',
			data
		})	
}

export const joinedOrg= (data) => {//已经提交过申请的机构信息

		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			if(response.data.code!=0){
				uni.showToast({
					title:'获取机构列表失败',
					icon:'none',
					mask:true
				})	
			}else{
				
			}
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/scs/org/relation/staffJoinReqs',
			method:'GET', 
			dataType: 'json',
		})	
}

export const joinedOkOrg= (data) => {//已经提交过申请的机构信息

		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			if(response.data.code!=0){
				uni.showToast({
					title:'获取机构列表失败',
					icon:'none',
					mask:true
				})	
			}else{
				
			}
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/scs/org/relation/joinedOrgList',
			method:'GET', 
			dataType: 'json',
		})	
}

export const addAlarmLog= (data) => {//添加紧急求助日志

		http.interceptor.request = (config) => {
			let access_token = uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token,
				'Content-Type': 'application/json'
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/oms/alarm/rec',
			method:'POST', 
			dataType: 'json',
			data
		})	
}

export const getFeedbackMessage = (staffId) => {	// 获取审核不通过的消息
	http.interceptor.request = (config) => {
		let access_token = uni.getStorageSync('access_token');
		config.header = {
			"Authorization":"Bearer " + access_token,
			'Content-Type': 'application/json'
		}
	}
	http.interceptor.response = (response) => {
		return response;
	}
	return http.request({
		baseUrl: myBaseUrl,
		url: devUrl+'/oms/staff/cert/feedback/reject',
		method:'get', 
		dataType: 'json',
		data: {
			staffId: staffId
		}
	})	
}

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	//注册登录相关
	onlyName,//注册判断用户名唯一性
	onlyPhone,//注册判断手机号唯一性
	regGetCode,//请求注册验证码
	getCode,//手机登录获取验证码
	regFormSubmit,//注册提交
		//登录方式
	passwordLogin,//账号密码登录!!!
	phonePswLogin,//手机密码登录!!!
	mobileLogin,//手机验证码登录!!!
	wechatLogin,//微信登录
	wechatBindGetCode,//绑定微信和用户获取验证码
	wechatBind,//绑定微信和用户
	unWechatBindGetCode,//解绑微信和用户获取验证码
	unWechatBind,//解绑微信和用户
	loginAndBindWechatGet,//微信绑定用户获取验证码和登录自主注册验证码统一 190722
	
	addVip,//添加会员身份
	logOut,//退出登录
	getchangepswcodebyphone,//修改密码通过手机号获取验证码
	getchangepswcodebyname,//修改密码通过用户名获取验证码
	changePsw,//修改密码
	sendChangePhoneCode,//获取更换手机
	changePhoneConfirm,//确认修改电话号码
	
	//身份认证相关
	getInfo,//获取身份认证1信息
	//confirmStep1,//身份验证1-步骤1不保存信息-20190423
	confirmRule,//不同身份类型不同认证内容
	// confirmStep2,//身份验证2-步骤2不保存信息-20190416
	confirmStep3,//身份验证3
	
	//服务机构相关
	getOrgList,//服务机构列表
	postOrgList,//申请入驻机构
	joinedOrg,//已经提交过申请的机构信息
	joinedOkOrg,//已经成功入驻的机构
	
	//紧急求助
	addAlarmLog,//添加紧急求助日志
	getFeedbackMessage,
}