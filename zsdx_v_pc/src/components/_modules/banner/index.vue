<template>
  <div class="banner" :style="commonWH">
    <ul class="banner_pic f--hlc" :style="allWH">
      <li class="f--hcc flex-1" v-for="v in bannerData.picList">
        <img :src="getImgSrc(v)" :style="commonWH" />
      </li>
    </ul>

    <ul class="banner_btn">
      <li v-for="v,i in bannerData.picList"
          :class="[whichBanner == i ? 'active' : '' ]"
          @click.stop="changeBanner(i)"
          @mouseenter.stop="BannerAnimated(false)"
          @mouseleave.stop="BannerAnimated(true)"  >
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'banner',
    props: ['bannerData'],
    data () {
      return {
        whichBanner: 0,
        commonWH: {
          width: '100%'
        },
        allWH: {
          width: 100 * this.bannerData.picList.length + '%',
          transition: '500ms',
          marginLeft: 0
        },
        bannerTimeC: null
      }
    },
    methods: {
      getImgSrc: function (url) {
        return require('../../../img/banner/banner' + url)
      },
      changeBanner: function (which) {
        this.whichBanner = which
        this.allWH.marginLeft = -(this.whichBanner * 100) + '%'
      },
      BannerAnimated: function (type) {
        if (type) {
          this.bannerTimeC = setInterval(() => {
            let now = this.whichBanner === 2 ? 0 : this.whichBanner + 1
            this.changeBanner(now)
          }, 5000)
          this.bannerTimeC
        } else {
          clearInterval(this.bannerTimeC)
        }
      }
    },
    mounted: function () {
      this.BannerAnimated(true)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/_modules/banner";
</style>
