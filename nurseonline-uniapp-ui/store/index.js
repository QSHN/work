import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import common from './modules/common'
import pay from './modules/pay'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		user,
		common,
		pay
	},
	getters
})

export default store