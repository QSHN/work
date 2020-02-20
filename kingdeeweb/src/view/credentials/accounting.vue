<template>
  <Modal
    v-model="modal"
    title="选择核算项目具体内容"
    :mask-closable="false"
    width="500"
    @on-cancel="cancel(false)">
    <Button style="margin: 0 10px 10px 0;" @click="loadMore">刷新</Button>

    <Form :label-width="120" style="margin-bottom: 200px;">
      <FormItem v-for="(v, i) in accountingItem" :key="i" :label="v.type">
        <Select v-model="v.name" filterable @on-change="selectChange($event, i, v.type)" style="width: 250px">
          <Option v-for="item in getList(v.type)" :value="item.name" :key="item._id">{{ item && item.code }} - {{ item && item.name }}</Option>
        </Select>

        <Button style="margin: 0 0 0 10px;" @click="add(v.type)">创建</Button>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel(false)">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>

    <customerForm ref="customerForm" @load="loadCustomer" :customerList="customerList" :groupList="customerGroup" />
    <departmentForm ref="departmentForm" @load="loadDepartment" :departmentList="departmentList" />
    <clerkForm ref="clerkForm" @load="loadClerk" :clerkList="clerkList" :groupList="departmentList" />
    <supplierForm ref="supplierForm" @load="loadSupplier" :supplierList="supplierList" :groupList="supplierGroup" />
<!--    <costForm ref="costForm" @load="loadCost" />-->
    <bankAccountForm ref="bankAccountForm" @load="loadBank" />
<!--    <cashForm ref="cashForm" @load="loadCash" />-->
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCustomer, queryCustomerGroup } from '../../api/customer'
import { queryDepartment } from '../../api/department'
import { queryClerk } from '../../api/clerk'
import { querySupplier, querySupplierGroup } from '../../api/supplier'
// import { queryCost } from '../../api/cost'
import { queryBankAccount } from '../../api/bankAccount'
// import { queryCashFlow } from '../../api/cashFlow'
import customerForm from '../customer/form'
import departmentForm from '../department/form'
import clerkForm from '../clerk/form'
import supplierForm from '../supplier/form'
// import costForm from '../cost/form'
import bankAccountForm from '../bankAccount/form'
// import cashForm from '../cashFlow/form'
export default {
  name: 'index',
  components: {
    customerForm,
    departmentForm,
    clerkForm,
    supplierForm,
    // costForm,
    bankAccountForm
    // cashForm
  },
  data () {
    return {
      modal: false,
      cb: null,
      accountingItem: [],
      customerList: [],
      customerGroup: [],
      departmentList: [],
      clerkList: [],
      supplierList: [],
      supplierGroup: [],
      bankAccountList: [],
      costList: [],
      cashList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission'
    ])
  },
  methods: {
    cancel (bool) {
      this.modal = false
      this.accountingItem = []
      if (!bool) this.cb(false)
    },
    show (accountingItem, cb) {
      this.modal = true
      this.accountingItem = Object.assign([], accountingItem)
      this.cb = cb
      this.loadMore()
    },
    loadMore () {
      this.accountingItem.forEach(v => {
        if (v.type === '客户') {
          this.loadCustomer()
        } else if (v.type === '部门') {
          this.loadDepartment()
        } else if (v.type === '职员') {
          this.loadClerk()
        } else if (v.type === '供应商') {
          this.loadSupplier()
        } else if (v.type === '费用') {
          // this.loadCost()
        } else if (v.type === '银行账户') {
          this.loadBank()
        } else if (v.type === '现金流量项目') {
          // this.loadCash()
        }
      })
    },
    loadCustomer () {
      queryCustomer({ accountSetId: this.accountSet._id }).then(res => {
        this.customerList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户',
          desc: err.message
        })
      })
      queryCustomerGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.customerGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户类别',
          desc: err.message
        })
      })
    },
    loadDepartment () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.departmentList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
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
    loadSupplier () {
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商',
          desc: err.message
        })
      })
      querySupplierGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商类别',
          desc: err.message
        })
      })
    },
    // loadCost () {
    //   queryCost({ accountSetId: this.accountSet._id }).then(res => {
    //     this.costList = res.data
    //   }).catch(err => {
    //     this.$Notice.error({
    //       title: '费用',
    //       desc: err.message
    //     })
    //   })
    // },
    loadBank () {
      queryBankAccount({ accountSetId: this.accountSet._id }).then(res => {
        this.bankAccountList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '银行账号',
          desc: err.message
        })
      })
    },
    // loadCash () {
    //   queryCashFlow({ accountSetId: this.accountSet._id }).then(res => {
    //     this.cashList = res.data
    //   }).catch(err => {
    //     this.$Notice.error({
    //       title: '现金流量项目',
    //       desc: err.message
    //     })
    //   })
    // },
    getList (type) {
      let list = []
      if (type === '客户') {
        list = this.customerList
      } else if (type === '部门') {
        list = this.departmentList
      } else if (type === '职员') {
        list = this.clerkList
      } else if (type === '供应商') {
        list = this.supplierList
      } else if (type === '费用') {
        // list = this.costList
      } else if (type === '银行账户') {
        list = this.bankAccountList
      } else if (type === '现金流量项目') {
        // list = this.cashList
      }
      return list
    },
    add (type) {
      if (type === '客户') {
        let formData = {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          groupId: null
        }
        this.$refs.customerForm.show('新建', null, formData)
      } else if (type === '部门') {
        let formData = {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          parentIds: []
        }
        this.$refs.departmentForm.show('新建', null, formData)
      } else if (type === '职员') {
        let formData = {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          groupId: null
        }
        this.$refs.clerkForm.show('新建', null, formData)
      } else if (type === '供应商') {
        formData = {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          groupId: null
        }
        this.$refs.supplierForm.show('新建', null, formData)
      } else if (type === '费用') {
        let formData = {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id
        }
        this.$refs.costForm.show('新建', null, this.costList, formData)
      } else if (type === '银行账户') {
        let formData = {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id
        }
        this.$refs.bankAccountForm.show('新建', null, this.bankAccountList, formData)
      } else if (type === '现金流量项目') {
        let formData = {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id
        }
        this.$refs.cashForm.show('新建', null, this.cashList, '', formData)
      }
    },
    selectChange (val, index, type) {
      let info = this.getList(type).find(v => v.name === val)
      this.accountingItem[index].code = info.code
      this.accountingItem[index].name = info.name
      this.accountingItem[index]._id = info._id
    },
    sure () {
      for (let i = 0; i < this.accountingItem.length; i++) {
        if (!this.accountingItem[i]._id) {
          this.$Notice.error({
            title: '核算项目',
            desc: this.accountingItem[i].type + '必选'
          })
          return
        }
      }
      this.cb(this.accountingItem)
      this.cancel(true)
    }
  }
}
</script>

<style lang="less" scoped>
  .temP {
    width: 100%;
    height: 18px !important;
    line-height: 18px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
    display: block;
  }
</style>
