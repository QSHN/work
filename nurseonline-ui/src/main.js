import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import router from './router/router'
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // 全局filter
import './styles/common.scss'
// 引入avue的包
// import Avue from '@smallwei/avue/lib/index.js'
import Avue from '@smallwei/avue/lib/avue.js';
// 引入avue的样式文件
// import '@smallwei/avue/lib/theme-chalk/index.css'
import '@smallwei/avue/lib/index.css';
import basicContainer from './components/basic-container/main'
// 插件 json 展示
import vueJsonTreeView from 'vue-json-tree-view'
// 饿了么高德地图组件
import VueAMap from 'vue-amap'

import { validatenull } from '@/util/validate'
//图片查看插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
// 动态获取系统图标库
import {getSysIconfonts} from '@/api/nursing/sys/sys'
Vue.use(preview)

Vue.prototype.validatenull = validatenull

Vue.use(Avue, { menuType: 'text', size: "small" })

Vue.use(router)

Vue.use(vueJsonTreeView)

Vue.use(VueAxios, axios)

Vue.use(VueAMap);

// 注册全局容器
Vue.component('basicContainer', basicContainer)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

//加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

// 动态加载系统的阿里云字体库
getSysIconfonts(1).then(({data}) => {
  if(!data.data) return;
  data.data.forEach(rec => {
    loadStyle(iconfontUrl.replace('$key', rec.projectId + "_" + rec.projectVersion))
  })
}).catch(err => console.log("加载图标库失败！", err))

// 高德地图配置
VueAMap.initAMapApiLoader({
  key: 'f3d6e955f387f56ae1aab58f587372d4',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
