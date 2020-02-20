<template>
  <Modal
    v-model="modal"
    :title="`${type}仓库`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="500"
    @on-cancel="cancel">
    <Row type="flex" style="margin-bottom: 10px;">
      <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
        <FormItem label="仓库编码" prop="code">
          <Input v-model="formData.code" style="width: 250px" />
        </FormItem>

        <FormItem label="仓库名称" prop="name">
          <Input v-model="formData.name" style="width: 250px" />
        </FormItem>

        <FormItem label="仓库类别" style="margin-bottom: 10px;">
          <Select v-model="formData.groupId" style="width: 250px">
            <Option v-for="(v, i) in groupList" :value="v._id" :key="i">{{ v.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="联系人" style="margin-bottom: 10px;">
          <Input v-model="formData.contact" style="width: 250px" />
        </FormItem>

        <FormItem label="联系电话" style="margin-bottom: 10px;">
          <Input v-model.number="formData.tel" style="width: 250px" />
        </FormItem>

        <FormItem label="联系手机" style="margin-bottom: 10px;">
          <Input v-model.number="formData.phone" style="width: 250px" />
        </FormItem>

        <FormItem label="仓库地址">
          <Cascader v-model="formData.addressList" :data="city" filterable></Cascader>
        </FormItem>

        <FormItem label="详细地址" style="margin-bottom: 10px;">
          <Input v-model="formData.address" style="width: 250px" />
        </FormItem>

        <FormItem label="备注" style="margin-bottom: 10px;">
          <Input v-model="formData.des" style="width: 250px" />
        </FormItem>
      </Form>
    </Row>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateWarehouse } from '../../api/warehouse'
import { city } from '../../libs/province'
export default {
  name: 'currency',
  props: {
    groupList: Array,
    warehouseList: Array
  },
  data () {
    return {
      city,
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
                callback(new Error('仓库编码不能为空'))
              } else if (this.oldData.code !== value && this.warehouseList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该仓库编码，不能重复'))
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
                callback(new Error('仓库名称不能为空'))
              } else if (this.oldData.name !== value && this.warehouseList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该仓库名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      }
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
        contact: null,
        phone: null,
        tel: null,
        addressList: [],
        address: null,
        des: null,
        status: '启用'
      }, addObj)
      if (data) this.oldData = data
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
          updateWarehouse(this.formData).then(res => {
            this.$Notice.success({
              title: '仓库',
              desc: `成功${this.type}仓库`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '仓库',
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>
