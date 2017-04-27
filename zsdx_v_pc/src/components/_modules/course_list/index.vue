<template>
  <div class="course_layer">
    <div class="course_list">
      <div class="list"
           v-for="v in courseData"
           :class="[v.type ? 'bg_yellow' : 'bg_blue']">

        <div class="live" v-if="v.isLive">直播</div>

        <div class="pic">
          <img :src="getImgSrc(v.pic)" class="ho_b1" />
        </div>

        <div class="content">
          <div class="title">{{v.title}}</div>
          <div class="name">{{v.name}}</div>
          <div class="info">{{v.info}}</div>
          <div class="price">{{v.price}}</div>
          <div class="certification" v-if="v.certification"></div>
          <div class="type">{{v.type ? "自动" : "随堂"}}</div>
        </div>

      </div>
    </div>

    <div class="scroll_div" v-if="courseData.isLoad">加载</div>
  </div>
</template>

<script>
  export default {
    name: 'course_list',
    props: ['courseData'],
    data () {
      return {}
    },
    methods: {
      getImgSrc: function (url) {
        return require('../../../img/course/' + url)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/_modules/course_list";
</style>
