<template>
  <Card style="height: 100%" ref="card" class="position_card_con">
    <div class="win_con">
      <div class="left">
        <Table ref="list" :columns="columns" :data="list" width="350" @on-row-click="onRowClick" @on-selection-change="onSelectionChange" @on-select="onSelect">
          <template slot-scope="{ row }" slot="address">
            <div>{{row.address}}</div>
            <div v-if="row.time&&row.time.toHawkString">{{row.time.toHawkString()}} <span style="color: red">(<Time :time="row.time"></Time>)</span></div>
          </template>
        </Table>
      </div>
      <div class="right">
        <el-amap vid="amapPosition" style="height: 100%" :center="center" :zoom="18">
          <el-amap-marker v-for="(marker, index) in pList" :key="'marker_'+index" v-if="marker.position" animation="AMAP_ANIMATION_DROP" :title="marker.name" :position="marker.position" :vid="'marker_'+index"></el-amap-marker>
          <el-amap-text v-for="(marker, index) in pList" :key="'info_'+index" v-if="marker.position" :offset="[0,-50]" :position="marker.position" :text="marker.name"></el-amap-text>
        </el-amap>
      </div>
    </div>
  </Card>
</template>

<script>
// import { getTraceCurrent } from '../../api/trace'
import { mapGetters, mapActions } from 'vuex'
import { lastpoint } from '../../api/gaode'
import { getAddress } from '@/libs/amap'
export default {
  name: 'position',
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 32,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          width: 80,
          align: 'center',
          sortable: true
        },
        {
          title: '位置',
          slot: 'address',
          sortable: 'true'
        }
      ],
      center: [116.2329, 39.2637],
      list: [],
      pList: [],
      data: []
    }
  },
  computed: {
    ...mapGetters([
      'myUserId',
      // 'typeEmployees',
      // 'superAdmin',
      // 'isDepartmentAdmin',
      'who',
      'getUserInfo'
    ]),
    height () {
      return this.getHeight()
    }
  },
  mounted () {
    this.getContacts().then(res => {
      this.list = res.map(item => {
        return {
          id: item.id,
          name: item.name,
          address: '无定位',
          location: null,
          time: null,
          _checked: true
        }
      })
      let c = null
      lastpoint({ employeeIds: res.map(item => item.id), correction: 'n' }).then(res => {
        let trids = res.data
        for (let key in trids) {
          let data = trids[key]
          if (data && data.data && data.data.location) {
            this.list.forEach(user => {
              if (key === user.id) {
                let p = data.data.location.split(',')
                if (!c)c = p
                user.position = p
                user.time = new Date(data.data.locatetime)
                getAddress(p[0], p[1]).then(addr => {
                  user.address = addr
                  console.log(user)
                  this.$forceUpdate()
                })
                this.pList.push(user)
              }
            })
          }
        }
        this.center = c
        console.log(res)
      })
    })
    // if (this.superAdmin._id === this.getUserInfo._id) {
    //   this.empolyeeRange = 'all'
    // } else if (this.isDepartmentAdmin(this.getUserInfo._id)) {
    //   this.empolyeeRange = 'default^SameLevel'
    // } else {
    //   this.empolyeeRange = 'none'
    // }
    // let list = this.typeEmployees(this.empolyeeRange).map(u => { return { id: u._id, name: u.name, address: '', time: '', position: '' } })
    // getTraceCurrent({ userIds: list.map(u => u.id) }).then(res => {
    //   this.data = res.data
    //   list.forEach(item => {
    //     let trace = this.data.find(d => d.userId === item.id)
    //     if (trace && trace.current) {
    //       let time = new Date(Date.parse(trace.current.date.replace(/-/g, '/')))
    //       item.address = trace.current.address
    //       item.time = time instanceof Date && !isNaN(time.getTime()) ? time : ''
    //       item.current = trace.current
    //       item.position = [trace.current.longitude, trace.current.latitude]
    //       this.center = item.position
    //     } else {
    //       item.address = '没有数据'
    //     }
    //   })
    //   this.list = list
    //   this.$nextTick(() => {
    //     this.$refs.list.selectAll(true)
    //   })
    // })
  },
  methods: {
    ...mapActions([
      'getContacts'
    ]),
    getHeight () {
      if (!this.$refs.card) return 600
      return this.$refs.card.$el.clientHeight - 32
    },
    getTraceData (id) {
      return this.data.find(d => d.userId === id).current
    },
    onRowClick (item) {
      item._checked = !item._checked
      if (this.pList.length === 0 && item.position) {
        this.pList.push(item)
      }
      if (item.position && this.pList.filter(i => i.id === item.id).length) {
        this.center = item.position
      }
    },
    onSelectionChange (list) {
      this.pList = list
    },
    onSelect (item) {
    }
  }
}
</script>
<style>
  .position_card_con .ivu-card-body{
    height: 100%;
  }
</style>
<style scoped>
  .win_con {
    height: 100%;
  }

  .win_con > .left {
    float: left;
    width: 350px;
    height: 100%;
    overflow-y: auto;
    background-color: #c3c3c312;
  }

  .win_con > .right {
    background-color: #c3c3c312;
    float: left;
    width: calc(100% - 360px);
    margin-left: 10px;
    height: 100%;
  }
</style>
