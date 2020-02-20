import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import selectInfo from './module/selectInfo'
import listNav from './module/listNav'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    selectInfo,
    listNav
  }
})
