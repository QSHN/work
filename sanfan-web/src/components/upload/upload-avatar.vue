<template>
  <div>
    <div class="demo-upload-list" v-for="(item, i) in defaultList" :key="i">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png','svg','gif']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      multiple
      type="drag"
      :action="`${$config.baseUrl.dev}/org/employee/uploadAvatar/`"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img :src="avatar" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    avatar: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defaultList: [],
      visible: false
    }
  },
  watch: {
    avatar: {
      handler: function (val) {
        if (val) {
          this.defaultList = [{
            status: 'finished',
            url: val
          }]
        } else {
          this.defaultList = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleView () {
      this.visible = true
    },
    handleRemove () {
      this.$emit('changeAvatar', '')
    },
    handleSuccess (res) {
      console.log(res.url)
      this.$emit('changeAvatar', res.url)
    },
    handleFormatError () {
      this.$Notice.warning({
        title: '上传图片错误',
        desc: '上传图片类型错误，只支持jpg，jpeg，png, svg, gif'
      })
    },
    handleMaxSize () {
      this.$Notice.warning({
        title: '上传图片错误',
        desc: '只能上传少于2M的图片'
      })
    }
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
