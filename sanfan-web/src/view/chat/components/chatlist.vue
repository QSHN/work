<!-- 聊天列表 -->
<template>
  <div class="msglist">
    <ul>
      <li v-for="(item,idx) in searchedChatlist"
          :key="idx"
          class="sessionlist"
          :class="{ active: item.targetId === chatSession }"
          @click="selectSession(item.targetId)">
        <div class="list-left">
          <Badge :count="item.friend ? item.unreadMessageCount : 0"
                 class-name="mini-badge"
                 overflow-count="99">
            <Avatar v-if="item.friend"
                    icon="ios-person"
                    size="large"
                    shape="square"
                    class="avatar"
                    :src="item.friend.smallAvatar"></Avatar>

            <Avatar v-else-if="item.group"
                    icon="ios-people"
                    size="large"
                    shape="square"
                    class="avatar"></Avatar>

          </Badge>
        </div>
        <div class="list-right">
          <template v-if="item.friend">
            <p class="name">{{item.friend.name}}</p>
            <span class="time">{{item.sentTime | time}}</span>
            <p class="lastmsg"
               v-html="getContent(item)"></p>

          </template>
          <template v-else-if="item.group">
            <p class="name">{{item.group.name}}</p>
            <span class="time">{{item.sentTime | time}}</span>
            <p class="lastmsg"
               v-html="item.lastContent"></p>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      avatars: []
    }
  },
  computed: {

    ...mapGetters([
      'chatSession',
      'searchedChatlist'
    ])
  },
  methods: {
    ...mapActions({
      selectSession: 'IM_SELECT_SESSION',
      setGroup: 'IM_SET_GROUP'
    }),

    getContent (item) {
      if (item && item.latestMessage && item.latestMessage.content) {
        if (item.latestMessage.content.content) {
          return RongIMLib.RongIMEmoji.emojiToHTML(item.latestMessage.content.content)
        } else {
          return item.latestMessage.content.name || ''
        }
      }
      return ''
    }
  },
  filters: {
    // 将日期过滤为 hour:minutes
    time (date) {
      const dateType = typeof date
      if (dateType === 'string' || dateType === 'number') {
        date = new Date(date)
      }
      if (date.getMinutes() < 10) {
        return date.getHours() + ':0' + date.getMinutes()
      } else {
        return date.getHours() + ':' + date.getMinutes()
      }
    }
  },
  created () {
    this.$store.dispatch('IM_CHAT_LIST')
    console.log('Groups', this.allChatGroups)
  }
}
</script>

<style lang="less" scoped>
.msglist {
  // height: 540px;
  height: 100%;
  overflow-y: auto;

  .sessionlist {
    display: flex;
    padding: 12px;
    transition: background-color 0.1s;
    font-size: 0;

    &:hover {
      background-color: rgb(220, 220, 220);
    }

    &.active {
      background-color: #c4c4c4;
    }

    .avatar {
      border-radius: 2px;
      margin-right: 12px;
    }

    .list-right {
      position: relative;
      flex: 1;
      margin-top: 4px;
    }

    .name {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
    }

    .time {
      float: right;
      color: #999;
      font-size: 10px;
      vertical-align: top;
    }

    .lastmsg {
      position: absolute;
      font-size: 12px;
      width: 130px;
      height: 26px;
      line-height: 15px;
      color: #999;
      bottom: -12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style>
/*scoped 样式不起作用*/
.avatar + .mini-badge {
  font-size: 12px;
  padding: 0 2px;
  right: 16px;
  border: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
