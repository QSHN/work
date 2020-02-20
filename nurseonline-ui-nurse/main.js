import Vue from 'vue'
import App from './App'

// 引入vuex 状态库
import store from "./store";
Vue.prototype.$store = store;

// 全局挂载后使用 request 统一管理
	//注册登录认证相关 相关
	import api from '@/static/common/api/'
	Vue.prototype.$api = api
	//字典相关
	import apid from '@/static/common/api/indexDictionary.js'
	Vue.prototype.$apid = apid
	//个人中心相关
	import apip from '@/static/common/api/indexPersonal.js'
	Vue.prototype.$apip = apip
	//订单、预约相关
	import apio from '@/static/common/api/indexOrder.js'
	Vue.prototype.$apio = apio
	//表单校验相关
	import validate from '@/static/js/validate.js'
	Vue.prototype.$validate = validate

//tab-stzhang-model
import '@/static/css/reset.scss'
import '@/static/js/constant.js'

//tar-global-js //加密解密
import targb from '@/static/js/tarGlobal.js'
Vue.prototype.$targb = targb


//const app
const app = new Vue({
    ...App
})
app.$mount()