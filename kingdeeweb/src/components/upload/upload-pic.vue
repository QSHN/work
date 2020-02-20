<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <template v-if="item.status !== 'uploading'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon v-if="!disabled" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.percentage" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <div v-if="!uploadList.length && disabled" class="ivu-upload">暂无图片</div>
    <div @click="selectAndUpload" v-if="!disabled && uploadList.length < multiple" class="ivu-upload" style="display: inline-block; width: 58px;">
      <div class="ivu-upload ivu-upload-drag">
        <input type="file" multiple="multiple" class="ivu-upload-input">
        <div style="width: 58px; height: 58px; line-height: 58px;">
          <i class="ivu-icon ivu-icon-ios-camera" style="font-size: 20px;">
          </i>
        </div>
      </div>
    </div>
    <Modal title="图片查看" v-model="visible">
      <img :src="ViewUrl" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { selectAndUpload, getSignUrl } from '../../libs/aliyun'
export default {
  name: 'uploadPic',
  model: {
    prop: 'defaultList',
    event: 'change'
  },
  props: {
    defaultList: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Number,
      default: 3
    },
    disabled: {
      type: Boolean,
      default: false
    }
    // defaultList: [
    //   '87a5da787e5e9119.1552016249645.jpeg',
    //   '87a5da787e5e9119.1552016113514.jpeg',
    //   '87a5da787e5e9119.1552015864602.jpeg'
    // ],
  },
  data () {
    return {
      ViewUrl: '',
      visible: false,
      uploadList: []
    }
  },
  computed: {
    _valueList () {
      return this.uploadList.map(item => item.oss)
    }
  },
  watch: {
    defaultList () {
      this.updateList()
    }
  },
  methods: {
    handleView (url) {
      this.ViewUrl = url
      this.visible = true
    },
    handleRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
      this.$emit('change', this._valueList)
    },
    selectAndUpload () {
      let data = {
        percentage: 50,
        status: 'uploading', // uploading finished
        url: null,
        oss: null,
        loaded: false
      }
      selectAndUpload(file => {
        data.name = file.name
        this.uploadList.push(data)
      }, p => {
        let url = p.substr(0, 4) === 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
        data.oss = url
        getSignUrl(url, fullUrl => {
          data.url = fullUrl
        })
        this.$emit('change', this._valueList)
      }, 'image/gif,image/jpeg,image/jpg,image/png,image/svg')
    },
    updateList () {
      // console.log('updateList')
      this.uploadList = []
      this.defaultList.forEach(url => {
        this.updateListPush(url)
      })
    },
    updateListPush (p) {
      let url = p.substr(0, 4) === 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
      let data = {
        percentage: 100,
        status: 'finished', // uploading
        oss: url,
        url: null,
        loaded: false
      }
      this.uploadList.push(data)
      getSignUrl(url, fullUrl => {
        data.url = fullUrl
      })
      return data
    }
  },
  mounted () {
    this.updateList()
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
