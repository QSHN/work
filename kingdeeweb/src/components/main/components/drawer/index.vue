<template>
  <Drawer width="530"
          :class="{drawer_layer: drawer, drawer_default: true}"
          placement="left"
          v-model="drawer"
          @cancel="hide"
          inner>
    <div class="box">
      <div class="left">
        <div class="l_t">
          {{drawerData.title}}
        </div>

        <div class="l_list_layer">
          <div style="flex-grow: 1; overflow: auto;">
            <div style="padding-right: 20px;">
              <div class="l_list" v-for="(v, i) in drawerData.children" :key="i">
                <div :class="{l_list_t: true, active: i === check[0] && checkDrown === i}" @click="checkFun(0, i)">
                  <span>{{v.title}}</span>
                  <Icon type="md-arrow-dropright" v-if="!(i === check[0] && checkDrown === i)" />
                  <Icon type="md-arrow-dropdown" v-else />
                </div>

                <div class="l_list_c" v-if="i === check[0] && checkDrown === i">
                  <div v-for="(item, index) in v.children" :key="index" :class="{item: true, active: index === check[1]}" @click="checkFun(1, index)">
                    <span>{{item.title}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="r_header">
          <Input search enter-button :size="'small'" placeholder="请输入功能" v-model="search" style="width: 190px; border-radius: 24px; overflow: hidden;" />
        </div>

        <div class="r_c">
          <div style="flex-grow: 1; overflow: auto;">
            <div v-if="drawerData.children && drawerData.children[check[0]]">
              <div class="r_list" v-for="(v, i) in search ? searchList : drawerData.children[check[0]].children[check[1]].children" :key="i">
                <div class="r_list_t">
                  {{v.title}}
                </div>

                <div class="r_list_c">
                  <div class="item" v-for="(item, index) in v.children" :key="index" v-if="!search || (search && item.title.includes(search))">
                    <span @click="turnToPage(item)" :style="{color: item.name ? '#000' : 'gray'}">{{item.title}}</span>
                    <div class="add">
                      <Icon type="md-add" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="no_search" v-if="search && searchList.length === 0">
                未搜索到记录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <theTrial ref="theTrial" />
    <finalTuning ref="finalTuning" />
    <carryForward ref="carryForward" />
  </Drawer>
</template>

<script>
import { basics } from '../../../../libs/basics'
import { financial } from '../../../../libs/financial'
import { mapGetters } from 'vuex'
import { updateAccountSet } from '../../../../api/accountSet'
import { credentialsPost, queryCredentials, invoicing } from '../../../../api/credentials'
import { funPermissionQuery } from '../../../../api/funPermission'
import theTrial from '../../../../view/subjectInit/theTrial'
import finalTuning from './finalTuning'
import carryForward from './carryForward'
export default {
  name: 'index',
  props: {
    which: {
      type: String,
      required: true
    }
  },
  components: {
    theTrial,
    finalTuning,
    carryForward
  },
  data () {
    return {
      basics,
      financial,
      drawer: false,
      drawerData: {},
      check: [],
      checkDrown: 0,
      search: '',
      searchList: [],
      permission: []
    }
  },
  computed: {
    ...mapGetters([
      'myPermission',
      'myUser',
      'adminList',
      'accountSet'
    ])
  },
  watch: {
    search () {
      if (this.search) {
        let list = []
        this.drawerData.children.forEach(v => {
          v.children.forEach(v1 => {
            v1.children.forEach(v2 => {
              v2.children.forEach(v3 => {
                if (v3.title.includes(this.search)) list.push(v2)
              })
            })
          })
        })
        this.searchList = list
      } else {
        this.searchList = []
      }
    },
    myUser: {
      handler () {
        if (this.myUser.companyId) this.load()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    checkFun (num, index) {
      if (num === 0) {
        this.checkDrown = this.checkDrown === index ? -1 : index
      }
      this.check[num] = index
      this.$forceUpdate()
    },
    show (type) {
      if (!this[type]) return
      this.drawer = true
      this.drawerData = this[type]
      this.$nextTick(() => {
        this.check = [0, 0]
      })
    },
    hide () {
      this.drawer = false
      this.drawerData = {}
      this.check = []
      this.checkDrown = 0
      this.search = ''
      this.searchList = []
    },
    turnToPage (item) {
      let isTurn = false
      // console.log(this.permission, this.myPermission)
      let isPermission = true
      if (this.which === 'financial') {
        // 财务
        if (this.check[1] === 0) {
          // 总账
          isPermission = this.permission.find(f => f.title === '总账').val
        } else if (this.check[1] === 1) {
          // 报表
          isPermission = this.permission.find(f => f.title === '报表').val
        }
      }
      if (!isPermission) return

      if (this.myUser.role === 'admin') {
        // 系统管理员
        isTurn = true
      } else {
        // 账套用户
        if (item.title === '用户管理') {
          // if (this.myInfo.manageP || this.myInfo.lookP) isTurn = true
        } else {
          if (this.adminList.includes(this.myUser._id)) {
            // 管理组
            isTurn = true
          } else {
            // 查看权限
            let pData = null
            if (this.which === 'basics') {
              if (this.check[1] === 0) {
                // 基础资料
                pData = this.myPermission.feature.find(v => v.title === '基础资料')
              } else if (this.check[1] === 1) {
                // 初始化项配置
                pData = this.myPermission.feature.find(v => v.title === '初始化项配置')
              }
            } else if (this.which === 'financial') {
              // 财务
              if (this.check[1] === 0) {
                // 总账
                pData = this.myPermission.feature.find(v => v.title === '总账')
              } else if (this.check[1] === 1) {
                // 报表
                pData = this.myPermission.feature.find(v => v.title === '报表')
              }
            }
            if (pData) {
              if (pData.checked || pData.children.filter(v => v.checked).length) isTurn = true
            }
          }
        }
      }
      if (isTurn) {
        if (item.name) {
          let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          if (item.name === 'generalLedgerInit' || item.name === 'generalLedgerUnInit') {
            this.initModal(item.name)
          } else if (item.name === 'credentialsPost') {
            this.allPost()
          } else if (item.name === 'credentialsSubjectIndex') {
            this.$router.push({
              name: item.name,
              query: {
                accountSetId: this.accountSet._id,
                subjectCode: '1001',
                subject: '库存现金',
                accountingPeriod: accountingPeriod
              }
            })
          } else if (item.name === 'accountingDetailIndex') {
            this.$router.push({
              name: item.name,
              query: {
                accountSetId: this.accountSet._id,
                accountingPeriod: accountingPeriod
              }
            })
          } else if (item.name === 'numberAccountingDetailIndex') {
            this.$router.push({
              name: item.name,
              query: {
                accountSetId: this.accountSet._id,
                accountingPeriod: accountingPeriod
              }
            })
          } else if (item.name === 'finalTuning') {
            this.$refs.finalTuning.show()
          } else if (item.name === 'carryForward') {
            this.$refs.carryForward.show()
          } else if (item.name === 'invoicing') {
            this.invoicingModal()
          } else {
            this.$router.push({
              name: item.name
            })
          }
          this.hide()
        } else {
          this.$Notice.error({
            title: item.title,
            desc: '该功能还在研发中，敬请期待'
          })
        }
      } else {
        this.$Notice.error({
          title: item.title,
          desc: '你没有权限， 请联系管理员'
        })
      }
    },
    updateSubject (name, text) {
      let formData = Object.assign({}, this.accountSet)
      formData.generalLedger = name === 'generalLedgerInit'
      updateAccountSet(formData).then(res => {
        this.$Notice.success({
          title: `初始数据录入`,
          desc: `成功${text}初始数据录入`
        })
        this.$store.dispatch('getAccountSet', formData._id)
      }).catch(err => {
        this.$Notice.error({
          title: `初始数据录入${text}`,
          desc: err.message
        })
      })
    },
    initModal (name) {
      let text = name === 'generalLedgerInit' ? '结束初始化' : '反初始化'
      this.$Modal.confirm({
        title: text + '——初始数据录入',
        content: `是否决定${text}`,
        onOk: () => {
          if (name === 'generalLedgerInit') {
            this.$refs.theTrial.loadSubject(() => {
              this.updateSubject(name, text)
            })
          } else {
            queryCredentials({
              post: '已过账',
              accountSetId: this.accountSet._id
            }).then(res => {
              if (res.data.length) {
                this.$Notice.error({
                  title: `初始数据录入${text}`,
                  desc: '已有过账凭证，无法反初始化'
                })
              } else {
                this.updateSubject(name, text)
              }
            }).catch(err => {
              this.$Notice.error({
                title: '凭证',
                desc: err.message
              })
            })
          }
        }
      })
    },
    allPost () {
      let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
      this.$Modal.confirm({
        title: '凭证过账',
        content: `确定过账${accountingPeriod}期所有凭证吗`,
        onOk: () => {
          credentialsPost({
            accountSetId: this.accountSet._id
          }).then(res => {
            this.$Notice.success({
              title: '凭证过账',
              desc: `${accountingPeriod}期所有凭证过账成功`
            })
          }).catch(err => {
            setTimeout(() => {
              this.$Modal.error({
                title: '凭证过账失败',
                content: err.message
              })
            }, 500)
          })
        }
      })
    },
    invoicingModal () {
      let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
      let isInvoicing = '结账'
      this.$Modal.confirm({
        title: '期末结账',
        render: (h) => {
          return h('div', [
            h('p', {
              style: {
                marginBottom: '10px'
              }
            }, `为了总结某一会计期间（年度或月度）的经营活动情况，必须顶起进行结账，结账就是把一定时期内发生的经济业务在全部登记入账的基础上，将各种账簿记录结出——本期发生额和期末余额，从而根据账簿记录编制会计报表`),
            h('p', {
              style: {
                marginBottom: '10px'
              }
            }, `在结账之前，应先检查本期发生的各种经济业务是否都已经编制记账凭证并登记入账。对各种类账户，也应当在结账前对余额进行结转，并登记入账。`),
            h('RadioGroup', {
              props: {
                value: isInvoicing
              },
              on: {
                input: (val) => {
                  isInvoicing = val
                }
              }
            }, [
              h('Radio', {
                props: {
                  label: '结账'
                }
              }),
              h('Radio', {
                props: {
                  label: '反结账'
                }
              })
            ])
          ])
        },
        onOk: () => {
          invoicing({
            accountSetId: this.accountSet._id,
            accountingPeriod: accountingPeriod,
            isInvoicing: isInvoicing
          }).then(res => {
            this.$Notice.success({
              title: `期末${isInvoicing}`,
              desc: `${accountingPeriod}期${isInvoicing}成功`
            })
            setTimeout(() => {
              location.reload()
            }, 1000)
          }).catch(err => {
            setTimeout(() => {
              this.$Modal.error({
                title: `期末${isInvoicing}`,
                content: err.message
              })
            }, 500)
          })
        }
      })
    },
    load () {
      funPermissionQuery({
        companyId: this.myUser.companyId
      }).then(res => {
        if (res.data) this.permission = res.data.permission
      }).catch(err => {
        this.$Modal.error({
          title: '权限获取',
          content: err.message
        })
      })
    }
  }
}
</script>

<style lang="less">
  .drawer_default {
    .ivu-drawer-mask {
      background: rgba(0, 0, 0, 0);
    }

    .ivu-drawer-wrap {
      bottom: 17px;
    }

    .ivu-drawer-content {
      border: 1px solid #bec4d0;
      border-left: none;
      box-shadow: none;

      .ivu-drawer-body {
        padding: 0;
      }

      .ivu-drawer-close {
        right: 0;
        top: 0;
      }
    }
  }

  .drawer_layer {
    position: fixed;
    left: 64px;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 99999;

    .box {
      display: flex;
      flex-direction: row;
      height: 100%;

      .left {
        width: 170px;
        height: 100%;
        background: #eaeef1;
        display: flex;
        flex-direction: column;

        .l_t {
          width: 130px;
          height: 54px;
          line-height: 54px;
          margin: 6px 0 0 10px;
          border-bottom: 1px solid #bec4d0;
          font-size: 16px;
          color: #4d8afa;
          min-height: 54px;
          padding-left: 4px;
        }

        .l_list_layer {
          flex-grow: 1;
          overflow: hidden;
        }

        .l_list {
          margin-top: 10px;
          padding-left: 10px;
        }

        .l_list_t {
          width: 140px;
          height: 30px;
          line-height: 30px;
          padding: 0 12px;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          border-radius: 5px;

          span {
            flex-grow: 1;
          }

          &.active,
          &:hover {
            background: #4d8afa;
            color: #fff;
          }
        }

        .l_list_c {
          padding: 4px 0 0 0;

          .item {
            width: 140px;
            height: 24px;
            line-height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 12px;
            color: #000;
            cursor: pointer;
            border-radius: 5px;
            padding-left: 10px;

            &:before {
              content: "";
              width: 1px;
              height: 100%;
              background: #bec4d0;
              display: block;
              margin-right: 20px;
            }

            &:hover {
              background: #4d8afa;
              color: #fff;

              &:before {
                content: "";
                width: 0;
                height: 0;
                border-top: 6px solid #4d8afa;
                border-right: 6px solid #4d8afa;
                border-bottom: 6px solid #4d8afa;
                border-left: 6px solid #ffff;
                display: block;
                margin-right: 9px;
              }
            }

            &.active,
            &.active:hover {
              color: #4d8afa;
              background: none;

              &:before {
                content: "";
                width: 0;
                height: 0;
                border-top: 6px solid #eaeef1;
                border-right: 6px solid #eaeef1;
                border-bottom: 6px solid #eaeef1;
                border-left: 6px solid #4d8afa;
                display: block;
                margin-right: 9px;
              }
            }
          }
        }
      }

      .right {
        flex-grow: 1;
        background: #f4f5f9;
        display: flex;
        flex-direction: column;

        .r_header {
          height: 60px;
          border-bottom: 1px solid #dee1e8;
          padding-left: 10px;
          display: flex;
          align-items: center;

          input {
            background: #dee1e8;
            border-top-left-radius: 24px;
            border-bottom-left-radius: 24px;
            overflow: hidden;
            color: #000;
            padding-left: 10px;

            &::-webkit-input-placeholder {
              color: #818794;
            }
          }
        }

        .r_c {
          flex-grow: 1;
          overflow: hidden;
          padding: 0 10px;

          .r_list {
            padding: 12px 0 6px;
            border-bottom: 1px solid #bec4d0;

            &:last-child {
              /*border-bottom: none;*/
            }

            .r_list_t {
              height: 34px;
              line-height: 34px;
              font-size: 12px;
              font-weight: bold;
              color: #4d8afa;
              padding: 0 8px;
            }

            .r_list_c {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;

              .item {
                width: 50%;
                height: 26px;
                line-height: 26px;
                font-size: 12px;
                color: #000;
                display: flex;
                flex-direction: row;
                align-items: center;
                cursor: pointer;

                span {
                  width: 140px;
                  height: 26px;
                  border-radius: 3px;
                  padding: 0 8px;
                  max-width: 140px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: normal;
                  display: block;
                }

                .add {
                  margin-left: 3px;
                  width: 20px;
                  height: 20px;
                  border-radius: 3px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  opacity: 0;

                  i {
                    font-size: 14px;
                    color: #000c17;
                  }

                  &:hover {
                    opacity: 1;
                    background: #34b674;

                    i {
                      color: #fff;
                    }
                  }
                }

                &:hover {
                  span {
                    background: #4d8afa;
                    color: #fff !important;
                  }

                  .add {
                    opacity: 1;
                  }
                }
              }
            }
          }

          .no_search {
            font-size:  16px;
            font-weight: bold;
            color: #4d8afa;
            margin: 15px 0 0 10px;
          }
        }
      }
    }
  }
</style>
