<template>
  <div style="padding-left: 1px;">
    <Row>
      <Alert type="warning" show-icon style="float: left">
        任务要按时完成，状态记得要在任务管理中进行更改
      </Alert>
    </Row>

    <Table border :columns="columns" :data="tableData" :loading="loading"></Table>
  </div>
</template>

<script>
import { searchTask } from '@/api/task'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'task',
  data () {
    return {
      loading: true,
      columns: [
        {
          title: '任务状态',
          render: (h, params) => {
            let status = params.row.taskStatus
            return h('span', status === 'UNPROVED' ? '待进行' : '进行中')
          }
        },
        {
          title: '任务类型',
          key: 'taskTypeName'
        },
        {
          title: '任务级别',
          render: (h, params) => {
            let level = params.row.level
            return h('span', level === 'HIGHEST' ? '非常紧急' : level === 'URGENT' ? '紧急' : '普通')
          }
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('span', moment(params.row.createTime).format('YYYY-MM-DD HH:MM:SS'))
          }
        },
        {
          title: '截止时间',
          render: (h, params) => {
            return h('span', moment(params.row.endTime).format('YYYY-MM-DD HH:MM:SS'))
          }
        },
        {
          title: '任务内容',
          key: 'content'
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
    searchTask({
      executorId: this.myUserId,
      taskStatusList: ['UNPROVED', 'PROCEED']
    }).then((res) => {
      console.log('task', res.data)
      if (res.data) {
        this.tableData = res.data
        this.$emit('updateCount', 3, res.data.length)
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
