<template>
  <Modal
    v-model="modal"
    :title="`${type}商品品牌`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="编码" prop="code">
        <Input v-model="formData.code" style="width: 200px" />
      </FormItem>

      <FormItem label="名称" prop="name">
        <Input v-model="formData.name" style="width: 200px" />
      </FormItem>

      <FormItem label="商品品牌组" prop="groupId">
        <Select v-model="formData.groupId" filterable style="width: 200px;">
          <Option v-for="item in groupList" :value="item._id" :key="item._id">{{ item.name }}</Option>
        </Select>
      </FormItem>

      <FormItem label="备注">
        <Input v-model="formData.des" style="width: 200px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateCommodityBrand } from '../../api/commodityBrand'
export default {
  name: 'currency',
  props: {
    groupList: Array
  },
  data () {
    return {
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
                callback(new Error('商品品牌编码不能为空'))
              } else if (this.oldData.code !== value && this.brandList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该商品品牌编码，不能重复'))
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
                callback(new Error('商品品牌名称不能为空'))
              } else if (this.oldData.name !== value && this.brandList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该商品品牌名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        groupId: [
          { required: true, message: '商品品牌组不能为空', trigger: 'change' }
        ]
      },
      brandList: []
    }
  },
  methods: {
    show (type, data, brandList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        name: '',
        status: '启用'
      }, addObj)
      if (data) this.oldData = data
      this.brandList = brandList
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
          updateCommodityBrand(this.formData).then(res => {
            this.$Notice.success({
              title: '商品品牌',
              desc: `成功${this.type}商品品牌`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '商品品牌',
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
