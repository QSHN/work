<template>
  <div v-if="isShow">
      <supplierForm ref="supplierForm" @load="update" :supplierList="supplierList" :groupList="supplierGroupList"></supplierForm>
      <clerkForm ref="clerkForm" @load="update" :clerkList="clerkList" :groupList="departmentList"></clerkForm>
      <departmentForm ref="departmentForm" @load="update" :departmentList="departmentList"></departmentForm>
      <warehouseForm ref="warehouseForm" @load="update" :warehouseList="warehouseList" :groupList="warehouseGroupList"></warehouseForm>
      <bankAccountForm ref="bankAccountForm" @load="update"></bankAccountForm>
      <clearingForm ref="clearingForm" @load="update" />
      <customerForm ref="customerForm" @load="update" :customerList="customerList" :groupList="customerGroupList"></customerForm>
      <spendingCategoryForm ref="spendingCategoryForm" @load="update" :spendingCategoryList="spendingCategoryList"></spendingCategoryForm>
      <incomeCategoryForm ref="incomeCategoryForm" @load="update" :incomeCategoryList="incomeCategoryList"></incomeCategoryForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySupplier, querySupplierGroup } from '../../api/supplier'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryWarehouse, queryWarehouseGroup } from '../../api/warehouse'
import { queryBankAccount } from '../../api/bankAccount'
import { queryClearingForm } from '../../api/clearingForm'
import { queryCustomer, queryCustomerGroup } from '../../api/customer'
import { querySpendingCategory } from '../../api/spendingCategory'
import { queryIncomeCategory } from '../../api/incomeCategory'

import supplierForm from '../../view/supplier/form'
import clerkForm from '../../view/clerk/form'
import departmentForm from '../../view/department/form'
import warehouseForm from '../../view/warehouse/form'
import bankAccountForm from '../../view/bankAccount/form'
import clearingForm from '../../view/clearingForm/form'
import customerForm from '../../view/customer/form'
import spendingCategoryForm from '../../view/spendingCategory/form'
import incomeCategoryForm from '../../view/incomeCategory/form'

export default {
  name: 'index',
  components: {
    supplierForm,
    clerkForm,
    departmentForm,
    warehouseForm,
    bankAccountForm,
    clearingForm,
    customerForm,
    spendingCategoryForm,
    incomeCategoryForm
  },
  data () {
    return {
      supplierList: [],
      supplierGroupList: [],
      clerkList: [],
      departmentList: [],
      warehouseList: [],
      warehouseGroupList: [],
      bankAccountList: [],
      clearList: [],
      customerList: [],
      customerGroupList: [],
      spendingCategoryList: [],
      incomeCategoryList: [],
      load: null,
      isShow: false
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser'
    ])
  },
  mounted () {
    setTimeout(() => {
      this.isShow = true
    }, 500)
  },
  methods: {
    show (type, load) {
      this.load = load
      switch (type) {
        case 'supplier':
          this.loadSupplier()
          break
        case 'clerk':
          this.loadClerk()
          break
        case 'department':
          this.loadDepartment()
          break
        case 'warehouse':
          this.loadWarehouse()
          break
        case 'bankAccount':
          this.loadBankAccount()
          break
        case 'clearingForm':
          this.loadClearingForm()
          break
        case 'customer':
          this.loadCustomer()
          break
        case 'spendingCategory':
          this.loadSpendingCategory()
          break
        case 'incomeCategory':
          this.loadIncomeCategory()
          break
      }
    },
    update () {
      if (this.load) this.load()
    },
    loadSupplier () {
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierList = res.data
        this.$refs.supplierForm.show('新建', null, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          groupId: null
        })
      }).catch(err => {
        this.$Notice.error({
          title: '供应商',
          desc: err.message
        })
      })
      querySupplierGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierGroupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商组',
          desc: err.message
        })
      })
    },
    loadClerk () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.departmentList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        this.clerkList = res.data
        this.$refs.clerkForm.show('新建', null, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          groupId: null
        })
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
          desc: err.message
        })
      })
    },
    loadDepartment () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.departmentList = res.data
        this.$refs.departmentForm.show('新建', null, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          parentIds: []
        })
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadWarehouse () {
      queryWarehouseGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseGroupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '仓库组',
          desc: err.message
        })
      })
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
        this.$refs.warehouseForm.show('新建', null, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          groupId: null
        })
      }).catch(err => {
        this.$Notice.error({
          title: '仓库',
          desc: err.message
        })
      })
    },
    loadBankAccount () {
      queryBankAccount({ accountSetId: this.accountSet._id }).then(res => {
        this.bankAccountList = res.data
        this.$refs.bankAccountForm.show('新建', null, this.bankAccountList, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id
        })
      }).catch(err => {
        this.$Notice.error({
          title: '银行账号',
          desc: err.message
        })
      })
    },
    loadClearingForm () {
      queryClearingForm({ accountSetId: this.accountSet._id }).then(res => {
        this.clearList = res.data
        this.$refs.clearingForm.show('新建', null, this.clearList, {
          accountSetId: this.accountSet._id
        })
      }).catch(err => {
        this.$Notice.error({
          title: '结算方式',
          desc: err.message
        })
      })
    },
    loadCustomer () {
      queryCustomerGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.customerGroupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户组',
          desc: err.message
        })
      })
      queryCustomer({ accountSetId: this.accountSet._id }).then(res => {
        this.customerList = res.data
        this.$refs.customerForm.show('新建', null, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id,
          groupId: null
        })
      }).catch(err => {
        this.$Notice.error({
          title: '客户',
          desc: err.message
        })
      })
    },
    loadSpendingCategory () {
      querySpendingCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.spendingCategoryList = res.data
        this.$refs.spendingCategoryForm.show('新建', null, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id
        })
      }).catch(err => {
        this.$Notice.error({
          title: '支出类别',
          desc: err.message
        })
      })
    },
    loadIncomeCategory () {
      queryIncomeCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.incomeCategoryList = res.data
        this.$refs.incomeCategoryForm.show('新建', null, {
          accountSetId: this.accountSet._id,
          creator: this.myUser._id
        })
      }).catch(err => {
        this.$Notice.error({
          title: '收入类别',
          desc: err.message
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
