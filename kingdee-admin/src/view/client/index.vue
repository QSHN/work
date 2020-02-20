<template>
  <Card shadow style="height: 100%; overflow:auto; overflow-x: hidden;">
    <Row type="flex" justify="space-between" style="margin-bottom: 15px;">
      <Input search enter-button v-model="search" placeholder="输入公司/联系人" style="width: 250px;" />
      <Button type="success" @click="setAccount('新建', null)">新建客户</Button>
    </Row>

    <Table border :columns="columns" :data="pageContent">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px"  @click="setAccount('修改', row)">修改</Button>
        <Button type="success" size="small" style="margin-right: 5px"  @click="setAccount('跟进记录', row)">跟进记录</Button>
        <Button type="success" size="small" style="margin-right: 5px"  @click="setAccount('功能管理', row)">功能管理</Button>
        <Button type="success" size="small" style="margin-right: 5px"  @click="setAccount('附件管理', row)">附件管理</Button>
        <template v-if="myUser.role === 'admin'">
          <Button v-if="row.accountStatus === '禁用'" size="small" style="margin-right: 5px"  @click="setAccount('启用', row)">启用</Button>
          <Button v-else type="error" size="small" style="margin-right: 5px"  @click="setAccount('禁用', row)">禁用</Button>
        </template>
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 15px;">
      <Page :total="page.total" :current="page.current" :pageSize="page.size" @on-change="changePage"></Page>
    </Row>

    <accountFrom ref="accountFrom" @load="load" :userList="userList" />
    <recordsForm ref="recordsForm" @load="load" />
    <functionManage ref="functionManage" @load="load" />
    <uploadFiles ref="uploadFiles" @load="load" />
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryClient, queryAdmin, updateClient } from '../../api/user'
import accountFrom from './form'
import recordsForm from './recordsForm'
import functionManage from './functionManage'
import iviewTableDrag from '../../libs/iviewTableDrag'
import uploadFiles from '../../components/uploadFiles/uploadFiles'
export default {
  name: 'clientIndex',
  components: {
    accountFrom,
    recordsForm,
    functionManage,
    uploadFiles
  },
  data () {
    return {
      search: '',
      page: {
        total: 1,
        current: 1,
        size: 20
      },
      columns: [
        {
          title: '公司名',
          key: 'companyName'
        },
        {
          title: '公司账号',
          key: 'companyAccount'
        },
        {
          title: '联系人',
          key: 'name'
        },
        {
          title: '手机号码',
          key: 'phone',
          width: 115
        },
        {
          title: '销售员',
          render: (h, params) => {
            return h('div', this.userList.find(v => v._id === params.row.salesmanId).name)
          }
        },
        {
          title: '账号状态',
          key: 'accountStatus'
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('div', moment(params.row.createdAt).format('YYYY-MM-DD'))
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 400,
          align: 'center'
        }
      ],
      clientList: [],
      tableList: [],
      pageContent: [],
      userList: [],
      allClientList: []
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
        let list = this.clientList
        if (this.search) {
          list = list.filter(v => v.companyName.includes(this.search) || v.name.includes(this.search))
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
      queryAdmin({
        role: 'salesman'
      }).then(res => {
        this.userList = res.data
        this.userList.push(this.myUser)
        let uList = this.userList.filter(v => this.myUser && (v._id === this.myUser._id || v.parentsId === this.myUser._id || this.myUser.role === 'admin'))
        queryClient().then(res => {
          this.allClientList = res.data
          this.clientList = res.data.filter(f => uList.find(u => u._id === f.salesmanId))
          this.changePage(1, this.clientList)
        }).catch(err => {
          this.$Notice.error({
            title: '客户列表',
            desc: err.message
          })
        })
      }).catch(err => {
        this.$Notice.error({
          title: '管理员列表',
          desc: err.message
        })
      })
    },
    setAccount (type, data) {
      if (type === '新建' || type === '修改') {
        this.$refs.accountFrom.show(type, data, this.clientList)
      } else if (type === '禁用' || type === '启用') {
        let formData = Object.assign({}, data)
        formData.accountStatus = type === '禁用' ? '禁用' : '正常'
        this.$Modal.confirm({
          title: `${type}该客户账号`,
          content: `确定是否${type}该客户账号`,
          onOk: () => {
            updateClient(formData).then(res => {
              this.$Notice.success({
                title: `${type}该客户账号`,
                desc: `成功${type}该客户账号`
              })
              this.load()
            }).catch(err => {
              this.$Notice.error({
                title: `${type}该客户账号`,
                desc: err.message
              })
            })
          }
        })
      } else if (type === '跟进记录') {
        this.$refs.recordsForm.show('新建', Object.assign({}, data))
      } else if (type === '功能管理') {
        this.$refs.functionManage.show(JSON.parse(JSON.stringify(data)))
      } else if (type === '附件管理') {
        this.$refs.uploadFiles.show(data)
      }
    }
  }
}
</script>

<style scoped>

</style>
