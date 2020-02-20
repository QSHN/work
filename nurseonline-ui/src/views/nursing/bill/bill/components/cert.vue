<template>
	<div class="bill-cert">
		<el-dialog :visible.sync="showModal" title="就医证明" width="800px">
			<div v-loading="loading" style="overflow:hidden;">
				<template v-if="dt && dt.length">
					<!--<div v-for="(item, index) in dt" :key="index">-->
						<!--<img :src="item.certImgPath" :alt="item.certDesc" />-->
					<!--</div>-->
          <el-carousel height="580" arrow="always">
            <el-carousel-item v-for="(item, index) in dt" :key="index">
              <img style="width:auto; height:100%; margin: 0 auto;" :src="item.certImgPath" :alt="item.certDesc" @click="handleOpenPreview(item.certImgPath)"/>
            </el-carousel-item>
          </el-carousel>
				</template>
				<span v-else>暂无信息</span>
			</div>
			<div slot="footer"><el-button @click="showModal = false;">取消</el-button></div>
		</el-dialog>
	</div>
</template>

<script>
	import {billCerts} from "@/api/nursing/bill/bill"
	
	export default {
		name: "billCert",
		data(){
			return {
				showModal: false,
				dt: [],
				loading: false,
			}
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			billId: [String, Number]
		},
    methods: {
      handleOpenPreview(imgUrl) {
        let items = [Object.assign({},{url:imgUrl})];
        this.$ImagePreview(items, 0);

        let preview = document.getElementsByClassName('avue-image-preview__box')
        let div = document.createElement("div")
        div.id ="closeBtnDiv"
        div.innerHTML = '点击关闭'
        div.style.position = 'absolute';
        div.style.right = '20px';
        div.style.top = '20px';
        div.style.zIndex = 9999;
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.background = '#ffffff';
        preview[preview.length-1].insertBefore(div, preview.firstElementChild)
      }
    },
		watch: {
			showModal(val){
				if(val === false){
					this.$emit("input", val);
				}else{
					this.loading = true;
					this.dt = null;
					billCerts(this.billId).then(res => {
						if(res.data && res.data.data){
							this.dt = res.data.data;
							this.dt.forEach(item=>{
							  this.imgs.push({
                  thumbUrl: item.certImgPath,
                  url: item.certImgPath
                })
              })
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
		}
	}
</script>

<style lang="scss" scoped>
	.bill-cert{
		.cert-img{
			width: 50%;
			height: 200px;
			float: left;
			overflow: hidden;
			img{
				max-width: 95%;
				max-height: 100%;
			}
		}
	}
</style>
