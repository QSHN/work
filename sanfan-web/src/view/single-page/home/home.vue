<template>
  <div style="height: 100%">
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>

    <Card style="height: calc(100% - 120px); overflow: auto">
      <Tabs v-model="tab">
        <TabPane label="今日打卡" name="checkin">
          <div style="height: calc(100vh - 346px); overflow: hidden;">
            <checkin @updateCount="updateData" />
          </div>
        </TabPane>
        <TabPane label="今日日报" name="daily">
          <div style="height: calc(100vh - 346px); overflow: auto;">
            <daily @updateCount="updateData" />
          </div>
        </TabPane>
        <TabPane label="今日汇报" name="report">
          <div style="height: calc(100vh - 346px); overflow: auto;">
            <report @updateCount="updateData" />
          </div>
        </TabPane>
        <TabPane label="今日任务" name="task">
          <div style="height: calc(100vh - 346px); overflow: auto;">
            <task @updateCount="updateData" />
          </div>
        </TabPane>
        <TabPane label="今日拜访" name="visit">
          <div style="height: calc(100vh - 346px); overflow: auto;">
            <visit @updateCount="updateData" />
          </div>
        </TabPane>
        <TabPane label="全部消息" name="message">
          <div style="height: calc(100vh - 346px); overflow: hidden;">
            <message />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import checkin from './components/checkin'
import daily from './components/daily'
import report from './components/report'
import task from './components/task'
import visit from './components/visit'
import message from '_c/message/message.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    checkin,
    daily,
    report,
    task,
    visit,
    message
  },
  data () {
    return {
      tab: 'checkin',
      inforCardData: [
        { title: '今日打卡', icon: 'md-alarm', count: 0, color: '#2d8cf0' },
        { title: '今日日报', icon: 'ios-bookmarks', count: 0, color: '#19be6b' },
        { title: '今日汇报', icon: 'md-analytics', count: 0, color: '#ff9900' },
        { title: '今日任务', icon: 'md-locate', count: 0, color: '#ed3f14' },
        { title: '今日拜访', icon: 'ios-call', count: 0, color: '#E46CBB' },
        { title: '未读消息', icon: 'md-chatbubbles', count: 0, color: '#9A66E4' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'messageUnreadCount'
    ])
  },
  watch: {
    messageUnreadCount: {
      handler (val) {
        this.updateData(5, val)
      },
      immediate: true
    }
  },
  methods: {
    updateData (index, count) {
      this.inforCardData[index].count = count
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less">
  .count-style{
    font-size: 50px;
  }
</style>
