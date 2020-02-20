<script>
	export default {
			onLaunch() {
				var today = new Date().toISOString().slice(0, 10)
				var endDay = '2020-01-28'
				var oDate1 = new Date(today);
				var oDate2 = new Date(endDay);
				if(oDate1<oDate2){
					uni.showModal({
						title: '【公告】',
						content: `尊敬的各位用户，春节快乐！\r\n
新春期间由于医院放假安排，平台在1月24日（除夕）至1月27日（大年初三）暂停预约，在1月28日（大年初四）开放。平台会在预约后尽快协调上门时间，请有需要的用户提早预约下单。对于紧急的病情建议直接到医疗机构就诊，以免耽误病情。
\r\n再次祝愿大家春节快乐，阖家幸福。`,
						cancelColor: '#eeeeee',
						confirmColor: '#FF0000',
					})
				}
				
				
				
				
				uni.removeStorageSync('access_token')
				uni.removeStorageSync('vip_info')
				uni.removeStorageSync('user_info')

				const updateManager = uni.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					console.log(res);
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res2) {
							uni.showModal({
								title: '更新提示',
								content: '发现新版本，是否重启应用?',
								cancelColor: '#eeeeee',
								confirmColor: '#FF0000',
								success(res2) {
									if (res2.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
					}
				})

				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
					uni.showModal({
						title: '提示',
						content: '检查到有新版本，但下载失败，请检查网络设置',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate()
							}
						}
					})
				})
			}
		}
</script>

<style lang="scss">
	@import "./common/css/base.scss";
	@import "./common/css/iconfont.css";
</style>
