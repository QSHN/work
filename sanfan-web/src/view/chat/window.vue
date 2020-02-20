<template>
  <div class="chat-main">
    <div class="sidebar">
      <!-- 最左边的选择框 -->
      <div class="mycard">
        <header>
          <Avatar icon="ios-person"
                  size="large"
                  shape="square"
                  class="avatar"
                  :src="getUserInfo.smallAvatar"></Avatar>
        </header>
        <div class="navbar"
             @click="clearSearch">
          <div class="icon icon-msg ivu-icon ivu-icon-md-chatbubbles"
               :class="{'active':chatTag === 'chat' }"
               @click="changeTab('chat')"></div>
          <div class="icon icon-friend ivu-icon ivu-icon-md-people"
               :class="{'active':chatTag === 'friend' }"
               @click="changeTab('friend')"></div>
        </div>
        <!--  <footer>
          <i class="icon iconfont icon-more"></i>
          <ul class="more">
            <li>意见反馈</li>
            <li>备份与恢复</li>
            <li>设置</li>
          </ul>
        </footer> -->
      </div>
    </div>
    <div class="main">
      <Friend v-show="chatTag === 'friend'" />
      <Chat v-show="chatTag === 'chat'" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Friend from './friend.vue'
import Chat from './chat.vue'

export default {
  name: 'ChatMain',
  components: {
    Friend,
    Chat
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'personnel',
      'chatTag',
      'chatFriendList'
    ])
  },
  data () {
    return {
      userAvatarUrl: ''
    }
  },
  methods: {
    ...mapMutations({
      changeTab: 'IM_CHANGE_TAG'
    }),

    clearSearch () {
      this.$store.dispatch('IM_SEARCH', '')
    }
  },
  created () {
    let self = this
    this.$store.dispatch('IM_INIT').then(() => {
      return self.$store.dispatch('IM_LOGIN')
    })

    // 初始化对话框列表
    if (this.chatFriendList && this.chatFriendList.length) return null
    // 调用 Action
    this.$store.dispatch('IM_INIT_FRIEND_LIST')
  }
}
</script>

<style lang="less" scoped>
body {
  background: #ddd;
}
.chat-main {
  display: flex;
  // border-radius: 50px;
  // margin: 20px auto;
  // margin: auto;
  // width: 1100px;
  height: 100%;
  min-width: 800px;
  min-height: 600px;
  background-color: #fff;

  box-shadow: 0 0 10px 2px #999;
  border-radius: 4px;
  overflow: hidden;

  .sidebar {
    width: 60px;
    // height: 600px;
    height: 100%;
    background: #2b2c2f;

    .mycard {
      position: relative;
      width: 100%;
      height: 100%;
      .avatar {
        width: 36px;
        height: 36px;
        margin: 20px 12px 0 12px;
        border-radius: 2px;
      }
      .navbar {
        width: 100%;
        text-align: center;
      }
      .icon {
        display: inline-block;
        font-size: 32px;
        margin-top: 28px;
        padding: 0 6px;
        box-sizing: border-box;
        color: rgb(173, 174, 175);
        opacity: 0.8;
        cursor: pointer;
        &.active {
          color: rgb(0, 220, 65);
        }
        &:hover {
          opacity: 1;
        }
      }
      // .icon-msg,
      // .icon-more {
      //   font-size: 22px;
      // }
      // .icon-msg {
      //   padding: 0 19px;
      // }
      footer {
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
        .more {
          position: absolute;
          width: 130px;
          height: 150px;
          left: 60px;
          color: #9e9696;
          font-size: 14px;
          bottom: 5px;
          background: #2f2e2e;
          z-index: 3;
          li {
            line-height: 50px;
            text-align: left;
            padding-left: 10px;
            &:hover {
              background: #3a3939;
            }
          }
        }
      }
    }
  }

  .main {
    flex: 1;
    // height: 600px;
    height: 100%;
    background: #f2f2f2;
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
