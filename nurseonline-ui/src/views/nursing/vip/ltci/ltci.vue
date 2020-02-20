<template>
  <div v-loading="treeLoading">

    <img :src="imgSrc1" alt="img1" width="100" height="100" @click="imgEnlarge(1)" id="img1">
    <img :src="imgSrc2" alt="img1" width="100" height="100" @click="imgEnlarge(2)" id="img2">
    <img :src="imgSrc3" alt="img1" width="100" height="100" @click="imgEnlarge(3)" id="img3">
    <img :src="imgSrc4" alt="img1" width="100" height="100" @click="imgEnlarge(4)" id="img4">

  </div>
</template>
<script>
  import {getCertByFormId, getImgByImgName, getQuestionsByFormId} from '@/api/nursing/vip/ltci/vipltciform'
  import {constants} from 'fs';
  // import { getTrees } from '@/api/ldadmin/ryapi'
  export default {
    name: 'ltci',
    props: {
      ltciFormId: {
        type: Number
      },
      callback: {
        type: Function,
        default: () => {
          return false
        }
      }
    },
    data() {
      return {
        treeLoading: true,
        filterText: '',
        defaultProps: {
          children: 'childNodes',
          label: 'itemName'
        },
        data: [],
        nodeDialog: false,
        isEdit: true,
        vipCert: {
          type: Object,
          default: () => {
          }
        },
        imgSrc1: 'http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//ry600_logo_01.jpg',
        imgSrc2: 'http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//ry600_logo_01.jpg',
        imgSrc3: 'http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//ry600_logo_01.jpg',
        imgSrc4: 'http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//ry600_logo_01.jpg',
      }
    },
    // filters: {
    //   getImg(val) {
    //     console.log(val)
    //     getImgByImgName(val).then(res => {
    //       console.log(res)
    //       return res
    //     })
    //     // return 'http://file.ry600.com/snapshot/vms/site/di/di70684438lrfavs/du9sks0f7yefy23z/image//ry600_logo_01.jpg'
    //   }
    // },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.fetchLtci();
      this.imgEnlarge(1);
    },
    methods: {
      fetchLtci() {
        this.treeLoading = true
        getCertByFormId(this.ltciFormId).then(res => {
          this.vipCert = res.data.data
          this.treeLoading = false
          //url是1~url;2~url;3~url，前面的n~是代表不同资质图片
          let splitPics = this.vipCert.imgUrl.split(";");
          for (let i = 0; i < splitPics.length - 1; i++) {
            let _url = splitPics[i].split("$");
            getImgByImgName(_url[1]).then(res => {
              this['imgSrc' + _url[0]] = window.URL.createObjectURL(res.data)
            }).catch(() => {
              console.log('failed')
            })
          }
        })
      },
      imgEnlarge(index) {
        let img = document.getElementById('img' + index)
        if (img.width == 100 && img.height == 100) {
          img.width *= 5;
          img.height *= 5;
        } else {
          img.width = 100;
          img.height = 100;
        }
      }
    }
  }
  // getImg(imgName) {
  //   console.log()
  //   getImgByImgName(imgName).then(res => {
  //     console.log(res)
  //   })
  //   // console.log(imgName)
  //   // let blob=getImgByImgName(imgName);
  //   // console.log(blob)
  //   // return window.URL.createObjectURL(blob);
  // },
</script>
<style lang="scss" scoped>
  /deep/ .el-tree-node__content {
    height: 40px;
  }

  /deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
