<template>
	<view>
		<view class="padding-10 title tc"># 可提前4小时预约</view>
		<view class="week-area flex">
			<view class="flex-center flex-column bg-white week-box padding-20-0" 
				  :class="{'isSelected': selectWeek == index}"
				  v-for="(item,index) in weeks"
				  :key="index"
				  @tap="changeWeek(index)">
				<view>{{item.week}}</view>
				<view>{{item.date | filterDate}}</view>
			</view>
		</view>
		<view class="bg-white padding-20 flex time-box">
			<view class="tc time-area"
				  :class="{'has-bottom': index > 19,'isSelected': selectTime === index,'cantChoose': !item.canChoose}"
				  v-for="(item,index) in timesList"
				  :key="index"
				  @tap="changeTime(index,item)">
				{{item.time}}
			</view>
		</view>
		<view class="button-area">
			<button @tap="backTo">确定</button>
		</view>
	</view>
</template>

<script>
import { getDays,getAllTimes } from '../../common/utils/util.js'
import { mapMutations } from 'vuex'
export default {
	data() {
		return {
			selectWeek: 0,
			selectTime: 0,
			weeks: []
		}
	},
	filters: {
		filterDate: function(value) {
			let date = new Date()
			let year = date.getFullYear()
			return value.replace(year + '-','')
		}
	},
	created(){
		this.weeks = getDays(7)
		this.weeks[0].week = '今天'
	},
	computed: {
		timesList() {
			let allTimes = getAllTimes()
			let select = this.weeks[this.selectWeek].date
			let selectTime = new Date(select)
			let now = new Date()
			
			if(selectTime <= now){
				let checkTime = now.setHours(now.getHours() + 4)
				for(let i=0; i<allTimes.length; i++){
					let time = select + ' ' + allTimes[i].time
					time = new Date(time).getTime()
					if(time <= checkTime){
						allTimes[i].canChoose = false
					}
					else{
						break
					}
				}
			}
			
			return allTimes
		}
	},
	methods: {
		backTo() {
			let timesList = this.timesList
			let selectTime = this.selectTime
			if(timesList[selectTime].canChoose){
				let time = selectTime + 1 < timesList.length ? timesList[selectTime + 1].time : '24:00'
				
				this.$store.commit('SET_SERVICE_TIME',{
					reserveDate: this.weeks[this.selectWeek].date,
					reserveTime1: timesList[selectTime].time,
					reserveTime2: time
				})
				uni.navigateBack({
					delta: -1
				})
			}
			else{
				uni.showToast({
					title: '请选择服务时间',
					icon: 'none',
					mask: true
				})
			}
		},
		changeWeek(idx){
			this.selectWeek = idx
		},
		changeTime(idx,item){
			if(item.canChoose){
				this.selectTime = idx
			}
		}
	}
}
</script>

<style lang="scss">
	.title{
		background-color: #fbf2bf;
		color: #856543;
	}
	
	.week-area{
		.week-box{
			background-color: #f0f2f5;
			font-size: 24rpx;
			flex: 1;
			&.isSelected{
				background-color: #6E8CFA;
				color: #fff;
			}
		}
	}
	.time-box{
		flex-wrap: wrap;
		.time-area{
			width: 25%;
			height: 100rpx;
			line-height: 100rpx;
			border-top: 1px solid #e6e6e6;
			border-left: 1px solid #e6e6e6;
			box-sizing: border-box;
			&:nth-child(4n){
				border-right: 1px solid #e6e6e6;
			}
			&.has-bottom{
				border-bottom: 1px solid #e6e6e6;
			}
			&.isSelected{
				background-color: #6E8CFA;
				color: #fff;
			}
			&.cantChoose{
				background-color:#f1f1f1;
				color:#949494;
			}
		}
	}
	.button-area{
		margin-top: 50rpx;
	}
</style>
