<template>
	<div class="bill-info">
		<el-dialog :visible.sync="showModal" title="服务预约单详情" width="1000px">
			<div>
				<div class="options">
					<el-button icon="icon-ry-jiuzhenjilu" type="text" @click="showCert = true;"> 查看就医证明</el-button>
					<el-button icon="icon-ry-personal-info" type="text" @click="showObjInfo = true;"> 查看服务对象详情</el-button>
					<el-button icon="icon-ry-nurse" type="text" @click="showStaff = true;"> 查看服务人员详情</el-button>
					<el-button icon="icon-ry-nursing" type="text" @click="showNursing = true;"> 查看护理记录信息</el-button>
				</div>
				<div type="border-card">
				<!--<div type="border-card" v-model="currTab">-->
					<div class="part" v-for="(part, index) in dt" :key="index">
					<!--<div :label="part.title" class="part" v-for="(part, index) in dt" :name="index">-->
						<template v-if="!part.column">
							<div class="part-title">{{part.title}}</div>
							<div class="part-cnt">
								<div class="part-item" v-for="(item, key) in part.data" :key="key">
									<i>{{item}}：</i>
									<span v-if="dic[key]">{{dic[key][tRow[key]]}}</span>
									<span v-else :title="tRow[key]">{{tRow[key]}}</span>
								</div>
							</div>
						</template>
					</div>
					<div>
						<el-tabs type="border-card">
							<template v-for="(part, index) in dt">
								<el-tab-pane v-if="part.column" :label="part.title" class="part" :key="index">
									<el-table :data="[tRow]">
										<el-table-column v-for="(item, key) in part.column" align="center" :prop="key" :label="item" :key="key"></el-table-column>
									</el-table>
								</el-tab-pane>
							</template>
						</el-tabs>
					</div>
				</div>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
		<bill-obj-info v-model="showObjInfo" :cust-id="row.custId"></bill-obj-info>
		<bill-cert v-model="showCert" :bill-id="row.billId"></bill-cert>
		<bill-staff v-model="showStaff" :staff-id="row.staffId"></bill-staff>
		<nursing-info v-model="showNursing" :task-id="row.taskId"></nursing-info>
	</div>
</template>

<script>
	import { fetchTreeByItemClassCode } from '@/api/nursing/aid/itemclass'
	import billCert from "../../bill/components/cert.vue"
	import billObjInfo from "../../bill/components/obj-info.vue"
	import billStaff from "./staff.vue"
	import nursingInfo from "./nursing-info.vue"
	import {getDics} from "@/util/util"
	
	export default {
		name: "billInfo",
		data(){
			return {
				showModal: false,
				dt: [{
					title: "预约单信息",
					data: {
						taskId: "预约单号",
						billId: "服务单号",
						orgName: "服务机构名称",
						billType: "订单类型",
						executeState: "执行状态",
						taskState: "预约状态",
						_reserveTime: "预约时间"
						// reserveDate: "预约时间",
						// reserveTime1: "",
						// reserveTime2: ""
					}
				}, {
					title: "下单会员&服务对象信息",
					data: {
						vipName: "会员姓名",
						linkman: "联系人",
						linkmanPhone: "联系人电话",
						custZoneId: "服务区域id",
						custAddress: "服务地址",
						custName: "服务对象名称"
						// applicant: "投保人",
						// applicantIdNo: "投保人身份证号"
					}
				}, {
					title: "服务人员信息",
					data: {
						staffName: "服务人员",
						assignTime: "分派时间"
					}
				}, {
					title: "服务信息",
					column: {
						serviceLabel: "服务项目名称",
						unit: "计价单位",
						price: "服务单价",
						qty: "数量",
						itemAmt: "服务金额"
					}
				}, {
					title: "耗材信息",
					column: {
						kitGoodsLabel: "耗材包标题",
						// unit: "计价单位",
						// kitPrice: "单价",
						_kitCount: "数量",  //qty * kitScale
						kitAmt: "金额"
					}
				}, {
					title: "费用说明（元）",
					column: {
						itemAmt: "服务金额",
						// discountAmt: "优惠金额",
						kitAmt: "耗材费",
						visitAmt: "上门费",
						premiumAmt: "保险费"
						// couponAmt: "礼券金额",
						// paymentAmt: "合计金额"
					}
				}, {
					title: "分账说明（元）",
					column: {
						staffAmt: "服务人员应收",
						orgAmt: "服务机构应收",
						operatorAmt: "运营机构应收"
						// paymentAmt: "合计金额"
					}
				}],
				dic: {
					billType: {},
					executeState: {},
					taskState: {}
				},
				// getDic: {billType: "bill_type", executeState: "execute_state", taskState: "task_state"},
				// currTab: "4"
				showObjInfo: false,
				showCert: false,
				showStaff: false,
				showNursing: false,
				tRow: {}
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			row: {
				type: Object,
				default(){
					return {};
				}
			}
		},
		components: {billObjInfo, billCert, billStaff, nursingInfo},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					// this.currTab = "4";
					this.getCodes();
				}
			},
			value(val){
				this.showModal = val;
			},
			row: {
				handler(val){
					console.log("watch", val);
					let row = {...val};
					row._kitCount = row.qty * row.kitScale;
					row._reserveTime = row.reserveDate + "  " + row.reserveTime1 + "~" + row.reserveTime2;
					this.tRow = {...row};
				},
				deep: true
			}
		},
		methods: {
			getCodes(){
				getDics(this.dic);
				// for(let item in this.dic){
				// 	console.log("jjj", this.dic[item], item, JSON.stringify(this.dic[item]))
				// 	if(JSON.stringify(this.dic[item]) === "{}"){
				// 		this.setDic(item);
				// 	}
				// }
			},
			// setDic(dicName){
			// 	fetchTreeByItemClassCode(this.getDic[dicName]).then(res => {
			// 		// console.log("code", "invoiceState", res);
			// 		if(res.data && res.data.data){
			// 			let dt = res.data.data;
			// 			let dtObj = {};
			// 			dt.forEach(item => {
			// 				dtObj[item.itemId] = item.itemName;
			// 			});
			// 			this.dic[dicName] = dtObj;
			// 		}
			// 	});
			// },
			check(){
				this.$confirm("您确定要将该订单通过审核吗？", "提示", {
					beforeClose: (action, instance, done) => {
						if(action === "confirm"){
							instance.confirmButtonLoading = true;
							check(this.row.billId).then(res => {
								this.$message.success("审核成功");
								this.showModal = false;
								this.$emit("refresh");
								done();
								instance.confirmButtonLoading = false;
							}).catch(err => {
								instance.confirmButtonLoading = false;
							});
						}else{
							done();
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bill-info{
		.options{
			position: absolute;
			top: 16px;
			left: 200px;
			.el-button{
				margin: 0 8px;
			}
		}
		.part{
			.part-title{
				font-weight: 600;
				line-height: 30px;
			}
			.part-cnt{
				overflow: hidden;
				margin-bottom: 20px;
				// min-height: 180px;
			}
			.part-item{
				float: left;
				width: 33.3%;
				height: 26px;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				&>i{
					font-style: normal;
				}
			}
		}
	}
</style>
