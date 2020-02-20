<template>
  <Modal
    v-model="modal"
    title="设置适用客户"
    :mask-closable="false"
    width="620"
    @on-cancel="cancel">
    <template v-if="customerData._id">
      <Transfer
        :data="getCustomerList"
        :target-keys="formData.userList"
        :list-style="listStyle"
        :operations="['删除','分组']"
        :titles="['未分组客户', formData.name]"
        filterable
        :render-format="render"
        @on-change="handleChange">
      </Transfer>

      <Button style="margin-top: 10px;" @click="setFun('add', null)">创建客户分组</Button>
      <Table :width="588" :height="300" border :columns="columns" :data="customerData.useUser" highlight-row class="input_table" style="margin-top: 10px">
        <template slot-scope="{ row }" slot="name">
          <div class="text">{{ row.name }}</div>
          <div class="hover_layer">
            <Input v-model="customerData.useUser[row._index].name" />
          </div>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px;" @click="setFun('edit', row)">设置</Button>
          <Button size="small" @click="setFun('delete', row)">删除</Button>
        </template>
      </Table>
    </template>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { customerPricesUpdate } from '../../api/commodityPrices'
export default {
  name: 'currency',
  props: {
    customerList: Array
  },
  data () {
    return {
      currentRow: null,
      modal: false,
      formData: {
        index: null,
        name: '',
        userList: []
      },
      customerData: {},
      columns: [
        {
          title: '客户组名',
          slot: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          width: 250,
          align: 'center'
        }
      ],
      listStyle: {
        width: '250px',
        height: '300px'
      }
    }
  },
  computed: {
    getCustomerList () {
      let list = this.customerList.map(m => {
        return {
          key: m._id,
          _id: m._id,
          name: m.name
        }
      })
      return list
    }
  },
  watch: {
    'formData.userList' () {
      if (this.formData.index !== null) {
        this.$set(this.customerData.useUser[this.formData.index], 'userList', this.formData.userList)
      }
    }
  },
  methods: {
    show (data) {
      this.modal = true
      this.customerData = data
    },
    cancel () {
      this.modal = false
      this.formData = {
        index: null,
        name: '',
        userList: []
      }
    },
    sure () {
      let isSame = this.customerData.useUser.find(v => this.customerData.useUser.find(f => f.name === v.name && f.index !== v.index))
      if (isSame) {
        this.$Message.error('存在相同的客户组')
      } else {
        customerPricesUpdate(this.customerData).then(res => {
          this.$Notice.success({
            title: '设置适用客户',
            desc: `成功设置适用客户`
          })
          this.$emit('load')
          this.cancel()
        }).catch(err => {
          this.$Notice.error({
            title: '设置适用客户',
            desc: err.message
          })
        })
      }
    },
    handleChange (newTargetKeys) {
      if (this.formData.name) {
        this.$set(this.formData, 'userList', newTargetKeys)
      } else {
        this.$Message.error('请选择对应的客户组')
      }
    },
    render (item) {
      return item.name
    },
    setFun (type, row) {
      switch (type) {
        case 'add':
          console.log(this.customerData.useUser.length)
          this.customerData.useUser.push({
            index: this.customerData.useUser.length,
            name: '',
            userList: []
          })
          break
        case 'edit':
          this.formData = Object.assign({}, row)
          break
      }
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    }
  }
}
</script>

<style lang="less">
  .input_table {
    .text {
      padding-left: 8px;
    }
    .hover_layer {
      display: none;
    }

    .ivu-table-row:hover,
    .ivu-table-row.active {
      .text {
        display: none;
      }
      .hover_layer {
        display: block;
      }
    }
  }
</style>
