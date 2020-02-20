<template>
  <div>
    <Row type="flex" justify="space-between" style="margin-bottom: 15px">
      <div>
        <Button type="success" style="margin-right: 10px;" @click="$emit('show', 'CLIENT')">创建拜访任务(客户)</Button>
        <Button type="success" @click="$emit('show', 'MERCHANT')">创建拜访任务(商家)</Button>
      </div>
      <Col span="4">
        <Input search enter-button placeholder="拜访客户/客户联系人" v-model="search" />
      </Col>
    </Row>
    <Table border :columns="columns" :data="search ? searchList : tableData" :loading="loading"></Table>
    <modal-del ref="modalDel" :way="'取消'" :content="'确定真的要取消这次拜访任务吗？'" :del="delVisit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getVisit, deleteVisit } from '@/api/client'
import moment from 'moment'
import modalDel from '_c/modal-del/modal-del.vue'
export default {
  name: 'visit-table',
  components: {
    modalDel
  },
  props: {
    tab: {
      type: String,
      required: true
    },
    clientVisitingType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      columns: [
        {
          title: '拜访客户',
          key: 'clientName',
          sortable: true
        },
        {
          title: '拜访人',
          sortable: true,
          render: (h, params) => {
            let name = params.row.visitorList.length && params.row.visitorList[0].name
            return h('span', name)
          }
        },
        {
          title: '创建人',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.assignerName)
          }
        },
        {
          title: '客户类型',
          key: 'typeName',
          sortable: true
        },
        {
          title: '客户联系人',
          key: 'clientLinkmanName'
        },
        {
          title: '拜访时间',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.visitTime)
          }
        },
        {
          title: '截止时间',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.deadline)
          }
        },
        {
          title: '拜访结果',
          sortable: true,
          render: (h, params) => {
            let status = ''
            if (params.row.clientVisitingStatus === 'CANCELED') {
              status = '已取消'
            } else if (params.row.clientVisitingStatus === 'CREATED') {
              status = moment().isAfter(params.row.deadline) ? '已失访' : '已创建'
            } else if (params.row.clientVisitingStatus === 'VISITED') {
              status = '已完成'
            }
            return h('span', {
              style: {
                color: status !== '已完成' ? status === '已创建' ? '#515a6e' : 'red' : 'green'
              }
            }, status)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: '140',
          align: 'center',
          render: (h, params) => {
            let status = ''
            if (params.row.clientVisitingStatus === 'CANCELED') {
              status = '已取消'
            } else if (params.row.clientVisitingStatus === 'CREATED') {
              status = moment().isAfter(params.row.deadline) ? '已失访' : '已创建'
            } else if (params.row.clientVisitingStatus === 'VISITED') {
              status = '已完成'
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {},
                on: {
                  click: () => {
                    this.$emit('look', Object.assign({}, params.row))
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: (this.getUserInfo.role !== 'SUPERADMIN' || params.row.assignerId !== this.getUserInfo.id) && status === '已创建'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$refs.modalDel.open(params.row.id)
                  }
                }
              }, '取消')
            ])
          }
        }
      ],
      tableData: [],
      search: '',
      searchList: []
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  watch: {
    search () {
      if (this.search) {
        this.searchList = this.tableData.filter(v => v.clientName.includes(this.search) || v.clientLinkmanName.includes(this.search))
      } else {
        this.searchList = []
      }
    }
  },
  methods: {
    load () {
      let ajaxData = {
        [this.tab === 'executor' ? 'visitorId' : 'assignerId']: this.getUserInfo.id,
        clientVisitingType: this.clientVisitingType
      }
      console.log(ajaxData)
      this.tableData = []
      getVisit(ajaxData).then(res => {
        console.log('getVisit', res.data)
        this.tableData = res.data
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
    },
    delVisit (id) {
      deleteVisit(id).then(res => {
        this.$refs.modalDel.success('已取消这次拜访任务')
        this.load()
      }).catch(err => {
        if (err.errorMsg) this.$refs.modalDel.error(err.errorMsg)
      })
    }
  },
  created () {
    this.load()
  }
}
</script>

<style scoped>

</style>
