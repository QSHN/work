<template>
  <Modal
    v-model="modal"
    :title="`${type}供应商`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1082"
    @on-cancel="cancel">
    <Row type="flex" style="margin-bottom: 10px;">
      <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="200" style="margin-top: 10px;">
        <Row type="flex">
          <FormItem label="供应商编码" prop="code">
            <Input v-model="formData.code" style="width: 250px" />
          </FormItem>

          <FormItem label="供应商名称" prop="name">
            <Input v-model="formData.name" style="width: 250px" />
          </FormItem>
        </Row>

        <Row type="flex">
          <FormItem label="供应商类别" style="margin-bottom: 10px;">
            <Select v-model="formData.groupId" style="width: 250px">
              <Option v-for="(v, i) in groupList" :value="v._id" :key="i">{{ v.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="余额日期" style="margin-bottom: 10px;">
            <DatePicker type="date" v-model="formData.balanceDate" style="width: 250px" />
          </FormItem>
        </Row>

        <Row type="flex">
          <FormItem label="期初应收款" style="margin-bottom: 10px;">
            <InputNumber :min="0" :step="0.01"  v-model="formData.receivable" style="width: 250px" />
          </FormItem>

          <FormItem label="期初预收款" style="margin-bottom: 10px;">
            <InputNumber :min="0" :step="0.01" v-model="formData.payments" style="width: 250px" />
          </FormItem>
        </Row>

        <Row type="flex">
          <FormItem label="增值税税率%" style="margin-bottom: 10px;">
            <Input type="number" :min="0" :step="0.01"  v-model="formData.rate" style="width: 250px" >
              <span slot="append">%</span>
            </Input>
          </FormItem>

          <FormItem label="纳税人识别号" style="margin-bottom: 10px;">
            <Input v-model="formData.taxpayers" style="width: 250px" />
          </FormItem>
        </Row>

        <Row type="flex">
          <FormItem label="开户银行" style="margin-bottom: 10px;">
            <Input v-model="formData.bank" style="width: 250px" />
          </FormItem>

          <FormItem label="银行账户" style="margin-bottom: 10px;">
            <Input v-model="formData.bankAccount" style="width: 250px" />
          </FormItem>
        </Row>
      </Form>
    </Row>

    <Row style="margin-bottom: 10px;">
      <Button @click="formData.list.push({
          name: null,
          phone: null,
          tel: null,
          other: null,
          address: null,
          isMain: false
      })">新增</Button>
    </Row>

    <Table :width="1052"
           border
           :columns="contactColumns"
           :data="formData.list"
           @on-row-click="rowClick"
           :row-class-name="rowClassName"
           class="input_table">
      <template slot-scope="{ row }" slot="name">
        <div class="text">{{ row.name }}</div>
        <div class="hover_layer">
          <Input v-model="formData.list[row._index].name" />
        </div>
      </template>

      <template slot-scope="{ row }" slot="phone">
        <div class="text">{{ row.phone }}</div>
        <div class="hover_layer">
          <Input v-model.number="formData.list[row._index].phone" />
        </div>
      </template>

      <template slot-scope="{ row }" slot="tel">
        <div class="text">{{ row.tel }}</div>
        <div class="hover_layer">
          <Input v-model="formData.list[row._index].tel" />
        </div>
      </template>

      <template slot-scope="{ row }" slot="other">
        <div class="text">{{ row.other }}</div>
        <div class="hover_layer">
          <Input v-model="formData.list[row._index].other" />
        </div>
      </template>

      <template slot-scope="{ row }" slot="address">
        <div class="text">{{ row.address }}</div>
        <div class="hover_layer">
          <Input v-model="formData.list[row._index].address" />
        </div>
      </template>

      <template slot-scope="{ row }" slot="isMain">
        <i-switch size="small" v-model="formData.list[row._index].isMain" />
      </template>

      <template slot-scope="{ row }" slot="action">
        <Button size="small" type="error" @click="formData.list.splice(row._index, 1)">删除</Button>
      </template>
    </Table>

    <Input v-model="formData.des" type="textarea" :rows="1" placeholder="添加备注信息" style="margin-top: 10px" />

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateSupplier } from '../../api/supplier'
import moment from 'moment'
export default {
  name: 'currency',
  props: {
    groupList: Array,
    supplierList: Array
  },
  data () {
    return {
      currentRow: null,
      modal: false,
      type: '',
      oldData: {},
      formData: {},
      formDataRule: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('供应商编码不能为空'))
              } else if (this.oldData.code !== value && this.supplierList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该供应商编码，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('供应商名称不能为空'))
              } else if (this.oldData.name !== value && this.supplierList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该供应商名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      contactColumns: [
        {
          title: '联系人',
          slot: 'name',
          width: 150
        },
        {
          title: '手机',
          slot: 'phone',
          width: 150
        },
        {
          title: '座机',
          slot: 'tel',
          width: 150
        },
        {
          title: 'QQ/微信/Email',
          slot: 'other',
          width: 200
        },
        {
          title: '联系地址',
          slot: 'address',
          width: 200
        },
        {
          title: '首要联系人',
          slot: 'isMain',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 100,
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    show (type, data, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: null,
        name: null,
        balanceDate: null,
        receivable: null,
        payments: null,
        taxpayers: null,
        bank: null,
        bankAccount: null,
        des: null,
        list: [],
        rate: null,
        status: '启用'
      }, addObj)
      if (data) {
        this.oldData = data
        if (this.formData.balanceDate) this.formData.balanceDate = moment(this.formData.balanceDate).format('YYYY-MM-DD')
      }
      if (this.formData.list.length < 3) {
        for (let i = this.formData.list.length; i < 3; i++) {
          this.formData.list.push({
            name: null,
            phone: null,
            tel: null,
            other: null,
            address: null,
            isMain: false
          })
        }
      }
      this.$forceUpdate()
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.oldData = {}
      this.$refs.formData.resetFields()
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let error = ''
          let isFind = false
          this.formData.list.forEach((v, i) => {
            if (!v.name && !error && (
              v.phone ||
              v.tel ||
              v.other ||
              v.address ||
              v.isMain
            )) {
              error = `第${i + 1} 行联系人必填`
            }
            if (v.name) {
              isFind = true
            }
          })
          if (error) {
            this.$Message.error(error)
          } else if (!isFind) {
            this.$Message.error('至少输入一行联系人')
          } else {
            updateSupplier(this.formData).then(res => {
              this.$Notice.success({
                title: '供应商',
                desc: `成功${this.type}供应商`
              })
              this.$emit('load')
              this.cancel()
            }).catch(err => {
              this.$Notice.error({
                title: '供应商',
                desc: err.message
              })
            })
          }
        }
      })
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
