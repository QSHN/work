<template>
  <div class="round_bar">
    <div class="bar_title" v-if="roundData.rTitle">{{roundData.rTitle}}</div>

    <div class="box f--hlc">
      <div class="box_left f--scc">
        <img src="../../../img/school_emblem/icon_w56_h46.png" />
        <a class="ho_6">{{roundData.description}}</a>
      </div>

      <div class="box_content">
        <div class="scroll_div" :style="{width: listAllWidth}">
          <div class="ul_layer f--hlc" :style="{width: listAllWidth}">
            <ul class="f--hlc flex-1" v-for="v1 in 2">
              <li v-for="v in roundData.list" class="f--scc flex-1">
                <img :src="getImgSrc(v.pic)">
                <a class="ho_blue">{{v.title}}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="box-right"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'round_bar',
    props: ['roundData'],
    data () {
      return {
        listAllWidth: this.roundData.list.length * 171 * 2 + 'px'
      }
    },
    methods: {
      getImgSrc: function (url) {
        return require('../../../img/school_emblem/' + url)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/_modules/round_bar";
</style>
