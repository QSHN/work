<template>
  <div style="padding-left: 1px;">
    <Row>
      <Alert type="warning" show-icon style="float: left">
        拜访完成后记得填写拜访总结，不然拜访算是没完成
      </Alert>
    </Row>
    <div style="height: calc(100vh - 390px); overflow: auto;">
      <Table border :columns="columns" :data="tableData" :loading="loading"></Table>
    </div>
  </div>
</template>

<script>
import { getVisit } from '@/api/client'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'visit',
  data () {
    return {
      loading: true,
      columns: [
        {
          title: '拜访客户',
          key: 'clientName'
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
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'myUserId'
    ])
  },
  methods: {
  },
  created () {
    let ajaxData = {
      visitorId: this.myUserId,
      visitingTime: new Date()
    }
    console.log(ajaxData)
    this.tableData = []
    getVisit(ajaxData).then(res => {
      console.log('getVisit', res.data)
      if (res.data) {
        this.tableData = res.data
        this.$emit('updateCount', 4, res.data.length)
      }
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
}
</script>

<style scoped>

</style>
