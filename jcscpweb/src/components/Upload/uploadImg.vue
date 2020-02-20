<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    action=""
    :drag="true"
    :multiple="true"
    :http-request="uploadHttp"
    :before-upload="beforeAvatarUpload"
    list-type="picture"
  >
    <img v-if="previewUrl" :src="previewUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'
import ossClient from '../../utils/aliyun'
export default {
  props: {
    imageUrl: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'uploadConf'
    ]),
    previewUrl() {
      if (this.imageUrl) {
        return ossClient(this.uploadConf).signatureUrl(this.imageUrl, { expires: 3600 * 24 * 30 })
      } else {
        return null
      }
    }
  },
  methods: {
    uploadHttp({ file }) {
      const fileName = 'pc.' + Date.now() + '.' + file.name.split('.')[1]
      ossClient(this.uploadConf).put(fileName, file, {
        'ContentType': 'image/jpeg'
      }).then(({ res, url, name }) => {
        if (res && res.status === 200) {
          console.log(`阿里云OSS上传图片成功回调`, res, url, name)
          this.$emit('change', name)
        }
      }).catch((err) => {
        this.$message.error(`上传图片失败:${err}`)
      })
    },
    beforeAvatarUpload(file) {
      const isJPEG = file.name.split('.')[1] === 'jpeg'
      const isJPG = file.name.split('.')[1] === 'jpg'
      const isPNG = file.name.split('.')[1] === 'png'
      const isLt500K = file.size / 1024 / 500 < 2
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error('上传图片只能是 JPEG/JPG/PNG 格式!')
      } else if (!isLt500K) {
        this.$message.error('单张图片大小不能超过 500KB!')
      }
      return (isJPEG || isJPG || isPNG) && isLt500K
    }
  }
}
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload-dragger {
    width: 100%;
    height: 100%;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 46px;
    height: 46px;
    line-height: 46px;
    text-align: center;
  }
  .avatar {
    width: 46px;
    height: 46px;
    display: block;
  }
</style>
