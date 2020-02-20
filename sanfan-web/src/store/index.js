import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import company from './module/company'
import chat from './module/chat'
import selector from './module/selector'
import finance from './module/finance'
import timecard from './module/timecard'
import approval from './module/approval'
import task from './module/task'

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
    company,
    chat,
    selector,
    finance,
    timecard,
    approval,
    task
  }
})
