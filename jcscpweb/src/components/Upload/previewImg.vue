<template>
  <img v-if="previewUrl" :src="previewUrl" class="preview-img">
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
  }
}
</script>

<style lang="scss" scoped>
  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
