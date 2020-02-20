<template lang="pug">
  .introduce
    .introduce_t
      .title 功能齐全实用·得心应手
      p 多功能运用，全面满足企业需求，真正懂得客户

    .introduce_c
      .container
        .list_layer
          .list(v-for="(v, i) in listData")
            .list_t {{v.title}}
            p {{v.describe}}
            img(:src="getImgSrc(v.pic)")

</template>

<script>
export default {
  name: 'Introduce',
  data() {
    return {
      listData: [
        {
          title: '任务管理',
          describe:
            '随时随地可新建任务，任务轻重级别、描述、期限、分工等事无巨细',
          pic: 'pic_task_management'
        },
        {
          title: '客户管理',
          describe: '详细准确的客户信息，领导者就从根源上掌握了企业的核心信息',
          pic: 'pic_client_management'
        },
        {
          title: '考勤管理',
          describe:
            '考勤分组、考勤时间灵活设置，自动汇总考勤数据，保证现场考勤真实性和及时性',
          pic: 'pic_attendance_management'
        },
        {
          title: '财务管理',
          describe:
            '实时了解公司当天财务的收入，支出和余额，可以知道每一笔收入或支出的详情',
          pic: 'pic_financial_management'
        },
        {
          title: '日报管理',
          describe:
            '日常工作效率看得见，及时记录当天内容，并进行相应的管理，随时掌握企业动态',
          pic: 'pic_daily_management'
        },
        {
          title: '客户拜访',
          describe:
            '记录拜访通话时长、次数和走访情况，这样可以实时监控拜访真实情况，无法做弊',
          pic: 'pic_customer_visit'
        },
        {
          title: '聊天功能',
          describe:
            '专属的企业内部沟通平台，发语音、发视频、发文字、发图片一应俱全',
          pic: 'pic_chat'
        },
        {
          title: '消息提醒',
          describe:
            '日常工作效率看得见，及时记录当天内容，并进行相应的管理，随时掌握企业动态',
          pic: 'pic_message_reminding'
        }
      ]
    }
  },
  methods: {
    getImgSrc(src) {
      return require(`~/assets/image/index/${src}@2x.png`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './introduce';
</style>
