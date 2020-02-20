<template>
  <div v-loading="treeLoading">

    <textarea id="options" cols="90" rows="40" :value="options">

    </textarea>

  </div>
</template>
<script>
  import {getCertByFormId, getImgByImgName, getQuestionsByFormId} from '@/api/nursing/vip/ltci/vipltciform'
  import {constants} from 'fs';
  // import { getTrees } from '@/api/ldadmin/ryapi'
  export default {
    name: 'ltciTest',
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
        options: ''
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
      this.fetchOptions();
    },
    methods: {
      fetchLtci() {
        this.treeLoading = true
      },
      fetchOptions() {
        getQuestionsByFormId(this.ltciFormId).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            this.options += res.data[i] + '\n';
          }
          this.treeLoading = false;
        });
      },
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
