<template>
  <Card shadow style="height: 100%;width: 100%;overflow:auto">
    <template v-if="classify === '下属'">
      <employee-selector :multiple="false"
                         :range="'directlyEmployee'"
                         v-model="eSelect"
                         style="width: 300px;"/>
    </template>

    <Tabs v-model="tab">
      <TabPane :label="classify !== '下属' ? '部门' + classify : '下属客户'" name="department">
        <Table border :columns="classify !== '商家' ? columnsC : columnsS" :data="search ? searchList : departmentList" :loading="loading"></Table>
      </TabPane>

      <TabPane :label="classify !== '下属' ? '我的' + classify : '下属商家'" name="my">
        <Table border :columns="classify === '客户' ? columnsC : columnsS" :data="search ? searchList : myList" :loading="loading"></Table>
      </TabPane>

      <div slot="extra" style="padding-top: 5px;">
        <Input search clearable size="small" v-model="search" placeholder="搜索客户" style="float: left; width: 150px" />
        <Button size="small"
                style="margin-left: 10px; float: left"
                v-if="classify !== '下属'"
                @click="$refs.clientModal.show(false, false)">
          添加{{classify}}
        </Button>
      </div>
    </Tabs>

    <client-modal ref="clientModal" @update="getClient" :classify="classify" />
    <modal-del ref="modalDel" :content="'确定真的要删除该客户吗'" :del="deleteClient" />
  </Card>
</template>

<script>
import { getDepartmentClient, getMyClient, getDirectlyClient, deleteClient } from '@/api/client'
import { mapGetters, mapActions } from 'vuex'
import EmployeeSelector from '_c/employees/selector.vue'
import clientModal from './clientModal'
import modalDel from '_c/modal-del/modal-del.vue'
export default {
  name: 'clientTable',
  props: {
    classify: {
      type: String,
      required: true
    }
  },
  components: {
    EmployeeSelector,
    clientModal,
    modalDel
  },
  data () {
    return {
      tab: 'department',
      eSelect: '',
      departmentList: [],
      myList: [],
      search: '',
      searchList: [],
      columnsC: [
        {
          title: '客户名称',
          key: 'name',
          sortable: true
        },
        {
          title: '客户类型',
          key: 'typeName',
          sortable: true
        },
        {
          title: '客户等级',
          key: 'levelName',
          sortable: true
        },
        {
          title: '客户意向',
          key: 'intentionName',
          sortable: true
        },
        {
          title: '客户地址',
          render: (h, params) => {
            return h('span', params.row.address)
          }
        },
        {
          title: '所有者',
          render: (h, params) => {
            return h('span', this.possessor(params.row.belongToWhoID))
          }
        },
        {
          title: '经手人',
          key: 'operatorName'
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
                    this.$refs.clientModal.show(params.row, true)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$refs.clientModal.show(params.row, false)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: this.getUserInfo.role !== 'SUPERADMIN'
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
      columnsS: [
        {
          title: '商家名称',
          key: 'name',
          sortable: true
        },
        {
          title: '商家类型',
          key: 'typeName',
          sortable: true
        },
        {
          title: '商家等级',
          key: 'levelName',
          sortable: true
        },
        {
          title: '商家意向',
          key: 'intentionName',
          sortable: true
        },
        {
          title: '商家地址',
          render: (h, params) => {
            return h('span', params.row.address)
          }
        },
        {
          title: '所有者',
          render: (h, params) => {
            return h('span', this.possessor(params.row.belongToWhoID))
          }
        },
        {
          title: '经手人',
          key: 'operatorName'
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
                    this.$refs.clientModal.show(params.row, true)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$refs.clientModal.show(params.row, false)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: this.getUserInfo.role !== 'SUPERADMIN'
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
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'contacts'
    ])
  },
  watch: {
    tab () {
      this.search = ''
    },
    search () {
      this.searchList = []
      if (this.search) {
        let list = this.tab === 'department' ? this.departmentList : this.myList
        this.searchList = list.filter((v) =>
          v.name.includes(this.search) ||
          v.type.includes(this.search) ||
          v.grade.includes(this.search) ||
          v.intention.includes(this.search)
        )
      }
    },
    eSelect () {
      this.getClient()
    },
    contacts () {
      if (this.contacts.length) this.getClient()
    }
  },
  methods: {
    ...mapActions([
      'getContacts'
    ]),
    possessor (id) {
      let val = ''
      this.contacts.forEach(v => {
        if (v.departmentId === id) val = v.departmentName
        if (v.id === id) val = v.name
      })
      // console.log(val)
      return val
    },
    getClient () {
      let load = (L, data, isMe) => {
        return new Promise((resolve, reject) => {
          L(data).then(res => {
            // console.log(res.data)
            if (isMe) {
              this.departmentList = res.data
            } else {
              this.myList = res.data
            }
            this.loading = false
            resolve()
          }).catch(err => {
            if (err.errorMsg) this.$refs.modalDel.error(err.errorMsg)
            reject(err)
          })
        })
      }
      if (this.classify !== '下属') {
        load(getDepartmentClient, {
          clientGroup: this.classify === '商家' ? 'MERCHANT' : 'CLIENT'
        }, true)
        load(getMyClient, {
          clientGroup: this.classify === '商家' ? 'MERCHANT' : 'CLIENT'
        }, false)
      } else {
        if (!this.eSelect) {
          this.loading = false
          return
        }
        load(getDirectlyClient, {
          belongToWhoID: this.eSelect,
          clientGroup: 'CLIENT'
        }, true)
        load(getDirectlyClient, {
          belongToWhoID: this.eSelect,
          clientGroup: 'MERCHANT'
        }, false)
      }
    },
    deleteClient (id) {
      deleteClient(id).then(res => {
        this.getClient()
        this.$refs.modalDel.success('删除成功!')
      }).catch(err => {
        if (err.errorMsg) this.$refs.modalDel.error(err.errorMsg)
      })
    }
  },
  created () {
    if (!this.contacts.length) {
      this.getContacts()
    } else {
      this.getClient()
    }
  }
}
</script>

<style scoped>

</style>
