import { mapGetters } from 'vuex'
import { AUDIT_STATUS } from './apply.consts'

const MS_ONE_DAY = 86400000
const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

const COLUMN_FILTERS = {
  dateType: {
    filters: [
      { label: '三天内', value: 3 },
      { label: '一周内', value: 7 },
      { label: '一个月内', value: 30 }
    ],
    filterMethod (value, row, key) {
      return (
        Math.abs(new Date(row[key]).getTime() - TODAY.getTime()) <=
        value * MS_ONE_DAY
      )
    }
  },
  auditStatus: {
    filters: [
      { label: '已通过', value: 'PASS' },
      { label: '未通过', value: 'UNPASS' },
      { label: '待审批', value: 'UNAUDITED' },
      { label: '已审批', value: 'APPROVED' },
      { label: '已撤销', value: 'WITHDRAW' }
    ],
    filterMethod (value, row) {
      return row.auditStatus === value
    }
  }
}

export default {
  props: {
    showList: {
      type: Object,
      default: () => ({
        showList: []
      })
    }
  },
  data () {
    let self = this

    return {
      AUDIT_STATUS: AUDIT_STATUS,
      // 表格使用的列名
      columns: [],
      // 默认的列
      defaultColumns: [
        { title: '申请人', key: 'createName', width: 100 },
        {
          title: '申请时间',
          key: 'createTime',
          width: 160,
          filters: COLUMN_FILTERS.dateType.filters,
          filterMultiple: false,
          filterMethod (value, row) {
            return COLUMN_FILTERS.dateType.filterMethod(
              value,
              row,
              'createTime'
            )
          }
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: 140,
          filters: COLUMN_FILTERS.dateType.filters,
          filterMultiple: false,
          filterMethod (value, row) {
            return COLUMN_FILTERS.dateType.filterMethod(value, row, 'startTime')
          }
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: 140,
          filters: COLUMN_FILTERS.dateType.filters,
          filterMultiple: false,
          filterMethod (value, row) {
            return COLUMN_FILTERS.dateType.filterMethod(value, row, 'endTime')
          }
        },
        { title: '事由', key: 'cause', width: 300, tooltip: true },
        {
          title: '状态',
          key: 'auditStatus',
          width: 100,
          filters: COLUMN_FILTERS.auditStatus.filters,
          filterMethod: COLUMN_FILTERS.auditStatus.filterMethod,
          render: (h, params) => {
            let st
            // 【已撤销】目前要前端填充
            if (params.row.withdraw === true) {
              st = 'WITHDRAW'
            } else if (this.approvalActionType === 'approvalManagerList') {
              st = params.row.applicationStatus
            } else {
              st = params.row.auditStatus
            }
            // console.log('ST in row :', st)
            return h(
              'Tag',
              {
                props: {
                  type: 'border',
                  color: self.tagColor(st)
                },
                nativeOn: {
                  click: () => {
                    self.showDetail(params.row)
                  }
                }
              },
              self.tagText(st)
            )
          }
        },
        {
          title: '审批人',
          key: 'approvalProcessDTOS',
          width: 160,
          render: (h, params) => {
            return h(
              'span',
              params.row.approvalProcessDTOS
                ? params.row.approvalProcessDTOS
                  .map(p => p.auditUserName)
                  .join('，')
                : ''
            )
          }
        },
        {
          title: '抄送人',
          key: 'copyToId',
          width: 160,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              params.row.copyToId
                ? params.row.copyToId.map(p => p.name).join('，')
                : ''
            )
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getSelectCache', 'approvalActionType'])
  },
  methods: {
    tagProp (key) {
      return status => {
        let obj = this.AUDIT_STATUS[status]
        if (obj) return obj[key]
        return ''
      }
    },
    tagColor (status) {
      return this.tagProp('color')(status)
    },
    tagText (status) {
      return this.tagProp('title')(status)
    },
    showDetail (row) {
      this.$emit('showDetail', row)
    },
    async handleSubmit () {
      let rst = await this.$refs.apply.handleSubmit()
      this.keepModal = false
      if (rst) {
        this.showModal = false
        this.$emit('refresh')
      } else {
        this.showModal = true
      }
      this.$nextTick(() => {
        // 防止连续点击弹窗关闭
        this.keepModal = true
      })
    }
  }
}
