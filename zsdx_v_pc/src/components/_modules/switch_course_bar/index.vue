<template>
  <div class="switch_course_bar">
    <div class="title">{{courseData.title}}</div>
    <nav class="f--hcc">
      <li v-for="v,i in courseData.list" class="ho_blue">
        {{ v }}
      </li>
    </nav>
  </div>
</template>

<script>
  export default {
    name: 'switch_course_bar',
    props: ['courseData'],
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/_modules/switch_course_bar";
</style>
