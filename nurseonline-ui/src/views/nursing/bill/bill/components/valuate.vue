<template>
	<div class="bill-valuate">
		<el-dialog :visible.sync="showModal" title="评价详情" width="600px">
			<div v-loading="loading" style="overflow:hidden;">
				<template v-if="dt">
					<div class="v-item"><i>姓名：</i><span>{{dt.userName}}</span></div>
					<div class="v-item"><i>评价方式：</i><span>{{dics.review_type[dt.reviewType]}}</span></div>
					<div class="v-item"><i>评价星级：</i><span class="stars"><i v-for="i in 5" :key="i" :class="[i <= dt.starRating ? 'el-icon-star-on' : 'el-icon-star-off']"></i></span></div>
					<div class="v-item"><i>评价时间：</i><span>{{dt.createTime}}</span></div>
					<div class="v-item v-item-row"><i>评价内容：</i><div>{{dt.reviewText}}</div></div>
				</template>
				<span v-else>暂无评价</span>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
	import { billReview } from '@/api/nursing/bill/bill'
	import { fetchTreeByItemClassCode } from '@/api/nursing/aid/itemclass'
	export default {
		name: "billValuate",
		data(){
			return {
				showModal: false,
				dt: null,
				loading: false,
				dics: {
					review_type: {}
				}
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			billId: [String, Number]
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.loading = true;
					this.dt = null;
					billReview(this.billId).then(res => {
						if(res.data && res.data.data){
							let dt = res.data.data;
							for(let i = 0; i < dt.length; i++){
								if(dt[i].reviewType == 0){  //用户自己评价
									this.dt = dt[i];
									break;
								}
							}
						}
						this.loading = false;
					}).catch(err => {
						this.loading = false;
					});
					this.getCodes();
				}
			},
			value(val){
				this.showModal = val;
			}
		},
		methods: {
			getCodes(){
				for(let key in this.dics){
					if(JSON.stringify(this.dics[key]) === "{}"){
						fetchTreeByItemClassCode(key).then(res => {
							if(res.data && res.data.data){
								let obj = {};
								res.data.data.forEach(item => {
									obj[item.itemId] = item.itemName;
								});
								this.dics[key] = obj;
							}
						}).catch();
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bill-valuate{
		i{
			font-style: normal;
			display: inline-block;
			width: 80px;
		}
		.v-item{
			float: left;
			width: 50%;
			height: 30px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			&.v-item-row{
				height: auto;
				width: 100%;
				white-space: normal;
				i{
					float: left;
				}
				&>div{
					margin-left: 80px;
				}
			}
			.stars{
				&>i{
					width: auto;
					color: #FA0;
				}
			}
		}
	}
</style>
