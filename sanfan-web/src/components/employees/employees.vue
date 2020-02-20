<template>
  <Modal v-model="modal" width="600" :footer-hide="true" @on-cancel="close">
    <p slot="header">
      <span>{{modalData && modalData.name}}</span>
    </p>
    <div class="employees" style="min-height: 400px;">
      <div style="margin: 15px 0 20px;">
        <Tree :data="employees" :render="renderContent"></Tree>
      </div>
    </div>
    <personal-form ref="personal" />
  </Modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { changeRole } from '@/api/company'
import personalForm from '_c/personal-form/personal-form.vue'
export default {
  name: 'employees',
  components: {
    personalForm
  },
  data () {
    return {
      modal: false,
      modalData: null,
      employees: [
        {
          title: '',
          id: '',
          expand: true,
          render: (h, { root, node, data }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%',
                fontSize: '14px'
              }
            }, [
              h('span', [
                h('span', data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '7px'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-add'
                  }),
                  style: {
                    marginRight: '8px',
                    width: '64px',
                    display: this.organization && this.organization.id !== data.id ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$refs.personal.show(data, true)
                    }
                  }
                })
              ])
            ])
          },
          children: []
        }
      ],
      buttonProps: {
        type: 'default',
        size: 'small'
      }
    }
  },
  computed: {
    ...mapGetters([
      'organization',
      'departmentById'
    ])
  },
  watch: {
    organization: {
      handler: function (val, oldVal) {
        this.update()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'getOrganizationTree'
    ]),
    open (data) {
      console.log(data)
      this.modalData = data
      this.employees[0].title = data.name
      this.employees[0].id = data.id
      this.setEmployees(data.children, data.employees, this.employees[0].children)
      this.modal = true
    },
    close () {
      this.employees[0].children = []
      this.$forceUpdate()
      this.modal = false
    },
    update () {
      if (!this.employees[0].id) return
      let data = this.departmentById(this.employees[0].id) || this.organization
      // console.log('update', data)
      this.employees[0].children = []
      this.setEmployees(data.children, data.employees, this.employees[0].children)
    },
    setEmployees (children, employees, newData) {
      if (children && children.length) {
        children.map((v, i) => {
          let list = []
          this.setEmployees(v.children, v.employees, list)
          newData.push({
            id: v.id,
            title: v.name,
            expand: true,
            children: list
          })
        })
      }
      if (employees && employees.length) {
        employees.map((v, i) => {
          newData.push({
            uid: v.id,
            title: v.name,
            role: v.role
          })
        })
      }
      this.$forceUpdate()
    },
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
          fontSize: '14px'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: data.uid ? 'md-person' : 'ios-photos'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title),
          h('span', {
            domProps: {
              innerHTML: '超级管理员'
            },
            style: {
              fontSize: '12px',
              padding: '0 2px 0 2px',
              color: '#01B38B',
              border: 'solid 1px #01B38B',
              marginLeft: '8px',
              display: data.role === 'SUPERADMIN' ? 'inline-block' : 'none'
            }
          }),
          h('span', {
            domProps: {
              innerHTML: '管理员'
            },
            style: {
              fontSize: '12px',
              padding: '0 2px 0 2px',
              color: '#01B38B',
              border: 'solid 1px #01B38B',
              marginLeft: '8px',
              display: data.role === 'DEPARTMENTADMIN' ? 'inline-block' : 'none'
            }
          })
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '7px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              display: data.uid ? 'none' : 'inline-block',
              marginRight: '8px',
              width: '64px'
            },
            on: {
              click: () => {
                this.$refs.personal.show(data, true)
              }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'md-create'
            }),
            style: {
              display: !data.uid ? 'none' : 'inline-block',
              marginRight: '8px'
            },
            on: {
              click: () => {
                this.$refs.personal.show(data, false)
              }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'md-settings',
              disabled: data.role === 'SUPERADMIN'
            }),
            style: {
              display: !data.uid ? 'none' : 'inline-block',
              marginRight: '8px'
            },
            on: {
              click: () => {
                let isAdmin = data.role === 'DEPARTMENTADMIN'
                let ajaxData = {
                  ids: [data.uid],
                  role: isAdmin ? 'EMPLOYEE' : 'DEPARTMENTADMIN'
                }
                this.$Modal.confirm({
                  title: '设置管理员',
                  content: `<p style="color: ${isAdmin ? 'red' : 'black'}">${isAdmin ? '您要移除' + data.title + '管理员权限吗' : '确定将' + data.title + '设置成管理员吗'}</p>`,
                  loading: true,
                  onOk: () => {
                    changeRole(ajaxData).then((res) => {
                      this.getOrganizationTree()
                      this.$Modal.remove()
                    }).catch((err) => {
                      console.error('changeRole', err)
                      if (err.errorMsg) {
                        this.$Notice.error({
                          title: '错误提示',
                          desc: err.errorMsg
                        })
                      }
                      this.$Modal.remove()
                    })
                  },
                  onCancel: () => {}
                })
              }
            }
          })
        ])
      ])
    }
  }
}
</script>
