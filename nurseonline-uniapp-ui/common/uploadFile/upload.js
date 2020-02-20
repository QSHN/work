import { validatenull } from '../utils/util'
//挂载vue实例，获取全局变量
import Vue from 'vue'
const vm = new Vue()

//单文件选择，一步到位（不推荐的方法）
export async function simpleUploadImg(url,data) {
	let [ err,res ] = await uni.chooseImage()
	if(!validatenull(res) && res.errMsg === 'chooseImage:ok'){
		return await upLoadImg(url,res.tempFilePaths[0],data)
	}
	else{
		throw new Error('ChooseImage Fail')
	}
}

//调用上传文件接口（使用起来比较灵活）
export function upLoadImg(url,file,data) {
	// const baseUrl = vm.$env === 'dev' ? 'http://192.168.1.64:18003' : 'https://api.rk600.cn'
	const baseUrl = vm.$baseUrl
	
	return new Promise((resolve,reject) => {
		uni.showLoading({
			title: '上传中...'
		})
		uni.uploadFile({
			url: baseUrl + url,
			filePath: file,
			name: 'file',
			header: {
				"Authorization": 'Bearer ' + uni.getStorageSync('access_token')
			},
			formData: data,
			success: res => {
				resolve(res)
			},
			fail: () => {
				reject()
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	})
}