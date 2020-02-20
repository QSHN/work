<template>
	<div class="bill-staff">
		<el-dialog :visible.sync="showModal" title="服务人员详情">
			<!-- <div style="overflow:hidden;" v-loading="loading">
				<div class="part-item" v-for="(item, key) in rd" :key="key">
					<i>{{item.value ? item.value : item}}：</i>
					<span v-if="dicList[key]">{{dics[dicList[key]][rd[key]]}}</span>
					<span :title="rd[key]" v-else>{{rd[key]}}</span>
				</div>
			</div> -->
			<!-- <avue-detail :option="formOption"></avue-detail> -->
			<div style="overflow:hidden;" v-loading="loading">
				<div class="part-item" v-for="(item, index) in formOption.column" :key="index">
					<i>{{item.label}}：</i>
					<!-- <span :title="rd[item.prop]">{{rd[item.prop]}}--{{item.prop}}</span> -->
					<span v-if="dicList[item.prop] && dics[dicList[item.prop]]">{{dics[dicList[item.prop]][rd[item.prop]]}}</span>
					<span :title="rd[item.prop]" v-else>{{rd[item.prop]}}</span>
				</div>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
	import { getObj } from '@/api/nursing/staff/staff'
	import { fetchTreeByItemClassCode } from '@/api/nursing/aid/itemclass'
	import { tableOption } from '@/const/crud/nursing/staff/staff'
	export default {
		name: "billStaff",
		data(){	
			return {
				showModal: false,
				dt: {},
				loading: false,
				rd: {},
				dics: {
					sex: {"0": "不填", "1": "男", "2": "女"},
					staff_state: {"0": '草稿', "1": '已提交', "2": '审核通过', "3": '审核未通过'},
					is_lock: {"1": '是', "0": '否'},
					is_certificated: {"1": '是', "0": '否'},
					is_examined: {"1": '是', "0": '否'}
				},
				dicList: {
					staffState: "staff_state",
					staffType: "staff_type",
					sex: "sex",
					education: "education",
					professionalTitle: "professional_title",
					isLocked: "is_locked",
					isCertificated:　"is_certificated",
					isExamined: "is_examined"
				},
				formOption: tableOption
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			staffId: [String, Number]
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.loading = true;
					this.rd = {};
					getObj(this.staffId).then(res => {
						if(res.data && res.data.data){
							this.rd = res.data.data;
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
				for(let item in this.dicList){
					let key = this.dicList[item];
					console.log("ddddd", !this.dics[key] || JSON.stringify(this.dics[key]) === "{}", JSON.stringify(this.dics[key]));
					if(!this.dics[key] || JSON.stringify(this.dics[key]) === "{}"){
						fetchTreeByItemClassCode(key).then(res => {
							if(res.data && res.data.data){
								let obj = {};
								res.data.data.forEach(item => {
									obj[item.itemId] = item.itemName;
								});
								this.dics[key] = obj;
							}
						}).catch(err => {
							console.log("err", err);
						});
					}
				}
				console.log("ddfff", this.dics);
			}
		}
	}
</script>

<style lang="scss">
	.bill-staff{
		.part-item{
			float: left;
			width: 50%;
			height: 26px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			&>i{
				font-style: normal;
				display: inline-block;
				width: 90px;
			}
		}
	}
</style>
