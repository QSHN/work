<template>
  <Layout style="height: 100%" class="main">
    <div  @mouseleave="mouseover(null)" class="side_layer">
      <Sider hide-trigger collapsible class="left-sider" :style="{overflow: 'hidden'}"  :class="{active: hoverIndex !== null}">
        <div class="logo">
          <img src="../../assets/images/logo.jpg" />
          <img src="../../assets/images/logo-min.jpg" />
        </div>

        <div class="side_list">
          <nav>
            <li v-for="(v, i) in sideBar" :key="v.id" @mouseover="mouseover(i)" :class="{active: i === hoverIndex}">
              <div class="icon">
                <img :src="getImgSrc(v.icon)" :style="{ width: v.icon === 'purchase' || v.icon === 'sale' || v.icon === 'use' ? '20px' : '26px' }" />
                <img :src="getImgSrc(v.icon + '1')" :style="{ width: v.icon === 'purchase' || v.icon === 'sale' || v.icon === 'use' ? '20px' : '26px' }" />
              </div>
              <p>{{ v.name }}</p>
              <Icon type="ios-arrow-forward"></Icon>
            </li>
          </nav>
        </div>

        <div class="collect">
          <div class="icon">
            <img :src="getImgSrc('collect')" />
            <img :src="getImgSrc('collect1')" />
          </div>
          <p>收藏</p>
          <Icon type="ios-arrow-forward"></Icon>
        </div>

        <div class="custom">
          自定义导航
        </div>
      </Sider>
      <div class="side_hover" v-if="hoverIndex !== null" :style="getStyle" :class="{active: showHover}">
        <div :style="getStyle" style="display: flex">
          <ul v-for="v in sideBar[hoverIndex].child" :key="v.id">
            <li v-if="sideBar[hoverIndex].child.length > 1" class="li_t"> {{ v.name }}</li>
            <li v-for="v1 in v.child" :key="v1.id" :class="{li_c: true, active: !v1.routeName}">
              <div @click="menuFun(v1.name, v1.routeName)">{{ v1.name}}</div>
              <div v-if="v1.search !== undefined" class="search_btn" @click="menuFun(v1.name, v1.search)">查看</div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Layout>
      <Header class="header-con">
        <header-bar>
          <div v-if="accountSet" class="account_set_info">
            {{accountSet.organization}}
            （
            <template v-if="accountSet.currentAccountingPeriod">
              {{accountSet.currentAccountingPeriod.split('-')[0]}}第{{accountSet.currentAccountingPeriod.split('-')[1]}}期
            </template>
            <template v-else>
              {{accountSet.accountingYear}}第{{accountSet.accountingPeriod}}期
            </template>
            ）
            <div @click="drawer = true">
              <Avatar :src="avatar" class="avatar"/>
            </div>
            <img src="../../assets/images/back.svg" title="返回主控制图" @click="$router.push({name: 'accountSetIndex'})" style="width: 26px; height: 26px; object-fit: cover; cursor: pointer; margin: 0 0 0 10px;" />
          </div>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
<!--            <keep-alive>-->
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>

    <theTrial ref="theTrial" />
    <finalTuning ref="finalTuning" />
    <carryForward ref="carryForward" />

    <Drawer :closable="false" v-model="drawer">
      <template slot="title"></template>
      <div class="drawer_layer">
        <div class="drawer_c">
          <div class="info">
            <div class="avatar">
              <img v-if="avatar" :src="avatar">
            </div>
            <div class="right">
              <div class="name">{{myUser.name}}</div>
              <template v-if="accountSet">
                <div class="name">{{accountSet.organization}}</div>
                <div class="name" >
                  <template v-if="accountSet.currentAccountingPeriod">
                    {{accountSet.currentAccountingPeriod.split('-')[0]}}第{{accountSet.currentAccountingPeriod.split('-')[1]}}期
                  </template>
                  <template v-else>
                    {{accountSet.accountingYear}}第{{accountSet.accountingPeriod}}期
                  </template>
                </div>
              </template>
            </div>
          </div>

          <div class="other">
            <div class="title">我的日程</div>
            <div class="calendar">
              <DatePicker size="small" type="date" placeholder="Select date"></DatePicker>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <span @click="$router.push({name: 'accountSetIndex'}), drawer = false" v-if="myUser && myUser.accountType !== '套账账户'">主控制台</span>
          <span @click="logOut">退出登录</span>
        </div>
      </div>
    </Drawer>
  </Layout>
</template>
<script>
// import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
// import User from './components/user'
import ABackTop from './components/a-back-top'
// import Fullscreen from './components/fullscreen'
// import Language from './components/language'
// import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import { getSignUrl } from '@/libs/aliyun'
// import minLogo from '@/assets/images/logo-min.jpg'
// import maxLogo from '@/assets/images/logo.jpg'
// import menuDrawer from './components/drawer'
import { sideBar } from '../../libs/sideBar'

import { updateAccountSet } from '../../api/accountSet'
import { credentialsPost, queryCredentials, invoicing } from '../../api/credentials'
import { funPermissionQuery } from '../../api/funPermission'
import theTrial from '../../view/subjectInit/theTrial'
import finalTuning from './components/drawer/finalTuning'
import carryForward from './components/drawer/carryForward'
import './main.less'
export default {
  name: 'Main',
  components: {
    // SideMenu,
    HeaderBar,
    // Language,
    TagsNav,
    // Fullscreen,
    // ErrorStore,
    // User,
    ABackTop,
    // menuDrawer
    theTrial,
    finalTuning,
    carryForward
  },
  data () {
    return {
      sideBar,
      isFullscreen: false,
      avatar: '',
      hoverIndex: null,
      showHover: false,
      drawer: false,
      funPermission: []
    }
  },
  computed: {
    ...mapGetters([
      'errorCount',
      'myUser',
      'accountSet',
      'myPermission'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    // userAvatar () {
    //   return this.$store.state.user.avatarImgPath
    // },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    // local () {
    //   return this.$store.state.app.local
    // },
    // hasReadErrorPage () {
    //   return this.$store.state.app.hasReadErrorPage
    // },
    // unreadCount () {
    //   return this.$store.state.user.unreadCount
    // }
    getStyle () {
      let style = {}
      if (this.hoverIndex !== null) {
        let height = 0
        const wHeight = window.innerHeight
        this.sideBar[this.hoverIndex].child.forEach(f => {
          if (f.child.length > height) height = f.child.length
        })
        height = height * 40 + (this.sideBar[this.hoverIndex].child.length > 1 ? 74 : 0)
        style.width = this.sideBar[this.hoverIndex].child.length * 184 + 24 + 'px'
        const top = this.hoverIndex * 48 + 56
        if (top + height + 10 > wHeight) {
          style.bottom = '10px'
          style.height = (wHeight - 10) + 'px'
        } else {
          style.top = top + 'px'
          style.height = height + 'px'
        }
      }
      return style
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'handleLogOut'
      // 'getUnreadMessageCount'
    ]),
    getImgSrc (name) {
      return require(`../../assets/images/workbench/${name}.svg`)
    },
    turnToPage (route) {
      if (this.myUser && this.myUser.useAccountSet) {
        let { name, params, query } = {}
        if (typeof route === 'string') name = route
        else {
          name = route.name
          params = route.params
          query = route.query
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name,
          params,
          query
        })
      }
    },
    funPermissionJudge (name) {
      let bool = false
      this.funPermission.forEach(f => {
        f.child.forEach(c => {
          c.child.forEach(cc => {
            if (cc.name === name) bool = cc.val
          })
        })
      })
      if (!bool) this.$Message.error('贵公司还没有购买该功能，请联系公司管理员')
      return bool
    },
    judge (name, action) {
      let bool = false
      let isFind = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === name) {
            isFind = true
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有查看${name}的权力，请联系管理员`)
            } else if (action === '查询') {
              bool = f.operation.find(f => f.val)
              if (!bool) this.$Message.error(`您没有操作${name}的权力，请联系管理员`)
            }
          }
        })
      }
      if (!isFind) bool = true
      return bool
    },
    menuFun (name, route) {
      if (!this.funPermissionJudge(name === '查业务凭证' ? '生成凭证' : name)) return
      if (name && route) {
        let accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
        if (route === 'generalLedgerInit' || route === 'generalLedgerUnInit') {
          if (!this.judge(name, route === 'generalLedgerInit' ? '结束初始化' : '反初始化')) return
          this.initModal(route)
        } else if (route === 'credentialsPost') {
          if (!this.judge(name, '过账')) return
          this.allPost()
        } else if (route === 'credentialsSubjectIndex') {
          if (!this.judge(name, '查询')) return
          this.$router.push({
            name: route,
            query: {
              accountSetId: this.accountSet._id,
              subjectCode: '1001',
              subject: '库存现金',
              accountingPeriod: accountingPeriod
            }
          })
        } else if (route === 'accountingDetailIndex') {
          if (!this.judge(name, '查询')) return
          this.$router.push({
            name: route,
            query: {
              accountSetId: this.accountSet._id,
              accountingPeriod: accountingPeriod
            }
          })
        } else if (route === 'numberAccountingDetailIndex') {
          if (!this.judge(name, '查询')) return
          this.$router.push({
            name: route,
            query: {
              accountSetId: this.accountSet._id,
              accountingPeriod: accountingPeriod
            }
          })
        } else if (route === 'finalTuning') {
          if (!this.judge(name, '期末调汇')) return
          this.$refs.finalTuning.show()
        } else if (route === 'carryForward') {
          if (!this.judge(name, '结转损益')) return
          this.$refs.carryForward.show()
        } else if (route === 'invoicing') {
          if (!this.judge(name, '期末结账')) return
          this.invoicingModal()
        } else {
          if (!this.judge(
            name === '查凭证' || name === '录凭证'
              ? '凭证'
              : name === '查业务凭证'
                ? '生成凭证'
                : name === '供应商初始数据'
                  ? '供应商'
                  : name === '客户初始数据'
                    ? '客户'
                    : name
            , '查询'
          )) return
          this.$router.push({
            name: route
          })
        }
      } else {
        this.$Notice.error({
          title: name,
          desc: '该功能还在研发中，敬请期待'
        })
      }
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    logOut () {
      this.handleLogOut().then(res => {
        this.drawer = false
        this.$router.push({
          name: 'login'
        })
      })
    },
    mouseover (id) {
      this.hoverIndex = id
      // console.log(id)
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
        if (res.data) this.funPermission = res.data.permission
      }).catch(err => {
        this.$Modal.error({
          title: '权限获取',
          content: err.message
        })
      })
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      // this.$refs.sideMenu.updateOpenName(newRoute.name)
    },
    'accountSet': {
      handler: function () {
        if (this.accountSet && this.accountSet.logo) {
          getSignUrl(this.accountSet.logo, (ret) => {
            if (ret instanceof Error) {
              this.avatar = require(`../../assets/images/avatar.jpg`)
            } else {
              this.avatar = ret
            }
            console.log(this.avatar)
          })
        } else {
          this.avatar = require(`../../assets/images/avatar.jpg`)
        }
      },
      deep: true,
      immediate: true
    },
    hoverIndex () {
      if (this.hoverIndex !== null && !this.showHover) {
        setTimeout(() => {
          this.showHover = true
        }, 10)
      } else if (this.hoverIndex === null) {
        this.showHover = false
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
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    // this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
