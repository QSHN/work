<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <template v-if="item && item.type">
        <img :src="file_icon(item.type)">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="download(item)"></Icon>
          <Icon v-if="!disabled" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
    </div>
    <div v-if="!uploadList.length && disabled" class="ivu-upload">暂无文件</div>
    <div @click="selectAndUpload" v-if="!disabled" class="ivu-upload" style="display: inline-block; width: 58px;">
      <div class="ivu-upload ivu-upload-drag">
        <input type="file" multiple="multiple" class="ivu-upload-input">
        <div style="width: 58px; height: 58px; line-height: 58px; font-size: 18px;">
          <Icon type="md-cloud-upload" />
        </div>
      </div>
    </div>
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
      return this.uploadList
    }
  },
  watch: {
    defaultList () {
      this.updateList()
    }
  },
  methods: {
    download (file) {
      // this.ViewUrl = url
      // this.visible = true
      console.log(file)
      getSignUrl(file.oss, (url) => {
        window.open(url)
      })
    },
    handleRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
      this.$emit('change', this._valueList)
    },
    selectAndUpload () {
      let data = {
        createdAt: Date.parse(new Date()),
        fileId: Date.parse(new Date())
      }
      selectAndUpload(file => {
        data.name = file.name
        data.oss = file.oss
        data.size = file.size
        data.type = file.name.replace(/^.+\./, '')
      }, p => {
        data.oss = p
        this.uploadList.push(data)
        this.$emit('change', this._valueList)
      })
    },
    updateList () {
      // console.log('updateList')
      this.uploadList = []
      this.defaultList.forEach(v => {
        this.updateListPush(v)
      })
    },
    updateListPush (p) {
      this.uploadList.push(p)
    },
    file_icon (ext) {
      if (['doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm'].includes(ext)) { return require('../../assets/images/files/icon_document_word_blue@2x.png') }

      if (['xls', 'xlt', 'et', 'ett', 'xlsx', 'xltx', 'csv', 'xlsm', 'xlsm', 'xltm'].includes(ext)) { return require('../../assets/images/files/icon_document_excel_green@2x.png') }

      if (['pdf'].includes(ext)) { return require('../../assets/images/files/icon_document_pdf_pink@2x.png') }

      if (['gif', 'png', 'jpg', 'jpeg'].includes(ext)) { return require('../../assets/images/files/icon_document_picture_orange@2x.png') }

      if (['pptx', 'ppt', 'pot', 'potx', 'pps', 'ppsx', 'dps', 'dpt', 'pptm', 'potm', 'ppsm'].includes(ext)) { return require('../../assets/images/files/icon_document_ppt_red@2x.png') }

      if (['txt', 'log', 'lrc', 'rtf', 'xml', 'htm', 'html'].includes(ext)) { return require('../../assets/images/files/icon_document_txt_purple@2x.png') }

      if (['zip', '7z', 'rar'].includes(ext)) { return require('../../assets/images/files/icon_document_zip_multicolor@2x.png') }

      // return compressed file icon by default
      return require('../../assets/images/files/icon_document_unknown_gray@2x.png')
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
