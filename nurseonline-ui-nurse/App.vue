<script>
	export default {
		onLaunch: function() {
		console.log('App Launch');

			const updateManager = uni.getUpdateManager()
            updateManager.onCheckForUpdate(function(res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function(res2) {
                        uni.showModal({
                            title: '更新提示',
                            content: '发现新版本，是否重启应用?',
                            cancelColor:'#eeeeee',
                            confirmColor:'#FF0000',
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
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共scss */
	@import "static/css/base.scss";
	@import "static/css/iconfont.css";
</style>
