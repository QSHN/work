//挂载vue实例，获取全局变量
import Vue from 'vue'
const vm = new Vue()

export default {
	config: {
		header: {
			'content-type':'application/json;charset=UTF-8',
			// 'content-type':'application/x-www-form-urlencoded;charset=UTF-8'
		},  
		data: {},
		method: "GET",
		dataType: "json",  /* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: config => {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
		},
		response: response => {
			uni.hideLoading()
			if(response.statusCode != 200){
				if(response.statusCode == 404){
					uni.showToast({
						title: '未知错误，请稍后再试',
						icon: 'none',
						mask: true,
						duration: 2000
					})
				}else if(response.data && response.data.msg){
					let msg = response.data.msg
					if(msg !== '当前用户不是会员用户！' && msg !== '用户不存在'){
						uni.showToast({
							title: msg,
							icon: 'none',
							mask: true,
							duration: 2000
						})
					}
				}
			}
			
			return response
		}
	},
	request(options) {
		if (!options) {
			options = {}
		}
		
		const baseUrl = vm.$baseUrl
		
		options.baseUrl = options.baseUrl || baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.methods
		
		try{
			// console.log('更改header为 Token')
			let _token = uni.getStorageSync('access_token')
			if(_token) {
				options.header = Object.assign({},options.header,{
					'Authorization': 'Bearer ' + _token
				})
			}
		}catch(e){
			console.log('获取token信息失败:',e)
		}

		return new Promise((resolve, reject) => {
			let _config = null
			
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				
				// 统一的响应日志记录
				if (statusCode === 200) { //成功
					resolve(response)
				} else {
					reject(response)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			
			uni.request(_config)
		})
	}
}