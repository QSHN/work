//个人中心相关
import http from './interface'
import Vue from 'vue'
import store from "../../../store";
Vue.prototype.$store = store;
let vm=new Vue()
let myBaseUrl=vm.$store.state.myBaseUrl//设置myBaseUrl
let devUrl=vm.$store.state.devUrl//开发devUrl
let nursing_upms=vm.$store.state.nursing_upms//nursing_upms


//排班表相关
export const getCalendarInit = (today) => {//获取排班信息 GET
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
				if(msg!='success'){
					uni.showToast({
						title:msg,
						icon:'none',
						mask:true
					})
				}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/schedule/week?anyDate='+today,
				method:"GET",
				dataType: 'json',
			})
}

export const getDefaultModel = (today) => {//获取排班模板 GET
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/schedule/offen',
				method:"GET",
				dataType: 'json',
			})
}

export const addCalendar = (data) => {//新增排班信息 POST
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
				if(msg!='success'){
					uni.showToast({
						title:msg,
						icon:'none',
						mask:true
					})
				}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/schedule/week',
				method:'POST',
				dataType: 'json',
				data
			})
}

export const addDefaultModel = (data) => {//新增排班模板 POST
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg=='success'){
						uni.showToast({
							title:'设置默认排班表成功',
							icon:'none',
							mask:true
						})
					}else{
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/schedule/offen',
				method:'POST',
				dataType: 'json',
				data
			})
}

export const changeCalendar = (data) => {//修改排班信息 PUT
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url:devUrl+'/scs/schedule/week',
				method:'PUT',
				dataType: 'json',
				data
			})
}

export const changeDefaultModel = (data) => {//修改排班模板 PUT
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg=='success'){
						uni.showToast({
							title:'设置默认排班表成功',
							icon:'none',
							mask:true
						})
					}else{
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/schedule/offen',
				method:'PUT',
				dataType: 'json',
				data
			})
}

export const hasStaffScheduleAfterCurrWeek= (data) => {//判断是否排过班

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
					title:'获取排班表失败',
					icon:'none',
					mask:true
				})	
			}else{
				
			}
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/scs/schedule/hasStaffScheduleAfterCurrWeek',
			method:'GET', 
			dataType: 'json',
		})	
}

//地址相关
export const getAddrListApi = (data) => {//获取地址列表
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/address/list',
				method:"GET",
				dataType: 'json',
			})
}

export const getDefAddr = (data) => {//获取地址（最后一次操作的地址）
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/address/def',
				method:"GET",
				dataType: 'json',
			})
}

export const addAddr = (data) => {//新增地址
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/address',
				method:"POST",
				dataType: 'json',
				data
			})
}

export const saveAddr= (data) => {//保存地址
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/address',
				method:"PUT",
				dataType: 'json',
				data
			})
}

export const delAddr= (addressId ) => {//保存地址
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/address?addressId='+addressId ,
				method:"DELETE",
				dataType: 'json',
				
			})
}

//基本信息相关
export const getPersonalInfo= (data) => {//获取当前登录的用户的服务人员信息
		http.interceptor.request = (config) => {
			let access_token= uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/scs/account/info',
			method:"GET",
			dataType: 'json',
		})
}

///nursing-admin/userinfo
export const userinfo= (data) => {//获取当前登录的用户的服务人员信息
		http.interceptor.request = (config) => {
			let access_token= uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: devUrl+'/userinfo',
			method:"GET",
			dataType: 'json',
		})
}
///nursing-upms/user/edit
export const userEdit= (data) => {//获取当前登录的用户的服务人员信息
		http.interceptor.request = (config) => {
			let access_token= uni.getStorageSync('access_token');
			config.header = {
				"Authorization":"Bearer " + access_token
			}
		}
		http.interceptor.response = (response) => {
			return response;
		}
		return http.request({
			baseUrl: myBaseUrl,
			url: nursing_upms+'/user/edit',
			method:"PUT",
			dataType: 'json',
			data
		})
}

export const savePersonalInfo= (data) => {//保存当前登录的用户的服务人员信息
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/account/info',
				method:"POST",
				dataType: 'json',
				data
			})
}

export const getGoodatServe= (data) => {//获取擅长服务
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/staff/service?size=100',
				method:"GET",
				dataType: 'json',
			})
}

export const saveGoodatServe= (data) => {//提交擅长服务
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/staff/service',
				method:"POST",
				dataType: 'json',
				data
			})
}

export const getGoodatProf= () => {//获取擅长专科
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/staff/specialist',
				method:"GET",
				dataType: 'json',
			})
}

export const saveGoodatProf= (data) => {//提交擅长专科 保存列表：Put，列表 [{staffId, specialist, specialistName}]
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/staff/specialist',
				method:"PUT",
				dataType: 'json',
				data
			})
}

export const addGoodatProf= (data) => {//专科 增一条：Post，对象：{staffId, specialist, specialistName}
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/staff/specialist',
				method:"POST",
				dataType: 'json',
				data
			})
}

//考试相关
export const getExamItem= (orgId,id,level) => {//获取考试题目 //不带level 190521
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/oms/org/question/'+orgId+'/'+id,//+'/'+level,
				method:"GET",
				dataType: 'json',
			})
}

export const submitTest= (data,staffId) => {//提交考试成绩
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg=='success'){
						uni.showToast({
							title:'提交成功',
							icon:'none',
							mask:true
						})
					}else{
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/oms/org/question/staff/result/'+staffId,
				method:"POST",
				dataType: 'json',
				data
			})
}

//余额相关
export const getBalance= (data) => {//获取总金额
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
				if(msg!='success'){
					uni.showToast({
						title:msg,
						icon:'none',
						mask:true
					})
				}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/scs/balance',
				method:"GET",
				dataType: 'json',
			})
}

export const getBalanceDetail= (data) => {//获取明细
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
				if(msg!='success'){
					uni.showToast({
						title:msg,
						icon:'none',
						mask:false
					})
				}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url:devUrl+ '/scs/balance/detail',
				method:"GET",
				dataType: 'json',
			})
}

export const toCash= (data) => {//申请提现
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
				if(msg!='success'){
					uni.showToast({
						title:msg,
						icon:'none',
						mask:true
					})
				}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/oms/staff/withdrawal/req',
				method:"POST",
				dataType: 'json',
				data
			})
}
// accountType：账户类型，0-支付宝（默认），1-微信支付，2-银行卡
// accountName：账户名称
// accountNo：账户，比如银行卡号
// bankCode：银行代码，参见item_class_code='bank’定义
// bankName：银行名称
// amt：提现金额 

export const getToCashDetail= (data) => {//提现记录
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url:devUrl+ '/oms/staff/withdrawal/req?descs=create_time',
				method:"GET",
				dataType: 'json',
			})
}

//领取单相关
export const getConsumeList= (str) => {//获取所有领取单信息
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url:devUrl+ '/scms/stock/bill/currStaffStockBills'+str,
				method:"GET",
				dataType: 'json',
			})
}

export const getConsumeDetail= (billId) => {//获取所有领取单信息
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
				if(msg!='success'){
					uni.showToast({
						title:msg,
						icon:'none',
						mask:false
					})
				}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url:devUrl+ '/scms/stock/bill/stockBillDetail/'+billId,
				method:"GET",
				dataType: 'json',
			})
}

export const goDeal= (billId) => {//确认签收
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				let msg=response.data.msg
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url:devUrl+ '/scms/stock/bill/signFor/'+billId,
				method:"PUT",
				dataType: 'json',
			})
}

//export default
export default {
	//排班相关
	getCalendarInit,//获取排班信息
	getDefaultModel,//获取排班模板
	
	addCalendar,//新增排班信息
	addDefaultModel,//新增排班模板
	
	changeCalendar,//修改排班信息
	changeDefaultModel,//修改排班模板
	
	hasStaffScheduleAfterCurrWeek,//判断是否排过班
	
	//地址
	getAddrListApi,//获取地址列表
	getDefAddr,//获取地址（最后一次操作的地址）
	
	addAddr,//新增地址
	saveAddr,//保存地址
	delAddr,//删除地址
	
	//基本信息相关
	getPersonalInfo,//获取当前登录的用户的服务人员信息
	userinfo,//头像
	userEdit,//更新用户信息
	savePersonalInfo,//保存当前登录的用户的服务人员信息
	
	getGoodatServe,//获取擅长服务
	saveGoodatServe,//保存擅长服务
	getGoodatProf,//获取擅长专科
	saveGoodatProf,//保存擅长专科
	addGoodatProf,//新增一条专科
	
	//考试相关
	getExamItem,//获取考试题目
	submitTest,//提交考试成绩
	
	//余额相关
	getBalance,//获取总金额
	getBalanceDetail,//获取明细
	toCash,//申请提现
	getToCashDetail,//提现记录
	
	//领取单相关
	getConsumeList,//获取领取单列表
	getConsumeDetail,//领取单详情
	goDeal//确认签收
}