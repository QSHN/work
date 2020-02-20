<template>
  <div>
      <Row type="flex" style="margin-bottom: 10px;">
        <div style="display: flex; align-items: center; margin-right: 10px;">
          凭证日期：
          <DatePicker type="daterange" split-panels v-model="search.filter.time" style="width: 200px"></DatePicker>
        </div>

        <div style="display: flex; align-items: center; margin-right: 10px;">
          凭证生成结果：
          <RadioGroup v-model="search.filter.credentialsType" type="button" style="margin-left: 5px;">
            <Radio label="全部"></Radio>
            <Radio label="暂存"></Radio>
            <Radio label="保存"></Radio>
          </RadioGroup>
        </div>
        <Button style="margin-right: 10px;" @click="load">查询</Button>
      </Row>

      <Table  :width="getTableWidth"
              :height="getTableHeight"
              border
              :columns="columns"
              :data="tableData"
              :loading="loading">
        <template slot-scope="{ row }" slot="time">
          {{ moment(row.time).format('YYYY-MM-DD') }}
        </template>

        <template slot-scope="{ row }" slot="code">
          <span style="color: #2d8cf0; text-decoration: underline;" @click="goOrder(row)">
            {{ row.orderCode }}
          </span>
        </template>

        <template slot-scope="{ row }" slot="orderType">
          {{ row.orderType}}
        </template>

        <template slot-scope="{ row }" slot="credentialsId">
          <span style="color: #2d8cf0; text-decoration: underline;" @click="goCredentials(row)">
            {{ row.credentialsId ? row.certificateNumber : '暂存凭证' }}
          </span>
        </template>

        <template slot-scope="{ row }" slot="result">
          <div v-if="!row.credentialsId" v-html="row.result"></div>
        </template>

        <template slot-scope="{ row }" slot="status">
          {{  row.credentialsId ? '成功' : '失败' }}
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
import { queryCredentialsCache } from '../../api/credentialsCache'
// import NP from 'number-precision'
export default {
  name: 'credentialsCreate',
  data () {
    return {
      selectList: [],
      loading: true,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '日期',
          width: 200,
          resizable: true,
          slot: 'time'
        },
        {
          title: '单据编号',
          width: 300,
          resizable: true,
          slot: 'code'
        },
        {
          title: '单据类型',
          width: 200,
          resizable: true,
          slot: 'orderType'
        },
        {
          title: '凭证字号',
          width: 200,
          resizable: true,
          slot: 'credentialsId'
        },
        {
          title: '结果描述',
          width: 400,
          resizable: true,
          slot: 'result'
        },
        {
          title: '生成结果',
          width: 200,
          resizable: true,
          slot: 'status'
        },
        {
          title: ' '
        }
      ],
      total: 0,
      pageSizeOpts: [10, 20, 50],
      search: {
        filter: {
          accountSetId: null,
          time: [null, null],
          credentialsType: '全部'
        },
        pageInfo: {
          limit: 10,
          page: 1
        }
      },
      tableData: []
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
      return window.innerHeight - 210
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
        }
      },
      immediate: true,
      deep: true
    },
    'search.pageInfo.page' () {
      this.load()
    },
    '$route': {
      handler () {
        if (this.$route.name !== 'credentialsCache') return
        if (this.accountSet) {
          this.load()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    moment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '生成凭证') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}生成凭证的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    load () {
      this.loading = true
      let ajaxData = {
        filter: {
          accountSetId: this.accountSet._id
        },
        pageInfo: this.search.pageInfo
      }
      if (this.search.filter.time.length && this.search.filter.time[0]) {
        ajaxData.filter.dateTime = {
          $gte: this.moment(this.search.filter.time[0]).format('YYYY-MM-DD') + ' 00:00:00.000',
          $lte: this.moment(this.search.filter.time[1]).format('YYYY-MM-DD') + ' 23:59:59.999'
        }
      }
      if (this.search.filter.credentialsType === '暂存') {
        ajaxData.filter.credentialsId = null
      } else if (this.search.filter.credentialsType === '保存') {
        ajaxData.filter.credentialsId = { $ne: null }
      }
      queryCredentialsCache(ajaxData).then(res => {
        this.total = res.data.total
        this.tableData = res.data.list
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '业务凭证',
          desc: err.message
        })
      })
    },
    goOrder (row) {
      let routerName = ''
      switch (row.orderType) {
        case '采购入库单':
          routerName = 'purchaseWarehouse'
          break
        case '采购退货单':
          routerName = 'purchaseReturn'
          break
        case '销售出库单':
          routerName = 'salesWarehouse'
          break
        case '销售退货单':
          routerName = 'salesReturn'
          break
        case '其他入库单':
          routerName = 'warehouseIn'
          break
        case '其他出库单':
          routerName = 'warehouseOut'
          break
        case '调拨入库单':
          routerName = 'warehouseAllocatingIn'
          break
        case '调拨出库单':
          routerName = 'warehouseAllocatingOut'
          break
        case '盘盈单 ':
          routerName = 'warehouseDiskSurplus'
          break
        case '盘亏单':
          routerName = 'warehouseDiskDeficient'
          break
        case '收款单':
          routerName = 'receivableCollection'
          break
        case '付款单':
          routerName = 'payableCollection'
          break
        case '预收款单':
          routerName = 'receivablePayments'
          break
        case '预付款单':
          routerName = 'payablePayments'
          break
        case '预收退款单':
          routerName = 'receivableRefund'
          break
        case '预付退款单':
          routerName = 'payableRefund'
          break
        case '其他应收单':
          routerName = 'receivableOther'
          break
        case '其他应付单':
          routerName = 'payableOther'
          break
        case '核销单':
          routerName = 'receivableVerification'
          break
      }
      this.$router.push({
        name: routerName,
        query: {
          id: row.orderId
        }
      })
    },
    goCredentials (row) {
      if (row.credentialsId) {
        this.$router.push({
          name: 'voucherInputIndex',
          query: {
            id: row.credentialsId,
            type: 'look'
          }
        })
      } else {
        this.$router.push({
          name: 'credentialsForm',
          query: {
            id: row._id,
            type: 'edit'
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .left_expand {
    position: relative;
    width: 210px;
    height: ~"calc(100vh - 132px)";
    margin-right: 10px;
    background: #fff;
    transition: 300ms;

    .expand_btn {
      position: absolute;
      right: 0;
      top: 50%;
      z-index: 1;
      width: 20px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c5c8ce;
      margin-top: -15px;
      cursor: pointer;
      transition: 300ms;

      img {
        width: 10px;
      }

      &:hover {
        opacity: .8;
      }
    }

    &.active {
      width: 0;
      margin-right: 0;

      .expand_btn {
        right: -20px;
        transform: rotateY(180deg);
      }
    }

    .le_c {
      width: 100%;
      height: 100%;
      overflow: hidden;

      .le_m {
        width: 210px;
        height: 100%;

        .title {
          width: 100%;
          height: 36px;
          min-height: 36px;
          border-bottom: 1px solid #dcdee2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;

          .add_btn {
            width: 18px;
            height: 18px;
            cursor: pointer;

            img {
              width: 100%;
              height: 100%;
              filter: grayscale(100%)
            }
          }
        }

        .search {
          padding: 8px 10px;
        }

        .scroll_layer {
          height: ~"calc(100% - 10px)";
          overflow: hidden;
        }
      }
    }
  }
  .measure_c {
    display: flex;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
    overflow: hidden;
  }
</style>
