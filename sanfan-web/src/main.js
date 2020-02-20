// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
// import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
// import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import VueAMap, { lazyAMapApiLoaderInstance } from 'vue-amap'

import { init } from './init/index'

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

// 初始化融云
// window.RongIMLib = require('../src/libs/rongcloud/RongIMLib-2.3.5.min')
window.RongIMLib = require('../src/libs/rongcloud/RongIMLib-2.3.5')
window.RongIMClient = window.RongIMLib.RongIMClient
window.RongIMLib.RongIMEmoji = require('../src/libs/rongcloud/RongEmoji-2.2.7')

Vue.use(iView)
// Vue.use(TreeTable)
Vue.use(VOrgTree)

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'b5d1149a49d966fce91b1699e563e298',
  plugin: [
    'AMap.Geolocation',
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.GraspRoad',
    'AMap.Geocoder'
  ],
  uiVersion: '1.0.11', // 版本号
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.13'
})
lazyAMapApiLoaderInstance.load()

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

init()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
