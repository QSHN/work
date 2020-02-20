<template>
  <div>
    <Spin v-if="showSpin"
          fix>加载中...</Spin>
    <Alert v-if="isAuditing"
           type="warning">
      选择拒绝就算为漏打卡处理，通过就算是正常打卡处理
    </Alert>
    <Form :label-width="60">
      <FormItem label="打卡人">
        {{ record.employeeName }}
      </FormItem>
      <FormItem label="打卡详情">
        <p :style="'color:' + textClr ">{{positionStr}}，{{attendancesStr}}打卡</p>
      </FormItem>
      <FormItem label="打卡日期">
        {{record.checkInDate}}
      </FormItem>
      <FormItem label="打卡地点">
        {{ record.address || '暂时无法定位'}}
      </FormItem>
      <FormItem v-if="auditStatusStr"
                label="打卡状态">
        <span :style="'color:' + auditStatusClr"
              class="timerecord-auditStatus">{{auditStatusStr}}</span>
      </FormItem>
      <FormItem label="照片">
        <p v-if="!record.photo">无照片</p>
        <images-viewer v-else
                       :photos="[record.photo]" />
      </FormItem>
      <FormItem label="说明">
        {{record.remarks || '无'}}
      </FormItem>
      <FormItem v-if="record.refuse"
                label="拒绝原因">
        <p style="color:#ed4014">{{record.refuse}}</p>
      </FormItem>
    </Form>
    <template v-if="isAuditing">
      <Divider />
      <Row :gutter="20">
        <Col span="3">
        <Button type="error"
                @click="nopass">拒绝</Button>
        </Col>
        <Col span="3">
        <Button type="success"
                @click="pass">通过</Button>
        </Col>
      </Row>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ImagesViewer from '_c/images/viewer.vue'
import { record, audit } from '@/api/attendance'
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../timerecord.mixin.js'

export default {
  name: 'TimerecordAudit',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    ImagesViewer
  },
  props: {
    id: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  data () {
    return {
      record: {},
      showSpin: false
    }
  },
  watch: {
    id (val) {
      if (!val) return

      let self = this
      self.showSpin = true
      self.$Loading.start()
      record(val).then(res => {
        if (!res || !res.data) {
          throw new Error('无打卡信息')
        }
        self.record = res.data
        self.$forceUpdate()
        self.showSpin = false
        self.$Loading.finish()
      }).catch(err => {
        console.error(err)
        self.$Loading.error()
        self.$Message.error('获取打卡信息失败')
      })
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  methods: {
    nopass () {
      let refuse = ''
      let self = this
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              autofocus: true,
              placeholder: '请输入拒绝原因'
            },
            on: {
              input: (val) => {
                refuse = val
              }
            }
          })
        },
        onOk: () => {
          if (!refuse) return self.$Message.warning('必须填写拒绝原因')
          audit({
            id: self.record.id,
            auditStatus: 'NOPASS',
            refuse
          }).then(res => {
            self.$Loading.finish()
            self.$set(self.record, 'auditStatus', 'NOPASS')
            // 这里写是Root向上发送
            self.$emit('stateChange', 'NOPASS')
            self.$forceUpdate()
            self.$Message.success('提交成功')
          }).catch(err => {
            console.error(err)
            self.$Loading.error()
            self.$Message.error('提交失败，请稍后再试')
          })
        }
      })
    },
    pass () {
      let self = this
      this.$Modal.confirm({
        title: '确定要通过该打卡',
        onOk (evt) {
          self.$Loading.start()

          audit({
            id: self.record.id,
            auditStatus: 'PASS'
          }).then(res => {
            self.$Loading.finish()
            self.$set(self.record, 'auditStatus', 'PASS')
            self.$emit('stateChange', 'PASS')
            self.$forceUpdate()
            self.$Message.success('提交成功')
          }).catch(err => {
            console.error(err)
            self.$Loading.error()
            self.$Message.error('提交失败，请稍后再试')
          })
        }
      })
    }
  }
}
</script>
