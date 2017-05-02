<template>
  <div class="course_layer">
    <div class="course_list">
      <div class="list"
           v-for="v in courseData"
           :class="[v.type ? 'bg_yellow' : 'bg_blue']">

        <div class="live" v-if="v.isLive"></div>

        <div class="pic">
          <img :src="getImgSrc(v.pic)" class="ho_b1" />
        </div>

        <div class="content">
          <div class="title"><a class="ho_6">{{v.title}}</a></div>
          <div class="name"><a class="ho_blue">{{v.name}}</a></div>
          <div class="info">{{v.info}}</div>
          <div class="price red" v-if="v.price != 0.00">￥ {{v.price}}</div>
          <div class="price green" v-else>￥ 免费</div>
          <div class="certification" v-if="v.certification"></div>
          <div class="type f--hcc br4">{{v.type ? "自动" : "随堂"}}</div>
        </div>

      </div>
    </div>

    <div class="scroll_div" v-if="isLoad">加载</div>
  </div>
</template>

<script>
  export default {
    name: 'course_list',
    props: ['courseData', 'isLoad'],
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
