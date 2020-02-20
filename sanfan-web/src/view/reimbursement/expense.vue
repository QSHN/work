<template>
    <div>
      <Button v-if="addFn" @click="add.show=true">新建报销</Button>
      <div v-if="!list.length" style="text-align: center;font-size: 16px;margin-top: 60px">没有数据</div>
      <Row v-else type="flex" align="top" :gutter="10">
        <Col v-for="(item,index) in list" :key="index" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
          <div class="item_con clearfloat" @click="show(item)">
            <div class="head">
              <img :src="item.reimbursePersonAvatar">
            </div>
            <div class="content">
              <p class="title">{{item.reimbursePersonName}}提交的报销</p>
              <div class="info" v-for="(info,index) in item.reimbursementItemDTOList" :key="index">
                <p>金额：{{info.amount}}元</p>
                <p>类别：{{info.categoryId}}</p>
                <p>明细：{{info.detail}}</p>
              </div>
              <p>时间：2019-03-24 16:44:37</p>
              <p v-if="item.status=='待审批'" class="wait">待审批</p>
              <p v-if="item.status=='已拒绝'" class="error">已拒绝 {{item.notes}}</p>
              <p v-if="item.status=='审批通过'" class="pass">审批通过</p>
            </div>
          </div>
        </Col>
      </Row>
      <AddExpense v-model="add.show" @finish="$emit('update')"></AddExpense>
      <Modal v-model="details.show" title="报销详情">
        <div class="item_con clearfloat">
          <div class="head">
            <img :src="who(details.data.applicant) && who(details.data.applicant).avatarUrl">
          </div>
          <div class="content">
            <p class="title">{{details.data.reimbursePersonName}}提交的报销</p>
            <div class="info" v-for="(info,index) in details.data.reimbursementItemDTOList" :key="index">
              <p>金额：{{info.amount}}元</p>
              <p>类别：{{info.categoryId}}</p>
              <p>明细：{{info.detail}}</p>
            </div>
            <p>
              审核人：<span>{{details.data.checkerName}}</span>
            </p>
            <p>
              审批人：<span>{{details.data.approverName}}</span>
            </p>
            <p>
              出纳人：<span>{{details.data.cashierName}}</span>
            </p>
            <p>
              抄送人：<span v-for="(item, index) in details.data.copyToWho" :key="'copyToWho_'+index">{{item.employeeName}} </span>
            </p>
            <p>时间：2019-03-24 16:44:37</p>
            <upload-pic disabled v-model="details.data.photo"></upload-pic>
            <p>审批流程：</p>
            <div style="margin-left: 50px;">
              <div class="approve_con">
                <div class="head_con">
                  <img :src="details.data.checkerAvatar"/>
                </div>
                <div class="status_con">
                  <img v-if="checkerStatus==='REJECTED'" src="../../assets/images/icon_reject_red@2x.png">
                  <img v-if="checkerStatus==='APPROVED'" src="../../assets/images/icon_through_green@2x.png">
                </div>
                <div class="name_con">{{details.data.checkerName}}</div>
                <div class="role_con">审核人</div>
                <div v-if="checkerStatus==='APPROVED'" class="pass">已通过</div>
                <div v-if="checkerStatus==='REJECTED'" class="rejected">已驳回</div>
              </div>
              <div class="process_right">
                <img src="../../assets/images/arrow_process_right_gray@2x.png">
              </div>
              <div class="approve_con">
                <div class="head_con">
                  <img :src="details.data.approverAvatar"/>
                </div>
                <div class="status_con">
                  <img v-if="approverStatus==='REJECTED'" src="../../assets/images/icon_reject_red@2x.png">
                  <img v-if="approverStatus==='APPROVED'" src="../../assets/images/icon_through_green@2x.png">
                </div>
                <div class="name_con">{{details.data.approverName}}</div>
                <div class="role_con">审批人</div>
                <div v-if="approverStatus==='APPROVED'" class="pass">已通过</div>
                <div v-if="approverStatus==='REJECTED'" class="rejected">已驳回</div>
              </div>
              <div class="process_right">
                <img src="../../assets/images/arrow_process_right_gray@2x.png">
              </div>
              <div class="approve_con">
                <div class="head_con">
                  <img :src="details.data.cashierAvatar"/>
                </div>
                <div class="status_con">
                  <img v-if="cashierStatus==='REJECTED'" src="../../assets/images/icon_reject_red@2x.png">
                  <img v-if="cashierStatus==='APPROVED'" src="../../assets/images/icon_through_green@2x.png">
                </div>
                <div class="name_con">{{details.data.cashierName}}</div>
                <div class="role_con">出纳人</div>
                <div v-if="cashierStatus==='APPROVED'" class="pass">已通过</div>
                <div v-if="cashierStatus==='REJECTED'" class="rejected">已驳回</div>
              </div>
            </div>
            <p v-if="note" style="clear: both;color: red;">拒绝原因：{{note}}</p>
          </div>
        </div>
        <Row v-if="type=='waitAudit'" :gutter="20" style="margin-top: 20px">
          <Col :span="12">
            <Button style="width: 100%" type="primary" @click="onApprove()">通过</Button>
          </Col>
          <Col :span="12">
            <Button style="width: 100%" type="error" @click="rejectShow(details.data)">拒绝</Button>
          </Col>
        </Row>
      </Modal>
      <Modal v-model="reject.show" title="拒绝原因" @on-ok="onReject">
        <Form style="margin-left: 40px">
          <FormItem label="原因"><Input style="width: 350px" v-model="reject.value"></Input></FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
import { doApprove } from '../../api/reimbursement'
import { mapGetters } from 'vuex'
import AddExpense from './addExpense'
import UploadPic from '../../components/upload/upload-pic'
export default {
  name: 'Expense',
  components: { AddExpense, UploadPic },
  props: {
    data: Array,
    addFn: false,
    type: String
  },
  data () {
    return {
      list: [],
      add: {
        show: false
      },
      details: {
        show: false,
        data: {}
      },
      reject: {
        show: false,
        data: {},
        value: ''
      }
    }
  },
  watch: {
    personnel () {
      this.$forceUpdate()
    },
    data (value) {
      this.load()
    }
  },
  computed: {
    ...mapGetters([
      'who',
      'myUserId',
      'personnel',
      'myCompany'
    ]),
    checkerStatus () {
      let process = this.details.data.reimbursementProcessDTOList
      if (process && process.length) {
        if (process[0].approveType === 'CHECK') {
          return process[0].approveStatus
        }
        if (process[0].approveType === 'APPROVE') {
          return 'APPROVED'
        }
        if (process[0].approveType === 'CASH') {
          return 'APPROVED'
        }
      }
    },
    approverStatus () {
      let process = this.details.data.reimbursementProcessDTOList
      if (process && process.length) {
        if (process[0].approveType === 'APPROVE') {
          return process[0].approveStatus
        }
        if (process[0].approveType === 'CASH') {
          return 'APPROVED'
        }
      }
    },
    cashierStatus () {
      let process = this.details.data.reimbursementProcessDTOList
      if (process && process.length) {
        if (process[0].approveType === 'CASH') {
          return process[0].approveStatus
        }
      }
    },
    note () {
      let process = this.details.data.reimbursementProcessDTOList
      if (process && process.length) {
        return process[0].note
      }
    }
  },
  mounted () {
    this.load()
    // if (this.myCompany.financeSetting) {
    //   this.pass.value.reviewer = this.myCompany.financeSetting.reviewer
    //   this.pass.value.approver = this.myCompany.financeSetting.approver
    //   this.pass.value.bookkeeper = this.myCompany.financeSetting.bookkeeper
    // }
  },
  methods: {
    getName (id) {
      let user = this.who(id)
      return user ? user.name : ''
    },
    load () {
      setTimeout(() => {
        this.$forceUpdate()
      }, 1000)
      this.list = this.data
    },
    show (item) {
      this.details.show = true
      this.details.data = item
    },
    passShow (item) {
      this.pass.show = true
      this.pass.data = item
    },
    rejectShow (item) {
      this.reject.show = true
      this.reject.data = item
    },
    isAudit (item) {
      if (item.status === '待审批' && item.approver.length) {
        if (item.approver.filter(item => (item.uid === this.myUserId)).length) {
          return true
        }
      }
      return false
    },
    onApprove () {
      this.$Modal.confirm({
        title: '操作确认',
        content: '确认通过吗？',
        onOk: () => {
          doApprove({ id: this.details.data.id, approveStatus: 'APPROVED' }).then(() => {
            this.$Message.success('审批通过')
            this.emit('refresh')
          }).catch(error => {
            console.error(error)
            this.$Message.error('提交失败，请稍后再试')
          })
        }
      })
    },
    onReject () {
      doApprove({ id: this.details.data.id, approveStatus: 'REJECTED' }).then(() => {
        this.$Message.success('拒绝成功')
        this.emit('refresh')
        this.reject.show = false
      }).catch(error => {
        console.error(error)
        this.$Message.error('提交失败，请稍后再试')
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import "expense";
</style>
