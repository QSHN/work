<template>
	<div class="vips">
		<el-dialog title="请点击选择会员" :visible.sync="show" width="980px">
			<div class="form-filter">
				<el-form :model="fd" inline>
					<!--<el-form-item prop="vipId" label="会员Id">-->
						<!--<el-input v-model="fd.vipId" placeholder="请输入会员Id" clearable></el-input>-->
					<!--</el-form-item>-->
					<el-form-item prop="vipName" label="会员姓名">
						<el-input v-model="fd.vipName" placeholder="请输入会员姓名" clearable></el-input>
					</el-form-item>
					<el-form-item prop="idNo" label="身份证号">
						<el-input v-model="fd.idNo" placeholder="请输入会员身份证号码" clearable></el-input>
					</el-form-item>
					<el-form-item prop="phone" label="手机号">
						<el-input v-model="fd.phone" placeholder="请输入手机号" clearable></el-input>
					</el-form-item>
					<el-button @click="search(true)">查询</el-button>
				</el-form>
			</div>
			<el-table :data="vips" style="width: 100%" v-loading="vipLoading" highlight-current-row @current-change="vipSelChange">
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="vipId" label="会员ID" width="70"></el-table-column>
				<el-table-column prop="vipName" label="姓名"></el-table-column>
				<el-table-column prop="birthDate" label="生日" width="120"></el-table-column>
				<el-table-column prop="phone" label="手机号" width="120"></el-table-column>
				<el-table-column prop="sex" label="性别" width="120">
					<template slot-scope="scope">
						<span v-if="scope.row.sex == 0">未知</span>
						<span v-else-if="scope.row.sex == 1">男</span>
						<span v-else-if="scope.row.sex == 2">女</span>
						<span v-else-if="scope.row.sex == 3">保密</span>
					</template>
				</el-table-column>
				<el-table-column prop="idNo" label="身份证号" width="150"></el-table-column>
				<el-table-column prop="vipLevel" label="会员等级" width="80"></el-table-column>
			</el-table>
			<el-pagination :page-size="page.size" :total="page.total" @current-change="pageChange"></el-pagination>
			<div slot="footer">
				<el-button @click="show = false;">取消</el-button>
				<el-button type="primary" @click="fSubmit">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {vips} from '@/api/nursing/invoice/invoice'
	export default {
		name: "vips",
		data(){
			return {
				vips: [],
				show: false,
				vipLoading: false,
				page: {
					size: 10,
					total: 0,
					current: 1
				},
				fd: {
					current: 1,
					vipCode: "",
					vipName: "",
					idNo: "",
					phone: ""
				},
				vipSel: {}  //已选择的会员
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			show(val){
				this.vips = [];
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
			vips: {  // 列表一旦改变，则重置已选择的人
				handler(val){
					this.vipSel = {};
				},
				deep: true
			}
		},
		methods: {
			search(refresh){
				if(refresh === true) this.fd.current = 1;
				this.vipLoading = true;
				vips(this.fd).then(res => {
					console.log("res", res);
					if(res.data && res.data.data){
            this.page.total = res.data.data.total;
						this.vips = res.data.data.records || [];
					}
					this.vipLoading = false;
				}).catch(err => {
					this.vipLoading = false;
				});
			},
			vipSelChange(e){
				console.log(e);
				if(e){
					this.vipSel = e;
				}
			},
      pageChange(index) {
        this.fd.current = index;
        //判断总数据量是否足够显示到目标页数，能够显示才刷新
        this.search(false);
      },
			fSubmit(){
				let e = this.vipSel;
				if(e && e.vipId){
					this.$emit("change", e);
					this.$emit("input", false);
				}else{
					this.$message.warning("请先点击选择会员");
				}
			}
		}
	}
</script>

<style>

</style>
