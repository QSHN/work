<template>
  <div>
    <Card>
      <div>快捷方式：</div>
      <ul class="quick_function">
        <li v-for="(v, i) in list" :key="i" @click="go(v.name, v.routerName)">
          <div>
            <img src="../../../assets/images/fun.svg">
          </div>
          {{ v.name }}
        </li>
      </ul>
    </Card>

    <div class="list_data" style="margin-top: 10px;">
      <div class="list_card_layer" v-for="(v, i) in allList" :key="i">
        <Card class="list_card">
          <div class="info" @click="go(v.name, v.routerName)">
            <div class="left">
              <img src="../../../assets/images/order.svg">
            </div>
            <div class="right">
              <div class="number">{{ v.number }}</div>
              <div class="title">{{ v.title }}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { funPermissionQuery } from '../../../api/funPermission'
import { queryAllList } from '../../../api/home'
export default {
  name: 'home',
  components: {},
  data () {
    return {
      list: [
        { name: '销售订单', routerName: 'salesOrder' },
        { name: '销售出库', routerName: 'salesWarehouse' },
        { name: '销售退货', routerName: 'salesReturn' },
        { name: '采购订单', routerName: 'purchaseOrder' },
        { name: '采购入库', routerName: 'purchaseWarehouse' },
        { name: '采购退货', routerName: 'purchaseReturn' },
        { name: '收款', routerName: 'receivableCollection' },
        { name: '付款', routerName: 'payableCollection' },
        { name: '调拨出库', routerName: 'warehouseAllocatingOut' },
        { name: '调拨入库', routerName: 'warehouseAllocatingIn' }
      ],
      funPermission: [],
      allList: []
    }
  },
  computed: {
    ...mapGetters([
      'errorCount',
      'myUser',
      'accountSet',
      'myPermission'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) this.loadList()
      },
      immediate: true,
      deep: true
    },
    myUser: {
      handler () {
        if (this.myUser.companyId) this.load()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    judge (name, action) {
      let bool = false
      let isFind = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === name) {
            isFind = true
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有查看${name}的权力，请联系管理员`)
            } else if (action === '查询') {
              bool = f.operation.find(f => f.val)
              if (!bool) this.$Message.error(`您没有操作${name}的权力，请联系管理员`)
            }
          }
        })
      }
      if (!isFind) bool = true
      return bool
    },
    funPermissionJudge (name) {
      let bool = false
      this.funPermission.forEach(f => {
        f.child.forEach(c => {
          c.child.forEach(cc => {
            if (cc.name === name) bool = cc.val
          })
        })
      })
      if (!bool) this.$Message.error('贵公司还没有购买该功能，请联系公司管理员')
      return bool
    },
    go (name, route) {
      if (!this.funPermissionJudge(name === '查业务凭证' ? '生成凭证' : name)) return
      if (name && route) {
        if (!this.judge(
          name === '查凭证' || name === '录凭证'
            ? '凭证'
            : name === '查业务凭证'
              ? '生成凭证'
              : name === '供应商初始数据'
                ? '供应商'
                : name === '客户初始数据'
                  ? '客户'
                  : name
          , '查询'
        )) return
        this.$router.push({
          name: route
        })
      }
    },
    load () {
      funPermissionQuery({
        companyId: this.myUser.companyId
      }).then(res => {
        if (res.data) this.funPermission = res.data.permission
      }).catch(err => {
        this.$Modal.error({
          title: '权限获取',
          content: err.message
        })
      })
    },
    loadList () {
      queryAllList({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.allList = res.data
      }).catch(err => {
        this.$Modal.error({
          title: '获取数据',
          content: err.message
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .quick_function {
    overflow: hidden;
    list-style: none;
    margin: 10px 0 0;

    li {
      width: 100px;
      float: left;
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;

      &:hover {
        opacity: .8;
      }

      div {
        background: #2d8cf0;
        border-radius: 5px;
        width: 50px;
        height: 50px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;

        img {
          width: 25px;
          object-fit: contain;
        }
      }
    }
  }

  .list_data {
    overflow: hidden;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;

    .list_card_layer {
      width: 25%;

      &:nth-child(4n) .list_card{
        margin-right: 0;
      }
    }

    .list_card {
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .info {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;

      .left {
        width: 56px;

        img {
          width: 100%;
          margin-top: 5px;
        }
      }

      .right {
         width: 150px;
         margin-left: 10px;

        .number {
          font-size: 24px;

        }
      }
    }
  }
</style>
