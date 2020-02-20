const vuextest = {
	state: {
		address: '默认地址'
	},
	mutations: {
		SET_ADDRESS: (state,address) => {
			state.address = address
		}
	}
}

export default vuextest