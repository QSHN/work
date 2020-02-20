<template>
  <card style="width: 100%; height: 100%">
    <Row type="flex" justify="space-between" style="margin-bottom: 15px">
      <Col span="12">
        <Button type="info" style="margin-right: 10px" @click="filterFun('all')">全部</Button>
        <Button type="primary" style="margin-right: 10px" @click="filterFun('release')">已发布</Button>
        <Button type="success" style="margin-right: 10px" @click="filterFun('unRelease')">未发布</Button>
      </Col>
      <Button icon="md-add" @click="$refs.announceModal.show(false, false)" :disabled="!IsCanCreate">添加公告</Button>
    </Row>
    <Table border :columns="columns" :data="status !== 'all' ? filterList : tableData" :loading="loading"></Table>
    <announce-modal ref="announceModal" @update="getAnnounce" />
    <modal-del ref="modalDel" :content="'确定真的要删除该公告吗'" :del="deleteAnnounce" />
  </card>
</template>

<script>
import { getAnnounce, setAnnounce, deleteAnnounce } from '@/api/announce.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
import announceModal from './components/announceModal'
import modalDel from '_c/modal-del/modal-del.vue'
export default {
  name: 'announcemgr',
  components: {
    announceModal,
    modalDel
  },
  data () {
    return {
      loading: true,
      columns: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '公告状态',
          sortable: true,
          render: (h, params) => {
            let val = '已发布'
            switch (params.row.publishType) {
              case 'TIMING':
                if (moment().isBefore(moment(params.row.publishTime))) {
                  val = '还没到发布时间'
                } else {
                  val = '已发布'
                }
                break
              case 'NOTYET':
                val = '未发布'
                break
            }
            return h('span', val)
          }
        },
        {
          title: '正文',
          key: 'content'
        },
        {
          title: '发布时间',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.publishTime && moment(params.row.publishTime).format('YYYY-MM-DD HH:MM:SS'))
          }
        },
        {
          title: '接收人',
          render: (h, params) => {
            let val = params.row.informationUserList.length ? `${params.row.informationUserList[0].name}等${params.row.informationUserList.length}人` : ''
            return h('span', val)
          }
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
                  type: 'info',
                  size: 'small'
                },
                style: {},
                on: {
                  click: () => {
                    this.$refs.announceModal.show(params.row, true)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: this.getUserInfo.role !== 'SUPERADMIN' && params.row.createId !== this.getUserInfo.id
                },
                style: {
                  marginLeft: '5px',
                  display: params.row.publish ? 'none' : 'inline-block'
                },
                on: {
                  click: () => {
                    this.$refs.announceModal.show(params.row, false)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  disabled: this.getUserInfo.role !== 'SUPERADMIN' && params.row.createId !== this.getUserInfo.id
                },
                style: {
                  marginLeft: '5px',
                  display: !params.row.publish ? 'none' : 'inline-block'
                },
                on: {
                  click: () => {
                    this.$Modal.warning({ title: '操作确认',
                      content: '您确定要撤回该公告吗？',
                      onOk: () => {
                        let data = Object.assign({}, params.row)
                        data.informationUserIds = params.row.informationUserList.map(v => v.id)
                        data.publishType = 'NOTYET'
                        data.publish = false
                        setAnnounce(data).then(res => {
                          this.getAnnounce()
                          this.$Notice.success({
                            title: '成功提示',
                            desc: '已撤回该通知公告'
                          })
                        }).catch((err) => {
                          if (err.errorMsg) {
                            this.$Notice.error({
                              title: '错误提示',
                              desc: err.errorMsg
                            })
                          }
                        })
                      }
                    })
                  }
                }
              }, '撤回'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: this.getUserInfo.role !== 'SUPERADMIN' && params.row.createId !== this.getUserInfo.id
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$refs.modalDel.open(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: [],
      filterList: [],
      status: 'all'
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ]),
    IsCanCreate () {
      let isBoss = this.getUserInfo.role === 'SUPERADMIN'
      let isDepartmentAdmin = this.getUserInfo.role === 'DEPARTMENTADMIN'
      let isAdministration = this.getUserInfo.permissions.filter(v => v.permissionGroup === 'ADMINISTRATION').length
      return isBoss || isDepartmentAdmin || isAdministration
    }
  },
  methods: {
    filterFun (status) {
      this.status = status
      switch (status) {
        case 'all':
          this.filterList = []
          break
        case 'release':
          this.filterList = this.tableData.filter(v => v.publish)
          break
        default:
          this.filterList = this.tableData.filter(v => !v.publish)
          break
      }
    },
    getAnnounce () {
      this.loading = true
      getAnnounce().then((res) => {
        this.tableData = res.data.UNPUBLISHED.concat(res.data.PUBLISHED)
        console.log('getAnnounce', this.tableData)
        this.filterFun(this.status)
        this.loading = false
      }).catch((err) => {
        if (err.errorMsg) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.errorMsg
          })
          this.loading = false
        }
      })
    },
    deleteAnnounce (id) {
      deleteAnnounce(id).then(res => {
        this.getAnnounce()
        this.$refs.modalDel.success('删除成功!')
      }).catch(err => {
        if (err.errorMsg) this.$refs.modalDel.error(err.message)
      })
    }
  },
  created () {
    this.getAnnounce()
  }
}
</script>

<style scoped>
</style>
