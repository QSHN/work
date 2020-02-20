<template>
  <div>

    <div class="avatar-list">
      <template v-if="canAdmin">
        <div class="avatar-item">
          <Avatar @click.native="showJoin"
                  icon="md-add"
                  shape="square"
                  size="large" />
          <p>添加</p>
        </div>
      </template>

      <template v-if="isAdmin">
        <div class="avatar-item">
          <Avatar @click.native="showDelete"
                  icon="md-remove"
                  shape="square"
                  size="large" />
          <p>删除</p>
        </div>
      </template>

      <template v-if="group">

        <div v-for="(m, idx) in group.members"
             :key="idx"
             class="avatar-item">
          <template v-if="group.masterId && group.masterId === m.employeeId  ">
            <Badge text="群主">
              <Avatar :src="m.smallAvatar"
                      icon="ios-person"
                      shape="square"
                      size="large" />
            </Badge>
          </template>
          <!-- <template v-else-if="m.isBan">
            <Badge type="normal"
                   text="禁言">
              <Avatar :src="m.smallAvatar"
                      icon="ios-person"
                      shape="square"
                      size="large" />
            </Badge>
          </template> -->
          <template v-else>
            <Avatar :src="m.smallAvatar"
                    icon="ios-person"
                    shape="square"
                    size="large" />
          </template>
          <p>{{m.name}}</p>
        </div>
      </template>
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

    <Button type="error"
            long
            @click="quitGroup"
            ghost>退出群聊</Button>

    <template v-if="isAdmin">
      <Divider />

      <CellGroup>

        <Cell @click.native="setGroupName"
              :title="group.name"
              label="修改群名称">
          <Icon type="ios-arrow-forward"
                slot="extra" />
        </Cell>
        <Cell @click.native="showChangeMaster"
              title="转让群主">
          <Icon type="ios-arrow-forward"
                slot="extra" />
        </Cell>

        <Cell label="启用后，其他成员不能修改群名称、邀请成员"
              title="仅群主可管理">
          <i-switch @on-change="onlyMasterManageChange"
                    v-model="group.onlyMasterManage"
                    slot="extra" />
        </Cell>
        <!-- <Cell label="启用后，群成员需要群主确认才能邀请成员进"
            title="群聊邀请确认">
        <i-switch @on-change="invitationConfirmChange"
                  v-model="group.invitationConfirm"
                  slot="extra" />
      </Cell> -->
        <Cell label="开启后，仅群主和指定的成员可以发言"
              title="全部禁言">
          <i-switch @on-change="isBanChange"
                    v-model="group.isBan"
                    slot="extra" />
        </Cell>
      </CellGroup>

      <template v-if="!group.isBan">
        <div class="avatar-list">
          <div class="avatar-item">
            <Avatar @click.native="showBanMember"
                    icon="md-add"
                    shape="square"
                    size="large" />
            <p>添加禁言</p>
          </div>

          <div class="avatar-item">
            <Avatar @click.native="showUnBanMember"
                    icon="md-remove"
                    shape="square"
                    size="large" />
            <p>移除禁言</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="avatar-list">
          <div class="avatar-item">
            <Avatar @click.native="showAddWhitelist"
                    icon="md-add"
                    shape="square"
                    size="large" />
            <p>添加发言</p>
          </div>

          <div class="avatar-item">
            <Avatar @click.native="showRemoveWhitelist"
                    icon="md-remove"
                    shape="square"
                    size="large" />
            <p>移除发言</p>
          </div>
        </div>
      </template>

      <Button type="error"
              long
              @click="dimissGroup"
              ghost>解散群聊</Button>
    </template>

    <Modal v-model="showPicker"
           @on-cancel="confirm = false"
           @on-ok="confirm = true"
           :width="800"
           :ok-text="okText">
      <group-picker @pickList="doPickerAction"
                    :currentList="pickerList"
                    :idKey="pickerKey"
                    :showPicker="showPicker" />
    </Modal>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import groupPicker from './groupPicker.vue'
import * as chatApi from '@/api/chat'

export default {
  name: '',
  components: {
    groupPicker
  },
  data () {
    return {
      // picker要执行的操作
      pickerAction: '',
      // picker可以操作的人选
      pickerList: [],
      // picker筛选id的key值
      pickerKey: 'id',
      // picker显示文字
      okText: '添加',
      showPicker: false,
      setTop: false,
      notificationStatus: false,
      confirm: false,

      conversation: {},
      group: {
        isBan: false,
        invitationConfirm: false,
        onlyMasterManage: false
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
      'selectedGroup',
      'chatFriendList',
      'getUserInfo'
    ]),

    isAdmin () {
      return this.group.masterId === this.getUserInfo.id
    },

    canAdmin () {
      if (!this.group.onlyMasterManage) return true
      return this.group.masterId === this.getUserInfo.id
    }
  },
  methods: {
    ...mapActions({
      selectSession: 'IM_SELECT_SESSION',
      setGroup: 'IM_SET_GROUP',
      CHAT_LIST: 'IM_CHAT_LIST',
      TOP_CHAT: 'IM_TOP_CHAT',
      NOTIFY_CHAT: 'IM_NOTIFY_CHAT'
    }),

    init () {
      if (this.selectedConversation && this.selectedConversation.targetId && this.selectedConversation.group) {
        this.conversation = this.selectedConversation
        this.group = this.selectedConversation.group
        // 适配switch按钮
        this.setTop = !!this.conversation.isTop
        this.notificationStatus = !!this.conversation.notificationStatus
      } else if (this.selectedGroup) {
        this.group = this.selectedGroup
      }
    },

    // 置顶对话
    setTopChange (isTop) {
      this.TOP_CHAT({
        conversationType: RongIMLib.ConversationType.GROUP,
        targetId: this.chatSession,
        isTop
      })
    },
    // 设置免打扰，web API 无法调用
    notificationStatusChange (status) {
      this.NOTIFY_CHAT({
        conversationType: RongIMLib.ConversationType.GROUP,
        targetId: this.chatSession,
        status
      })
    },

    // Promise 调用时，chatApi为undefined
    refreshGroup (chatApi) {
      let self = this
      return chatApi.getOne(this.chatSession).then(rst => {
        self.group = rst.data
        // 刷新store
        // Object.assign(self.selectedGroup, self.group)
        self.setGroup(rst.data)
        self.$forceUpdate()
      })
    },

    setGroupName () {
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
          chatApi.rename({
            name: groupName,
            id: self.chatSession
          })
            .then(() => self.refreshGroup(self))
            .then(() => { self.selectedGroup.name = groupName })
            .catch(error => {
              console.error('Error In onlyMasterManage', error)
              self.$Message.error('设置失败')
            })
        }
      })
    },

    switchChange (action, key, status) {
      chatApi[action]({
        id: this.chatSession,
        [key]: status
      })
        .then(() => this.refreshGroup(chatApi))
        .catch(error => {
          console.error('Error In onlyMasterManage', error)
          this.$Message.error('设置失败')
        })
    },

    onlyMasterManageChange (status) {
      this.switchChange('setOnlyMasterManage', 'onlyMasterManage', status)
    },
    invitationConfirmChange (status) {
      // 后端目前没有这个接口

      // this.switchChange('setOnlyMasterManage', 'onlyMasterManage', status)
    },
    isBanChange (status) {
      this.switchChange('banGroup', 'isBan', status)
    },

    callShowPicker (pickerAction, okText, pickerList, key) {
      if (!this.group) return
      this.pickerAction = pickerAction
      this.okText = okText
      this.pickerList = pickerList
      this.pickerKey = key
      this.showPicker = true
    },

    beforePickerShow () {
      let members = this.group && this.group.members
      if (!members || !members.length) {
        this.$Message.error('无法添加')
        return false
      } else {
        return members
      }
    },
    showChangeMaster () {
      let members = this.beforePickerShow()
      if (!members) return

      let list = members.filter(m => m.employeeId !== this.group.masterId)
      this.callShowPicker('changeMaster', '转让', list, 'employeeId')
    },
    showJoin () {
      let members = this.beforePickerShow()
      if (!members) return

      let list = this.chatFriendList.filter(f => !members.some(m => m.employeeId === f.id))
      this.callShowPicker('join', '添加', list, 'id')
    },
    showDelete () {
      let members = this.beforePickerShow()
      if (!members) return

      let list = members.filter(m => m.employeeId !== this.group.masterId)
      this.callShowPicker('quit', '删除', list, 'employeeId')
    },
    showBanMember () {
      let members = this.beforePickerShow()
      if (!members) return

      let list = members.filter(m => !m.isBan)
      this.callShowPicker('banMember', '添加', list, 'employeeId')
    },
    showUnBanMember () {
      let members = this.beforePickerShow()
      if (!members) return

      let list = members.filter(m => m.isBan)
      this.callShowPicker('unBanMember', '删除', list, 'employeeId')
    },
    showAddWhitelist () {
      let members = this.beforePickerShow()
      if (!members) return

      let list = members.filter(m => !m.isIgnoreBanAll)
      this.callShowPicker('addWhitelist', '添加', list, 'employeeId')
    },
    showRemoveWhitelist () {
      let members = this.beforePickerShow()
      if (!members) return

      let list = members.filter(m => m.isIgnoreBanAll)
      this.callShowPicker('removeWhitelist', '删除', list, 'employeeId')
    },

    // 判断picker的操作
    doPickerAction (ids, idKey) {
      // 两个事件发生的顺序不一定同步，nextTick保险点
      this.$nextTick(() => {
        if (!this.confirm) return
        console.log('PickAction Group', ids)

        // 转让群主单独处理
        if (this.pickerAction === 'changeMaster') return this.changeMaster(ids)

        chatApi[this.pickerAction]({
          id: this.chatSession,
          memberIds: ids.map(p => p[idKey])
        }).then(() => this.refreshGroup(chatApi)).catch(error => {
          console.error(`Error In Ask for ${this.pickerAction}`, error)
          this.$Message.error('设置失败')
          if (error.errorMsg) this.$Message.error(error.errorMsg)
        })
      })
    },

    changeMaster (ids) {
      if (!ids || ids.length !== 1) return this.$Message.error('群主只能是一个人')

      chatApi.changeMaster({
        id: this.chatSession,
        masterId: ids[0].employeeId
      }).then(() => this.refreshGroup(chatApi)).catch(error => {
        console.error('Error In Ask for changeMaster', error)
        this.$Message.error('转让失败失败')
        if (error.errorMsg) this.$Message.error(error.errorMsg)
      })
    },

    quitGroup () {
      if (!this.group) return this.$Message.error('无法退出该群')
      if (this.getUserInfo.id === this.group.masterId) return this.$Modal.error({ title: '您是群主，请先转让群主再退群', closable: false })
      let self = this
      this.$Modal.confirm({
        title: '确认退出该群',
        onOk () {
          chatApi.quitOne(self.group.id)
            .then(() => self.$store.dispatch('IM_DEL_CHAT', {
              'conversationType': self.conversation.conversationType,
              'targetId': self.chatSession
            }))
            .then(() => self.$store.dispatch('IM_CHAT_LIST'))
            .catch(error => {
              console.error('Error In Ask for quitGroup', error)
              self.$Message.error('设置失败')
            })
        }
      })
    },

    dimissGroup () {
      if (!this.group) return this.$Message.error('无法解散该群')
      if (!this.isAdmin) return this.$Message.error('只有群主才能解散该群')
      let self = this

      this.$Modal.confirm({
        title: '确认解散该群',
        onOk () {
          chatApi.deleteOne(self.group.id)
            .then(() => self.$store.dispatch('IM_DEL_CHAT', {
              'conversationType': self.conversation.conversationType,
              'targetId': self.chatSession
            }))
            .then(() => self.$store.dispatch('IM_CHAT_LIST'))
            .catch(error => {
              console.error('Error In Ask for dimissGroup', error)
              this.$Message.error('设置失败')
            })
        }
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
