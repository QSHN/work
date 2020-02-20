<template>
  <div>
    <div style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px;">价格策略优先级</div>
    <Tabs type="card" v-if="strategyPrices">
      <Tab-pane label="销售价格策略">
        <Table border :columns="salesColumns" :data="strategyPrices.sales" :width="652">
          <template slot-scope="{ row }" slot="status">
            <div @click="statusFun(row._index, row.status === '启用' ? '禁用' : '启用', 'sales')" style="position: relative;">
              <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
              <i-switch size="small" :value="row.status === '启用'" />
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button size="small" style="margin-right: 5px;" @click="move(row._index, true, 'sales')">上移</Button>
            <Button size="small" @click="move(row._index, false, 'sales')">下移</Button>
          </template>
        </Table>
      </Tab-pane>
      <Tab-pane label="采购价格策略">
        <Table border :columns="salesColumns" :data="strategyPrices.purchase" :width="652">
          <template slot-scope="{ row }" slot="status">
            <div @click="statusFun(row._index, row.status === '启用' ? '禁用' : '启用', 'purchase')" style="position: relative;">
              <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
              <i-switch size="small" :value="row.status === '启用'" />
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button size="small" style="margin-right: 5px;" @click="move(row._index, true, 'purchase')">上移</Button>
            <Button size="small" @click="move(row._index, false, 'purchase')">下移</Button>
          </template>
        </Table>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { strategyPricesQuery, strategyPricesUpdate } from '../../api/commodityPrices'
export default {
  name: 'index',
  data () {
    return {
      strategyPrices: null,
      salesColumns: [
        {
          title: '价格策略名称',
          key: 'title',
          width: 200,
          align: 'center'
        },
        {
          title: '是否启用',
          slot: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '优先级',
          key: 'index',
          width: 200,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ])
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
    }
  },
  methods: {
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '价格取数优先级') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}价格取数优先级的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    load () {
      strategyPricesQuery({ accountSetId: this.accountSet._id }).then(res => {
        this.strategyPrices = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    statusFun (index, action, which) {
      this.$set(this.strategyPrices[which][index], 'status', action)
      this.update()
    },
    move (index, action, which) {
      if (action && index === 0) {
        this.$Message.error('已在最前')
      } else if (!action && index === this.strategyPrices[which].length - 1) {
        this.$Message.error('已在最后')
      } else {
        let data = Object.assign({}, this.strategyPrices[which][index])
        this.strategyPrices[which].splice(index, 1)
        if (action) {
          this.strategyPrices[which].splice(index - 1, 0, data)
        } else {
          this.strategyPrices[which].splice(index + 1, 0, data)
        }
        this.strategyPrices[which].forEach((f, i) => {
          f.index = i + 1
        })
        this.update()
      }
    },
    update () {
      if (!this.judge('修改')) return
      strategyPricesUpdate(this.strategyPrices).then(res => {
        this.load()
        this.$Message.success('已保存更新')
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
