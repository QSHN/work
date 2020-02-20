import http from './interface'
import Vue from 'vue'
import store from "../../../store";
Vue.prototype.$store = store;
let vm=new Vue()

let myBaseUrl=vm.$store.state.myBaseUrl//设置myBaseUrl
let devUrl=vm.$store.state.devUrl//开发devUrl
let access_token=""

//字典相关
export const staffType = (data) => {//oms/aid/itemtrees
	http.interceptor.request = (config) => {
		try {
			access_token= uni.getStorageSync('access_token');
		} catch (e) {
				console.log(e)
		}
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		return response;
	}
    return http.request({
		baseUrl: myBaseUrl,
        url: devUrl+'/oms/aid/itemtrees/'+data,
		method:"GET",
		dataType: 'json',
    })
}

//获取所有平台服务列表
export const allService = (size,current,serviceType) => {// /oms/service
	http.interceptor.request = (config) => {
		try {
			access_token= uni.getStorageSync('access_token');
		} catch (e) {
				console.log(e)
		}
		config.header = {
			"Authorization":"Bearer " + access_token
		}
	}
	http.interceptor.response = (response) => {
		return response;
	}
    return http.request({
		baseUrl: myBaseUrl,
        url: devUrl+'/oms/service/link?size='+size+'&current='+current+'&treeType='+serviceType,
		method:"GET",
		dataType: 'json',
    })
}


// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	staffType,//职业类别
	allService,//平台服务列表
}