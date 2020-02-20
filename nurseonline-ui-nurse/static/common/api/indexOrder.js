//订单预约相关
import http from './interface'
import Vue from 'vue'
import store from "../../../store";
Vue.prototype.$store = store;
let vm=new Vue()
let myBaseUrl=vm.$store.state.myBaseUrl//设置myBaseUrl
let devUrl=vm.$store.state.devUrl//开发devUrl

/***********分隔线（按业务分隔）待接预约单相关************/

export const getBillAssignViewPageByStaff= (data) => {//获取预约单待接列表接口
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
				baseUrl:myBaseUrl,
				url: devUrl+'/billassign/billAssignViewPageByStaff?'+data,
				method:"GET",
				dataType: 'json',
			})
}

export const confirmAcceptTask= (staffId,taskId,assignId) => {//当前服务人员确认接单接口 confirmAcceptTask
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
					if(response.data.code==0){//成功=>跳转
						uni.navigateTo({
							url:"receive?taskId="+taskId
						})
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
				url: devUrl+'/billassign/confirmAcceptTask?staffId='+staffId+'&taskId='+taskId+'&assignId='+assignId,
				method:"PUT",
				dataType: 'json',
			})
}

/***********分隔线（按业务分隔）预约单相关************/

export const getOrderInfo= (data) => {//获取预约单列表接口 billTaskViewPageByStaff
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
				url: devUrl+'/billtask/billTaskViewPageByStaff?'+data,
				method:"GET",
				dataType: 'json',
			})
}

export const pageEx= (data,staffId) => {//预约单模糊搜索 修正弃用190513
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
				url: devUrl+'/billtask/pageEx?taskId='+data+'&staffId='+staffId,
				method:"GET",
				dataType: 'json',
			})
}

export const billtaskBytaskId= (taskId) => {////GET/billtask/{taskId}  -- 返回entity
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
				url: devUrl+'/billtask/'+taskId,
				//url: devUrl+'/billtask/view/'+taskId,
				method:"GET",
				dataType: 'json',
			})
}

export const consumptive= (data) => {//领取耗材 /scms/stock/bill/receiveGoodses
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
			    url: devUrl+'/scms/stock/bill/staff/applyForGoodses',
				method:"POST",
				dataType: 'json',
				data
			})
}

export const commit_consumptive= (billId) => {//领取耗材 把状态改为提交
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
			    url: devUrl+'/scms/stock/bill/commit/'+billId,
				method:"PUT",
				dataType: 'json',
			})
}

export const startServe= (staffId,taskId,actionId,position,imgUrl) => {//出门服务-开始投保 PUT /billtask/executeTask?staffId=?taskId=?actionId=?position=?imgUrl=?
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
			    url: devUrl+'/billtask/executeTask?staffId='+staffId+'&taskId='+taskId+'&actionId='+actionId+'&position='+position+'&imgUrl='+imgUrl,
				method:"PUT",
				dataType: 'json',
			})
}
/*  actionId 说明
0	会员提交订单
1	优佳护已收款
2	优佳护已审核订单
3	会员提交预约单
4	优佳护已分派服务人员
5	服务人员已接单
6	服务人员已出门
7	服务人员已到达服务地址
8	服务人员已服务完成
9	会员已确认预约单
10	预约单成功关闭
11	优佳护已退款
12	会员撤销预约单
13	服务人员撤销预约单
14	预约单撤销关闭
15	会员撤销订单
16	优佳护撤销订单
17	服务订单撤销关闭
18	服务订单成功关闭
19	服务订单已完成待会员确认
20	会员已确认服务订单
21	服务人员开始评估
*/
export const orderDetail= (billNum) => {//预约详情 //待完善
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
			    url: devUrl+'/bill/'+billNum,
				method:"GET",
				dataType: 'json',
			})
}

export const refuseOeder= (staffId,taskId,reason,assignId) => {//拒绝接单 PUT
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
			    url: devUrl+'/billassign/rejectTask?staffId='+staffId+'&taskId='+taskId+'&reason='+reason+'&assignId='+assignId,
				method:"PUT",
				dataType: 'json',
			})
}

export const cancelOrder= (staffId,taskId,reason) => {//撤销预约单 PUT
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				console.log("res_cancel.data.data.code",response.data.code)
				if(response.data.code==0){//撤销成功后再刷新
					vm.$store.state.orderRefresh++;
				}
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
			    url: devUrl+'/billtask/rejectTask?staffId='+staffId+'&taskId='+taskId+'&reason='+reason,
				method:"PUT",
				dataType: 'json',
			})
}

/***********分隔线（按业务分隔）就诊详情相关************/

export const treatrec= (custId) => {//预约详情 //待完善
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
			    url: devUrl+'/scs/cust/treatrec?custId='+custId,
				method:"GET",
				dataType: 'json',
			})
}

export const billcerts= (billId) => {//预约详情 //待完善
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
			    url: devUrl+'/bill/billcerts?billId='+billId,
				method:"GET",
				dataType: 'json',
			})
}

export const billtrack= (taskId) => {//预约详情 //待完善
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
			    url: devUrl+'/billtrack/listByTaskId?taskId='+taskId,
				method:"GET",
				dataType: 'json',
			})
}

/***********分隔线（按业务分隔）到达评估相关************/

export const putNurseRec= (staffId,taskId) => {//创建评估单 POST
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				
					if(response.data.code==0){
						vm.$store.state.rec=response.data.data
						vm.$store.state.recId=response.data.data.recId
						//跳转到评估页面
						uni.reLaunch({
							url:'../../packageB/Reach/beginJudge'
						})
					}else if(response.data.code==1){
						uni.showModal({
							title: '提示',
							content: response.data.msg+'是否继续进行评估？',
							success: function (res) {
								if (res.confirm) {
									console.log('用户点击确定');
									vm.$store.state.ReadRecOnly=false//编辑评估单
									uni.showLoading({})
									getNurseRec(taskId)//获取护理记录
									uni.hideLoading()
								} else if (res.cancel) {
									console.log('用户点击取消');
									return
								}
							}
						});
					}
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/oms/nurserec?taskId='+taskId,
				method:"POST",
				dataType: 'json',
			})
}

//获取护理记录
export const getNurseRec= (taskId) => {//获取护理记录
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				vm.$store.state.rec=response.data.data
				vm.$store.state.recId=response.data.data.recId
				let msg=response.data.msg
				//在这里可以判断是否获取成功
					if(msg!='success'){
						uni.showToast({
							title:msg,
							icon:'none',
							mask:true
						})
					}
				//跳转到评估页面
				uni.reLaunch({
					url:'../../packageB/Reach/beginJudge'
				})	
				return response;
			}
			return http.request({
				baseUrl: myBaseUrl,
			    url: devUrl+'/oms/nurserec/taskId/'+taskId,
				method:"GET",
				dataType: 'json',
			})
}

//获取护理记录 single
export const getNurseRec_single= (taskId) => {//获取护理记录-不跳转。单纯请求recId
			http.interceptor.request = (config) => {
				let access_token= uni.getStorageSync('access_token');
				config.header = {
					"Authorization":"Bearer " + access_token
				}
			}
			http.interceptor.response = (response) => {
				vm.$store.state.rec=response.data.data
				vm.$store.state.recId=response.data.data.recId
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
			    url: devUrl+'/oms/nurserec/taskId/'+taskId,
				method:"GET",
				dataType: 'json',
			})
}

//获取护理记录
export const goNurseRec= (data,str) => {//更新护理记录，包括提交评估内容，和务完成上传记录
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
			    url: devUrl+'/oms/nurserec?'+str,
				method:"PUT",
				dataType: 'json',
				data
			})
}

//根据预约号获取评估 id
export const getAssessment = (taskId) => {
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
		url: devUrl + '/billtask/getTplId/' + taskId,
		method: "GET"
	})
}

//export default
export default {
	//接单相关
	getBillAssignViewPageByStaff,//分配给当前服务人员任务列表信息 √
	confirmAcceptTask,//当前服务人员确认接单接口 √
	
	//预约单相关
	getOrderInfo,//获取预约列表 √
	pageEx,//模糊搜索
	billtaskBytaskId,//GET/billtask/{taskId}  -- 返回entity √

	consumptive,//领取耗材
	startServe,//出门服务-开始投保 √
	orderDetail,//预约详情 //待完善
	refuseOeder,//拒绝接单 √
	cancelOrder,//撤销预约单
	commit_consumptive,//领取耗材，把状态改为提交
	
	//就诊详情
	treatrec,//查看就诊记录
	billcerts,//就医证明
	billtrack,//跟踪记录
	
	//到达评估
	putNurseRec,//创建评估单
	getNurseRec,//获取护理记录
	getNurseRec_single,//获取护理记录_single
	goNurseRec,//更新护理记录，包括提交评估内容record:true，和务完成上传记录 submit:true 
	getAssessment, //根据预约号获取评估 id
}