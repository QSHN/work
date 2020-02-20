const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  myInfo: state => state.user.myInfo,
  allUserList: state => state.user.allUserList,
  basicInfo: state => state.basicInfo.basicInfo,
  basicData: state => state.basicInfo.basicData,
  uploadConf: state => state.utils.uploadConf
}
export default getters
