<template>
	<div class="bill-info">
		<el-dialog :visible.sync="showModal" title="服务订单详情" width="1000px">
			<div>
				<div class="options">
					<el-button icon="icon-ry-jiuzhenjilu" type="text" @click="showCert = true;"> 查看就医证明</el-button>
					<el-button icon="icon-ry-personal-info" type="text" @click="showObjInfo = true;"> 查看服务对象详情</el-button>
					<el-button icon="icon-ry-person" type="text" @click="showVip = true;"> 查看会员详情</el-button>
					<template v-if="!org">
						<el-button v-if="row.checkerId" icon="icon-ry-shtongguo" type="text" disabled> 已审核</el-button>
						<el-button v-else-if="(row.billState == 1 && row.payState == 1)" icon="icon-ry-shenhe" type="text" @click="check"> 审核</el-button>
					</template>
				</div>
				<div type="border-card">
				<!--<div type="border-card" v-model="currTab">-->
					<div class="part" v-for="(part, index) in dt" :key="index">
					<!--<div :label="part.title" class="part" v-for="(part, index) in dt" :name="index">-->
						<template v-if="!part.column && tRow">
							<div class="part-title">{{part.title}}</div>
							<div class="part-cnt">
								<div class="part-item" v-for="(item, key) in part.data" :key="key">
									<i>{{item}}：</i>
									<span v-if="dic[key] && dic[key][tRow[key]]">{{dic[key][tRow[key]]}}</span>
									<span v-else :title="tRow[key]">{{tRow[key]}}</span>
								</div>
							</div>
						</template>
					</div>
					<div>
						<el-tabs type="border-card">
							<template v-for="(part, i) in dt">
								<el-tab-pane v-if="part.column" :label="part.title" class="part" :key="i">
									<el-table :data="[row]">
										<template v-if="part.slot">
											<el-table-column align="center" v-for="(item, index) in part.column" :label="item.label" :key="index">
												<template slot-scope="scope">
													<span v-if="item.prop === 'amount'">{{scope.row.itemAmt + scope.row.discountAmt}}</span>
													<span v-else>{{scope.row[item.prop]}}</span>
												</template>
											</el-table-column>
										</template>
										<template v-else>
											<el-table-column align="center" v-for="(item, index) in part.column" :width="item.width" :prop="item.prop" :label="item.label" :key="index" show-overflow-tooltip></el-table-column>
										</template>
									</el-table>
								</el-tab-pane>
							</template>
						</el-tabs>
					</div>
				</div>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
		<bill-vip v-model="showVip" :vip-id="row.vipId"></bill-vip>
		<bill-obj-info v-model="showObjInfo" :cust-id="row.custId"></bill-obj-info>
		<bill-cert v-model="showCert" :bill-id="row.billId"></bill-cert>
	</div>
</template>

<script>
	import { check, invoiceState, payState, billState, relationForCust, billType } from '@/api/nursing/bill/bill'
	import billObjInfo from "./obj-info.vue"
	import billCert from "./cert.vue"
	import billVip from "./vip.vue"
	import {getDics} from "@/util/util"
	
	export default {
		name: "billInfo",
		data(){
			return {
				showModal: false,
				dt: [{
					title: "服务订单信息",
					data: {
						billId: "服务单号",
						orgName: "服务机构名称",
						billType: "订单类型",
						invoiceState: "开票状态",
						payState: "支付状态",
						billState: "订单状态",
						billDate: "单据日期",
						couponCode: "优惠券代码",
						validDate: "有效期至",
						createTime: "创建时间",
						_reserveTime: "首次预约时间"
						// reserveTime: {
						// 	reserveTime1: "",
						// 	reserveTime2: ""
						// }
					}
				}, {
					title: "审核信息",
					data: {
						checkerName: "审核人",
						checkTime: "审核时间"
					}
				}, {
					title: "下单会员&服务对象信息",
					data: {
						vipName: "会员姓名",
						linkman: "联系人",
						linkmanPhone: "联系人电话",
						// applicant: "投保人",
						// applicantIdNo: "投保人身份证号",
						// relationForCust: "与会员关系",
						custZoneId: "服务对象所在区域",
						custAddress: "服务地址",
						custName: "服务对象",
						diseaseDesc: "疾病描述"
					}
				}, {
					title: "服务人员要求",
					data: {
						staffLevel: "人员级别"
					}
				}, {
					title: "服务信息",
					column: [
						{
							prop: "serviceLabel",
							label: "服务名称",
							width: 200
						},
						{
							prop: "unit",
							label: "计价单位"
						},
						{
							prop: "price",
							label: "单价"
						},
						{
							prop: "avgPrice",
							label: "平均服务单价"
						},
						{
							prop: "qty",
							label: "数量"
						},
						{
							prop: "qtyFinished",
							label: "已完成数量"
						},
						{
							prop: "qtyLocked",
							label: "已锁定数量"
						},
						{
							prop: "itemAmt",
							label: "折后金额"
						}
					],
				},{
					title: "耗材信息",
					column: [{
						prop: "kitGoodsLabel",
						label: "耗材包标题"
					},{
						prop: "kitPrice",
						label: "单价"
					},{
						prop: "kitScale",
						label: "数量"
					},{
						prop: "kitAmt",
						label: "金额"
					}]
				}, {
					title: "费用说明（元）",
					slot: true,
					column: [{
						prop: "amount",
						label: "服务金额"
					},{
						prop: "discountAmt",
						label: "优惠金额"
					},{
						prop: "kitAmt",
						label: "耗材费"
					},{
						prop: "visitAmt",
						label: "上门费"
					},{
						prop: "premiumAmt",
						label: "保险费"
					},{
						prop: "couponAmt",
						label: "礼券金额"
					},{
						prop: "paymentAmt",
						label: "合计"
					}]
				}, {
					title: "分账说明",
					column: [{
						prop: "staffRate",
						label: "服务人员应收比例"
					}, {
						prop: "orgRate",
						label: "服务机构应收比例"
					}, {
						prop: "operatorRate",
						label: "运营机构应收比例"
					}]
				}],
				dic: {
					invoiceState: {},
					payState: {},
					billState: {},
					billType: {},
					relationForCust: {}
					// staffLevel: {}
				},
				// getDic: { invoiceState, payState, billState, billType
				// , relationForCust 
				// },
				// currTab: "4"
				showObjInfo: false,
				showCert: false,
				showVip: false,
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
			},
			org: {
				type: Boolean,
				default: false
			}
		},
		components: {billObjInfo, billCert, billVip},
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
					row._reserveTime = row.reserveDate + "  " + row.reserveTime1 + ":00~" + row.reserveTime2 +":00";
					this.tRow = {...row};
				},
				deep: true
			}
		},
		methods: {
			getCodes(){
				// for(let item in this.dic){
				// 	console.log("jjj", this.dic[item], item, JSON.stringify(this.dic[item]))
				// 	if(JSON.stringify(this.dic[item]) === "{}"){
				// 		this.setDic(item);
				// 	}
				// }
				getDics(this.dic);
			},
			// setDic(dicName){
			// 	this.getDic[dicName]().then(res => {
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
				margin: 0 5px;
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
				padding: 0 8px;
				box-sizing: border-box;
				&>i{
					font-style: normal;
				}
			}
		}
	}
</style>
