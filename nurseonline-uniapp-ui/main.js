import Vue from 'vue'
import App from './App'
import store from './store'
import TitleCard from './components/TitleCard.vue'

//全局过滤器
import { priceFormat } from './common/utils/filter'

Vue.filter('priceFormat',priceFormat)

Vue.config.productionTip = false

Vue.prototype.$store = store

//开发环境
Vue.prototype.$env = 'dev'
//生产环境
// Vue.prototype.$env = 'pro'

Vue.prototype.$service = '17707599741'

if (process.env.NODE_ENV == 'production') {
    Vue.prototype.$env = 'pro'
    Vue.prototype.$baseUrl = 'https://api.youjiahu.com'
    Vue.prototype.$pswEncode = 'VFBVbNlbNYz6j8z2'
	// Vue.prototype.$pswEncode = 'yjhtyjhtyjhtyjht'   // 测试登录加密
}else{
	//Vue.prototype.$baseUrl = 'https://api.rk600.cn'
	// Vue.prototype.$baseUrl = 'https://api.youjiahu.com'
	// Vue.prototype.$pswEncode = 'VFBVbNlbNYz6j8z2'
	Vue.prototype.$baseUrl = 'https://yjh.caochuanxi.com'
	Vue.prototype.$pswEncode = 'yjhtyjhtyjhtyjht'   // 测试登录加密
	// Vue.prototype.$baseUrl = 'https://apitest.ry600.site'
	// Vue.prototype.$baseUrl = 'http://192.168.1.64:18003'
	// Vue.prototype.$pswEncode = 'pigxpigxpigxpigx'   // 开发登录加密
}

App.mpType = 'app'

Vue.component('title-card',TitleCard)

const app = new Vue({
    ...App,
	store
})
app.$mount()
