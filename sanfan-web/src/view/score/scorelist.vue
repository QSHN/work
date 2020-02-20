<template>
  <div>
    <Button @click="showAddRule()" style="margin: 5px">添加考核内容</Button>
    <div>
      <div class="card_item" v-for="(item,index) in list" :key="index" @click="showDetails(item)">
        <Card>
          <p slot="title">
            <span>{{item.name}}</span>
            <span class="card_item_run" :class="{card_item_isrun:((item.checkRuleStatus=='EXECUTING')||(item.checkRuleStatus=='EXECUTED'))}">（{{(item.checkRuleStatus=='EXECUTED')?'执行完成':((item.checkRuleStatus=='EXECUTING')?'正在执行':'未执行')}}）</span>
          </p>
          <span @click.stop="deleteRule(item)" slot="extra" style="color: #ff4d31;font-size: 10px;cursor: pointer">删除</span>
          <div>
            <Row>
              <Col span="6">
                考核时间：
              </Col>
              <Col span="18">
                {{new Date(item.startDate).toHawkDateString()}} 至 {{new Date(item.endDate).toHawkDateString()}}
              </Col>
            </Row>
            <Row>
              <Col span="6">
                <p>考核规则：</p>
              </Col>
              <Col span="18">
                <p class="rule_con" v-for="(rule,index) in item.ruleItemDTOList" :key="index">
                  <span style="font-weight: bold">{{rule.itemName}}</span>
                  <span v-if="rule.unitValue&&rule.unit">{{rule.unit}}：{{rule.unitValue}}</span>
                  <span v-if="rule.valueType&&rule.value">{{(rule.valueType=='add')?'加分':'扣分'}}：{{rule.value}}</span></p>
              </Col>
            </Row>
          </div>
        </Card>
      </div>

    </div>
    <Modal
      v-model="details.show"
      title="考核详情"
      :loading="details.loading"
    @on-ok="saveRule">
      <Form v-if="details.formItem" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="details.formItem.name" style="width: 200px;"></Input>
        </FormItem>
        <FormItem v-if="ruleModule=='CUSTOM'" label="时间：">
          <DatePicker v-model="details.formItem.date" type="date" placeholder="选择执行时间" ></DatePicker>
        </FormItem>
        <FormItem v-else label="时间：">
          <DatePicker v-model="details.formItem.daterange" type="daterange" :options="options" placeholder="选择时间范围" ></DatePicker>
        </FormItem>
        <FormItem label="执行：">
          <i-switch v-if="!details.formItem.finish" v-model="details.formItem.run" size="large">
            <span slot="open">运行</span>
            <span slot="close">关闭</span>
          </i-switch>
          <span v-else style="color: lightseagreen;font-weight: bold">已执行</span>
        </FormItem>
        <FormItem label="员工：">
          <selector v-if="details.show" multiple v-model="details.formItem.users" range="allEmployee"></selector>
        </FormItem>
        <div>
          <FormItem label="考核规则：">
            <Select style="width: 250px;margin-right: 10px" v-model="details.newRule">
              <Option v-for="(item,index) in ruleTypes" :key="index" :value="item.itemId">{{item.itemName}}</Option>
            </Select>
            <Button @click="addRuleItem()">添加规则</Button>
            <Card v-for="(rule,index) in details.formItem.ruleItemDTOList" :key="index" style="width: 340px; margin-top: 10px">
              <p slot="title" style="width: 100px"><span>{{rule.itemName}}</span></p>
              <span v-if="!details.formItem.finish" @click.prevent="deleteRuleItem(rule)" slot="extra" style="color: #ff4d31;font-size: 10px;cursor: pointer">删除</span>
              <Row v-if="rule.itemNum">
                <Col span="12" style="line-height: 32px">考核项目标值</Col>
                <Col span="12"><InputNumber :min="0"  v-model="rule.itemNum" style="width: 100px;float: right"></InputNumber ></Col>
              </Row>
              <div v-for="(sub,index) in rule.itemSubList" :key="index">
                <Row v-if="sub.scoreType=='PERIOD'" style="margin-bottom: 10px;">
                  <Col span="12" style="line-height: 32px">{{sub.name}}</Col>
                  <Col span="12">
                    <Select style="margin-right: 10px;text-align: right" v-model="sub.period">
                      <Option value="DAY">每天</Option>
                      <Option value="WEEK">每周</Option>
                      <Option value="MONTH">每月</Option>
                    </Select>
                  </Col>
                </Row>
                <Row style="margin-bottom: 10px;" v-if="sub.scoreType=='ADD_SCORE'||sub.scoreType=='SUB_SCORE'||sub.scoreType=='ADD_SALARY'||sub.scoreType=='SUB_SALARY'||sub.scoreType=='TARGET'">
                  <Col span="12" style="line-height: 32px">{{sub.name}}</Col>
                  <Col span="12"><InputNumber :readonly="details.formItem.finish" :min="0" v-model="sub.score" style="width: 100px;float: right"></InputNumber ></Col>
                </Row>
                <Row style="margin-bottom: 10px;" v-if="sub.scoreType=='TEMPLATE'">
                  <Col span="24" style="line-height: 32px">{{sub.name}}</Col>
                </Row>
              </div>
            </Card>
          </FormItem>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepCopy } from '../../libs/util'
import selector from '../../components/employees/selector'
import moment from 'moment'
import { getCheckItemModule, postCheckRuleSearch, postCheckRule, deleteCheckRuleById } from '@/api/score'

export default {
  name: 'scorelist',
  props: {
    ruleModule: String
  },
  components: {
    selector
  },
  data () {
    return {
      ruleTypes: [],
      list: [],
      options: {
        shortcuts: [
          {
            text: '1 周',
            value () {
              const start = new Date()
              const end = moment().add(7, 'day').toDate()
              return [start, end]
            }
          },
          {
            text: '1 月',
            value () {
              const start = new Date()
              const end = moment().add(1, 'months').toDate()
              return [start, end]
            }
          },
          {
            text: '3 月',
            value () {
              const start = new Date()
              const end = moment().add(3, 'months').toDate()
              return [start, end]
            }
          },
          {
            text: '6 月',
            value () {
              const start = new Date()
              const end = moment().add(6, 'months').toDate()
              return [start, end]
            }
          },
          {
            text: '1 年',
            value () {
              const start = new Date()
              const end = moment().add(1, 'years').toDate()
              return [start, end]
            }
          },
          {
            text: '3 年',
            value () {
              const start = new Date()
              const end = moment().add(3, 'years').toDate()
              return [start, end]
            }
          }
        ]
      },
      details: {
        show: false,
        formItem: {
          name: '',
          date: '',
          daterange: [],
          users: [],
          run: true,
          finish: false,
          ruleItemDTOList: []
        },
        data: {},
        model: 'edit',
        newRule: '',
        loading: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'myCompany'
    ])
  },
  mounted () {
    getCheckItemModule(this.ruleModule).then(res => {
      this.ruleTypes = res.data
    })
    postCheckRuleSearch({
      checkModules: [this.ruleModule]
    }).then(res => {
      this.list = res.data.list
    })
  },
  methods: {
    load () {
      postCheckRuleSearch({ checkModules: [this.ruleModule] }).then(res => {
        this.list = res.data.list
      })
    },
    showDetails (item) {
      this.details.show = true
      this.details.data = deepCopy(item)
      this.details.formItem.name = this.details.data.name
      this.details.formItem.finish = this.details.data.checkRuleStatus === 'EXECUTED'
      this.details.formItem.run = this.details.data.checkRuleStatus === 'EXECUTING'
      this.details.formItem.users = this.details.data.rulePersonDTOList.map(user => user.employeeId)
      this.details.formItem.ruleItemDTOList = this.details.data.ruleItemDTOList

      if (this.ruleModule === 'CUSTOM') {
        this.details.formItem.date = new Date(this.details.data.endDate)
      } else {
        this.details.formItem.daterange = [new Date(this.details.data.startDate), new Date(this.details.data.endDate)]
      }
    },
    showAddRule () {
      this.details.show = true
      this.details.formItem = {
        name: '',
        date: '',
        daterange: [],
        users: [],
        run: true,
        finish: false,
        ruleItemDTOList: []
      }
      if (this.ruleModule === 'CUSTOM') {
        this.details.formItem.date = new Date()
      } else {
        let end = new Date()
        end.setFullYear(end.getFullYear() + 1)
        this.details.formItem.daterange = [new Date(), end]
      }
    },
    saveRule () {
      let formItem = this.details.formItem
      let err = ''
      if (!formItem.name) {
        err = '名称不能为空'
      } else if (!(formItem.date || formItem.daterange.length)) {
        err = '时间不能为空'
      } else if (!formItem.users.length) {
        err = '员工不能为空'
      } else if (!formItem.ruleItemDTOList.length) {
        err = '考核规则不能为空'
      }
      if (err) {
        this.$Message.error(err)
        this.details.loading = false
        this.$nextTick(() => {
          this.details.loading = true
        })
      } else {
        let data = this.details.data
        data.checkModule = this.ruleModule
        data.name = this.details.formItem.name
        data.checkRuleStatus = formItem.finish ? 'EXECUTED' : (formItem.run ? 'EXECUTING' : 'UNEXECUTED')
        if (this.ruleModule === 'CUSTOM') {
          data.startDate = formItem.date
          data.endDate = formItem.date
        } else {
          data.startDate = formItem.daterange[0]
          data.endDate = formItem.daterange[1]
        }
        data.rulePersonDTOList = formItem.users.map(id => {
          return { employeeId: id }
        })
        data.ruleItemDTOList = formItem.ruleItemDTOList
        postCheckRule(data).then(res => {
          this.$Message.success('保存成功')
          this.load()
          this.details.show = false
        })
      }
    },
    deleteRule (item) {
      if (item.id) {
        deleteCheckRuleById(item.id).then(() => {
          this.$Message.success('删除成功')
          this.load()
        }).catch(() => {
          this.$Message.error('删除成功')
        })
      }
    },
    addRuleItem () {
      let rule = this.ruleTypes.find(r => r.itemId === this.details.newRule)
      let isHave = this.details.formItem.ruleItemDTOList.find(r => r.itemId === this.details.newRule)
      if (isHave && !isHave.isAllowRepeat) {
        this.$Notice.error({
          title: '错误提示',
          desc: '该规则不允许重复'
        })
        return
      }
      if (this.details.formItem.ruleItemDTOList && rule) {
        let r = deepCopy(rule)
        this.details.formItem.ruleItemDTOList.push(r)
      }
    },
    deleteRuleItem (item) {
      if (this.details.formItem.ruleItemDTOList && item) {
        let index = this.details.formItem.ruleItemDTOList.indexOf(item)
        this.details.formItem.ruleItemDTOList.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
  .rule_con{
  }
  .rule_con>span{
    margin-right: 10px;
  }
  .card_item{
    width: 360px;
    float: left;
    margin: 5px;
  }
  .card_item_run{
    display: inline-block;
    color: #cdcdcd;
  }
  .card_item_isrun{
    color: lightseagreen;
  }
</style>
