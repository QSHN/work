<template>
  <div>
    <Card class="card_item">
      <span class="card_item_txt">{{employee && who(employee)}}</span>
      <span class="card_item_score">总分：<span class="max">{{scoreSum.totalScore.totalScore}}</span>（初始分{{scoreSum.totalScore.initScore}}）</span>
      <!--<span class="card_item_score">加分：{{addScore}}</span>-->
      <!--<span class="card_item_score">扣分：{{subScore}}</span>-->
      <span v-if="date" class="card_item_date">{{date.getFullYear()}}年{{date.getMonth()+1}}月</span>
      <div class="card_item_info">
        加分：{{scoreSum.totalScore.addScore}}
        <span v-if="scoreSum.addScoreSum.length">
           （ <span v-for="(item,index) in scoreSum.addScoreSum" :key="index">{{item.moduleName}}：{{item.score}}，</span> ）
        </span>
      </div>
      <div class="card_item_info">
        扣分：{{scoreSum.totalScore.subScore}}
        <span v-if="scoreSum.subScoreSum.length">
          （ <span v-for="(item,index) in scoreSum.subScoreSum" :key="index">{{item.moduleName}}：{{item.score}}，</span> ）
        </span>
      </div>
    </Card>
    <Card>
      <Form inline :label-width="40">
        <FormItem label="员工">
          <selector v-model="employee" @change="load" range="allEmployee" style="width: 200px;"></selector>
        </FormItem>
        <FormItem label="日期">
          <DatePicker v-model="date" @on-change="load" type="month" style="width: 200px;"></DatePicker>
        </FormItem>
      </Form>
      <Table style="margin-top: 10px" :columns="columns" :data="records">
        <template slot-scope="{ row }" slot="checkModule">
          <span>{{checkModule[row.checkModule]}}</span>
        </template>
        <template slot-scope="{ row }" slot="checkScoreType">
          <span>{{scoreType[row.checkScoreType]}}</span>
        </template>
        <template slot-scope="{ row }" slot="checkScoreType">
          <span>{{scoreType[row.checkScoreType]}}</span>
        </template>
        <template slot-scope="{ row }" slot="scoreStatus">
          <span style="margin-right: 10px">{{scoreStatus[row.scoreStatus]}}</span>
          <span v-if="isAdmin">
            <Button v-if="row.scoreStatus=='NORMAL'"
                    size="small"
                    type="info"
                    @click="changeStatus(row, 'CANCEL')">撤消</Button>
            <Button v-else
                    size="small"
                    type="warning"
                    @click="changeStatus(row, 'RECOVER')">恢复</Button>
          </span>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
import selector from '../../components/employees/selector'
import { postCheckScoreSum, postCheckScoreSearch, postCheckScoreProcessById } from '../../api/score'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'score',
  components: {
    selector
  },
  data () {
    return {
      employee: '',
      date: '',
      scoreSum: {
        totalScore: {},
        addScoreSum: {},
        subScoreSum: {}
      },
      records: [],
      checkModule: {
        REPORT: '汇报',
        ATTENDANCE: '考勤',
        TASK: '任务',
        DAILY: '日报',
        VISIT: '拜访',
        CUSTOM: '自定义'
      },
      scoreType: {
        ADD_SCORE: '加分',
        SUB_SCORE: '扣分',
        ADD_SALARY: '加工资',
        SUB_SALARY: '减工资',
        TARGET: '目标值',
        PERIOD: '周期',
        TEMPLATE: '模板'
      },
      scoreStatus: {
        NORMAL: '正常',
        CANCELED: '已撤销'
      },
      columns: [{
        title: '类型',
        slot: 'checkModule',
        sortable: true,
        align: 'center'
      },
      {
        title: '类别',
        key: 'itemName',
        sortable: true,
        align: 'center'
      },
      {
        title: '加/减',
        slot: 'checkScoreType',
        sortable: true,
        align: 'center'
      },
      {
        title: '分数',
        key: 'score',
        sortable: true,
        align: 'center'
      },
      {
        title: '状态',
        slot: 'scoreStatus',
        sortable: true,
        align: 'center'
      },
      {
        title: '详情',
        key: 'note',
        sortable: true,
        align: 'center'
      },
      {
        title: '日期',
        key: 'bizDate',
        sortable: true,
        align: 'center'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'myUserId',
      'who',
      'myProfile',
      'superAdmin',
      'isDepartmentAdmin',
      'getUserInfo',
      'typeEmployees'
    ]),
    isAdmin () {
      return this.myProfile.role === 'SUPERADMIN' || this.myProfile.permissions.filter(item => item === 'assessSetting').length
    }
  },
  mounted () {
    this.date = new Date()
    this.employee = this.myUserId
    if (this.employee) this.load()
  },
  methods: {
    loadScoreSum () {
      postCheckScoreSum({
        employeeId: this.employee,
        month: moment(this.date).format('YYYY-MM')
      }).then(res => {
        this.scoreSum = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    load () {
      this.loadScoreSum()
      if (this.date && this.employee) {
        postCheckScoreSearch({
          employeeId: this.employee,
          month: moment(this.date).format('YYYY-MM')
        }).then(res => {
          this.records = res.data.list
        }).catch(() => {
          this.$Message.error('请求失败')
        })
      } else {
        this.$Message.error('请选择员工和日期')
      }
    },
    changeStatus (item, status) {
      if (this.isAdmin) {
        let tip = '你确定要执行此操作吗？'
        if (status === 'CANCEL') tip = '你确定要撤消这条记录吗？'
        if (status === 'RECOVER') tip = '你确定要恢复这条记录吗？'
        this.$Modal.confirm({ title: '操作确认',
          content: tip,
          onOk: () => {
            postCheckScoreProcessById(item.id, {
              process: status
            }).then(res => {
              this.$Message.success('操作成功')
              this.load()
            }).catch(() => {
              this.$Message.error('操作失败')
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .card_item{
    margin-bottom: 10px;
  }
  .card_item_txt{
    font-size: 20px;
  }
  .card_item_date{
    font-size: 16px;
    background-color: #01b38b;
    color: white;
    border-radius: 50px;
    padding: 5px 20px;
    margin-left: 10px;
    float: right;
  }
  .card_item_score{
    margin-left: 10px;
    font-size: 16px;
    margin-top: 10px;
  }
  .card_item_score .max{
      font-size: 20px;
    color: #ff715a;
  }
  .card_item_info{
    color: #a6a6a6;
  }
</style>
