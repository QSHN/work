<template>
	<div class="bill-assign-detail">
		<el-dialog :visible.sync="showModal" title="分派详情" width="980px">
			<el-table v-loading="loading" :data="dt">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="staffId" label="护士ID"></el-table-column>
                <el-table-column prop="priority" label="优先次序"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column prop="confirmTime" label="确认时间"></el-table-column>
                <el-table-column prop="refuseReason" label="拒绝原因"></el-table-column>
			</el-table>
			<div slot="footer">
                <el-button @click="showModal = false;">取消</el-button>
            </div>
		</el-dialog>
	</div>
</template>

<script>
	import { billAssign } from '@/api/nursing/bill/billtask'
	// import { fetchTreeByItemClassCode } from '@/api/nursing/aid/itemclass'
	export default {
		name: "billAssignDetail",
		data(){
			return {
				showModal: false,
				dt: [],
				loading: false,
				dics: {
					review_type: {}
                },
                page: {}
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			taskId: [String, Number]
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.loading = true;
					this.dt = null;
					billAssign(this.taskId).then(res => {
						if(res.data && res.data.data){
                            let dt = {...res.data.data};
                            this.dt = [...dt.records];
                            delete dt.records;
                            this.page = {...dt};
						}
						this.loading = false;
					}).catch(err => {
						this.loading = false;
					});
					// this.getCodes();
				}
			},
			value(val){
				this.showModal = val;
			}
		},
		methods: {
			// getCodes(){
			// 	for(let key in this.dics){
			// 		if(JSON.stringify(this.dics[key]) === "{}"){
			// 			fetchTreeByItemClassCode(key).then(res => {
			// 				if(res.data && res.data.data){
			// 					let obj = {};
			// 					res.data.data.forEach(item => {
			// 						obj[item.itemId] = item.itemName;
			// 					});
			// 					this.dics[key] = obj;
			// 				}
			// 			}).catch();
			// 		}
			// 	}
            // },
            formSubmit(){}
		}
	}
</script>

<style lang="scss" scoped>
	.bill-assign-detail{
	}
</style>