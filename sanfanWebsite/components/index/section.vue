<template lang="pug">
  .section
    .section_t
      .title {{sData.title}}
      p {{sData.subTitle}}
    .section_c(:class="sData.cls")
      .container
        .main
          .left
            img(:src="getImgSrc(sData.pic)")
          .right
            .item(v-for="(v, i) in sData.content" :key="i" :class="v.describe.length == 1 ? 'active' : 'active1'")
              .item_t {{v.title}}
              .item_c
                p(v-for="(v1, i1) in v.describe" :key="i1") {{v1}}

    
</template>

<script>
export default {
  name: 'Section',
  props: {
    sData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    getImgSrc(src) {
      return require(`~/assets/image/index/${src}@2x.png`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './section';
</style>
