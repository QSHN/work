<!-- 文本输入框 -->
<template>
  <div class="text">
    <div class="emoji">
      <Tooltip content="发送表情"
               theme="light"
               placement="top">
        <Icon @click="showEmoji = !showEmoji"
              class="icon-look"
              type="md-happy" />
      </Tooltip>

      <Tooltip content="发送图片"
               theme="light"
               placement="top">
        <Icon @click="sendFile(true)"
              class="icon-look"
              type="md-images" />
      </Tooltip>

      <Tooltip content="发送文件"
               theme="light"
               placement="top">
        <Icon @click="sendFile(false)"
              class="icon-look"
              type="md-attach" />
      </Tooltip>

      <transition name="showbox">
        <div class="emojiBox"
             v-show="showEmoji"
             @mouseleave="showEmoji = false">
          <li v-for="(item, idx) in RongIMEmoji.list"
              :key="idx">
            <span v-html="RongIMEmoji.symbolToHTML(item.symbol)"
                  @click="insertEmoji(item.emoji)">
            </span>
          </li>
        </div>
      </transition>
    </div>
    <textarea ref="text"
              v-model="content"
              @keyup="onKeyup"
              @click="showEmoji = false"></textarea>
    <div class="send"
         @click="send">
      <span> {{beforeSendMsg ? '发送(Ent)' : '无法发送' }} </span>
    </div>
    <transition name="appear">
      <div class="warn"
           v-show="warn">
        <div class="description">不能发送空白信息</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { selectAndUpload } from '../../../libs/aliyun'
import { getConversationKey, fileType } from './util'

export default {
  data () {
    return {
      content: '',
      reply: '未找到',
      frequency: 0,
      warn: false,
      showEmoji: false,

      conversation: {
        conversationType: RongIMLib.ConversationType.PRIVATE, // 二人单聊会话类型，枚举值为 1
        draft: '' // rongcloud.cn文档中未说明，可能是草稿
      },
      // 是否发送
      isSend: true,
      RongIMEmoji: RongIMLib.RongIMEmoji
    }
  },
  computed: {
    ...mapGetters([
      'chatSession',
      'selectedConversation',
      'selectedGroup',
      'getUserInfo'
    ]),

    // 禁言检测
    beforeSendMsg () {
      if (!this.conversation || !this.conversation.conversationType) return false

      if (this.conversation.conversationType === RongIMLib.ConversationType.PRIVATE) {
        // 单人聊天无禁言
        return true
      } else if (this.conversation.conversationType === RongIMLib.ConversationType.GROUP) {
        // 先不做远程同步检测
        if (!this.selectedGroup || !this.selectedGroup.members || !this.selectedGroup.members.length) return false

        let member = this.selectedGroup.members.find(p => p.employeeId === this.getUserInfo.id)
        // 不在群里，禁言
        if (!member) return false
        // 白名单不受影响
        if (member.isIgnoreBanAll) return true
        // 被禁言返回错误值
        if (!this.selectedGroup.isBan && member.isBan) return false
        // 群主也受影响
        // if (this.selectedGroup.masterId === this.getUserInfo.id) return true
        // 上面已检测过白名单
        if (this.selectedGroup.isBan) return false
      }

      return true
    }
  },
  methods: {
    ...mapActions({
      SEND_MSG: 'IM_SEND_MSG',
      PUSH_MEG: 'IM_PUSH_MEG'
    }),

    // 按回车发送信息
    onKeyup (e) {
      if (!this.beforeSendMsg) return
      if (e.keyCode === 13) {
        this.send()
      }
    },

    // 点击发送按钮发送信息
    send () {
      // 禁言检测不通过
      if (!this.beforeSendMsg) return this.$Message.error('不能发送消息')

      if (this.content.length <= 1) {
        this.warn = true
        this.content = ''
        setTimeout(() => {
          this.warn = false
        }, 1000)
      } else {
        this.isSend = false
        this.SEND_MSG({
          content: { content: this.content },
          msgType: 'text',
          type: getConversationKey(this.conversation.conversationType),
          targetId: this.chatSession,
          onSuccess: msg => {
            this.PUSH_MEG(msg)
            this.content = ''
            this.isSend = true
          },
          onError: (msg, info) => {
            this.$Message.error('发送失败 ' + info)
            this.isSend = true
          }
        })
      }
    },

    sendFile (isImage) {
      // 禁言检测不通过
      if (!this.beforeSendMsg) return this.$Message.error('不能发送消息')

      // 不识别图片类型，允许图片作为文件上传
      let self = this
      let fileInfo
      selectAndUpload(file => {
        fileInfo = {
          // fileId: generateId(),
          name: file.name,
          size: file.size,
          type: fileType(file.name)
        }
      }, res => {
        if (!res || res instanceof Error) {
          console.error('Upload File to Aliyun : ', res)
          return this.$Message.error('上传文件失败，请稍后再试')
        }

        let content
        if (isImage) {
          content = { content: res, imageUri: res }
        } else {
          content = { name: fileInfo.name, size: fileInfo.size, type: fileInfo.type, fileUrl: res }
        }

        self.SEND_MSG({
          content,
          msgType: isImage ? 'image' : 'file',
          type: getConversationKey(self.conversation.conversationType),
          targetId: self.chatSession,
          onSuccess: msg => {
            self.PUSH_MEG(msg)
          },
          onError: (msg, info) => {
            debugger
            this.$Message.error(info)
            this.isSend = true
          }
        })
      })
    },

    insertEmoji (emoji) {
      let { selectionStart, selectionEnd, value } = this.$refs.text
      if (selectionStart === undefined || selectionEnd === undefined) return false
      // console.log({ selectionStart, selectionEnd, value })

      this.content = value.substring(0, selectionStart) + emoji + value.substring(selectionEnd)

      this.$refs.text.selectionStart = selectionStart + (this.content.length - value.length)
      this.$refs.text.selectionEnd = selectionEnd + (this.content.length - value.length)
    }
  },
  // 在进入的时候 聚焦输入框
  mounted () {
    this.$refs.text.focus()
  },
  watch: {
    // 在选择其它对话的时候 聚焦输入框
    chatSession () {
      setTimeout(() => {
        this.$refs.text.focus()
      }, 0)

      if (this.selectedConversation && this.selectedConversation.targetId) {
        this.conversation = this.selectedConversation
        console.log('Text Converstion %o', this.conversation)
      } else if (this.selectedGroup) {
        this.conversation = {
          conversationType: RongIMLib.ConversationType.GROUP // 群组会话类型，枚举值为 3
        }
      } else {
        this.conversation = {
          conversationType: RongIMLib.ConversationType.PRIVATE // 二人单聊会话类型，枚举值为 1
        }
      }
    },
    // 当输入框中的值为空时 弹出提示  并在一秒后消失
    content () {
      if (this.content === '') {
        if (this.frequency === 0) {
          this.warn = true
          this.frequency++
          setTimeout(() => {
            this.warn = false
          }, 1000)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  position: relative;
  // height: 150px;
  height: 240px;
  min-height: 150px;
  background: #fff;

  .emoji {
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    padding: 0 30px;
    box-sizing: border-box;
    color: #7c7c7c;

    .icon-look {
      display: inline-block;
      margin-right: 8px;
      font-size: 22px;
      line-height: 1.6;
      cursor: pointer;

      &:hover {
        color: #1aad19;
      }
    }

    .emojiBox {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      top: -310px;
      left: -100px;
      width: 400px;
      height: 300px;
      padding: 5px;
      background-color: #fff;
      border: 1px solid #d1d1d1;
      border-radius: 2px;
      box-shadow: 0 1px 2px 1px #d1d1d1;
      overflow: scroll;

      li {
        list-style: none;
        padding: 0;
        margin: 0px 8px;
        cursor: pointer;
      }

      &.showbox-enter-active,
      &.showbox-leave-active {
        transition: all 0.5s;
      }

      &.showbox-enter,
      &.showbox-leave-active {
        opacity: 0;
      }
    }
  }

  textarea {
    box-sizing: border-box;
    padding: 0 30px;
    height: 110px;
    width: 100%;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
  }

  .send {
    position: absolute;
    // bottom: 10px;
    bottom: 20px;
    right: 30px;
    width: 75px;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    background: #f5f5f5;
    font-size: 14px;
    color: #7c7c7c;

    &:hover {
      background: rgb(18, 150, 17);
      color: #fff;
    }
  }

  .warn {
    position: absolute;
    bottom: 50px;
    right: 10px;
    width: 110px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    text-align: center;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    box-shadow: 0 1px 5px 1px #bdbdbd;

    &.appear-enter-active,
    &.appear-leave-active {
      transition: all 1s;
    }

    &.appear-enter,
    &.appear-leave-active {
      opacity: 0;
    }

    &:before {
      content: " ";
      position: absolute;
      top: 100%;
      right: 20px;
      border: 7px solid transparent;
      border-top-color: #fff;
      filter: drop-shadow(1px 3px 2px #bdbdbd);
    }
  }
}
</style>
