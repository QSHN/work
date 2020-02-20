<template>
  <div class="content">
    <div class="msglist">
      <search></search>
      <chatlist></chatlist>
    </div>
    <div class="chatbox"
         v-show="chatSession !== ''">
      <message @openDrawer="setDrawer" />
      <v-text />
    </div>
    <Drawer :closable="false"
            :scrollable="true"
            class-name="chat-drawer"
            width="360"
            v-model="showDrawer">
      <!-- 单聊  -->
      <s-drawer v-if="conversation.conversationType === 1"
                @closeDrawer="showDrawer = false" />
      <!-- 群聊 -->
      <g-drawer v-if="conversation.conversationType === 3" />
    </Drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import search from './components/search.vue'
import chatlist from './components/chatlist.vue'
import message from './components/message.vue'
import vText from './components/text.vue'
import sDrawer from './components/singleDrawer.vue'
import gDrawer from './components/groupDrawer.vue'
export default {
  components: {
    search,
    chatlist,
    message,
    vText,
    sDrawer,
    gDrawer
  },
  data () {
    return {
      showDrawer: false,
      conversation: {
        conversationType: 1
      }
    }
  },
  computed: {
    ...mapGetters(['chatSession'])
  },
  methods: {
    // 获取是哪种对话类型触发的抽屉操作
    setDrawer (cvst) {
      this.conversation = cvst
      if (!this.conversation || !this.conversation.conversationType) {
        this.$Message.info('该对话无更多操作')
      } else {
        this.showDrawer = true
      }
    }
  },
  created () {
    this.$store.dispatch('IM_CHAT_LIST')
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  width: 100%;
  height: 100%;

  .msglist {
    width: 250px;
    background: rgb(230, 230, 230);
  }

  .chatbox {
    flex: 1;
  }
}
</style>
<style>
/* 设置滚动条的样式 */
.chat-drawer .ivu-drawer-body::-webkit-scrollbar {
  width: 8px;
}
/* 滚动条滑块 */
.chat-drawer .ivu-drawer-body::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
