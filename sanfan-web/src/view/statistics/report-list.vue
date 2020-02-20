<template>
  <Card style="width: 100%; height: 100%; overflow: auto">
    <Row style="margin-bottom: 15px">
      <div style="width:260px; display: inline-block">
        <employee-selector :multiple="false"
                           :range="'directlyEmployee'"
                           v-model="eSelect" />
      </div>
    </Row>

    <Table border :columns="columns" :data="tableData" :loading="loading"></Table>

    <Row type="flex" justify="end" style="margin-top: 15px">
      <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="(page) => pageNum = page" />
    </Row>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportDataById, auditReport } from '@/api/report'
import EmployeeSelector from '_c/employees/selector.vue'
import moment from 'moment'
export default {
  name: 'report-list',
  components: {
    EmployeeSelector
  },
  data () {
    return {
      eSelect: '',
      loading: true,
      columns: [
        {
          title: '汇报人',
          key: 'employeeName',
          sortable: true,
          align: 'center'
        },
        {
          title: '汇报数据',
          align: 'center',
          render: (h, params) => {
            let val = ''
            params.row.items.forEach(v => {
              val += `
                <div>
                  <span style="width: 50%; text-align: right; display: block; float: left;">${v.name}： </span>
                  <span style="width: 50%; text-align: left; display: block; float: left;">
                    <span style="width: 15%; padding: 0 0 0 10px; color: red;">${v.value}</span>
                    <span>${v.unit}</span>
                  </span>
                </div>
              `
            })
            return h('span', {
              domProps: {
                innerHTML: val
              }
            })
          }
        },
        {
          title: '创建时间',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h('span', moment(params.row.createTime).format('YYYY-MM-DD'))
          }
        },
        {
          title: '状态',
          align: 'center',
          render: (h, params) => {
            let status = params.row.status
            let isMe = params.row.employeeId === this.getUserInfo.id
            let val = ''
            switch (status) {
              case 'CONFIRM': val = '已完成'
                break
              case 'REJECT': val = '已驳回'
                break
              case 'WITHDRAW': val = '已撤回'
                break
              case 'UNREAD':
              case 'READ': val = `已提交，等待${isMe ? '上级' : '您'}的审批`
                break
              default: val = '未提交'
                break
            }
            return h('span', val)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '140',
          align: 'center',
          render: (h, params) => {
            let status = params.row.status
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  disabled: params.row.employeeId === this.getUserInfo.id || (params.row.employeeId !== this.getUserInfo.id && (status !== 'UNREAD' && status !== 'READ'))
                },
                on: {
                  click: () => {
                    this.$Modal.success({
                      title: '汇报审批',
                      content: '是否确认该汇报',
                      onOk: () => {
                        this.auditFun(params.row.id, 'CONFIRM')
                      }
                    })
                  }
                }
              }, '通过'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: params.row.employeeId === this.getUserInfo.id || (params.row.employeeId !== this.getUserInfo.id && (status !== 'UNREAD' && status !== 'READ'))
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    let self = this
                    let remark = ''
                    this.$Modal.confirm({
                      render (h) {
                        return h('Input', {
                          props: {
                            // value: this.value,
                            autofocus: true,
                            placeholder: `请填写驳回原因`
                          },
                          on: {
                            input: (val) => {
                              remark = val
                            }
                          }
                        })
                      },
                      onOk () {
                        self.auditFun(params.row.id, 'REJECT', remark)
                      }
                    })
                  }
                }
              }, '驳回')
            ])
          }
        }
      ],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  watch: {
    vSelect () {
      this.getData()
    },
    eSelect () {
      this.getData()
    },
    pageNum () {
      this.getData()
    }
  },
  methods: {
    auditFun (id, status, remark) {
      let sendData = {
        id,
        status,
        remark
      }
      auditReport(sendData).then((res) => {
        this.getData()
      }).catch((err) => {
        if (err.message) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.message
          })
        }
      })
    },
    getData () {
      let ajaxData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.eSelect) {
        ajaxData.employeeId = this.eSelect
      }
      // console.log('getData', ajaxData)
      getReportDataById(ajaxData).then((res) => {
        console.log('getData', res.data)
        if (!res.data) return
        this.tableData = res.data.list
        this.total = res.data.total
        this.loading = false
      }).catch((err) => {
        if (err.message) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.message
          })
          this.loading = false
        }
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
