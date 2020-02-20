<template>
  <Card style="width: 100%; height: 100%; overflow: auto">
    <Row style="margin-bottom: 50px">
      <Select v-model="dSelect" style="width: 200px;">
        <Option v-for="item in dSelectList"
                :value="item.id"
                :key="item.name">{{item.name}}
        </Option>
      </Select>
    </Row>

    <Row type="flex">
      <Col span="9">
        <div style="border-right: 1px solid #eee;">
          <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="150">
            <FormItem label="报表名称：" prop="name">
              <Input v-model="formData.name" :maxlength="10" style="width: 300px" placeholder="请填写报表名称"></Input>
            </FormItem>

            <FormItem label="制定数据项目：" prop="items">
              <span>
                {{
                  formData.items.length ?
                    formData.items.reduce((total, v, i) => total += v.name + `${i !== formData.items.length - 1 ? '，' : ''}`, '') :
                    '请选择'
                }}
              </span>

              <Button type="primary" size="small" style="margin: -4px 0 0 20px" @click="formulate">制定</Button>
            </FormItem>

            <FormItem label="提交周期：" prop="period">
              <RadioGroup v-model="formData.period" type="button">
                <Radio label="DAY">天</Radio>
                <Radio label="WEEK">周</Radio>
                <Radio label="MONTH">月</Radio>
              </RadioGroup>
            </FormItem>

            <div v-show="formData.period === 'DAY'">
              <FormItem label="提交日期：" prop="days">
                <Select v-model="formData.days" @on-change="selectDays" multiple style="width: 300px">
                  <Option v-for="(item, index) in daysOfWeek.values"
                          :value="item"
                          :key="item">{{daysOfWeek.displays[index.toString()]}}</Option>
                </Select>
              </FormItem>

              <FormItem label="提交开始时间：" prop="startTime">
                <Select v-model="formData.startTime"  style="width: 300px">
                  <Option v-for="(item, index) in times.values"
                          :value="item"
                          :key="item">{{times.displays[index.toString()]}}</Option>
                </Select>
              </FormItem>

              <FormItem label="提交截止时间：" prop="endTime">
                <Select v-model="formData.endTime" style="width: 300px">
                  <Option v-for="(item, index) in times.values"
                          :value="item"
                          :key="item">{{times.displays[index.toString()]}}</Option>
                </Select>
              </FormItem>
            </div>

            <div v-show="formData.period === 'WEEK' || formData.period === 'MONTH'">
              <FormItem label="提交开始时间：" prop="startDate">
                <Select v-model="formData.startDate" placeholder="请选择日期" style="width: 140px">
                  <Option v-for="(item, index) in daysOfWeek.values"
                          :value="item"
                          :key="item">{{daysOfWeek.displays[index.toString()]}}</Option>
                </Select>
                <Select v-model="formData.startTime" placeholder="请选择时间" style="width: 140px; margin-left: 20px;">
                  <Option v-for="(item, index) in times.values"
                          :value="item"
                          :key="item">{{times.displays[index.toString()]}}</Option>
                </Select>
              </FormItem>

              <FormItem label="提交截止时间：" prop="endDate">
                <Select v-model="formData.endDate" placeholder="请选择日期" style="width: 140px">
                  <Option v-for="(item, index) in daysOfWeek.values"
                          :value="item"
                          :key="item">{{daysOfWeek.displays[index.toString()]}}</Option>
                </Select>
                <Select v-model="formData.endTime" placeholder="请选择时间" style="width: 140px; margin-left: 20px;">
                  <Option v-for="(item, index) in times.values"
                          :value="item"
                          :key="item">{{times.displays[index.toString()]}}</Option>
                </Select>
              </FormItem>
            </div>

            <FormItem label="提醒员工提交：" prop="remindNotification">
              <i-switch v-model="formData.remindNotification" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
              </i-switch>
            </FormItem>

            <div v-if="formData.remindNotification">
              <FormItem label="提醒时间：" prop="remindTime">
                <Select v-model="formData.remindTime" style="width: 300px">
                  <Option v-for="(item, index) in remindTime.values"
                          :value="item"
                          :key="item">{{remindTime.displays[index]}}</Option>
                </Select>
              </FormItem>

              <FormItem label="提醒内容：">
                <Input v-model="formData.remindContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 300px" placeholder="请填写提醒内容">
                </Input>
              </FormItem>
            </div>

            <FormItem>
              <Button type="success" @click="save">保存</Button>
            </FormItem>
          </Form>
        </div>
      </Col>
      <Col span="2"></Col>
      <Col span="12" v-if="isFormulate">
        <div style="width: 600px">
          <Table border :columns="columns" :data="tableData" style="width: 600px; margin-bottom: 15px;"></Table>
          <Button type="info" style="margin-right: 15px;" @click="$refs.tempModal.show(false, (data) => { tableData.push(data) })">添加</Button>
          <Button type="success" @click="changeItems">确定</Button>
        </div>
      </Col>
    </Row>

    <temp-modal ref="tempModal" />
    <score-modal ref="scoreModal"/>
  </Card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  selectData,
  daysOfWeek,
  daysOfMonth,
  times,
  remindTime
} from '@/libs/select.js'
import { getReportTemp, setReportTemp } from '@/api/report'
import { getOrganizationTree } from '@/api/company'
import tempModal from './components/temp-modal'
import scoreModal from './components/score-modal'
export default {
  name: 'report-temp',
  components: {
    tempModal,
    scoreModal
  },
  data () {
    return {
      daysOfWeek,
      daysOfMonth,
      times,
      remindTime,
      dSelect: '',
      dSelectList: [],
      sTemp: '',
      isFormulate: false,
      formData: {
        name: '',
        items: [],
        period: 'DAY',
        days: [],
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        remindNotification: true,
        remindTime: 60,
        remindContent: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写报表名称', trigger: 'blur' }
        ],
        items: [
          {
            required: true,
            trigger: 'change',
            type: Array,
            validator: (rule, value, callback) => {
              if (this.formData.items.length) {
                callback()
              } else {
                callback(new Error(`请制定数据项目`))
              }
            }
          }
        ],
        days: [
          {
            required: true,
            trigger: 'change',
            type: Array,
            validator: (rule, value, callback) => {
              // console.log(this.formData.days)
              if (this.formData.period === 'DAY' && this.formData.days.length === 0) {
                callback(new Error(`请选择提交日期`))
              } else {
                callback()
              }
            }
          }
        ],
        startTime: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === undefined) this.formData.startTime = ''
              let startTime = this.formData.startTime.toString()
              let endTime = this.formData.endTime.toString()
              if (this.formData.period === 'DAY' && !startTime.length) {
                callback(new Error(`请选择提交开始时间`))
              } else {
                console.log('startTime', startTime, endTime)
                if (this.formData.period === 'DAY' &&
                  startTime.length &&
                  endTime.length &&
                  parseInt(startTime) >= parseInt(endTime)
                ) {
                  callback(new Error(`开始时间不能大于等于截止时间`))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        endTime: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === undefined) this.formData.endTime = ''
              let startTime = this.formData.startTime.toString()
              let endTime = this.formData.endTime.toString()
              if (this.formData.period === 'DAY' && !endTime.length) {
                callback(new Error(`请选择提交截止时间`))
              } else {
                console.log('endTime', startTime, endTime)
                if (this.formData.period === 'DAY' &&
                  startTime.length &&
                  endTime.length &&
                  parseInt(startTime) >= parseInt(endTime)
                ) {
                  callback(new Error(`截止时间不能小于等于开始时间`))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        startDate: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              let ws = this.formData.startDate.toString()
              let we = this.formData.endDate.toString()
              let ts = this.formData.startTime.toString()
              let te = this.formData.endTime.toString()
              if (this.formData.period !== 'DAY' && (!ws.length || !ts.length)) {
                callback(new Error(`请选择提交开始时间`))
              } else {
                if (this.formData.period !== 'DAY' && we.length && te.length &&
                  (
                    parseInt(ws) > parseInt(we) ||
                    (
                      parseInt(ws) === parseInt(we) &&
                      parseInt(ts) >= parseInt(te)
                    )
                  )
                ) {
                  callback(new Error(`截止时间不能小于等于开始时间`))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        endDate: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              let ws = this.formData.startDate.toString()
              let we = this.formData.endDate.toString()
              let ts = this.formData.startTime.toString()
              let te = this.formData.endTime.toString()
              if (this.formData.period !== 'DAY' && (!we.length || !te.length)) {
                callback(new Error(`请选择提交截止时间`))
              } else {
                if (this.formData.period !== 'DAY' && we.length && te.length &&
                  (
                    parseInt(ws) > parseInt(we) ||
                    (
                      parseInt(ws) === parseInt(we) &&
                      parseInt(ts) >= parseInt(te)
                    )
                  )
                ) {
                  callback(new Error(`截止时间不能小于等于开始时间`))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        remindNotification: [{ required: true }],
        remindTime: [{ required: true }]
      },
      columns: [
        {
          title: '数据项目名',
          key: 'name'
        },
        {
          title: '达标值',
          render: (h, params) => {
            return h('span', `${params.row.target} ${params.row.unit}`)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '180px',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {},
                on: {
                  click: () => {
                    this.$refs.tempModal.show(params.row, (data) => {
                      this.tableData.splice(params.index, 1, data)
                    })
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$refs.scoreModal.show(params.row.ratingSettings, params.row.target, (score) => {
                      let data = params.row
                      data.ratingSettings = score
                      this.tableData.splice(params.index, 1, data)
                      console.log('tableData', this.tableData)
                    })
                  }
                }
              }, '设置'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.tableData.splice(params.index, 1)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: [
        {
          name: '今日营业额',
          unit: '元',
          target: '100',
          ratingSettings: []
        },
        {
          name: '今日客户数',
          unit: '个',
          target: '10',
          ratingSettings: []
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  watch: {
    dSelect () {
      this.getData()
      this.isFormulate = false
    }
  },
  methods: {
    ...mapActions([]),
    selectData,
    getData () {
      this.$refs.formValidate.resetFields()
      getReportTemp(this.dSelect).then((res) => {
        console.log('getReportTemp', res.data)
        let temp = res.data
        if (temp) {
          this.formData = {
            id: temp.id,
            name: temp.name || '',
            items: temp.items || [],
            period: temp.period || 'DAY',
            days: temp.days !== null ? temp.days.map(String) : [],
            startTime: temp.startTime !== null && temp.startTime.toString(),
            endTime: temp.endTime !== null ? temp.endTime.toString() : '',
            startDate: temp.startDate !== null ? temp.startDate.toString() : '',
            endDate: temp.endDate !== null ? temp.endDate.toString() : '',
            remindNotification: temp.remindNotification,
            remindTime: temp.remindTime || 60,
            remindContent: temp.remindContent || '',
            departmentId: this.dSelect
          }
        } else {
          this.formData = {
            name: '',
            items: [],
            period: 'DAY',
            days: [],
            startTime: '',
            endTime: '',
            startDate: '',
            endDate: '',
            remindNotification: true,
            remindTime: 60,
            remindContent: '',
            departmentId: this.dSelect
          }
        }
        // console.log(this.formData)
        this.$refs.formValidate.resetFields()
      }).catch((err) => {
        if (err.message) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.message
          })
        }
      })
    },
    selectDays (val) {
      this.formData.days = val.sort()
    },
    formulate () {
      if (this.formData.items) {
        this.tableData = Object.assign([], this.formData.items)
        this.isFormulate = true
        this.sTemp = ''
        this.$forceUpdate()
      }
    },
    changeItems () {
      this.formData.items = this.tableData
      this.$forceUpdate()
    },
    save () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let ajaxData = Object.assign({}, this.formData)
          console.log('save', ajaxData)
          setReportTemp(ajaxData).then(res => {
            this.$Notice.success({
              title: '保存模板',
              desc: '保存成功'
            })
          }).catch(err => {
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
            }
          })
        }
      })
    }
  },
  created () {
    let departmentId = this.getUserInfo.role === 'SUPERADMIN' ? '' : this.getUserInfo.departmentId
    this.dSelectList = []
    this.dSelect = ''
    getOrganizationTree(departmentId).then(res => {
      if (departmentId) {
        // 部门管理员
        this.dSelect = res.data.id
        this.dSelectList = this.selectData({
          list: Object.assign([], res.data.children),
          id: 'id',
          name: 'name',
          children: 'children'
        })
        this.dSelectList.unshift({ id: this.dSelect, name: res.data.name })
      } else {
        // 超级管理员
        if (res.data.children && res.data.children.length) {
          this.dSelect = res.data.children[0].id
          this.dSelectList = this.selectData({
            list: Object.assign([], res.data.children),
            id: 'id',
            name: 'name',
            children: 'children'
          })
        }
      }
      console.log('department', this.dSelectList)
    }).catch(err => {
      if (err.errorMsg) {
        this.$Notice.error({
          title: '错误提示',
          desc: err.errorMsg
        })
      }
    })
  }
}
</script>

<style scoped>

</style>
