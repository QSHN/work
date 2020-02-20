<template>
	<view style="background:#fff;">
		<view v-if='ReadRecOnly'class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#当前页只可查看，不可修改
		</view>
		<view v-else class="grace-idcard-alL color6e8cfa bgc-fff border-bottom-8 padding-10-0 pl45">
			#如果信息与评估不一致，请修改!
		</view>
	
		
		<view class="grace-idcard-main uni-padding-wrap uni-common-mt">
			
			<view class="uni-title uni-common-pl padding"><view class="left-icon">服务对象基本信息</view></view>
			<!-- input -->
			<view class="bottom-01 bg-white padding flex-box horizontal-between vertical-center border-bottom" v-for="(type,typeIndex) in InputList" :key="typeIndex">
				<view class="flex-item">{{type.name}}</view>
				
				<view v-if="type.type === 'select'">
					<picker :disabled="ReadRecOnly" :range="sex_column" @change="sexChange" :value="sexIdx" range-key="label">
						<view class="picker">{{sex_column[sexIdx].label}}</view>
					</picker>
				</view>
				<view v-else><input :disabled="ReadRecOnly" class="flex-item uni-input" v-model="type.value" name="type.name" :placeholder="type.placeholder" placeholder-class="holder"/></view>
			</view>

			<view style="margin-top:38upx;padding-bottom: 18px;">
				<button type="primary color6d8bf9" @tap="toJudgeMain">下一步</button>
			</view>
			
			</view><!-- wraper结束 -->
		</view>
	</view>
</template>

<script>
	export default {
        components: {
        },
		data() {
            return {
			  sexIdx: 0,
			  InputList:[
				  {name:"姓名",
				   placeholder:"",
				   value:"",
				   type:"input",
				  },
				  {name:"性别",
				   placeholder:"",
				   value:"女",
				   type:"select",
				   column: [
				   	{
				   		label: '男',
				   		value: '0'
				   	},
				   	{
				   		label: '女',
				   		value: '1'
				   	},
				   ]
				  },
				  {name:"年龄",
				   placeholder:"",
				   value:"",
				   type:"input"
				  },
				  {name:"身份证号",
				   placeholder:"",
				   value:"",
				   type:"input"
				  },
			  ],
			  sex_column: [
			  	{
			  		label: '男',
			  		value: '0'
			  	},
			  	{
			  		label: '女',
			  		value: '1'
			  	},
			  ],
			  ReadRecOnly:false
			  }
		},
		onLoad() {
			this.init()
		},
        computed: {
        },
		methods: {
			async init(){
				//是否只读
				this.ReadRecOnly=this.$store.state.ReadRecOnly
				
				console.log("this.$store.state.rec",this.$store.state.rec)
				let res=this.$store.state.rec
				this.InputList[0].value=res.custName
				this.InputList[1].value=res.sex
				this.InputList[2].value=res.age
				this.InputList[3].value=res.idNo
			},
			async toJudgeMain(){
				// uni.showLoading({})
				this.$store.state.rec.custName=this.InputList[0].value
				this.$store.state.rec.sex=this.InputList[1].value
				this.$store.state.rec.age=this.InputList[2].value
				this.$store.state.rec.idNo=this.InputList[3].value
				this.$store.state.rec.recId=this.$store.state.recId
				// data.recId=this.$store.state.recId
				// let str='record='+true+'&position='+this.longitude+','+this.latitude//record挂在url上
				// let res_data=await this.$apio.goNurseRec(this.$store.state.rec)
				// uni.hideLoading()
				
				uni.navigateTo({
					url:'judgeMain',
				})
			},
			bindTextAreaBlur: function (e) {
				console.log(e.detail.value)
				}
			},
			sexChange(e) {
				console.log("e.detail.value",e.detail.value)
				this.sexIdx = e.detail.value
			},
	}
</script>

<style lang="scss">
	.content{
		background-color: $uni-bg-color;
	}
	
	.part{
		background: $uni-bg-color;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		margin-bottom: 20upx;
	}

	.padding {
		padding: 25upx 40upx;
	}

	.flexRow{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}

    .tj{
		margin-bottom: 0;
		padding-bottom: 0;
		.tjTitle{
			display: flex;
			flex-direction: row;
			border-bottom: 1upx solid #ebedf0;
			padding: 40upx 0;
            .left{
				flex: 1;
				text-align: left;
				font-size: $uni-font-size-base;
				font-weight: bold;
			}
			.right{
				flex: 1;
				text-align: right;
				color: $uni-text-color-grey;
			}
		}
		.tjBody{
			justify-content: flex-start;
			border-bottom: 1upx solid #f5f5f5;
		}
	}
.list{
	width:100%;border-bottom:solid 26upx #f1f1f1;
	.li{
		width:92%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
	&.noborder{border-bottom:0}
		.icon{
			flex-shrink:0;width:50upx;height:50upx;
			image{width:50upx;height:50upx}
		}
		.text{padding-left:20upx;width:100%;color:#666}
		.to{flex-shrink:0;width:40upx;height:40upx}
	}
}
.uni-textarea textarea{
	width:auto;
	height:80px;
	background-color: #eeeff3;
}
.inline-block{
	display: inline-block
}
.to{flex-shrink:0;width:40upx;height:28upx}
input{
	text-align: right;
}
</style>
