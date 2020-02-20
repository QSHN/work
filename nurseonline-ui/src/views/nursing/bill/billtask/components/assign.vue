<template>
	<div class="bill-assign">
		<el-dialog :visible.sync="showModal" title="分派服务人员">
			<div v-loading="loading" style="overflow:hidden;">
				<el-table :data="dt" @selection-change="selChange">
					<el-table-column type="selection"></el-table-column>
					<el-table-column label=" " type="index" width="25"></el-table-column>
					<el-table-column label="护士名称" prop="staffName" width="100" show-overflow-tooltip></el-table-column>
					<el-table-column label="性别" prop="sex" width="60">
						<template slot-scope="scope">
							<span>{{dics.sex[scope.row.sex]}}</span>
						</template>
					</el-table-column>
					<el-table-column label="年龄" prop="age" width="60"></el-table-column>
					<el-table-column label="所在医院" prop="jobOrg" show-overflow-tooltip></el-table-column>
					<el-table-column label="工作年限" prop="serviceYears" width="90"></el-table-column>
					<el-table-column label="职称" prop="professionalTitle" width="100">
						<template slot-scope="scope">
							<span>{{dics.professionalTitle[scope.row.professionalTitle] || scope.row.professionalTitle}}</span>
						</template>
					</el-table-column>
					<el-table-column label="距离（米）" prop="distance" width="100"></el-table-column>
				</el-table>
			</div>
			<div slot="footer">
                <el-button type="primary" @click="formSubmit" :loading="saveLoading">确认指派</el-button>
                <el-button @click="showModal = false;">取消</el-button>
            </div>
		</el-dialog>
	</div>
</template>

<script>
	import {recommender, createBillAssignList} from "@/api/nursing/bill/billassign"
	// import { fetchTreeByItemClassCode } from '@/api/nursing/aid/itemclass'
	import {getDics} from "@/util/util"
	export default {
		name: "billAssign",
		data(){
			return {
				showModal: false,
				dt: [],
				loading: false,
				dics: {
					sex: {"0": "不填", "1": "男", "2": "女"},
					professionalTitle: {}
				},
				selList: [],
				saveLoading: false
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			taskId: [String, Number],
			row: {
				type: Object,
				default(){
					return {};
				}
			}
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.loading = true;
					this.dt = null;
					console.log("assign row", this.row);
					this.load();
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
			},
			formSubmit(){
				if(this.selList.length){
					let taskId = this.taskId;
					let list = this.selList.map(item => {
						return item.staffId;
					});
					this.saveLoading = true;
					createBillAssignList(taskId, list).then(res => {
						if(res.data && res.data.data){
							this.$message.success("操作成功");
							this.showModal = false;
						}
						this.saveLoading = false;
					}).catch(err => {
						this.saveLoading = false;
					});
				}else{
					this.$message.warning("请先勾选服务人员");
				}
			},
			load(){
				let reqData = {
					orgId: null,
					custPosition: null,
					serviceIdArr: [],
					reserveDate: null,
					reserveTime1: null,
					reserveTime2: null,
					orgServiceId: null
				};
				for(let key in reqData){
					console.log("key", key);
					reqData[key] = this.row[key];
				}
				reqData.serviceIdArr = this.row.serviceId;
				console.log("reqData", reqData);
				recommender(reqData).then(res => {
					if(res.data && res.data.data){
						let dt = res.data.data;
						this.dt = dt;
					}
					this.loading = false;
				}).catch(err => {
					this.loading = false;
				});
			},
			selChange(e){
				console.log("change", e);
				this.selList = e;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bill-assign{
	}
</style>