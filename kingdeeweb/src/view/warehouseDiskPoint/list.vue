<template>
  <div>
    <Row type="flex" justify="space-between">
      <Row>
        <div style="display: flex; align-items: center;">
          <Select v-model="whichSearchType" style="width: 100px; margin-right: 10px;">
            <Option v-for="(item, index) in searchList" :value="item.title" :key="index">{{ item.title }}</Option>
          </Select>
          <Input v-model="search.searchVal" :placeholder="searchList.find(f => f.title === whichSearchType).placeholder" style="width: 300px;" />
          <Button style="margin-left: 10px;" @click="load">搜索</Button>
        </div>
      </Row>

      <ButtonGroup>
        <Button style="width: 80px; margin-left: 10px;" @click="$router.push({
          name: 'warehouseDiskPoint'
        })">新增</Button>
        <Button style="width: 80px; margin-left: 10px;" @click="load">刷新</Button>
      </ButtonGroup>
    </Row>

    <Row type="flex" style="margin-top: 10px;">
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun(null, '盈亏处理')">盈亏处理</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('lock', '锁盘', '解锁')">锁盘</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun('lock', '解锁', '锁盘')">解锁</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchFun(null, '删除')">删除</Button>
      <!--<Button style="margin-right: 10px;" :disabled="true">打印</Button>-->
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="tracking">全流程跟踪</Button>
    </Row>

    <Table :width="getTableWidth"
           :height="getTableHeight"
           border
           :columns="columns"
           :loading="loading"
           :data="tableData"
           @on-selection-change="selectTable"
           style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="code">
        <router-link :to="{
          name: 'warehouseDiskPoint',
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="pointTime">
        {{ row.pointTime ? moment(row.pointTime).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="warehouseId">
        {{ warehouseList.find(f => f._id === row.warehouseId) && warehouseList.find(f => f._id === row.warehouseId).name }}
      </template>
      <template slot-scope="{ row }" slot="lock">
        <Tag color="green" v-if="row.lock === '解锁'">解锁</Tag>
        <Tag color="red" v-else>锁盘</Tag>
      </template>
      <template slot-scope="{ row }" slot="result">
        <Tag color="green" v-if="row.result === '已盘点'">已盘点</Tag>
        <Tag color="red" v-else>盘点中</Tag>
      </template>
      <template slot-scope="{ row }" slot="deficientId">
        <router-link :to="{
          name: 'warehouseDiskDeficient',
          query: { id: row.deficientId }
        }">{{ row.deficientCode }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="surplusId">
        <router-link :to="{
          name: 'warehouseDiskSurplus',
          query: { id: row.surplusId }
        }">{{ row.surplusCode }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="clerkId">
        {{ clerkList.find(f => f._id === row.clerkId) && clerkList.find(f => f._id === row.clerkId).name }}
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Page :current.sync="search.pageInfo.page" :total="total" :page-size="search.pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryWarehouseDiskPoint, batchWarehouseDiskPoint } from '../../api/warehouseDiskPoint'
import { queryClerk } from '../../api/clerk'
import { queryWarehouse } from '../../api/warehouse'
export default {
  name: 'warehouseDiskPointList',
  data () {
    return {
      total: 0,
      pageSizeOpts: [10, 20, 50],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按单据编号/商品名称',
          formula: ['code', 'list.name']
        },
        {
          title: '按单据编号',
          placeholder: '请输入按单据编号',
          formula: ['code']
        },
        {
          title: '商品名称',
          placeholder: '请输入商品名称',
          formula: ['list.name']
        }
      ],
      search: {
        searchVal: '',
        filter: {
          accountSetId: null
        },
        pageInfo: {
          limit: 10,
          page: 1
        }
      },
      selectList: [],
      loading: true,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          resizable: true
        },
        {
          title: '单据编号',
          width: 200,
          slot: 'code',
          resizable: true
        },
        {
          title: '单据日期',
          width: 150,
          slot: 'dateTime',
          resizable: true
        },
        {
          title: '盘点日期',
          width: 150,
          slot: 'pointTime',
          resizable: true
        },
        {
          title: '盘点仓库',
          width: 150,
          slot: 'warehouseId',
          resizable: true
        },
        {
          title: '锁盘状态',
          width: 150,
          slot: 'lock',
          resizable: true
        },
        {
          title: '盘点状态',
          width: 150,
          slot: 'result',
          resizable: true
        },
        {
          title: '盘盈单编号',
          width: 200,
          slot: 'surplusId',
          resizable: true
        },
        {
          title: '盘亏单编号',
          width: 200,
          slot: 'deficientId',
          resizable: true
        },
        {
          title: '盘点人',
          width: 150,
          slot: 'clerkId',
          resizable: true
        }
      ],
      tableData: [],
      clerkList: [],
      warehouseList: [],
      warehouseDiskPoint: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList',
      'userList'
    ]),
    getTableHeight () {
      return window.innerHeight - 250
    },
    getTableWidth () {
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.load()
          this.loadClerk()
          this.loadWarehouse()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '盘点单') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}盘点单的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadClerk () {
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        this.clerkList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
          desc: err.message
        })
      })
    },
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    load () {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      let filter = {
        accountSetId: this.accountSet._id
      }
      if (search.searchVal) {
        let formula = this.searchList.find(f => f.title === this.whichSearchType).formula
        this.$set(filter, '$or', [])
        formula.forEach(f => {
          let obj = {}
          if (f === 'customer') {
            let list = this.customerList.filter(f => f.name.includes(search.searchVal)).map(v => v._id)
            if (list.length) {
              this.$set(obj, 'customerId', { $in: list })
              filter['$or'].push(obj)
            }
          } else if (f.includes('.')) {
            let c = f.split('.')
            let o = {}
            o[c[1]] = { $regex: search.searchVal }
            this.$set(obj, c[0], { $elemMatch: o })
            filter['$or'].push(obj)
          } else {
            this.$set(obj, f, { $regex: search.searchVal })
            filter['$or'].push(obj)
          }
        })
      }
      search.filter = filter
      delete search.searchVal
      queryWarehouseDiskPoint(search).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.warehouseDiskPoint = res.data.list
        this.loading = false
        if (this.selectList.length) {
          this.tableData.forEach(f => {
            if (this.selectList.includes(f._id)) {
              f._checked = true
            }
          })
        }
        this.$store.commit('setListNav', {
          type: 'warehouseDiskPoint',
          list: res.data.list.map(v => v._id)
        })
      }).catch(err => {
        this.$Notice.error({
          title: '商品',
          desc: err.message
        })
      })
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchFun (type, title, val = null) {
      if (!this.judge(title)) return
      let errorList = []
      let canList = []
      let selectList = Array.from(new Set(this.selectList))
      selectList.forEach(id => {
        let fData = this.warehouseDiskPoint.find(f => f._id === id)
        if (title === '删除') {
          if (fData.lock === '锁盘') {
            errorList.push({
              code: fData.code,
              val: '锁盘'
            })
          } else if (fData.result === '已盘点') {
            errorList.push({
              code: fData.code,
              val: '已盘点'
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        } if (title === '盈亏处理') {
          if (fData.lock === '锁盘') {
            errorList.push({
              code: fData.code,
              val: '锁盘'
            })
          } else if (fData.result === '已盘点') {
            errorList.push({
              code: fData.code,
              val: '已盘点'
            })
          } else if (fData.clerkId && fData.clerkId !== this.myUser._id) {
            errorList.push({
              code: fData.code,
              val: '只能处理自己的盘点单'
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        } else if (title === '锁盘') {
          if (fData.audit === '锁盘') {
            errorList.push({
              code: fData.code,
              val: '锁盘'
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        } else if (title === '解锁') {
          if (fData.audit === '解锁') {
            errorList.push({
              code: fData.code,
              val: '解锁'
            })
          } else {
            canList.push({
              code: fData.code,
              id: id
            })
          }
        }
      })
      let content = ''
      if (errorList.length) {
        content += `<p>无法${title}以下单据：</p>`
        errorList.forEach(f => {
          content += `<p>单据编号: ${f.code} - ${f.val}</p>`
        })
      }
      if (canList.length) {
        content += `<p>确定是否${title}以下单据：</p>`
        canList.forEach(f => {
          content += `<p>单据编号: ${f.code}</p>`
        })
      } else {
        content += `<p>您没有符合${title}条件的单据</p>`
      }
      this.$Modal.confirm({
        title: `${title}盘点单`,
        content: content,
        onOk: () => {
          if (canList.length) {
            let action = {}
            if (title === '删除') {
              action = '删除'
            } if (title === '盈亏处理') {
              action = '盈亏处理'
            } else {
              action[type] = val
            }
            batchWarehouseDiskPoint({
              action: action,
              ids: canList.map(m => m.id)
            }).then(res => {
              this.$Message.success(`成功${title}盘点单`)
              this.load()
            }).catch(err => {
              this.$Message.error(err.message)
            })
          }
        }
      })
    },
    tracking () {
      this.$router.push({
        name: 'processTrackingIndex',
        query: {
          type: '盘点单',
          ids: this.selectList.join(',')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
