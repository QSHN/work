<template>
  <Card shadow style="height: 100%; overflow:auto; overflow-x: hidden;">
    <Row type="flex" justify="space-between" style="margin-bottom: 15px;">
      <Button type="success" @click="setApp('发布', null)">发布APP版本</Button>
    </Row>

    <Table border :columns="columns" :data="pageContent">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px"  @click="setApp('修改', row)">修改</Button>
        <Button type="error" size="small" style="margin-right: 5px"  @click="setApp('删除', row)">删除</Button>
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 15px;">
      <Page :total="page.total" :current="page.current" :pageSize="page.size" @on-change="changePage"></Page>
    </Row>

    <appForm ref="appForm" @load="load" />
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryApp, deleteApp } from '../../api/user'
import appForm from './form'
import iviewTableDrag from '../../libs/iviewTableDrag'
export default {
  name: 'app',
  components: { appForm },
  data () {
    return {
      page: {
        total: 1,
        current: 1,
        size: 20
      },
      columns: [
        {
          title: '版本号',
          key: 'code'
        },
        {
          title: '内部版本号',
          key: 'internalCode'
        },
        {
          title: '版本内容',
          key: 'content'
        },
        {
          title: '发布时间',
          render: (h, params) => {
            return h('div', moment(params.row.time).format('YYYY-MM-DD'))
          }
        },
        {
          title: '强制更新',
          render: (h, params) => {
            return h('div', params.row.isUpdate ? '是' : '否')
          }
        },
        {
          title: '启用',
          render: (h, params) => {
            return h('div', params.row.status ? '是' : '否')
          }
        },
        {
          title: '发布时间',
          render: (h, params) => {
            return h('div', moment(params.row.time).format('YYYY-MM-DD'))
          }
        },
        {
          title: '下载链接',
          key: 'down',
          width: 300
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
          width: 200,
          align: 'center'
        }
      ],
      appList: [],
      tableList: [],
      pageContent: []
    }
  },
  computed: {
    ...mapGetters([
      'myUser'
    ])
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
      queryApp().then(res => {
        this.appList = res.data
        this.changePage(1, res.data)
      }).catch(err => {
        this.$Notice.error({
          title: 'APP列表',
          desc: err.message
        })
      })
    },
    setApp (type, data) {
      if (this.myUser.name !== 'root') {
        this.$Notice.error({
          title: 'APP',
          desc: '您没有权限修改发布app'
        })
        return
      }
      if (type === '发布' || type === '修改') {
        this.$refs.appForm.show(type, data, this.appList)
      } else {
        this.$Modal.confirm({
          title: '删除APP',
          content: `是否删除APP：${data.code}`,
          onOk: () => {
            deleteApp({
              id: data._id
            }).then(res => {
              this.$Notice.success({
                title: '删除APP',
                desc: `成功删除APP：${data.code}`
              })
              this.load()
            }).catch(err => {
              this.$Notice.error({
                title: '删除APP',
                desc: err.message
              })
            })
          }
        })
      }
    }
  },
  created () {
    this.load()
  }
}
</script>

<style scoped>

</style>
