<template>
  <div>
    <Row type="flex" justify="space-between" style="margin-bottom: 15px;">
      <Col span="6">
        <Button type="success" @click="$refs.personal.show(null, true)">添加员工</Button>
      </Col>
      <Col span="6">
        <Input search enter-button placeholder="搜索员工" v-model="search" />
      </Col>
    </Row>
    <Table border :columns="columns" :data="search ? searchList : contacts"></Table>
    <personal-form ref="personal" />
    <modal-del ref="modalDel" :content="'确定真的要删除该用户吗'" :del="deleteEmployees" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import personalForm from '_c/personal-form/personal-form.vue'
import modalDel from '_c/modal-del/modal-del.vue'
import { changeAccountStatus, deleteEmployee } from '@/api/company'
export default {
  name: 'personList',
  components: {
    personalForm,
    modalDel
  },
  data () {
    return {
      search: '',
      searchList: [],
      columns: [
        {
          title: '名字',
          key: 'name',
          sortable: true
        },
        {
          title: '部门',
          key: 'departmentName',
          sortable: true
        },
        {
          title: '性别',
          key: 'gender',
          render: (h, params) => {
            return h('span', params.row.gender === 'UNKNOWN' ? '' : params.row.gender === 'MALE' ? '男' : '女')
          }
        },
        {
          title: '电话号码',
          key: 'phone'
        },
        {
          title: '操作',
          key: 'action',
          width: '180',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$refs.personal.show({ uid: params.row.id }, false)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: params.row.status === 'ENABLED' ? 'warning' : 'success',
                  size: 'small',
                  disabled: this.getUserInfo.role !== 'SUPERADMIN' || params.row.role === 'SUPERADMIN'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.stop(params.row)
                  }
                }
              }, params.row.status === 'ENABLED' ? '停用' : '启用'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: this.getUserInfo.role !== 'SUPERADMIN' || params.row.id === this.getUserInfo.id
                },
                style: {},
                on: {
                  click: () => {
                    this.$refs.modalDel.open(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'contacts',
      'getUserInfo'
    ])
  },
  watch: {
    search () {
      this.searchList = []
      if (this.contacts.length) {
        this.searchList = this.contacts.filter(v => v.name.includes(this.search))
      }
    }
  },
  methods: {
    ...mapActions([
      'getContacts',
      'getOrganizationTree'
    ]),
    stop (data) {
      this.$Modal.confirm({
        title: '账户状态',
        content: `<p style="color: ${data.status === 'ENABLED' ? 'red' : 'black'}">您要是否要${data.status === 'ENABLED' ? '停用' : '启用'}该账户</p>`,
        loading: true,
        onOk: () => {
          changeAccountStatus({
            id: data.id,
            status: data.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
          }).then((res) => {
            this.getContacts()
            this.getOrganizationTree()
            this.$Modal.remove()
          }).catch((err) => {
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
              this.$Modal.remove()
            }
          })
        },
        onCancel: () => {}
      })
    },
    deleteEmployees (uId) {
      deleteEmployee({ ids: [uId] }).then(res => {
        this.getContacts()
        this.getOrganizationTree()
        this.$refs.modalDel.success('删除成功!')
      }).catch(err => {
        if (err.errorMsg) this.$refs.modalDel.error(err.errorMsg)
      })
    }
  },
  created () {
    this.getContacts()
  }
}
</script>

<style scoped>

</style>
