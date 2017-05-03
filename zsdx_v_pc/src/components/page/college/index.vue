<template>
  <div class="college_page">
    <div class="banner">
      <div class="title">中山大学</div>
      <p>博学、审问、慎思、明辨 、笃行</p>
    </div>

    <div class="content">
      <div class="COPC_header">
        <div class="title">合作院校</div>
        <div class="btn ho_8 br5">院校入驻</div>
      </div>

      <ul>
        <li v-for="v in collegeData"
            @mouseenter.stop="MouseEnterFuc"
            @mouseleave.stop="MouseLeaveFuc">
          <div class="li_content">
            <div class="school_name">{{v.school}}</div>
            <span>{{v.en}}</span>
            <p>{{v.content}}</p>
          </div>

          <div class="hover">
            <div class="school_name">{{v.school}}</div>
            <span>{{v.en}}</span>
            <p>{{v.content}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Pub from '../../../js/public'

  export default {
    name: 'college_page',
    Pub,
    data () {
      return {
        collegeData: [
          {
            school: '广州海洋大学',
            en: 'Guangzhou Ocean University',
            content: '广学明德、海纳厚为'
          },
          {
            school: '中山大学',
            en: 'Sun Yat-sen University',
            content: '博学 审问 慎思 明辨  笃行'
          },
          {
            school: '广州大学',
            en: 'Guangzhou University',
            content: '博学笃行 与时俱进'
          },
          {
            school: '湖南大学',
            en: 'Hunan University',
            content: '实事求是、敢为人先'
          },
          {
            school: '暨南大学',
            en: 'Jinan University',
            content: '忠信笃敬'
          },
          {
            school: '武汉大学',
            en: 'Wuhan University',
            content: '求是拓新 自强弘毅'
          },
          {
            school: '复旦大学',
            en: 'Fudan University',
            content: '博学而笃志，切问而近思'
          },
          {
            school: '华南理工大学',
            en: 'South China University of Technology',
            content: '博学慎思，明辨笃行'
          },
          {
            school: '斯坦福大学',
            en: 'Stanford University',
            content: '让自由之风吹'
          },
          {
            school: '南京大学',
            en: 'Nanjing University',
            content: '诚朴 雄伟 励学 敦行'
          },
          {
            school: '东南大学',
            en: 'Southeast University',
            content: '止于至善'
          },
          {
            school: '台北艺术大学',
            en: 'Taipei University of the Arts',
            content: '依于人，游于艺'
          }
        ]
      }
    },
    methods: {
      MouseEnterFuc: function (e) {
        Pub.addMouseClass(e, e.target, 'in')
      },
      MouseLeaveFuc: function (e) {
        Pub.addMouseClass(e, e.target, 'out')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/page/college";
</style>
