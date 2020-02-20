<template>
	<div class="bill-vip">
		<el-dialog :visible.sync="showModal" title="会员详情">
			<div style="overflow:hidden;" v-loading="loading">
                <template v-for="item in option">
                    <div class="part-item" v-if="!(hideList[item.prop] !== undefined)" :key="item.prop">
                        <i>{{item.label}}：</i>
                        <span v-if="item.dics">{{item.dics[rd[item.prop]]}}</span>
                        <span :title="rd[item.prop]" v-else>{{rd[item.prop]}}</span>
                    </div>
                </template>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
    import { getObj } from '@/api/nursing/vip/vip'
    import { tableOption } from '@/const/crud/nursing/vip/vip'
	export default {
		name: "billObjInfo",
		data(){
            let column = tableOption.column.map(item => {
                if(item.dicData && item.dicData.length){
                    item.dics = {};
                    item.dicData.forEach(dic => {
                        item.dics[dic.value] = dic.label;
                    });
                }
                return item;
            });
			return {
                showModal: false,
                option: column,
				loading: false,
                rd: {},
                hideList: {  // 隐藏项
                    createTime: "创建时间",
                    updateTime: "修改时间"
                }
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			vipId: [String, Number]
		},
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.loading = true;
					this.rd = {};
					getObj(this.vipId).then(res => {
						if(res.data && res.data.data){
							this.rd = res.data.data;
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
		}
	}
</script>

<style lang="scss">
	.bill-vip{
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