const pay = {
	state: {
		address: {},
		patients: {},
		serviceTime: {},
		billCertList: []
	},
	mutations: {
		SET_ADDRESS: (state,address) => {
			state.address = Object.assign({},state.address,address)
		},
		SET_PATIENTS: (state,patients) => {
			state.patients = Object.assign({},state.patients,patients)
		},
		SET_SERVICE_TIME: (state,serviceTime) => {
			state.serviceTime = Object.assign({},state.serviceTime,serviceTime)
		},
		SET_BILL_CERT_LIST: (state,billCertList) => {
			state.billCertList = billCertList
		},
		INIT_STORE: (state) => {
			state.address = {}
			state.patients = {}
			state.serviceTime = {}
			state.billCertList = []
		},
		INIT_ADDRESS: (state) => {
			state.address = {}
		}
	}
}
export default pay