<template>
	<div class="bill-process">
		<el-dialog :visible.sync="showModal" title="处理过程" width="500px">
			<div class="timeline" v-loading="loading">
				<div v-if="!dt.length">暂无数据</div>
				<div :class="['timeline-item', (index === dt.length -1) ? 'last-item' : '']" v-for="(item, index) in dt" :key="index" @click="showDetail(item.trackId)">
					<div class="time">{{item.createTime}}</div>
					<div>{{item.actionName}}</div>
					<div class="user"><i class="icon-ry-person"></i> {{item.userName}}</div>
				</div>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
		<el-dialog :visible.sync="detail.show" title="处理过程详情">
			<div class="detail" v-loading="detail.loading">
				<div class="d-item"><i>服务单号：</i><span>{{detail.dt.billId}}</span></div>
				<div class="d-item"><i>预约单号：</i><span></span></div>
				<div class="d-item"><i>用户名：</i><span>{{detail.dt.userName}}</span></div>
				<div class="d-item"><i>创建时间：</i><span>{{detail.dt.createTime}}</span></div>
				<div class="d-item"><i>活动名称：</i><span :title="detail.dt.actionName">{{detail.dt.actionName}}</span></div>
				<div class="d-item"><i>目前地址：</i><span :title="detail.dt.position">{{detail.dt.position}}</span></div>
				<div class="d-item d-item-img"><i>图片：</i><img v-if="detail.dt.imgUrl" :src="detail.dt.imgUrl"/><span v-else>暂无图片</span></div>
			</div>
			<div slot="footer"><el-button @click="detail.show = false;">取消</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
	// import { check, invoiceState, payState, billState, relationForCust, billType } from '@/api/nursing/bill/bill'
	import { getBillTrack, getTaskTrack, getTrackDetail } from '@/api/nursing/bill/billtrack'
	export default {
		name: "billProcess",
		data(){
			return {
				showModal: false,
				dt: [],
				loading: false,
				detail: {
					show: false,
					loading: false,
					dt: {}
				}
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			billId: [String, Number],
			taskId: [String, Number]
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.dt = [];
					this.loading = true;
					let method = this.billId ? getBillTrack(this.billId) : getTaskTrack(this.taskId);
					method.then(res => {
					// getBillTrack(19040000011).then(res => {
						if(res.data && res.data.data){
							// this.dt = [...res.data.data, ...res.data.data];
							this.dt = res.data.data;
						}
						this.loading = false;
					}).catch(err => {
						this.loading = false;
					});
				}
			},
			value(val){
				this.showModal = val;
			}
		},
		methods: {
			showDetail(id){
				this.detail.show = true;
				this.detail.loading = true;
				this.detail.dt = {};
				getTrackDetail(id).then(res => {
					if(res.data && res.data.data){
						this.detail.dt = res.data.data;
					}
					this.detail.loading = false;
				}).catch(err => {
					this.detail.loading = false;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bill-process{
		.timeline{
			.timeline-item{
				padding: 10px 50px;
				position: relative;
				padding-bottom: 20px;
				cursor: pointer;
				transition: background 0.4s;
				&:hover{
					background: #e9f4ff;
				}
				&>div{
					margin-bottom: 10px;
				}
				.time{
					color: #777;
				}
				.user{
					position: absolute;
					right: 50px;
					top: 10px;
				}
				.icon-ry-person{
					font-size: 15px !important;
					color: #999;
				}
				@mixin ba{
					content: "";
					display: block;
					position: absolute;
					top: 10px;
					background: #CCC;
					z-index: 9;
				}
				&::before{
					width: 16px;
					height: 16px;
					border-radius: 50%;
					left: 20px;
					@include ba;
				}
				&::after{
					height: 100%;
					width: 2px;
					left: 27px;
					@include ba;
				}
				&.last-item::after{
					display:none;
				}
			}
		}
		.detail{
			min-height: 200px;
			overflow: hidden;
			.d-item{
				float: left;
				width: 50%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 30px;
				i{
					font-style: normal;
					width: 80px;
					display: inline-block;
				}
				&.d-item-img{
					width: 100%;
					height: auto;
					i{
						float: left;
					}
					img{
						max-width: 100%;
					}
				}
			}
		}
	}
</style>
