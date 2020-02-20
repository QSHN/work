<template>
	<div class="bill-obj-info">
		<el-dialog :visible.sync="showModal" title="服务对象详情">
			<div style="overflow:hidden;" v-loading="loading">
				<div class="part-item" v-for="(item, key) in dt" :key="key">
					<i>{{item.value ? item.value : item}}：</i>
					<span v-if="dics[key]">{{dics[key][rd[key]]}}</span>
					<span :title="rd[key]" v-else>{{rd[key]}}</span>
				</div>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
	import { getObj } from '@/api/nursing/cust/cust'
	import {getDics} from "@/util/util"
	export default {
		name: "billObjInfo",
		data(){
			return {
				showModal: false,
				dt: {
					custCode: "客户代码",
					idNo: "身份证号",
					custName: "客户姓名",
					birthDate: "出生日期",
					sex: "性别",
					custType: "客户类型",
					age: "年龄",
					nation: "民族",
					maritalStatus:"婚姻状况",
					address: "家庭住址",
					zoneId: "所在区域ID",
					phone: "联系电话",
					linkman: "联系人",
					linkmanPhone: "联系人电话"
				},
				loading: false,
				rd: {},
				dics: {
					custType: {},
					maritalStatus: {},
					sex: {"0": "不填", "1": "男", "2": "女"}
				}
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			custId: [String, Number]
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.loading = true;
					this.rd = {};
					getObj(this.custId).then(res => {
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
				getDics(this.dics);
			}
		}
	}
</script>

<style lang="scss">
	.bill-obj-info{
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