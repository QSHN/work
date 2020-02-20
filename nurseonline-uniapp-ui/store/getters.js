const getters = {
  access_token: state => state.user.access_token,
	userInfo: state => state.user.userInfo,
	vipInfo: state => state.user.vipInfo,
	city: state => state.common.city,
	address: state => state.pay.address,
	patients: state => state.pay.patients,
	serviceTime: state => state.pay.serviceTime,
	billCertList: state => state.pay.billCertList,
	scanUserInfo: state => state.common.scanUserInfo,
	identityInfo: state => state.common.identityInfo,
	codeDate: state => state.common.codeDate,
	tabSelect: state => state.common.tabSelect,
}
export default getters