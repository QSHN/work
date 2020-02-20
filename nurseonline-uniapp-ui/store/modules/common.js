const common = {
	state: {
		city: {},
		scanUserInfo: {},
		identityInfo: {},
		codeDate: '',
		tabSelect: 1,
	},
	mutations: {
		SET_CITY: (state,city) => {
			state.city = Object.assign({},state.city,city)
		},
		SET_SCAN_USER_INFO: (state, data) => {
			state.scanUserInfo = Object.assign({}, state.scanUserInfo, data)
		},
		REMOVE_SCAN_USER_INFO: (state) => {
			state.scanUserInfo = {}
		},

		SET_IDENTITY_INFO: (state, data) => {
			state.identityInfo = Object.assign({}, state.identityInfo, data)
		},
		REMOVE_IDENTITY_INFO: (state) => {
			state.identityInfo = {}
		},
		SET_CODEDATE: (state, date) => {
			state.codeDate = date
		},
		SET_TAB_SELECT: (state, data) => {
			state.tabSelect = data
		},
	}
}

export default common