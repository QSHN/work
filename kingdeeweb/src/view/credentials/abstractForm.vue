<template>
  <Modal
    v-model="modal"
    title="摘要库"
    :mask-closable="false"
    width="1000"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <Row type="flex">
        <FormItem label="编码" prop="code">
          <Input v-model="formData.code" style="width: 200px" />
        </FormItem>

        <FormItem label="摘要" prop="name">
          <Input v-model="formData.name" style="width: 200px" />
        </FormItem>

        <Button type="success" @click="sure" style="width: 100px; height: 32px; margin-left: 120px;">{{formData._id ? '修改' : '新增'}}</Button>
      </Row>
    </Form>

    <Table border :columns="columns" :data="abstractList">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">修改</Button>
        <Button type="success" size="small" style="margin-right: 5px" @click="select(row)">选择</Button>
        <Button type="error" size="small" style="margin-right: 5px" @click="deleteFun(row)">删除</Button>
      </template>
    </Table>

    <div slot="footer">
      <Button type="text" @click="add" v-if="formData._id">切换为新增状态</Button>
      <Button type="text" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateAbstract, deleteAbstract } from '../../api/abstract'
export default {
  name: 'currency',
  props: {
    abstractList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      formData: {},
      oldData: {},
      formDataRule: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                this.oldData.code !== value && this.abstractList.filter(v => v.code === value.trim()).length
              ) {
                callback(new Error('已存在该摘要，不能重复'))
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
              if (
                this.oldData.name !== value && this.abstractList.filter(v => v.name === value.trim()).length
              ) {
                callback(new Error('已存在该摘要，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      columns: [
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '摘要内容',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      cb: null
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    show (cb) {
      this.modal = true
      this.formData = {
        name: '',
        code: ''
      }
      this.cb = cb
      this.oldData = JSON.parse(JSON.stringify(this.formData))
      this.$refs.formData.resetFields()
      this.$forceUpdate()
    },
    cancel () {
      this.modal = false
      this.$refs.formData.resetFields()
    },
    edit (row) {
      this.formData = Object.assign({}, row)
      this.oldData = JSON.parse(JSON.stringify(this.formData))
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let formData = Object.assign({}, this.formData)
          formData.accountSetId = this.accountSet._id
          updateAbstract(formData).then(res => {
            this.$Notice.success({
              title: `摘要库`,
              desc: `成功更新摘要库`
            })
            this.add()
            this.$emit('load')
          }).catch(err => {
            this.$Notice.error({
              title: `摘要库`,
              desc: err.message
            })
          })
        }
      })
    },
    add () {
      this.formData = {
        name: '',
        code: ''
      }
      this.oldData = JSON.parse(JSON.stringify(this.formData))
    },
    deleteFun (row) {
      this.$Modal.confirm({
        title: `删除摘要`,
        content: `确定删除${row.name}吗？`,
        onOk: () => {
          deleteAbstract({
            id: row._id
          }).then(res => {
            this.$Notice.success({
              title: '删除摘要',
              desc: '成功删除摘要'
            })
            this.$emit('load')
          }).catch(err => {
            this.$Notice.error({
              title: '删除摘要',
              desc: err.message
            })
          })
        }
      })
    },
    select (row) {
      this.cb(row.name)
      this.cancel()
    }
  }
}
</script>

<style lang="less">

</style>
