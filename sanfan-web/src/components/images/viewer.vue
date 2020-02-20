<template>
  <div>
    <Spin v-if="loading"
          fix>加载中...</Spin>
    <div class="demo-upload-list"
         v-for="(url,idx) in photos"
         :key="idx">
      <img :src="imgList[idx]"
           alt="加载中…"
           @click="handleView(imgList[idx])">
    </div>
    <!-- vue 异步加载的奇怪问题，不默认检测photos的变化 -->
    <span class="check">{{photos.join(',')}}</span>
    <Modal title="图片查看"
           v-model="visible">
      <img :src="ViewUrl"
           v-if="visible"
           style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { getSignUrl } from '../../libs/aliyun'

// const getAliUrl = pic => {
//   return new Promise((resolve, reject) => {
//     getSignUrl(pic, (ret) => {
//       if (ret instanceof Error) {
//         return resolve('#')
//       } else {
//         console.info('Success pic', ret)
//         return resolve(ret)
//       }
//     })
//   })
// }

export default {
  props: {
    photos: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      ViewUrl: '',
      visible: false,
      imgList: [],
      loading: 0
    }
  },
  watch: {
    photos () {
      this.init()
    }
  },
  methods: {
    init () {
      this.imgList.length = 0
      this.loading = this.photos.length
      let self = this
      for (let i = 0; i < this.photos.length; i++) {
        getSignUrl(self.photos[i], (ret) => {
          self.loading--
          if (ret instanceof Error) {
            self.imgList[i] = '#'
          } else {
            console.info('Success pic', ret)
            self.imgList[i] = ret
          }
        })
      }
    },
    handleView (url) {
      this.ViewUrl = url
      this.visible = true
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style>
.demo-upload-list {
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
  display: block;
}
.check {
  visibility: hidden;
}
</style>
