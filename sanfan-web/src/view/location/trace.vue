<template>
  <Card class="trace_card_con">
    <Form inline :label-width="40">
        <FormItem label="员工">
          <selector v-model="employee" @change="initMap()" range="allEmployee" style="width: 200px;"></selector>
        </FormItem>
      <FormItem label="日期">
        <DatePicker v-model="date" @on-change="initMap()"  style="width: 200px;"></DatePicker>
      </FormItem>
      <FormItem label="轨迹">
        <RadioGroup v-model="openGraspRoad" type="button" @on-change="initMap()">
          <Radio label="原始点"></Radio>
          <Radio label="轨迹纠偏"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <el-amap vid="amapTrace" :amap-manager="amapManager" :zoom="zoom" class="amapTrace"></el-amap>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Card>
</template>

<script>
import VueAMap from 'vue-amap'
import { mapGetters } from 'vuex'
import { loadMap, drawPath } from '../../libs/amap'
import selector from '../../components/employees/selector'
import moment from 'moment'
import { trsearch } from '@/api/gaode'
export default {
  name: 'trace',
  components: {
    selector
  },
  data () {
    return {
      show: false,
      zoom: 12,
      amapManager: new VueAMap.AMapManager(),
      path: '',
      records: [],
      amap: {
        instance: null,
        style: {
          width: '100%',
          height: '100px'
        },
        path: null
      },
      spinShow: false,
      nodatawarning: null,
      openGraspRoad: '原始点', // 打开纠偏
      employee: '',
      date: new Date(),
      empolyeeRange: ''
    }
  },
  computed: {
    ...mapGetters([
      'myUserId',
      // 'superAdmin',
      // 'isDepartmentAdmin',
      'getUserInfo'
    ])
  },
  mounted () {
    let self = this
    // if (this.superAdmin._id === this.getUserInfo._id) {
    //   this.empolyeeRange = 'all'
    // } else if (this.isDepartmentAdmin(this.getUserInfo._id)) {
    //   this.empolyeeRange = 'default^SameLevel'
    // } else {
    //   this.empolyeeRange = 'none'
    // }
    this.employee = this.myUserId
    loadMap().then(() => {
      let map = self.amapManager.getMap()
      if (!map) return console.log('map is null')
      self.amap.path = drawPath(map)
      self.initMap()
    })
  },
  methods: {
    initMap () {
      this.records = []
      const filter = {
        employeeIds: [this.employee],
        qCreateTime: moment(this.date).format('YYYY-MM-DD'),
        correction: 'denoise=1,mapmatch=' + (this.openGraspRoad === '轨迹纠偏' ? 1 : 0) + ',attribute=0,threshold=0,mode=driving'
      }
      this.spinShow = true
      trsearch(filter).then(res => {
        this.spinShow = false
        let data = res.data[this.employee]
        if (data.length) {
          this.records = data
          this.showTrace()
        } else {
          this.spinShow = false
          console.log('没有数据')
          this.$Message.error('无纠偏')
          this.showTrace()
        }
      })
    },
    showTrace () {
      if (!this.amap.path) {
        let map = this.amapManager.getMap()
        if (!map) return this.$Message.error('map is null')
        this.amap.path = drawPath(map)
      }
      // clean it up first
      this.amap.path && this.amap.path.setData()
      let self = this

      if (!this.records || this.records.length === 0) {
        this.$Message.error('没有数据')
        return
      }

      if (!this.amap.path) {
        console.error('no valid path on map')
        return
      }
      let diff = 1000 * 60 * 60 * 8
      let data = []
      let pathlist = []
      let datalist = self.records.map(item => {
        if (item.errcode === 10000) {
          return item.data.tracks.map(pt => {
            let t = pt.points.map(po => {
              let p = po.location.split(',')
              let d = {
                x: p[0],
                y: p[1],
                sp: po.speed,
                ag: po.accuracy,
                tm: new Date(po.locatetime + diff)
              }
              data.push(d)
              return d
            })
            if (t.length)pathlist.push(t)
            return t
          })
        }
      })
      data.sort((a, b) => {
        if (a.tm < b.tm) return -1
        if (a.tm > b.tm) return 1
        return 0
      })
      let dataPath = []
      datalist.forEach(dlist => {
        dlist.forEach(data => {
          if (data.length) {
            dataPath.push({
              name: moment(data[0].tm).format('YYYY-MM-DD hh:mm:ss') + '至' + moment(data[data.length - 1].tm).format('YYYY-MM-DD hh:mm:ss'),
              path: data.map(d => [d.x, d.y])
            })
          }
        })
      })
      self.amap.path.setData(dataPath)
      // 原始点轨迹
      // self.amap.path.setData([{
      //   name: moment(data[0].tm).format('YYYY-MM-DD hh:mm:ss') + '至' + moment(data[data.length - 1].tm).format('YYYY-MM-DD hh:mm:ss'),
      //   path: data.map(d => [d.x, d.y])
      // }])
    }
  }
}
</script>
<style>
  .trace_card_con{
    height: 100%;
  }
  .trace_card_con .ivu-card-body{
    height: 100%;
  }
</style>
<style scoped>
  .amapTrace{
    height: calc(100% - 57px);
  }
</style>
