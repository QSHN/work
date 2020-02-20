import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import basicInfo from './modules/basicInfo'
import utils from './modules/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    basicInfo,
    utils
  },
  getters
})

export default store
