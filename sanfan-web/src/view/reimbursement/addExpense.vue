<template>
  <Modal v-model="modalShow" title="新建报销" @on-ok="save" :loading="loading">
    <Form v-if="modalShow" :model="formItem" :label-width="80">
      <template v-for="(schedule,index) in formItem.reimbursementItemDTOList">
        <div :key="'schedule_'+index" style="background-color: #f9f9f9;padding: 10px;position: relative;margin-bottom: 10px;border-radius: 4px">
          <Button v-if="formItem.reimbursementItemDTOList.length>1" @click="delSendover(schedule)" style="z-index:1;position: absolute;top: 10px;right: 10px;cursor: pointer;color: #d30000">删除</Button>
          <FormItem label="报销金额">
            <InputNumber v-model="schedule.amount" style="width: 200px" :min="0" placeholder="请输入数字"></InputNumber >
          </FormItem>
          <FormItem label="报销类别">
            <Select v-model="schedule.categoryId">
              <Option v-for="(type,index) in ['交通费','住宿费','餐饮费','办公用品']" :key="index" :value="type">{{type}}</Option>
            </Select>
          </FormItem>
          <FormItem label="费用明细">
            <Input v-model="schedule.detail" placeholder="请输入费用明细"></Input>
          </FormItem>
        </div>
      </template>
      <div @click="addSendover" style="width: 100%;background-color: #66b8ed;color: white;text-align: center;line-height: 30px;margin-bottom: 10px;cursor: pointer">+添加报销明细</div>
      <FormItem label="审核人">
        <selector v-model="formItem.checkerId" range="financialEmployee"></selector>
      </FormItem>
      <FormItem label="审批人">
        <selector v-model="formItem.approverId" range="financialEmployee"></selector>
      </FormItem>
      <FormItem label="出纳人">
        <selector v-model="formItem.cashierId" range="financialEmployee"></selector>
      </FormItem>
      <FormItem label="抄送人">
        <selector v-model="formItem.copyToIds" range="financialEmployee" multiple></selector>
      </FormItem>
      <FormItem label="相片">
        <upload-pic v-model="formItem.photoList"></upload-pic>
      </FormItem>
      <div style="font-size: 14px;text-align: center;margin: 10px;text-align: right">总报销金额：{{allmoney}}元</div>
    </Form>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { addReimbursement } from '../../api/reimbursement'
import UploadPic from '../../components/upload/upload-pic'
import selector from '../../components/employees/selector'
export default {
  name: 'addExpense.vue',
  model: {
    prop: 'show',
    event: 'showChange'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: { UploadPic, selector },
  watch: {
    modalShow (value) {
      this.$emit('showChange', value)
    },
    show (value) {
      this.modalShow = value
    }
  },
  data () {
    return {
      modalShow: false,
      loading: true,
      formItem: {
        checkerId: '',
        approverId: '',
        cashierId: '',
        photoList: [],
        reimbursementItemDTOList: [{
          detail: '',
          amount: 0,
          categoryId: ''
        }],
        copyToIds: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'myCompany',
      'myUserId'
    ]),
    allmoney () {
      return this.formItem.reimbursementItemDTOList.reduce((total, item) => (total + item.amount), 0)
    }
  },
  mounted () {
    this.modalShow = this.show
    this.formItem.applicant = this.myUserId
  },
  methods: {
    addSendover () {
      this.formItem.reimbursementItemDTOList.push({
        detail: '',
        amount: 0,
        categoryId: ''
      })
    },
    delSendover (item) {
      let index = this.formItem.reimbursementItemDTOList.indexOf(item)
      if (index >= 0) {
        this.formItem.reimbursementItemDTOList.splice(index, 1)
      }
    },
    save () {
      var data = JSON.parse(JSON.stringify(this.formItem))

      if (data.reimbursementItemDTOList.filter(item => !item.amount).length) {
        this.reLoading()
        this.$Message.error('金额不正确')
        return
      }
      if (data.reimbursementItemDTOList.filter(item => !item.categoryId).length) {
        this.reLoading()
        this.$Message.error('请选择报销类别')
        return
      }
      if (!data.photoList.length) {
        this.reLoading()
        this.$Message.error('请上传相片')
        return
      }
      if (!data.checkerId) {
        this.reLoading()
        this.$Message.error('必须选择审核人')
        return
      }
      if (!data.approverId) {
        this.reLoading()
        this.$Message.error('必须选择审批人')
        return
      }
      if (!data.cashierId) {
        this.reLoading()
        this.$Message.error('必须选择出纳人')
        return
      }

      addReimbursement(data).then(res => {
        this.$Message.success('新建成功')
        this.$emit('finish', res.data)
        this.modalShow = false
      }).catch(() => {
        this.$Message.error('新建失败')
        this.reLoading()
      })
    },
    reLoading () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    }
  }
}
</script>

<style scoped>

</style>
