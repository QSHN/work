<template>
	<view class="flex-column justify-between information-box">
		<view>
			<view class="flex-msg border-01 padding-20 bg-white">
				<text>联系人姓名</text>
				<input class="tr" type="text" v-model="form.linkman" placeholder="请填写您的姓名" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>联系人方式</text>
				<input class="tr" type="text" v-model="form.linkmanPhone" placeholder="请输入联系方式" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>服务对象真实姓名</text>
				<input class="tr" type="text" v-model="form.custName" placeholder="请填写服务对象姓名" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>服务对象联系方式</text>
				<input class="tr" type="text" v-model="form.custPhone" placeholder="请输入服务对象联系方式" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>性别</text>
				<picker :range="sexColumn" @change="sexChange" :value="sexColumnIndex" range-key="label">
					<text v-if="sexColumn[sexColumnIndex].label">{{sexColumn[sexColumnIndex].label}}</text>
					<text class="icon iconfont" v-else>&#xe6f8;</text>
				</picker>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>年龄</text>
				<input class="tr" type="text" v-model="form.custAge" placeholder="请输入服务对象年龄" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>身份证号码</text>
				<input class="tr" type="text" v-model="form.custIdNo" placeholder="请输入服务对象身份证号码" placeholder-class="font-grey"/>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view>住院日期</view>
				<view class="bg-white padding-10 pick-box">
                    <picker mode="date" :value="inDate" :start="startDate" :end="endDate" @change="inDateChange">
						<text v-if="inDate">{{inDate}}</text>
						<text class="icon iconfont" v-else>&#xe6f8;</text>
                    </picker>
                </view>
			</view>
			<view class="bottom-01 bg-white padding-20 flex-msg">
				<view>出院日期</view>
				<view class="bg-white padding-10 pick-box">
				    <picker mode="date" :value="outDate" :start="startDate" :end="endDate" @change="outDateChange">
				        <text v-if="outDate">{{outDate}}</text>
				        <text class="icon iconfont" v-else>&#xe6f8;</text>
				    </picker>
				</view>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>医院名称</text>
				<view class="bg-white padding-10 pick-box">
					<picker :range="hospitalList" @change="hospitalChange" :value="hospitalIndex" range-key="orgName">
						<text v-if="hospitalList[hospitalIndex].orgName">{{hospitalList[hospitalIndex].orgName}}</text>
						<text class="icon iconfont" v-else>&#xe6f8;</text>
					</picker>
				</view>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>科室</text>
				<view class="bg-white padding-10 pick-box">
					<picker :range="officeList" @change="officeChange" :value="officeIndex" range-key="officeName">
						<text v-if="officeList[officeIndex].officeName">{{officeList[officeIndex].officeName}}</text>
						<text class="icon iconfont" v-else>&#xe6f8;</text>
					</picker>
				</view>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>医生姓名</text>
				<input class="tr" type="text" v-model="form.doctorName" placeholder="请填写医生的姓名" placeholder-class="font-grey"/>
			</view>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>病床号</text>
				<input class="tr" type="text" v-model="form.bedNo" placeholder="请填写病床号" placeholder-class="font-grey"/>
			</view>
			<navigator url="../../pages/date/list" class="flex-msg border-01 padding-20 bg-white">
				<text>上门时间</text>
				<view class="bg-white padding-10 pick-box">
					<text v-if="serviceTime.reserveDate">
						{{serviceTime.reserveDate + ' ' + serviceTime.reserveTime1 + '-' + serviceTime.reserveTime2}}
					</text>
					<text class="icon iconfont" v-else>&#xe6f8;</text>
				</view>	
			</navigator>
			<view class="flex-msg bottom-01 padding-20 bg-white">
				<text>地址</text>
				<input class="tr" type="text" v-model="form.custAddress" placeholder="请输入服务地址" placeholder-class="font-grey"/>
			</view>
		</view>
		
		<view class="bg-white bottom-20">
			<view class=" padding-20">
				<title-card title="主要诊断"></title-card>
				<textarea v-model="form.symptomsDesc" placeholder="请输入主要诊断内容" class="symptomsDesc" v-show="!dialogVisible" />
				<view class="simulate-textarea" v-show="dialogVisible">
					<rich-text :nodes="symptomsDescText"></rich-text>
				</view>
			</view>
			<view class=" padding-20">
				<title-card title="主要症状"></title-card>
				<textarea v-model="form.diseaseDesc" placeholder="请输入主要症状内容" class="diseaseDesc" v-show="!dialogVisible" />
				<view class="simulate-textarea" v-show="dialogVisible">
					<rich-text :nodes="diseaseDescText"></rich-text>
				</view>
			</view>	

			<view class=" padding-20">
				<text class="flex-column align-center bottom-10">请上传最新的就医证明(如病历、出院总结等)以便订单审核</text>
				<view class="upload-area justify-between">
					<template v-for="(item,index) in imgList">
						<template v-if="item.certImgPath">
							<view class="upload-box" @tap.stop="previewImg(item.certImgPath)" :key="index">
								<view class="flex-center tip">
									<image :src="item.certImgPath" mode="aspectFit" />
								</view>
								<view class="close-area flex-center bg-white" @tap.stop="removeImg(index)">
									<text class="iconfont">&#xe615;</text>
								</view>
							</view>
						</template>
					</template>
					<template v-if="imgList.length < 6">
						<view class="upload-box" @tap.stop="uploadImg">
							<view class="flex-column flex-center tip" >
								<text class="iconfont upload-icon">&#xe6b3;</text>
								<text>上传照片</text>
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
				
		<view class="button-area">
			<button @tap="orderPay" :disabled="canSubmit">提交</button>
		</view>
	</view>
</template>


<script>
	import { getAllOrg,getOrgList,getServiceList,getOrgServiceDetail,getInformedContent,submitOrder,getOfficeName } from '@/common/api/service/service'
	import { simpleUploadImg } from '@/common/uploadFile/upload'
	import { submitBill,getPrice } from '@/common/api/bill/bill'
	import { getVipInfo } from '@/common/api/user'
	import { mapGetters,mapMutations } from 'vuex'
	export default{
		data() {
			const currentDate = this.getDate({
            format: true,
			})
			return {
				vipInfo: {},
				vipId:'',
				vipName:'',
				inDate: '',
				outDate: '',
				reserveDate: '',
				reserveTime1: '',
				reserveTime2: '',
				imgList: [],
				sexColumnIndex: '',
				sexColumn: [
					{
						label: '男',
						custSex: '1'
					},
					{
						label: '女',
						custSex: '2'
					},
				],
				hospitalIndex: '',
				hospitalList: [],
				officeIndex: '',
				officeList: [],
				form:{
					fupBillType: '0',
					linkman:'',
					linkmanPhone:'',
					custName:'',
					custPhone:'',
					custIdNo:'',
					custAge:'',
					doctorName:'',
					bedNo:'',
					custAddress:'',
					symptomsDesc:'',
					diseaseDesc:'',
				},
				id: '',
				proveImgPath:'',
				hasDetail: '',
				detail: {}
			}
				
		},
		computed: {
			...mapGetters(['serviceTime','address','patients','billCertList']),
			startDate() {
					return this.getDate('start');
				},
				endDate() {
					return this.getDate('end');
				},
			diseaseDescText() {
				let result = this.diseaseDesc
				if (this.diseaseDesc == '') {
					result = '请输入主要症状内容'
				}
				return result
			},
			symptomsDescText() {
				let result = this.symptomsDesc
				if (this.symptomsDesc == '') {
					result = '请输入主要症状内容'
				}
				return result
			}
			
		},
		onShow() {
			if(this.billCertList.length > 0){
				this.imgList = this.billCertList
			}
		},
		
		
		async onLoad(e) {
			// this.id = e.id;
			let { data } = await getAllOrg()
			if(data.msg === 'success'){
				if(data.data.records.length > 0){
					this.hospitalList = data.data.records
					this.fetchHospital(this.hospitalList[0].orgId)
					
				}
			}
		},
		created() {
			getVipInfo().then(response => {
				let data = response.data
				if(data.msg === 'success'){
					this.vipInfo = Object.assign({},data.data)
					this.vipId=this.vipInfo.vipId
					this.vipName=this.vipInfo.vipName
				}
			})
		},
		methods:{
				inDateChange(e) {
					this.inDate = e.target.value
				},
				outDateChange(e) {
					this.outDate = e.target.value
				},
				getDate(type) {
					const date = new Date();
					let year = date.getFullYear();
					let month = date.getMonth() + 1;
					let day = date.getDate();

					if (type === 'start') {
						year = year - 60;
					} else if (type === 'end') {
						year = year + 2;
					}
					month = month > 9 ? month : '0' + month;;
					day = day > 9 ? day : '0' + day;
					return `${year}-${month}-${day}`;
				},
				sexChange(e) {
					this.sexColumnIndex = e.detail.value	
				},
				fetchHospital(orgId) {
					this.fetchService(orgId)
				},
				hospitalChange(e) {
					this.hospitalIndex = e.detail.value
					this.orgId=this.hospitalList[e.detail.value].orgId
					this.orgName=this.hospitalList[e.detail.value].orgName
					this.fetchService(this.hospitalList[e.detail.value].orgId)
					getOfficeName(this.orgId).then(response => {
								if(response.data.msg === 'success'){
									if(response.data.data.length > 0){
										this.officeList = response.data.data
									}
								}								
							})						
					},
					fetchService(orgId){					
						
					},
					officeChange(e) {
						this.officeIndex = e.detail.value
						this.officeId=this.officeList[e.detail.value].officeId
						this.officeName=this.officeList[e.detail.value].officeName
						console.log(this.officeId)
						console.log(this.officeName)
					},			
					uploadImg() {
						simpleUploadImg('/nursing-admin/fup/bill/upload',{
							resType: 'billCert'
						}).then(response => {
							let data = JSON.parse(response.data)
							this.imgList.push({
								certImgPath: data.data
							})
							this.proveImgPath = data.data
						}).catch(e => {
							console.log('用户取消上传或上传失败')
						})
					},
					getImgs() {
						this.$store.commit('SET_BILL_CERT_LIST',this.imgList)
						uni.navigateBack({
							delta: -1
						})
					},
					previewImg(img) {
						uni.previewImage({
							urls: [ img ]
						})
					},
					removeImg(idx) {
						this.imgList.splice(idx,1)
					},
					
					async orderPay() {
						this.form = Object.assign({},this.form,{
									custSex:this.sexColumn[this.sexColumnIndex].custSex,
									inDate:this.inDate,
									outDate:this.outDate,
									reserveDate:this.serviceTime.reserveDate,
									reserveTime1:this.serviceTime.reserveTime1.slice(0,2),
									reserveTime2:this.serviceTime.reserveTime2.slice(0,2),
									vipId:this.vipId,
									vipName:this.vipName,
									orgId:this.orgId,
									orgName:this.orgName,
									officeId:this.officeId,
									officeName:this.officeName,
									proveImgPath:this.proveImgPath,
									})
						console.log(this.form)
						if(this.form.linkman==''){
							uni.showToast({
								title: '联系人姓名不能为空',
								icon: 'none',
								mask: true
							})
						}else if(this.form.linkmanPhone==''){
						uni.showToast({
							title: '联系电话不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.custName==''){
						uni.showToast({
							title: '服务对象真实姓名不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.custPhone==''){
						uni.showToast({
							title: '服务对象联系电话不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.custSex==''){
						uni.showToast({
							title: '请选择性别',
							icon: 'none',
							mask: true
						})
					}else if(this.form.custAge==''){
						uni.showToast({
							title: '年龄不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.custIdNo==''){
						uni.showToast({
							title: '身份证号码不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.inDate==''){
						uni.showToast({
							title: '住院日期不能为空',
							icon: 'none',
							mask: true
						})
					}
					else if(this.form.outDate==''){
						uni.showToast({
							title: '出院日期不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.orgName==''){
						uni.showToast({
							title: '请选择医院名称',
							icon: 'none',
							mask: true
						})
					}else if(this.form.officeName==''){
						uni.showToast({
							title: '请选择科室',
							icon: 'none',
							mask: true
						})
					}else if(this.form.doctorName==''){
						uni.showToast({
							title: '医生姓名不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.bedNo==''){
						uni.showToast({
							title: '病床号不能为空',
							icon: 'none',
							mask: true
						})
					}
					else if(this.form.reserveDate==''){
						uni.showToast({
							title: '请选择上门时间',
							icon: 'none',
							mask: true
						})
					}else if(this.form.custAddress==''){
						uni.showToast({
							title: '地址不能为空',
							icon: 'none',
							mask: true
						})
					}
					else if(this.form.symptomsDesc==''){
						uni.showToast({
							title: '主要诊断不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.diseaseDesc==''){
						uni.showToast({
							title: '主要症状不能为空',
							icon: 'none',
							mask: true
						})
					}else if(this.form.proveImgPath==''){
						uni.showToast({
							title: '请上传就医证明',
							icon: 'none',
							mask: true
						})
					}
					else{
						await submitOrder(this.form).then(response => {
							console.log(response)
							if(response.data.msg === 'success'){
								this.$store.commit('INIT_STORE')
								uni.showToast({
									title: '提交成功！',
									icon: 'none',
									mask: true
								})
								setTimeout(() => {
									this.$store.commit('SET_TAB_SELECT', 2)
									uni.switchTab({
										url: '/pages/tab/order'
									})
								},500)
							}
						})
					}
						
					},
				},

		
	}
</script>

<style lang="scss">
	.content{
		min-height: 100%;
		padding: 20rpx 50rpx 210rpx;
		box-sizing: border-box;
	}
	.pic-box{
		color:#6e8cfa;
		border: 1px dashed #6e8cfa;
	}
	.upload-area{
		flex-wrap: wrap;
		margin-top: 30rpx;
		.upload-box{
			width: 45%;
			height: 330rpx;
			margin-bottom: 20rpx;
			border: 1px dashed #595757;
			border-radius: 8rpx;
			position: relative;
			.tip{
				height: 100%;
				overflow: hidden;
			}
			.close-area{
				position: absolute;
				border: 1px solid;
				border-radius: 50%;
				padding: 4rpx;
				right: -14rpx;
				top: -14rpx;
				width: 36rpx;
				height: 36rpx;
				.iconfont{
					font-size: 38rpx;
				}
			}
			.upload-icon{
				font-size: 70rpx;
			}
			image{
				width: 100%;
			}
		}
	}
	.symptomsDesc{
		margin-top: 10rpx;
		height: 180rpx;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eee;
		padding: 20rpx;
		border-radius: 8rpx;
	}
	.diseaseDesc{
		margin-top: 10rpx;
		height: 180rpx;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eee;
		padding: 20rpx;
		border-radius: 8rpx;
	}
	.submit-content {
		width: 100%;
		height: 100%;
		cursor: default;
		user-select: none;
		overflow-x: hidden;
	}
	.simulate-textarea {
		margin-top: 10rpx;
		height: 180rpx;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eee;
		padding: 20rpx;
		border-radius: 8rpx;
		display: block;
		position: relative;
	}
</style>
