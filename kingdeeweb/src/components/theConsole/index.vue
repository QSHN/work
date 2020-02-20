<template>
  <Layout style="height: 100%" class="theConsole">
    <Layout>
      <Header class="header-con">
        <div v-if="company" class="account_set_info">
          {{ company.companyName }}

          <img src="../../assets/images/exit.svg" title="退出登录" @click="logOut" />
        </div>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <Menu mode="horizontal" :active-name="$route.name"  @on-select="go">
              <MenuItem name="accountSetIndex">
                账套管理
              </MenuItem>
              <MenuItem name="accountIndex">
                用户管理
              </MenuItem>
            </Menu>
            <!--<keep-alive :include="cacheList">-->
            <keep-alive>
              <router-view :company="company" />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import HeaderBar from '../main/components/header-bar'
import { mapGetters, mapActions } from 'vuex'
import { queryCompany } from '../../api/_backstage'
export default {
  name: 'theConsole',
  components: {
    HeaderBar
  },
  data () {
    return {
      company: null
    }
  },
  computed: {
    ...mapGetters([
      'myUser'
    ])
  },
  watch: {
    myUser: {
      handler () {
        if (this.myUser && this.myUser.companyId) {
          this.loadCompany()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    loadCompany () {
      queryCompany({ _id: this.myUser.companyId }).then(res => {
        this.company = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '获取公司信息',
          desc: err.message
        })
      })
    },
    logOut () {
      this.handleLogOut().then(res => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    go (name) {
      // console.log(name)
      this.$router.push({
        name: name
      })
    }
  }
}
</script>

<style lang="less">
.theConsole {

  .header-con{
    background: #fff;
    padding: 0 20px;
    width: 100%;
  }
  .main-layout-con{
    height: 100%;
    overflow: hidden;
  }
  .main-content-con{
    height: ~"calc(100% - 60px)";
    overflow: hidden;
  }
  .tag-nav-wrapper{
    padding: 0;
    height:40px;
    background:#F0F0F0;
  }
  .content-wrapper{
    padding: 18px;
    height: ~"calc(100% - 80px)";
    overflow: auto;
  }

  .account_set_info {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 26px;
      height: 26px;
      object-fit: cover;
      cursor: pointer;
    }
  }

  .ivu-menu-item > i{
    margin-right: 12px !important;
  }
  .ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
    margin-right: 8px !important;
  }
  .collased-menu-dropdown{
    width: 100%;
    margin: 0;
    line-height: normal;
    padding: 7px 0 6px 16px;
    clear: both;
    font-size: 12px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
    &:hover{
      background: rgba(100, 100, 100, 0.1);
    }
    & * {
      color: #515a6e;
    }
    .ivu-menu-item > i{
      margin-right: 12px !important;
    }
    .ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
      margin-right: 8px !important;
    }
  }

  .ivu-select-dropdown.ivu-dropdown-transfer{
    max-height: 400px;
  }

  .ivu-layout-header {
    height: 56px !important;
    line-height: 56px !important;
  }
}
</style>
