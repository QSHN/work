<template>
  <div class="zsdx_index_page" v-bind:style="{ minHeight: height+'px'}">
    <banner :bannerData="bannerData"></banner>

    <div class="page_main_content">
      <no-effect-nav :navData='noEffectNavData'></no-effect-nav>

      <div class="degree_courses">
        <div class="title">学位课</div>
        <span>学位直通车，专业认证，满满干货</span>
        <div class="more_icon"></div>

        <div class="list_layer f--hlc">
          <div class="list flex-1" v-for="v in degreeCourses">
            <img :src="getImgSrc(v.pic)">
            <div class="list_title">{{v.title}}</div>
            <p>{{v.content}}</p>
            <a :href="v.href" class="ho_6">{{v.a}}</a>
          </div>
        </div>
      </div>
    </div>

    <page-nav :navData="navData"></page-nav>
  </div>
</template>

<script>
  import banner from '../../_modules/banner/index.vue'
  import pageNav from '../../_modules/nav/3dnav.vue'
  import noEffectNav from '../../_modules/nav/no_effect_nav.vue'

  export default {
    name: 'zsdx_index_page',
    components: { banner, pageNav, noEffectNav },
    data () {
      return {
        height: window.innerHeight - 69 - 292,
        bannerData: {
          noLink: true,
          picList: ['1.jpg', '2.jpg', '3.jpg']
        },
        navData: [
          { href: '#', name: '热门' },
          { href: '#', name: 'Java开发工程师' },
          { href: '#', name: '营养师' },
          { href: '#', name: '导师' },
          { href: '#', name: '交互设计师' }
        ],
        noEffectNavData: [
          { href: '#', name: 'Mooc' },
          { href: '#', name: '职业考试' },
          { href: '#', name: '演讲' },
          { href: '#', name: '兴趣/技能' },
          { href: '#', name: '全部课程' }
        ],
        degreeCourses: [
          {
            pic: 'law_green_w90_h90.png',
            title: '法学硕士',
            content: '培养高层次的复合型、应用型法律人才。',
            href: '#',
            a: '查看法学硕士'
          },
          {
            pic: 'medicine_red_w90_h90.png',
            title: '临床医学硕士',
            content: '临床分析和思维能力，能独立处理本学科（指二级学科，内科与外科分别不少于3个三级学科，以下同）领域内的常见病。',
            href: '#',
            a: '查看医学硕士'
          },
          {
            pic: 'financial_purple_w90_h90.png',
            title: '经济金融',
            content: '金融数量化分析技能，能够在金融机构和企事业单位从事投资策略、金融产品分析及定价、资产管理与风险控制。',
            href: '#',
            a: '查看金融学学士学位'
          }
        ]
      }
    },
    methods: {
      getImgSrc: function (url) {
        return require('../../../img/zsdx_index/' + url)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/page/zsdx_index";
</style>
