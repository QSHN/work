import Vue from 'vue'
import { loginByPhone,loginByUsername,loginByUserPhone,loginByWechat,setHeader } from '@/common/api/login'
import { getVipInfo,getUserInfo } from '@/common/api/user'
import { encryption,toFormData } from '@/common/utils/util'

const vm = new Vue()

const user = {
	state: {
		userInfo: {},
		vipInfo: {},
		access_token: uni.getStorageSync('access_token') || ''
	},
	actions: {
		//用户手机号码登录
		LoginByPhone({commit},userInfo) {
			return new Promise((resolve,reject) => {
				loginByPhone(userInfo).then(response => {
					let data = response.data
					commit('SET_ACCESS_TOKEN',data.access_token)
					resolve(data)
				}).catch(() => {
					reject()
				})
			})
		},
		//用户账号密码登录
		LoginByUsername({commit},userInfo) {
			let user = new Object()
			
			try{
				let loginByUsername = uni.getStorageSync('login_by_username')
				
				if(loginByUsername && loginByUsername.username === userInfo.username && loginByUsername.password === userInfo.password){
					user = Object.assign({},loginByUsername)
				}
				else{
					user = Object.assign({},encryption({
						data: userInfo,
						key: vm.$pswEncode,
						param: ['password']
					}))
				}
				
			}catch(e){
				//TODO handle the exception
				console.log(e)
			}
			
			return new Promise((resolve,reject) => {
				let password = encodeURIComponent(user.password)
				// loginByUsername(`?username=${user.username}&password=${password}&grant_type=password&scope=server`).then(response => {
				let checkMobile = /^1[345789]\d{9}$/
				if(checkMobile.test(user.username)){
					loginByUserPhone(toFormData(Object.assign({},user,{
						mobile: user.username,
						password: password,
						grant_type: 'mobile',
						scope: 'server'
					}))).then(response => {
						let data = response.data
						if(userInfo.remember){
							uni.setStorageSync('login_by_username',user)
						}
						commit('SET_ACCESS_TOKEN',data.access_token)
						resolve(data)
					}).catch(() => {
						reject()
					})
				}
				else{
					loginByUsername(toFormData(Object.assign({},user,{
						password: password,
						grant_type: 'password',
						scope: 'server'
					}))).then(response => {
						let data = response.data
						if(userInfo.remember){
							uni.setStorageSync('login_by_username',user)
						}
						commit('SET_ACCESS_TOKEN',data.access_token)
						resolve(data)
					}).catch(() => {
						reject()
					})
				}
				
			})
		},
		//微信登录
		LoginByWechat({commit},data){
			return new Promise((resolve,reject) => {
				loginByWechat(data).then(({data}) => {
					commit('SET_ACCESS_TOKEN',data.access_token)
					resolve(data)
				}).catch(err => {
					reject(err)
				})
			})
		},
		//获取当前用户基本信息
		GetUserInfo({commit}) {
			return new Promise((resolve,reject) => {
				getVipInfo().then(({data}) => {
					if(data.msg === 'success'){
						commit('SET_VIP_INFO',data.data)
						resolve(Object.assign({},data.data,{isVip: true}))
					}			
				}).catch(response => {
					let data = response.data
					if(response.statusCode === 500){
						if(data.msg === '当前用户不是会员用户！'){
							resolve({ isVip: false })
						}
					}
				})
			})
		}
	},
	mutations: {
		SET_ACCESS_TOKEN: (state,access_token) => {
			uni.setStorageSync('access_token',access_token)	
			state.access_token = access_token
			setHeader(access_token)
		},
		SET_VIP_INFO: (state,vipInfo) => {
			uni.setStorageSync('vip_info',vipInfo)
			state.vipInfo = Object.assign({},state.vipInfo,vipInfo)
		},
		SET_USERINFO: (state,userInfo) => {
			uni.setStorageSync('user_info',userInfo)
			state.userInfo = Object.assign({},state.userInfo,userInfo)
		}
	}
}

export default user