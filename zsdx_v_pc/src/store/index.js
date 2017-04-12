import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
// 组件store
import Public from './modules/public'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    Public
  }
})
