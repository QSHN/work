<template>
  <Card shadow style="height: 100%" class="message-page">
    <div style="height: 100%">
      <div class="message-page-con message-category-con">
        <div class="bt_con">
          <span style="margin-right: 20px;color: #000c17;color: #de4b4b;" @click="handleDelAll">清除所有</span>
          <span @click="handleReadAll">全部已读</span>
        </div>
        <Menu width="auto" active-name="unread" @on-select="handleSelect">
          <MenuItem name="unread">
            <span class="category-title">未读消息</span><Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
          </MenuItem>
          <MenuItem name="readed">
            <span class="category-title">已读消息</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageReadedCount"></Badge>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-list-con">
        <Spin fix v-if="listLoading" size="large"></Spin>
        <Menu
          width="auto"
          active-name=""
          :class="titleClass"
          @on-select="handleView"
        >
          <MenuItem v-for="item in messageList" :name="item.id" :key="`msg_${item.id}`">
            <div>
              <p class="msg-title">{{ item.title }}</p>
              <Badge status="default" :text="item.createTime" />
              <Button
                style="float: right;margin-right: 20px;"
                :style="{ display: item.loading ? 'inline-block !important' : '' }"
                :loading="item.loading"
                size="small"
                :icon="currentMessageType === 'readed' ? 'md-trash' : 'md-redo'"
                :title="currentMessageType === 'readed' ? '删除' : '还原'"
                type="text"
                v-show="currentMessageType !== 'unread'"
                @click.native.stop="removeMsg(item)"></Button>
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-view-con">
        <Spin fix v-if="contentLoading" size="large"></Spin>
        <div class="message-view-header">
          <h2 class="message-view-title">{{ showingMsgItem.title }}</h2>
          <time class="message-view-time">{{ showingMsgItem.createTime }}</time>
        </div>
        <div v-html="messageContent"></div>
      </div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
const listDic = {
  unread: 'messageUnreadList',
  readed: 'messageReadedList'
}
export default {
  name: 'message_page',
  data () {
    return {
      listLoading: true,
      contentLoading: false,
      currentMessageType: 'unread',
      messageContent: '',
      showingMsgItem: {}
    }
  },
  computed: {
    ...mapState({
      messageUnreadList: state => state.user.messageUnreadList,
      messageReadedList: state => state.user.messageReadedList,
      messageList () {
        return this[listDic[this.currentMessageType]]
      },
      titleClass () {
        return {
          'not-unread-list': this.currentMessageType !== 'unread'
        }
      }
    }),
    ...mapGetters([
      'messageUnreadCount',
      'messageReadedCount'
    ])
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getContentByMsgId',
      'getMessageList',
      'hasRead',
      'removeReaded',
      'restoreTrash',
      'removeAllMessage',
      'readAllMessage'
    ]),
    stopLoading (name) {
      this[name] = false
    },
    handleSelect (name) {
      this.currentMessageType = name
    },
    handleView (id) {
      this.contentLoading = true
      this.getContentByMsgId({ id }).then(content => {
        this.messageContent = content.content
        const item = this.messageList.find(item => item.id === id)
        if (item) this.showingMsgItem = item
        if (this.currentMessageType === 'unread') this.hasRead({ id })
        this.stopLoading('contentLoading')
      }).catch(() => {
        this.stopLoading('contentLoading')
      })
    },
    removeMsg (item) {
      item.loading = true
      const id = item.id
      if (this.currentMessageType === 'readed') {
        this.removeReaded({ id }).then(() => {
          if (this.showingMsgItem.id === id) {
            this.showingMsgItem = {}
            this.messageContent = ''
          }
        })
      } else {
        this.restoreTrash({ id })
      }
    },
    handleDelAll () {
      this.$Modal.confirm({ title: '操作确认',
        content: '您确定要删除全部消息吗？',
        onOk: () => {
          this.removeAllMessage().then(() => {
            this.showingMsgItem = {}
            this.messageContent = ''
          })
        }
      })
    },
    handleReadAll () {
      this.readAllMessage()
    }
  },
  mounted () {
    this.listLoading = true
    // 请求获取消息列表
    this.getMessageList().then(() => this.stopLoading('listLoading')).catch(() => this.stopLoading('listLoading'))
  }
}
</script>

<style lang="less">
  .message-page{
    .ivu-card-body {
      height: 100%;
    }
    &-con{
      height: 100%;
      display: inline-block;
      vertical-align: top;
      position: relative;
      &.message-category-con{
        border-right: 1px solid #e6e6e6;
        width: 200px;
        .bt_con{
          /*text-decoration:underline;*/
          border-bottom: 1px solid #e5e5e5;
          text-align: center;
          padding-bottom: 10px;
          width: 184px;
          font-size: 14px;
          margin-bottom: 20px;
          cursor: pointer;
        }
      }
      &.message-list-con{
        border-right: 1px solid #e6e6e6;
        width: 230px;
        overflow-y: auto;
      }
      &.message-view-con{
        position: absolute;
        left: 446px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
        .message-view-header{
          margin-bottom: 20px;
          .message-view-title{
            display: inline-block;
          }
          .message-view-time{
            margin-left: 20px;
          }
        }
      }
      .category-title{
        display: inline-block;
        width: 65px;
      }
      .gray-dadge{
        background: gainsboro;
      }
      .not-unread-list{
        .msg-title{
          color: rgb(170, 169, 169);
        }
        .ivu-menu-item{
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
            display: none;
          }
          &:hover{
            .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
