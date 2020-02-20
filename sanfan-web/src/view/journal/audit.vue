<template >
  <div class="journal-form">
    <Spin v-if="spinShow"
          size="large"
          fix />
    <Form ref="Journal"
          :label-width="80">
      <Row>
        <Col span="12">
        <FormItem label="创建人:">{{journal.createName}} </FormItem>
        <FormItem label="日志类型:">{{typeStr}} </FormItem>
        </Col>

        <Col span="12">
        <FormItem label="创建时间:">{{journal.createTime}} </FormItem>
        <FormItem label="日志状态:">
          <Tag :color="statusClass">{{statusTitle}} </Tag>
        </FormItem>
        </Col>

      </Row>

      <FormItem label="驳回原因:"
                v-if="journal.result && journal.dailyStatus === 'NOPASS'">
        <p class="no-pass-text">{{journal.result}}</p>
      </FormItem>

      <FormItem label="审批人:">
        {{dailyAuditUserNames}}
      </FormItem>

      <FormItem label="日志内容:">
        <Input :value="journal.content"
               type="textarea"
               readonly
               :rows="6" />
      </FormItem>

      <!-- 查看日志照片 -->
      <FormItem v-if="journal.photos && journal.photos.length >= 1"
                label="日志照片:">
        <images-viewer :photos="journal.photos"></images-viewer>
      </FormItem>

      <FormItem v-if="showAudit">

        <Row :gutter="20">
          <Col span="4">
          <Button type="error"
                  size="large"
                  @click="showRejectModal(true)">驳回</Button>
          </Col>
          <Col span="4">
          <Button type="success"
                  size="large"
                  @click="passJournal()">通过</Button>
          </Col>
        </Row>

      </FormItem>

      <!-- 驳回对话框 -->
      <Modal @on-ok="rejectJournal"
             v-model="showReject"
             title="请填写驳回理由">
        <Input v-model="result"
               placeholder="请填写驳回理由" />
      </Modal>

    </Form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ImagesViewer from '_c/images/viewer.vue'
import { changeAuditStatus, dailyDetails, dailyUpdate } from '@/api/daily'

const DAILYTYPES = {
  'DAILY': '日报', 'WEEKLY': '周报', 'MONTHLY': '月报'
}

// 日报状态
const STATUS_TYPES = {
  'READ': { title: '已读', class: 'primary' },
  'UNREAD': { title: '未读', class: 'default' },
  'PASS': { title: '通过', class: 'success' },
  'NOPASS': { title: '驳回', class: 'warning' }
}

export default {
  name: 'journalaudit',
  components: {
    ImagesViewer
  },
  props: {
    'journalID': {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 加载
      spinShow: true,
      // 驳回理由
      result: '',
      // 显示拒绝
      showReject: false,
      journal: {
        dailyStatus: '',
        dailyType: ''
      }
    }
  },
  watch: {
    async journalID (val) {
      if (!val) return

      this.result = ''

      this.spinShow = true

      let rst = await dailyDetails(val)
      if (!rst.data) return this.$Message.error('详情获取出错')

      this.journal = rst.data

      if (this.journal.photos && this.journal.photos.length) {
        this.journal.photos = this.journal.photos.filter(p => !!p)
      }

      if (this.journal.createId !== this.getUserInfo.id &&
        this.getUserInfo.role !== 'SUPERADMIN' &&
        this.journal.dailyStatus === 'UNREAD') {
        let rtn = await dailyUpdate(val)
        if (rtn) {
          this.journal.dailyStatus = 'READ'
        }
      }

      this.spinShow = false
    }
  },
  methods: {

    showRejectModal (isShow) { this.showReject = isShow },

    // 统一操作按钮
    doAudit (dailyStatus, result) {
      this.$Loading.start()

      changeAuditStatus({ id: this.journal.id, dailyStatus, result }).then(res => {
        this.$Loading.finish()
        this.$set(this.journal, 'dailyStatus', dailyStatus)
        this.$set(this.journal, 'result', result)
        this.$emit('stateChange', this.journal.id, dailyStatus, result)
        this.$forceUpdate()

        if (dailyStatus !== 'UNREAD') {
          this.$Message.success('提交成功')
        }
      }).catch(err => {
        console.error(err)
        this.$Loading.error()
        this.$Message.error('提交失败，请稍后再试')
      })
    },
    // 同意
    passJournal () {
      this.doAudit('PASS')
    },
    // 驳回
    rejectJournal (title = '驳回理由') {
      if (!this.result || !this.result.trim()) {
        return this.$Message.error('驳回理由不得为空')
      }
      this.doAudit('NOPASS', this.result)
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ]),
    dailyAuditUserNames () {
      return this.journal.dailyAuditUserList && this.journal.dailyAuditUserList.length
        ? this.journal.dailyAuditUserList.map(p => p.name).join(', ') : ''
    },
    statusClass () {
      return (STATUS_TYPES[this.journal.dailyStatus] && STATUS_TYPES[this.journal.dailyStatus].class) || ''
    },
    statusTitle () {
      return (STATUS_TYPES[this.journal.dailyStatus] && STATUS_TYPES[this.journal.dailyStatus].title) || ''
    },
    typeStr () {
      return DAILYTYPES[this.journal.dailyType] || ''
    },
    // 是否显示操作处理结果
    showAudit () {
      return this.journal.createId !== this.getUserInfo.id &&
        this.getUserInfo.role !== 'SUPERADMIN' &&
        (this.journal.dailyStatus === 'UNREAD' || this.journal.dailyStatus === 'READ')
    }
  }
}
</script>
<style lang="less" scoped>
@import "./form.less";
</style>
