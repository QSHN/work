<template>
  <div>
    <Card class="attendance-log">
      <Spin v-if="spinShow"
            size="large"
            fix />
      <!-- 筛选框 -->
      <div class="attendance-filter"
           slot="title">
        <Form :label-width="80">
          <Row :gutter="24">
            <Col span="6">
            <FormItem>
              <RadioGroup v-model="actionType"
                          @on-change="initPage(true)"
                          type="button">
                <Radio label="approvalManagerList">审批</Radio>
                <Radio label="myApprovalList">发起</Radio>
                <Radio label="copyList">抄送</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <!-- <Col span="6">
          <FormItem label="时间跨度:">
            <Select v-model="range"
                    @on-change="filters.filterChange"
                    placeholder="请选择时间长度">
              <Option :value="3">三天内</Option>
              <Option :value="7">一周内</Option>
              <Option :value="30">一个月内</Option>
              <Option :value="1100">全部</Option>
            </Select>
          </FormItem>
          </Col> -->
            <Col span="6">
            <FormItem label="审批状态:">
              <Select v-model="filters.auditStatus"
                      @on-change="initPage(true)"
                      placeholder="请选择审批状态">
                <Option value="">全部</Option>
                <Option value="UNAUDITED">待审批</Option>
                <Option value="PASS">已通过</Option>
                <Option value="UNPASS">已拒绝</Option>
                <Option value="APPROVED">已审批</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </div>

      <div class="attendance-list">
        <slot name="table"
              v-bind:showList="showList"></slot>
      </div>

      <Divider />

      <div class="attendance-pager">
        <ButtonGroup>
          <Button @click="changePage(-1)"
                  type="primary"
                  :disabled="!hasPreviousPage"
                  ghost>
            <Icon type="ios-arrow-back" />
            上一页
          </Button>
          <Button @click="changePage(1)"
                  :disabled="!hasNextPage"
                  type="primary"
                  ghost>
            下一页
            <Icon type="ios-arrow-forward" />
          </Button>
        </ButtonGroup>
      </div>
    </Card>

    <Modal v-model="isShowDetail"
           width="900"
           height="800">
      <p slot="header">{{detailTitle}}</p>
      <slot name="audit"
            v-bind="detailInfo"></slot>
    </Modal>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { myApprovalList, approvalManagerList, copyList } from '@/api/approval'
import { APPLICATION_TYPE } from './apply.consts.js'

export default {
  name: 'ApplyList',
  components: {},
  data () {
    return {
      APPLICATION_TYPE: APPLICATION_TYPE,
      // 加载中
      spinShow: false,
      actionType: 'myApprovalList',
      hasNextPage: false,
      hasPreviousPage: false,
      filters: {
        pageNum: 1,
        pageSize: 50, // 定值
        auditStatus: '',
        applicationType: ''
      },
      isShowDetail: false,
      detailTitle: '',
      detailInfo: null,
      showList: []
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'approvalActionType',
      'approvalApplicationType'

    ]),

    applicationStr () {
      return this.APPLICATION_TYPE[this.approvalApplicationType].title
    }

  },
  methods: {
    ...mapActions([
      'changeApprovalActionType'
    ]),
    initPage (zeroPage) {
      this.$Loading.start()

      if (zeroPage) {
        this.filters.pageNum = 1
      }

      this.filters.applicationType = this.approvalApplicationType.toString()

      if (!this.filters.auditStatus) delete this.filters.auditStatus

      let query

      switch (this.actionType) {
        case 'myApprovalList':
          query = myApprovalList
          break
        case 'approvalManagerList':
          query = approvalManagerList
          break
        case 'copyList':
          query = copyList
          break
      }

      this.changeApprovalActionType(this.actionType)

      this.spinShow = true

      query(this.filters).then(res => {
        this.$Loading.finish()
        if (!res || !res.data || !res.data.list) throw new Error('No data From Remote')
        this.hasNextPage = res.data.hasNextPage
        this.hasPreviousPage = res.data.hasPreviousPage

        if (res.data.list.length) {
          this.showList = res.data.list
        } else {
          if (zeroPage) {
            this.showList = []
          }
        }
      }).catch(err => {
        console.error(err)
        this.$Loading.error()
        this.$Message.error('获取记录失败，请稍后再试')
      }).then(() => {
        this.spinShow = false
      })
    },
    changePage (add) {
      this.filters.pageSize += add
      this.initPage(false)
    },
    detail (row) {
      if (!row) {
        console.log.error('No Row Info')
        return
      }
      this.detailInfo = row
      this.detailTitle = `${row.createName} ${row.createTime} 的${this.applicationStr}申请`

      this.isShowDetail = true
    }
  },
  created () {
    this.actionType = this.approvalActionType.toString()
    this.filters.applicationType = this.approvalApplicationType.toString()
    // this.initPage(true)
  }

}
</script>
<style lang="less" scoped>
.attendance-log {
  min-width: 900px;
  .attendance-filter {
    .ivu-form-item {
      margin-bottom: 0;
    }
  }
  .attendance-list {
    min-height: 400px;

    .application-table-btns {
      display: flex;
      justify-content: space-around;
    }
  }
  .attendance-pager {
    text-align: center;
  }
}
</style>
