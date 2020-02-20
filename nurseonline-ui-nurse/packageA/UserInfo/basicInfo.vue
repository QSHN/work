<template>
	<view>
		<form @submit="formSubmit">
		  <view class="wraperView">
			<view>
				<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(user,propIndex) in userInfo" :key="propIndex">
					<view>{{user.label}}</view>
					<view v-if="user.type === 'select'" >
						<picker :range="user.column" @change="sexChange" :value="sexIdx">
							<view>{{user.column[sexIdx]}}</view>
						</picker>
					</view>
					<view v-else>
						<input class="uni-input tr" :disabled="user.disabled" name="input" v-model="user.value" :placeholder="user.placeholder" />
					</view>
				</view>
			</view>
			<view class="btn-area">
				<button formType="submit" @tap="backToIndex" class="bgc-6e8cfa">保存</button>
			</view>
		 </view>
		</form>
	</view>
</template>

<script>
var receiveInfo;	
var myBaseUrl;
var devUrl;
var nursing_upms;
var _self;

export default {
	data() {
		return {
			sexIdx: "",
			date: '1993-10-04',
			userInfo: [
				// {
				// 	label: '用户名',
				// 	prop: 'username',
				// 	type: 'text',
				// 	placeholder: '',
				// 	value:"",
				// 	disabled:true
				// },
				{
					label: '真实姓名',
					prop: 'weight',
					type: 'text',
					value:"50kg",
					placeholder: '',
					disabled:true
				},	
				{
					label: '手机号',
					prop: 'height',
					type: 'text',
					value:'165cm',
					placeholder: '请输入你的手机号',
					disabled:false
				},
				// {
				// 	label: '出生日期',
				// 	prop: 'borndate',
				// 	type: 'date'
				// },
				{
					label: '年龄',
					prop: 'mobile',
					type: 'text',
					value:'',
					placeholder: '请输入你的年龄'
				},			
			],
			saveArr:{
				
			},
			src:'',
			imgUrl:'',//提交缓存后的头像
			access_token:''
		}
	},
	onLoad() {
		this.init()
		myBaseUrl=this.$store.state.myBaseUrl
		devUrl=	this.$store.state.devUrl
		nursing_upms=this.$store.state.nursing_upms
		_self=this
	},
	methods: {
		async init(){
			let res_info=await this.$apip.getPersonalInfo()
			console.log(res_info.data.data)
			receiveInfo=res_info.data.data
			// this.userInfo[0].value=receiveInfo.userName
			this.userInfo[0].value=receiveInfo.staffName
			this.userInfo[1].value=receiveInfo.phone
			this.userInfo[2].value=receiveInfo.age
			this.sexIdx=receiveInfo.sex
			
		},
		sexChange(e) {
			this.sexIdx = e.detail.value
			
		},
		dateChange(e) {
			this.date = e.detail.value
			
		},
		async backToIndex(){//保存信息
			let res_info=await this.$apip.getPersonalInfo()
			let res_info_data=res_info.data.data
			res_info_data.age=this.userInfo[2].value
			res_info_data.phone=this.userInfo[1].value
			let res=await this.$apip.savePersonalInfo(res_info_data)
			uni.navigateBack({
				url:'index'
			})
		},
		ages(str){//根据出生日期计算年龄  alert(ages("1980-03-22"))
				var   r   = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);     
				if(r==null)return   false;     
				var   d=   new   Date(r[1],   r[3]-1,   r[4]);     
				if   (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])   
				{   
					  var   Y   =   new   Date().getFullYear();   
					  return((Y-r[1]));   
				}   
				return("输入的日期格式错误！");   
		}
	}
}
</script>

<style lang="scss" scoped>
	image{
		width: 80upx!important;
		height: 80upx!important;
	}
	.padding{
		padding: 20upx;
	}
	.bottom-20{
		margin-bottom: 20upx;
	}
	.bottom-01{
		margin-bottom: 2upx;
	}
	.avatar-box{
		width: 80upx;
		height: 80upx;
		// border-radius: 50%;
		overflow: hidden;
		border:1px solid #ccc;
		padding:15upx;
		image{
			width: 100%;
		}
	}
	.btn-area{
		margin-top: 40upx;
		button{
			width: 90%;
			background-color: #00b28e;
			border-color: #75d4c0;
			color: #fff;
			border-radius: 10upx;
		}
	}
</style>
