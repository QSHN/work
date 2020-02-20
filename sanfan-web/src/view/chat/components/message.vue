<template>
  <div class="message">
    <header class="header">
      <div class="friend-name">{{conversationTitle}}</div>
      <div class="close-message"
           @click="$emit('openDrawer', conversation)">
        <Icon size="22"
              type="ios-more"
              color="#7c7c7c" />
      </div>
    </header>
    <div class="message-wrapper"
         ref="list">
      <ul v-if="chatRecord">
        <li v-for="(item, idx) in chatRecord"
            :key="idx"
            class="message-item">
          <div class="time">
            <span v-if="getTimeTip(item.sentTime, idx)">{{getTimeTip(item.sentTime, idx)}}</span>
          </div>
          <!-- <div class="time">
            <span v-if="item.messageType === 'RecallCommandMessage'">撤回了一条消息</span>
          </div> -->
          <div class="message-main"
               :class="{ 'self': item.messageDirection === 1 }"
               v-if="item.messageType !== 'RecallCommandMessage'">
            <!--判断是否是自己-->

            <Avatar icon="ios-person"
                    size="large"
                    shape="square"
                    class="avatar"
                    :src="getAvatar(item)" />
            <div :class="{'image-message': item.messageType === 'ImageMessage' }"
                 class="content">
              <template v-if="item.messageType === 'TextMessage'">
                <Tooltip placement="left"
                         theme="light"
                         :disabled="item.messageDirection !== 1">
                  <span @click="delMessage(item)"
                        class="del-message"
                        slot="content">撤回</span>
                  <div v-html="emojiToHTML(item.content.content)"
                       class="text"></div>
                </Tooltip>
              </template>

              <template v-else-if="item.messageType === 'FileMessage'">
                <Poptip :placement="item.messageDirection === 1 ? 'left' : 'right'"
                        @on-popper-show="initFileUrl(item)"
                        padding="8px 8px">
                  <CellGroup class="pop-btns"
                             slot="content">
                    <Cell v-if="item.messageDirection === 1"
                          @click.native="delMessage(item)"
                          title="撒回" />
                    <Cell @click.native="downloadFile"
                          title="下载" />
                    <!-- 原生先不处理预览，没有获取token的接口 -->
                    <!-- <Cell @click.native="previewFile"
                          :disabled="!ablePreview"
                          title="预览">
                      <Spin v-if="!ablePreview"
                            size="small"
                            slot="icon" />
                    </Cell> -->
                  </CellGroup>
                  <div class="text">
                    <div class="file-card">
                      <div class="file-text">
                        <span class="file-name">{{item.content.name}}</span>
                        <span class="file-size">{{fileSize(item.content.size)}}</span>
                      </div>
                      <img :src="fileIcon(item.content.type)"
                           class="file-img" />
                    </div>
                  </div>
                </Poptip>
              </template>

              <template v-else-if="item.messageType === 'ImageMessage'">
                <Tooltip placement="left"
                         theme="light"
                         :disabled="item.messageDirection !== 1">
                  <span @click="delMessage(item)"
                        class="del-message"
                        slot="content">撤回</span>
                  <div @click="previewImage(item)"
                       class="text">
                    <!--
                      如果没有 fullPaht 那么就触发 getItemImage
                      @error 触发比较麻烦
                    -->
                    <img :src="item.content.fullPath || getItemImage(item)"
                         class="msg-img" />
                  </div>
                </Tooltip>
              </template>
            </div>
            <template v-if="conversation.conversationType === 1 && !item.offLineMessage && item.messageDirection === 1">
              <div class="is-read">{{ getIsread(item.receivedStatus) }}</div>
              <!-- 插入一个占位符 -->
              <div>&nbsp;</div>
            </template>
          </div>
        </li>
      </ul>
    </div>

    <Modal :title="downloadName"
           v-model="showImgPreview">
      <img :src="previewUrl"
           v-if="ablePreview"
           style="width: 100%">
    </Modal>

    <!-- 下载文件 -->
    <a id="downloadform"
       style="display:none;"
       target="_blank"></a>

  </div>
</template>

<script>
import moment from 'dayjs'
import { mapGetters, mapActions } from 'vuex'
// import { query, create, updateLastTime } from '@/api/chat'
// import { preview } from '@/api/utils'
import { getSignUrlPromise, fileIcon, fileSize, isImage, canPreview } from './util.js'

const TIME_TIP_GAT = 15 * 60 * 1000 // 15分钟
const ONE_MINUTE = 60 * 1000
const TODAY = new Date()
TODAY.setHours(0)
TODAY.setMinutes(0)
TODAY.setSeconds(0)

export default {
  computed: {
    ...mapGetters([
      'chatSession',
      'selectedChat',
      'getHistoryMessages',
      'selectedConversation',
      'selectedChatFriend',
      'selectedGroup',
      'getUserInfo'
    ]),

    getTimeTip () {
      return (curr, index) => {
        if (index >= 1) {
          let ref = this.chatRecord[index - 1].sentTime
          if (TIME_TIP_GAT > Math.abs(curr - ref)) return ''
        }

        if (curr < TODAY) {
          return moment(curr).format('MM-DD HH:MM')
        } else {
          let gap = curr - this.openTime
          if (gap < 0) {
            return moment(curr).format('HH:MM')
          } else {
            // 无法实时刷新
            return Math.ceil((Date.now() - curr) / ONE_MINUTE) + '分钟前'
          }
        }
      }
    },

    //  在发送信息之后，将输入的内容中属于表情的部分替换成emoji图片标签
    //  再经过v-html 渲染成真正的图片

    emojiToHTML () {
      return message => RongIMLib.RongIMEmoji.emojiToHTML(message)
    },

    getIsread () {
      return st => parseInt(st, 10) === 1 ? '已读' : '未读'
    },

    // ===================== 群聊 ========================

    getAvatar () {
      let self = this
      return item => {
        if (item.messageDirection === 1) return self.getUserInfo.smallAvatar
        if (self.selectedChatFriend) return self.selectedChatFriend.smallAvatar
        if (item.senderUserId && self.selectedGroup && self.selectedGroup.members &&
          self.selectedGroup.members.length) {
          let friend = self.selectedGroup.members.find(
            p => p.employeeId === item.senderUserId
          )
          return friend ? friend.smallAvatar : ''
        }
        return ''
      }
    },

    conversationTitle () {
      if (this.selectedChatFriend) return this.selectedChatFriend.name
      if (this.selectedGroup) return this.selectedGroup.name
      return ''
    }
  },
  data () {
    return {
      // 页面打开时间
      openTime: new Date(),
      // 页面刷新控线
      otHandler: 0,
      // 用来渲染对话
      conversation: {
        friend: {
          name: '',
          avatarUrl: ''
        }
        // sentStatus: 0 // 会话状态
      },
      // 真正渲染的消息列表
      chatRecord: [],
      // 下载url
      downloadUrl: '',
      // 下载文件名
      downloadName: '',
      // 预览url
      previewUrl: '',
      // 是否是图片
      isImageFile: false,
      // 是否可预览
      ablePreview: false,
      // 图片预览窗口
      showImgPreview: false
    }
  },
  watch: {
    chatSession () {
      this.init()
    },
    // 自动滚动，并已读
    chatRecord (val, oldVal) {
      this.gotoBottom()

      if (val.length) {
        this.READ_MEG_ALL(this.chatSession)
      }
    }
  },
  methods: {
    ...mapActions({
      PUSH_MEG: 'IM_PUSH_MEG',
      READ_MEG_ALL: 'IM_READ_MEG_ALL',
      CLEAR_UNREAD: 'IM_CLEAR_UNREAD',
      DEL_MEG: 'IM_DEL_MEG'
    }),

    init () {
      if (this.selectedConversation && this.selectedConversation.targetId) {
        this.conversation = this.selectedConversation

        this.chatRecord = this.selectedChat

        let self = this

        this.getHistoryMessages(this.conversation.conversationType).then(({ list, hasMsg }) => {
          // 之前已插入到列表里则整段历史记录跳过
          if (list.some(msg => self.chatRecord.some(m => msg.messageUId === m.messageUId))) return null

          self.chatRecord.unshift(...list)

          // 需要排序
          self.chatRecord.sort((a, b) => a.sentTime - b.sentTime)

          self.CLEAR_UNREAD(self.chatSession)

          // query(self.chatSession).then(res => {
          //   if (!res.data.id) {
          //     create({ targetId: self.chatSession })
          //   }
          // })
          // updateLastTime(self.chatSession)

          // self = undefined
        })
      } else if (this.selectedChatFriend && this.selectedChatFriend.id) {
        this.chatRecord = this.selectedChat
        this.conversation = {
          friend: this.selectedChatFriend,
          targetId: this.chatSession,
          conversationType: RongIMLib.ConversationType.PRIVATE // 单聊会话类型，枚举值为 1
        }
        // query(this.chatSession).then(res => {
        //   if (!res.data.id) {
        //     create({ targetId: this.chatSession })
        //   }
        // })
        // updateLastTime(this.chatSession)
      } else if (this.selectedGroup) {
        this.chatRecord = this.selectedChat
        this.conversation = {
          // 先用自己顶替一下
          friend: this.getUserInfo,
          targetId: this.chatSession,
          conversationType: RongIMLib.ConversationType.GROUP // 群组会话类型，枚举值为 3
        }
      } else {
        this.chatRecord = []
        this.conversation = {
          friend: {
            name: '',
            avatarUrl: ''
          }
          // sentStatus: 0 // 会话状态
        }
      }
    },

    gotoBottom () {
      setTimeout(() => { this.$refs.list.scrollTop = this.$refs.list.scrollHeight }, 0)
    },

    // 关闭会话
    closeConversation () {
      if (!this.conversation.conversationType) return null
      this.$store.dispatch('IM_DEL_CHAT', {
        'conversationType': this.conversation.conversationType,
        'targetId': this.chatSession
      })
    },

    // 删除信息
    delMessage (item) {
      this.DEL_MEG(item)
    },

    getItemImage (item) {
      getSignUrlPromise(item.content.imageUri).then(url => {
        item.content.fullPath = url
        this.$forceUpdate()
        this.$nextTick(() => {
          this.gotoBottom()
        })
      })
    },

    fileIcon (fileType) {
      return fileIcon(fileType)
    },

    fileSize (fileByte) {
      return fileSize(fileByte)
    },

    // 文件对象Url初始化
    initFileUrl (item) {
      this.downloadName = this.downloadUrl = this.previewUrl = ''
      this.isImageFile = this.ablePreview = false

      if (isImage(item.content.type)) {
        this.isImageFile = true

        // 名字没起好
        getSignUrlPromise(item.content.fileUrl).then(url => {
          this.downloadUrl = this.previewUrl = url
          this.downloadName = item.content.name
          this.ablePreview = true
        })
      } else if (canPreview(item.content.type)) {
        this.isImageFile = false
        let self = this

        getSignUrlPromise(item.content.fileUrl).then(url => {
          self.downloadUrl = url
          self.downloadName = item.content.name
        })

        // 端暂时不做预览功能，原生后端没有提供之前的接口
        // preview(item.content.fileUrl).then(resp => {
        //   let url = (resp.data && resp.data.TgtUri) || ''
        //   if (!url) {
        //     console.error('preview url not found')
        //     return self.$Message.error('预览生成失败')
        //   }

        //   getPreviewUrlPromise(url).then(rst => {
        //     self.previewUrl = rst
        //     self.ablePreview = true
        //   }).catch(error => {
        //     console.error('Get Preview url failed From Aliyun', error)
        //     self.$Message.error('预览获取失败')
        //   })
        // })
      }
    },

    downloadFile () {
      if (!this.downloadUrl) return this.$Message.error('该文件无法下载')

      let a0 = document.getElementById('downloadform')
      a0.download = this.downloadName
      a0.href = this.downloadUrl
      a0.click() // 触发click模拟下载
    },

    previewFile () {
      if (!this.ablePreview) return this.$Message.error('该文件无法预览')

      if (this.isImageFile) {
        this.showImgPreview = true
      } else {
        let a0 = document.getElementById('downloadform')
        a0.download = this.downloadName
        a0.href = this.previewUrl
        a0.click() // 触发click模拟下载
      }
    },

    previewImage (item) {
      this.previewUrl = item.content.fullPath
      this.ablePreview = true
      this.showImgPreview = true
    }

  },
  mounted () {
    console.log('chatSession', this.chatSession)
    this.init()
    //  在页面加载时让信息滚动到最下面
    // scrollTop获取位于对象最顶端和窗口中可见内容的最顶端之间的距离  scrollHeight获取对象的滚动高度
    if (this.$refs.list && this.$refs.list.scrollHeight) return setTimeout(() => { this.$refs.list.scrollTop = this.$refs.list.scrollHeight }, 0)
  },
  created () {
    // 分钟显示
    this.openTime.setMilliseconds(-TIME_TIP_GAT)
    // 每分钟更新刷新时间
    this.otHandler = setInterval(() => {
      this.openTime.setMilliseconds(ONE_MINUTE)
    }, ONE_MINUTE)
  },
  destroyed () {
    clearInterval(this.otHandler)
  }
}
</script>

<style lang="less" scoped>
@textH: 240px; // 文本框预留高度
@avatarH: 62px;
@avatarW: 78px;
.message {
  width: 100%;
  // height: 450px;
  height: 600px;
  max-height: 660px;
  .header {
    height: 60px;
    padding: 28px 0 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    .friend-name {
      display: inline-block;
      font-size: 18px;
    }

    .close-message {
      display: block;
      float: right;
      margin-right: 2em;
      line-height: 1;
      cursor: pointer;
    }
  }
  .message-wrapper {
    // min-height: 390px;
    // max-height: 390px;
    min-height: 540px;
    max-height: 540px;
    padding: 10px 15px;
    box-sizing: border-box;
    overflow-y: auto;
    border-bottom: 1px solid #e7e7e7;
    .message-item {
      margin-bottom: 15px;
    }
    .time {
      width: 100%;
      font-size: 12px;
      margin: 7px auto;
      text-align: center;
      span {
        display: inline-block;
        padding: 4px 6px;
        color: #fff;
        border-radius: 3px;
        background-color: #dcdcdc;
      }
    }
    .message-main {
      .avatar {
        float: left;
        margin-left: 15px;
        border-radius: 3px;
      }
      .content {
        display: inline-block;
        margin-left: 10px;
        position: relative;
        padding: 6px 10px;
        max-width: 330px;
        min-height: 36px;
        line-height: 24px;
        box-sizing: border-box;
        font-size: 14px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        &:before {
          content: " ";
          position: absolute;
          top: 12px;
          right: 100%;
          border: 6px solid transparent;
          border-right-color: #fafafa;
        }
      }

      .content.image-message {
        background-color: #fff;
        &:before {
          border-right-color: #fff;
        }
      }

      .file-card {
        min-width: 160px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .file-text {
          min-height: 56px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          .file-name {
            line-height: 1;
            font-weight: 700;
          }
          .file-size {
            color: #999;
            font-size: 12px;
          }
        }
        .file-img {
          width: 60px;
          height: 60px;
        }
      }

      .msg-img {
        max-width: 200px;
        max-height: 100px;
        margin-top: 4px;
      }
    }
    .self {
      text-align: right;
      position: relative;

      .avatar {
        float: right;
        margin: 0 15px;
      }

      .is-read {
        position: absolute;
        right: @avatarW;
        line-height: 2.4;
        color: #999;
      }
      .content {
        background-color: #b2e281;
        &:before {
          right: -12px;
          vertical-align: middle;
          border-right-color: transparent;
          border-left-color: #b2e281;
        }
      }
      .content.image-message {
        background-color: #fff;
        &:before {
          border-right-color: transparent;
          border-left-color: #fff;
        }
      }

      .del-message {
        cursor: pointer;
      }
    }
  }
}

li {
  list-style: none;
}
</style>
