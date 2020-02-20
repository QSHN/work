<template>
  <Modal
    v-model="modal"
    :title="`${type}跟进记录`"
    :mask-closable="false"
    width="1000"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <Row type="flex">
        <FormItem label="跟进内容" prop="content">
          <Input v-model="formData.content" style="width: 250px" />
        </FormItem>

        <FormItem label="跟进结果" prop="result">
          <Input v-model="formData.result" style="width: 250px" />
        </FormItem>

        <Button type="success" @click="sure" style="width: 100px; height: 32px; margin-left: 50px;">{{formData.index !== undefined ? '修改' : '新增'}}</Button>
      </Row>
    </Form>

    <Table border :columns="columns" :data="clientData.recordList">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px"  @click="edit(row._index)">修改</Button>
      </template>
    </Table>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { updateRecords, queryAdmin } from '../../api/user'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'currency',
  data () {
    return {
      modal: false,
      type: '',
      formData: {},
      formDataRule: {
        content: [
          { required: true, trigger: 'blur', message: '跟进内容不能为空' }
        ],
        result: [
          { required: true, trigger: 'blur', message: '跟进结果不能为空' }
        ]
      },
      clientData: {},
      columns: [
        {
          title: '跟进内容',
          key: 'content'
        },
        {
          title: '跟进结果',
          key: 'result'
        },
        {
          title: '跟进人',
          render: (h, params) => {
            return h('div', params.row.userId ? this.userList.find(v => v._id === params.row.userId).name : '')
          }
        },
        {
          title: '跟进时间',
          render: (h, params) => {
            return h('div', moment(params.row.time).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      userList: []
    }
  },
  computed: {
    ...mapGetters([
      'myUser'
    ])
  },
  watch: {
    myUser: {
      handler () {
        if (this.myUser && this.myUser._id) this.loadUser()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    show (type, client) {
      this.modal = true
      this.type = type
      this.formData = {
        content: '',
        result: ''
      }
      this.clientData = JSON.parse(JSON.stringify(client))
      this.$nextTick(() => {
        setTimeout(() => {
          iviewTableDrag()
        }, 1500)
      })
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.clientData = {}
      this.$refs.formData.resetFields()
    },
    edit (index) {
      this.formData = Object.assign({
        index: index
      }, this.clientData.recordList[index])
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let formData = Object.assign({}, this.formData)
          formData.time = new Date()
          formData.userId = this.myUser._id
          let clientData = JSON.parse(JSON.stringify(this.clientData))
          if (formData.index) {
            clientData.recordList[formData.index] = formData
          } else {
            clientData.recordList.push(formData)
          }
          updateRecords(clientData).then(res => {
            this.$Notice.success({
              title: `${this.type}跟进记录`,
              desc: `成功${this.type}跟进记录`
            })
            this.clientData = clientData
            this.$emit('load')
            this.formData = {
              content: '',
              result: ''
            }
          }).catch(err => {
            this.$Notice.error({
              title: `${this.type}跟进记录`,
              desc: err.message
            })
          })
        }
      })
    },
    loadUser () {
      queryAdmin({
        isAll: true
      }).then(res => {
        this.userList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '用户列表',
          desc: err.message
        })
      })
    }
  }
}
</script>

<style lang="less">

</style>
