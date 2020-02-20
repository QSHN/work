<template>
  <div class="page_checkin">
    <Row>
      <Alert type="warning" show-icon style="float: left">工作日记得在固定时间点打卡喔</Alert>
    </Row>

    <Table border :columns="columns" :data="tableData" :loading="loading"></Table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getRecord } from '@/api/attendance'
export default {
  name: 'checkin',
  data () {
    return {
      loading: true,
      tc: null,
      columns: [
        {
          title: '打卡类型',
          key: 'type'
        },
        {
          title: '规定打卡时间',
          key: 'timeDate'
        },
        {
          title: '实际打卡时间',
          key: 'checkInDate'
        },
        {
          title: '打卡地点',
          key: 'address'
        },
        {
          title: '打卡结果',
          key: 'status'
        }
      ],
      records: [],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  methods: {
    ...mapActions([])
  },
  created () {
    getRecord({
      employeeId: this.getUserInfo.id
    }).then((res) => {
      console.log(res.data)
      if (res.data && res.data.length) {
        res.data.forEach(v => {
          if (v.checkInDate) this.records.push(v)
        })
        this.tableData = res.data
        this.$emit('updateCount', 0, this.records.length)
      }
      this.loading = false
    }).catch((err) => {
      if (err.errorMsg) {
        this.$Notice.error({
          title: '错误提示',
          desc: err.errorMsg
        })
        this.loading = false
      }
    })
  }
}
</script>

<style scoped>

</style>
