<template>
  <div>
    <Card class="timecard-main">
      <p slot="title">
        考勤组列表
      </p>
      <div slot="extra">
        <Button type="success"
                @click="createTimeCard"> 新增考勤组 </Button>
      </div>

      <div class="timecard-list">
        <Card class="timecard-card"
              v-for="(tc, index) in templateList"
              :key="index">

          <p slot="title">
            {{tc.name}}
          </p>

          <div slot="extra"
               class="timecard-btns">
            <Button ghost
                    size="small"
                    type="warning"
                    @click="updateTimeCard(tc)"> 编辑 </Button>
            <!-- <Button ghost
                    size="small"
                    type="error"
                    @click="removeTimeCard(tc)"> 删除 </Button> -->
          </div>

          <div class="timecard-info">

            <div class="timecard-row">
              <div class="timecard-row-head">
                <Icon size="24"
                      type="ios-calendar-outline" />
                <span>工作日</span>
              </div>
              <div class="timecard-row-body">
                {{tc.workDays}}
              </div>
            </div>

            <div class="timecard-row">
              <div class="timecard-row-head">
                <Icon size="24"
                      type="ios-clock-outline" />
                <span>考勤时段</span>
              </div>
              <div class="timecard-row-body">
                {{tc.workTimes}}
              </div>
            </div>

            <div class="timecard-row">
              <div class="timecard-row-head">
                <Icon size="24"
                      type="ios-navigate-outline" />
                <span>考勤地点</span>
              </div>
              <div class="timecard-row-body">
                {{tc.location}}
              </div>
            </div>

            <div class="timecard-row">
              <div class="timecard-row-head">
                <Icon size="24"
                      type="ios-people-outline" />
                <span>考勤员工</span>
              </div>
              <div class="timecard-row-body">
                {{tc.owners}}
              </div>
            </div>

          </div>
        </Card>
      </div>

      <div v-if="!this.templateList.length">
        <h2>暂无考勤组</h2>
      </div>

      <Modal v-model="showModal"
             :loading="keepModal"
             :mask-closable="false"
             :closable="false"
             width="1200"
             height="500"
             @on-cancel="$forceUpdate()"
             @on-ok="handleSubmit">
        <p slot="header">{{isEdit ? '编辑' : '新建'}} 考勤组 {{currentTimecard && currentTimecard.name || ''}}</p>
        <Timecard ref="detail" />
      </Modal>

    </Card>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Timecard from './timecardedit.vue'

export default {
  name: 'timecardlist',
  components: { Timecard },
  props: {},
  data () {
    return {
      templateList: [],
      // 显示弹窗
      showModal: false,
      // 保持弹窗
      keepModal: true,
      // 是否编辑
      isEdit: false
    }
  },
  computed: {
    ...mapGetters(['timecardList', 'currentTimecard'])
  },
  methods: {
    ...mapMutations(['setCurrentTimecard']),
    ...mapActions(['getTimecardList', 'timecardListFormated']),

    listTimeCards () {
      this.$Loading.start()
      this.getTimecardList()
        .then(rtn => {
          // 获取的是Formated
          this.timecardListFormated().then(() => {
            this.templateList = this.timecardList
          })
          this.$Loading.finish()
        })
        .catch(error => {
          console.error('Fail In AddComPanySetting', error)
          this.$Message.error('列表失败')
          this.$Loading.error()
        })
    },

    updateTimeCard (tc) {
      this.keepModal = this.showModal = true
      this.isEdit = true
      this.setCurrentTimecard(tc)
    },

    removeTimeCard (tc) {
      let self = this
      this.$Modal.confirm({
        title: '确定要删除"' + tc.name + '"的设置',
        onOk () {
          self.$Loading.start()
          this.remove(tc._id).then(res => {
            self.$Loading.finish()
            self.$Message.info('删除成功')
          }).catch(err => {
            console.error(err)
            self.$Loading.error()
            self.$Message.error('提交失败，请稍后再试')
          })
        }
      })
      self = undefined
    },

    createTimeCard () {
      this.keepModal = this.showModal = true
      this.isEdit = false
      this.setCurrentTimecard({
        name: ''
      })
    },

    async handleSubmit () {
      let rst = await this.$refs.detail.submit()
      this.keepModal = false
      this.showModal = !rst
      if (rst) this.listTimeCards()
      this.$nextTick(() => {
        // 防止连续点击弹窗关闭
        this.keepModal = true
      })
    }

  },
  mounted () {
    this.listTimeCards()
  }
}
</script>
<style lang="less" >
@hd: ~".timecard";

@{hd}-main {
  min-width: 800px;

  & > .ivu-card-body {
    background-color: #fafafa;
  }

  @{hd}-list {
    display: flex;
    flex-flow: row wrap;

    @{hd}-card {
      width: 500px;
      margin: 6px;

      @{hd}-btns button:first-child {
        margin-right: 1em;
      }

      @{hd}-row {
        margin: 0 auto 0.5em auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        &-head {
          width: 6.5em;
          margin-right: 1em;
          color: #999;

          i {
            margin-right: 0.3em;
          }
        }

        &-body {
          max-width: 360px;
          word-break: break-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
