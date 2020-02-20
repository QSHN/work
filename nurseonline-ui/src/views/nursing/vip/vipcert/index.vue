<template>
  <div v-loading="certLoading">
    <el-carousel indicator-position="none" height="820px" :autoplay=false>
      <el-carousel-item v-for="(form,index) in forms" :key="index" >
        <el-form :model="form" ref="form" label-width="90px">
          <el-form-item label="资料状态">
            <el-select v-model="form.certState" placeholder="请选择" disabled>
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件名称">
            <el-input v-model="form.certTypeName" disabled></el-input>
          </el-form-item>
          <el-form-item label="条目类型">
            <el-input v-model="form.certTag" disabled></el-input>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input v-model="form.certNo" disabled></el-input>
          </el-form-item>
          <el-form-item label="生效时间">
            <el-input v-model="form.fromDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="有效期">
            <el-input v-model="form.validDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="证件详情">
            <el-input v-model="form.certDesc" disabled></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" disabled></el-input>
          </el-form-item>
          <el-carousel indicator-position="outside" :autoplay="false" arrow="never">
            <el-carousel-item v-for="(certUrl,urlindex) in form.certImgPath" :key="urlindex" :label="labelaa">
              <h3>
                <img :src=certUrl :preview=index preview-text="资质文件">
              </h3>
            </el-carousel-item>
          </el-carousel>
        </el-form>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  import {getObj} from '@/api/nursing/vip/vipcert'
  import {constants} from 'crypto';
  import preview from 'vue-photo-preview'
  import 'vue-photo-preview/dist/skin.css'

  export default {
    name: 'vipcert',
    props: {
      vipId: {
        type: Number
      }
    },
    data() {
      return {
        certLoading: true,
        data: {},
        nodeDialog: false,
        isEdit: true,
        forms: [{
          "vipCertId": -1,
          "vipId": -1,
          "certState": -1,
          "certTag":1,
          "certType": -1,
          "certTypeName": "",
          "certNo": "",
          "fromDate": "",
          "validDate": "",
          "certDesc": "",
          "certImgPath": [],
          "createTime": "",
          "updateTime": ""
        }],
        stateOptions:[
          {
            value: 0,
            label: '待审核'
          }, {
            value: 1,
            label: '审核通过'
          }, {
            value: 2,
            label: '审核未通过'
          }, {
            value: 3,
            label: '未知状态'
          }
        ]
      }
    },
    watch: {
      vipId() {
        this.fetchCert()
      }
    },
    created() {
      this.fetchCert()
    },
    methods: {
      initCert() {
        this.forms = [Object.assign({}, {
          "vipCertId": -1,
          "vipId": -1,
          "certState": -1,
          "certType": -1,
          "certTypeName": "",
          "certNo": "",
          "fromDate": "",
          "validDate": "",
          "certDesc": "",
          "certImgPath": [""],
          "createTime": "",
          "updateTime": ""
        })]
      },
      //获取资质
      fetchCert() {
        this.certLoading = true
        getObj(this.vipId).then(res => {
          let remoteForms = res.data.data
          let showCerts = []
          for (let i = 0; i < remoteForms.length; i++) {
            remoteForms[i].certImgPath = remoteForms[i].certImgPath.split(',')
          }
          this.forms = remoteForms
          this.certLoading = false
        }).catch((response) => {
          this.initCert()
          this.certLoading = false
        })
      },
      closeDialog() {
        this.initCert()
        this.$refs.form.clearValidate()
      }
    }
  }
</script>
<style lang="scss">
  .el-input.is-disabled .el-input__inner {
    background-color: #dddddd!important;
    color: #161616!important;
  }

  .el-select.is-disabled .el-select__inner {
    background-color: #dddddd!important;
    color: #161616!important;
  }
  .el-carousel {
    text-align: center;
  }

  .pswp {
    z-index: 9999;
  }
</style>
