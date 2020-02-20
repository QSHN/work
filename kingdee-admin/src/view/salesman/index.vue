<template>
  <Card shadow style="height: 100%; overflow:auto; overflow-x: hidden;">
    <Row type="flex" justify="space-between" style="margin-bottom: 15px;">
      <Input search enter-button v-model="search.name" placeholder="输入销售员姓名" style="width: 250px;" />
      <Button type="success" @click="setAdmin('新建', null)">新建销售员</Button>
    </Row>

    <Table border :columns="columns" :data="pageContent">
      <template slot-scope="{ row }" slot="action">
        <template v-if="row.accountStatus === '已删除' || row.accountStatus === '禁用'">
          <Button type="primary" size="small" style="margin-right: 5px"  @click="setAdmin(row.accountStatus === '已删除' ? '恢复' : '启用', row)">
            {{row.accountStatus === '已删除' ? '恢复' : '启用'}}
          </Button>
        </template>
        <template v-else>
          <Button type="primary" size="small" style="margin-right: 5px"  @click="setAdmin('修改', row)">修改</Button>
          <Button type="warning" size="small" style="margin-right: 5px"  @click="setAdmin('禁用', row)">禁用</Button>
          <Button type="error" size="small" style="margin-right: 5px"  @click="setAdmin('删除', row)">删除</Button>
        </template>
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 15px;">
      <Page :total="page.total" :current="page.current" :pageSize="page.size" @on-change="changePage"></Page>
    </Row>

    <adminForm ref="adminForm" @load="load" :clickList="clickList" />
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryAdmin, updateUser, queryClerk } from '../../api/user'
import adminForm from './form'
import iviewTableDrag from '../../libs/iviewTableDrag'
export default {
  name: 'salesman',
  components: { adminForm },
  data () {
    return {
      search: {
        name: '',
        role: 'salesman'
      },
      page: {
        total: 1,
        current: 1,
        size: 20
      },
      columns: [
        {
          title: '账号',
          key: 'account'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '手机号码',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '性别',
          key: 'gender'
        },
        {
          title: '职位',
          key: 'clerk'
        },
        {
          title: '上级',
          render: (h, params) => {
            return h('div', params.row.parentsId ? this.userList.find(v => v._id === params.row.parentsId).name : '')
          }
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('div', moment(params.row.createdAt).format('YYYY-MM-DD'))
          }
        },
        {
          title: '账号状态',
          key: 'accountStatus'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      userList: [],
      tableList: [],
      pageContent: [],
      clickList: []
    }
  },
  computed: {
    ...mapGetters([
      'myUser'
    ])
  },
  watch: {
    search: {
      handler () {
        let list = this.userList.filter(v => this.myUser && (v._id === this.myUser._id || v.parentsId === this.myUser._id))
        if (this.search) {
          list = list.filter(v => v.name.includes(this.search.name))
        }
        this.changePage(1, list)
      },
      deep: true
    },
    myUser: {
      handler () {
        if (this.myUser && this.myUser._id) this.load()
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    setTimeout(() => {
      iviewTableDrag()
    }, 1500)
  },
  methods: {
    changePage (current, list) {
      if (list) {
        this.tableList = list
        this.page.total = list.length
      }
      this.page.current = current
      this.pageContent = this.tableList.slice((current - 1) * this.page.size, current * this.page.size)
    },
    load () {
      queryAdmin(this.search).then(res => {
        this.userList = res.data
        let list = this.userList.filter(v => this.myUser && (v._id === this.myUser._id || v.parentsId === this.myUser._id || this.myUser.role === 'admin'))
        if (this.search) {
          list = list.filter(v => v.name.includes(this.search.name))
        }
        this.changePage(1, list)
      }).catch(err => {
        this.$Notice.error({
          title: '销售员列表',
          desc: err.message
        })
      })
      queryClerk().then(res => {
        this.clickList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '职位列表',
          desc: err.message
        })
      })
    },
    setAdmin (type, data) {
      if (type === '新建' || type === '修改') {
        this.$refs.adminForm.show(type, data, this.userList)
      } else {
        let formData = Object.assign({}, data)
        if (formData._id === this.myUser._id) {
          this.$Notice.error({
            title: '销售员账号',
            desc: '自己无法修改自己的账号状态，请联系您的上级或者管理员'
          })
        } else {
          if (type === '删除') formData.accountStatus = '已删除'
          if (type === '禁用') formData.accountStatus = '禁用'
          if (type === '恢复') formData.accountStatus = '正常'
          if (type === '启用') formData.accountStatus = '正常'
          this.$Modal.confirm({
            title: `${type}销售员账号`,
            content: `确定是否${type}销售员账号`,
            onOk: () => {
              updateUser(formData).then(res => {
                this.$Notice.success({
                  title: '销售员',
                  desc: `成功${type}销售员账号`
                })
                this.load()
              }).catch(err => {
                this.$Notice.error({
                  title: '销售员账号',
                  desc: err.message
                })
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
