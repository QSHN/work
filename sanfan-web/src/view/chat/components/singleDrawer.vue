<template>
  <div>

    <div class="avatar-list">
      <div class="avatar-item">
        <Avatar @click.native="showPicker = true"
                icon="md-add"
                shape="square"
                size="large" />
        <p>添加</p>
      </div>

      <div class="avatar-item">
        <Avatar :src="conversation.friend && conversation.friend.smallAvatar"
                icon="ios-person"
                shape="square"
                size="large" />
        <p>{{conversation.friend && conversation.friend.name}}</p>
      </div>
    </div>
    <Divider />
    <CellGroup>
      <Cell title="置顶聊天">
        <i-switch @on-change="setTopChange"
                  v-model="setTop"
                  slot="extra" />
      </Cell>
      <!-- <Cell title="消息免打扰">
        <i-switch @on-change="notificationStatusChange"
                  v-model="notificationStatus"
                  slot="extra" />
      </Cell> -->
    </CellGroup>
    <Divider />
    <Button type="info"
            long
            v-if="conversation.targetId"
            @click="removeConversation"
            ghost>关闭对话</Button>

    <Modal v-model="showPicker"
           @on-cancel="createGroup = false"
           @on-ok="createGroup = true"
           :width="800"
           ok-text="添加">
      <group-picker @pickList="addPeople"
                    :currentList="currentList"
                    :idKey="'id'"
                    :showPicker="showPicker" />
    </Modal>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import groupPicker from './groupPicker.vue'
import { createOne } from '@/api/chat'

export default {
  name: '',
  components: {
    groupPicker
  },
  data () {
    return {
      showPicker: false,
      setTop: false,
      notificationStatus: false,
      createGroup: false,

      conversation: {
        friend: {
          smallAvatar: ''
        }
      }

    }
  },
  watch: {
    chatSession () {
      this.init()
    }
  },
  computed: {
    ...mapGetters([
      'chatSession',
      'selectedConversation',
      'selectedChatFriend',
      'chatFriendList',
      'getUserInfo'
    ]),
    currentList () {
      if (!this.conversation.friend) return []
      return this.chatFriendList.filter(f => this.conversation.friend.id !== f.id && this.getUserInfo.id !== f.id)
    }
  },
  methods: {
    ...mapActions({
      selectSession: 'IM_SELECT_SESSION',
      setGroup: 'IM_SET_GROUP',
      TOP_CHAT: 'IM_TOP_CHAT',
      NOTIFY_CHAT: 'IM_NOTIFY_CHAT'
    }),

    init () {
      if (this.selectedConversation && this.selectedConversation.targetId) {
        this.conversation = this.selectedConversation
        // 适配switch按钮
        this.setTop = !!this.conversation.isTop
        this.notificationStatus = !!this.conversation.notificationStatus
      } else if (this.selectedChatFriend) {
        this.conversation.friend = this.selectedChatFriend
      }
    },

    setTopChange (isTop) {
      debugger
      this.TOP_CHAT({
        conversationType: RongIMLib.ConversationType.PRIVATE,
        targetId: this.chatSession,
        isTop
      })
    },
    notificationStatusChange (status) {
      this.NOTIFY_CHAT({
        conversationType: RongIMLib.ConversationType.PRIVATE,
        targetId: this.chatSession,
        status
      })
    },

    addPeople (ids) {
      // 两个事件发生的顺序不一定同步，nextTick保险点
      this.$nextTick(() => {
        if (!this.createGroup) return
        console.log('Create Group', ids)

        let self = this
        let groupName = ''

        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                autofocus: true,
                placeholder: '请输入聊天群名称'
              },
              on: {
                input: (val) => {
                  groupName = val
                }
              }
            })
          },
          onOk: () => {
            if (!groupName) return self.$Message.warning('需要聊天群名称')
            // self.$Message.info(groupName)
            createOne({
              name: groupName,
              masterId: self.getUserInfo.id,
              onlyMasterManage: true,
              invitationConfirm: false,
              // 当前聊天对象也要入群
              memberIds: [...ids.map(m => m.id), this.conversation.friend.id]
            }).then(rst => {
              console.log('Create An New Group', rst)

              // debugger
              if (!rst.data || !rst.data.id) {
                self.$Message.error('创建群失败')
                self = undefined
                return
              }

              self.setGroup(rst.data)
                .then(() => self.selectSession(rst.data.id))
                .then(() => self.$emit('closeDrawer'))
                .then(() => { self = undefined })
            })
          }
        })
      })
    },

    removeConversation () {
      if (!this.conversation.conversationType) return null
      this.$store.dispatch('IM_DEL_CHAT', {
        'conversationType': this.conversation.conversationType,
        'targetId': this.chatSession
      }).then(() => {
        this.$emit('closeDrawer')
      })
    }

  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less">
.placeholder-gap {
  width: 100%;
  height: 16px;
  background: #fafafa;
}
.avatar-list {
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  .avatar-item {
    margin: 10px;

    p {
      text-align: center;
    }
  }
}
</style>
