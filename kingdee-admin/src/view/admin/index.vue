<template>
  <Card shadow style="height: 100%; overflow:auto; overflow-x: hidden;">
    <Row type="flex" justify="space-between" style="margin-bottom: 15px;">
      <Input search enter-button v-model="search.name" placeholder="输入管理员姓名" style="width: 250px;" />
      <Button type="success" @click="setAdmin('新建', null)">新建管理员</Button>
    </Row>

    <Table border :columns="columns" :data="pageContent">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px"  @click="setAdmin('修改', row)">修改</Button>
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 15px;">
      <Page :total="page.total" :current="page.current" :pageSize="page.size" @on-change="changePage"></Page>
    </Row>

    <adminForm ref="adminForm" @load="load" />
  </Card>
</template>

<script>
import moment from 'moment'
import { queryAdmin } from '../../api/user'
import adminForm from './form'
import iviewTableDrag from '../../libs/iviewTableDrag'
export default {
  name: 'admin',
  components: { adminForm },
  data () {
    return {
      search: {
        name: '',
        role: 'admin'
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
          title: '创建时间',
          render: (h, params) => {
            return h('div', moment(params.row.createdAt).format('YYYY-MM-DD'))
          }
        },
        {
          title: '最后登录时间',
          render: (h, params) => {
            return h('div', moment(params.row.updatedAt).format('YYYY-MM-D'))
          }
        },
        {
          title: '状态',
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
      pageContent: []
    }
  },
  watch: {
    search: {
      handler () {
        let list = this.userList
        if (this.search) {
          list = list.filter(v => v.name.includes(this.search.name))
        }
        this.changePage(1, list)
      },
      deep: true
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
        this.changePage(1, res.data)
      }).catch(err => {
        this.$Notice.error({
          title: '管理员列表',
          desc: err.message
        })
      })
    },
    setAdmin (type, data) {
      this.$refs.adminForm.show(type, data, this.userList)
    }
  },
  created () {
    this.load()
  }
}
</script>

<style scoped>

</style>
