<template>
	<view>
		<view class="grace-idcard-main" style="margin-bottom: 100rpx;">
			<view class="wraperView"><!-- wraper开始 --> 
				<view class="left-icon">请选择您要入驻的服务机构(可多选)</view>
				 <view class="color666 text-alignC width100p title mt20" v-if="showPoint">暂无可入驻的服务机构，有疑问请联系客服</view>
				<uni-grid v-if="!showPoint"  :options="OrgListAsk" :resRaw="resRaw"  column-num="2"></uni-grid>
			</view>
		</view>
		<org-log></org-log>
	</view>
</template>
<script>
import orgLog from '@/packageA/MyOrg/orgLog.vue'		
import uniGrid from "@/components/uni-grid/uni-grid-org.vue"
var _self;
export default {
	components: {
		uniGrid,
		orgLog
	},
	data() {
		return {
			title: 'picker',
            array: ['湛江市某某某医院', '湛江市某某某护理服务中心',],
            index: 0,
			OrgListAsk:[],
			resRaw:[],
			showPoint:true
		};
	},
	computed:{
		orgUnJoinedRefresh(){
			return this.$store.state.orgUnJoinedRefresh
		}
	},
	watch:{
		orgUnJoinedRefresh(){
			console.log("我监听到了orgUnJoinedRefresh状态的变化",this.$store.state.orgUnJoinedRefresh)
			this.init()
			setTimeout(function () {
			    uni.stopPullDownRefresh();
			}, 1000);
		}
	},
	onLoad:function(){
		_self = this;
		this.init()
	},
	onPullDownRefresh() {
		this.init()
		setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		async init(){
			this.OrgListAsk=[];
			let res_org=await this.$api.getOrgList()
			let records=res_org.data.data
			this.resRaw=res_org.data.data
			console.log("orgList",records)
			console.log("this.resRaw",this.resRaw)
			if(records.length<=0){
				this.showPoint=true
				return
			}
			this.showPoint=false
			records.forEach((item,index)=>{
				this.OrgListAsk.push({
					orgId:item.orgId,
					text:item.orgName,
					bgImg:""
				})
			})
			
		},
		selectImg1 : function() {
			uni.chooseImage({
				count:1,
				success:function(res){
					_self.idCard1 = res.tempFilePaths[0];
				}
			})
		},
		selectImg2 : function() {
			uni.chooseImage({
				count:1,
				success:function(res){
					_self.idCard2 = res.tempFilePaths[0];
				}
			})
		},
		previewImg1 : function(){
			uni.previewImage({
				urls:[_self.idCard1]
			});
		},
		previewImg2 : function(){
			uni.previewImage({
				urls:[_self.idCard2]
			});
		},
		nextStepBack3:function(){
			uni.navigateBack({
				url:'step3'
			})
		},
		bindPickerChange: function(e) {
            console.log('picker发送选择改变，携带值为', e.target.value)
            this.index = e.target.value
        },
		toPersonal(){//返回个人中心
			uni.switchTab({
				url:'../index'
			})
		}
	},
}
</script>
<style>
page{background-color: #fff;}
view{font-size:28upx;}
.grace-idcard-main{margin:0;}
.grace-idcard-desc{line-height:2em; background:#FFFFFF; padding:20upx; border-radius:10upx;}
.grace-idcard-text{line-height:2em; margin-top:30upx;}
.grace-idcard-items{background:#FFFFFF; padding:30upx 0; display:flex; margin:30upx 0; border-radius:10upx; align-items: flex-start;}
.grace-idcard-uper-btn{width:276upx; margin:0 60upx; background:#F1F1F1; padding-bottom:10upx; border-radius:10upx; text-align:center;}
.grace-idcard-uper-btn .img{width:100upx; height:100upx; margin:0 auto; margin-top:30upx;}
.grace-idcard-uper-btn .img image{width:100upx; height:100upx;}
.grace-idcard-uper-btn .text{width:100%; margin-top:10upx; text-align:center; line-height:2em;}
.grace-idcard-preview{width:50%; margin:0 30upx;}
.grace-idcard-preview image{width:100%;}
.mt77p{margin-top:77%;}
.to{flex-shrink:0;width:40upx;height:28upx}
.grace-idcard-alL{text-align: left;}
.title{font-size:24upx;}
</style>