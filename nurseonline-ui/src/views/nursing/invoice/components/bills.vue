<template>
	<div class="bills">
		<el-dialog title="可开票的订单列表" :visible.sync="show" width="980px">
			<el-table :data="list" style="width: 100%" v-loading="tableLoading" highlight-current-row @selection-change="colSelChange">
				<el-table-column type="selection" width="40"></el-table-column>
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="billNo" label="订单号" width="110"></el-table-column>
				<el-table-column prop="serviceLabel" label="服务项目名称"></el-table-column>
				<el-table-column prop="custName" label="服务对象名"></el-table-column>
				<el-table-column prop="billState" label="订单状态" width="140">
					<template slot-scope="scope">
						<span>{{bState[scope.row.billState]}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="paymentAmt" label="订单金额" width="80"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
				<el-table-column prop="visitAmt" label="上门费" width="110"></el-table-column>
			</el-table>
			<div slot="footer">
				<el-button @click="show = false">取消</el-button>
				<el-button type="primary" @click="fSubmit">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {bills, billState} from '@/api/nursing/invoice/invoice'
	export default {
		name: "bills",
		data(){
			return {
        fd: {
          current: 1,
          vipCode: "",
          vipName: "",
          idNo: "",
          phone: ""
        },
				list: [],
				show: false,
				tableLoading: false,
				selList: [],  //已选择的订单
				bState: {}
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			vipId: [Number, String]
		},
		watch: {
			show(val){
				this.list = [];
        this.fd.current = 1;
				if(val === false){
					this.$emit("input", val);
				}else{
					this.search();
				}
			},
			value(val){
				this.show = val;
			},
			list: {  // 列表一旦改变，则重置已选择的订单列表
				handler(val){
					this.selList = [];
				},
				deep: true
			}
		},
		mounted() {
			this.getBillStateList();
		},
		methods: {
			getBillStateList(){
				billState().then(res => {
					let obj = {};
					if(res.data && res.data.data){
						let dt = res.data.data;
						dt.forEach(item => {
							obj[item["itemId"]] = item["itemName"];
						});
					}
					this.bState = {...obj};
				}).catch();
			},
			search(refresh){
				if(refresh === true) this.fd.current = 1;
				this.tableLoading = true;
				bills(this.vipId).then(res => {
					console.log("res", res);
					if(res.data && res.data.data){
						this.list = res.data.data || [];
					}
					this.tableLoading = false;
				}).catch(err => {
					this.tableLoading = false;
				});
			},
			colSelChange(e){
				console.log(e);
				if(e && e.length){
					this.selList = e;
				}else{
					this.selList = [];
				}
			},
			fSubmit(){
				let e = this.selList;
				if(e && e.length){
					this.$emit("change", e);
					this.$emit("input", false);
				}else{
					this.$message.warning("请先点击选择订单");
				}
			}
		}
	}
</script>
