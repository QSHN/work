<template>
  <div>
    <div v-if="url" class="demo-upload-list">
      <template v-if="status !== 'uploading'">
        <img :src="fullUrl">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(fullUrl)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress :percent="50" hide-info></Progress>
      </template>
    </div>
    <div v-else @click="selectAndUpload" class="ivu-upload" style="display: inline-block; width: 58px;"><div class="ivu-upload ivu-upload-drag"><input type="file" multiple="multiple" class="ivu-upload-input"> <div style="width: 58px; height: 58px; line-height: 58px;"><i class="ivu-icon ivu-icon-ios-camera" style="font-size: 20px;"></i></div></div>  <!----></div>
    <Modal title="图片查看" v-model="visible">
      <img :src="ViewUrl" v-if="visible" style="width: 100%;">
    </Modal>
  </div>
</template>
<script>
import { selectAndUpload, getSignUrl } from '../../libs/aliyun'
export default {
  name: 'uploadAvatar',
  model: {
    prop: 'avatarUrl',
    event: 'change'
  },
  props: {
    avatarUrl: String,
    format: []
  },
  data () {
    return {
      ViewUrl: '',
      visible: false,
      url: '',
      fullUrl: '',
      status: 'finished' // finished uploading
    }
  },
  watch: {
    avatarUrl () {
      this.getFullUrl()
    }
  },
  methods: {
    handleView (url) {
      this.ViewUrl = url
      this.visible = true
    },
    handleRemove (file) {
      this.url = ''
      this.fullUrl = ''
      this.$emit('change', this.url)
    },
    selectAndUpload () {
      selectAndUpload(file => {
        this.status = 'uploading'
      }, p => {
        let url = p.substr(0, 4) === 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
        this.url = url
        this.status = 'finished'
        getSignUrl(url, fullUrl => {
          this.fullUrl = fullUrl
        })
        this.$emit('change', this.url)
      }, 'image/gif,image/jpeg,image/jpg,image/png,image/svg')
    },
    getFullUrl () {
      if (!this.avatarUrl) {
        this.url = ''
        this.fullUrl = ''
        return
      }
      this.url = this.avatarUrl
      getSignUrl(this.avatarUrl, fullUrl => {
        this.fullUrl = fullUrl
      })
    }
  },
  mounted () {
    this.getFullUrl()
  }
}
</script>
<style>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
