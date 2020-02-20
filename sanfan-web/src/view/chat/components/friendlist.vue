<!-- 好友列表 -->
<template>
  <div class="friend-list">
    <ul>
      <!-- initial 是用来分组的 -->
      <li v-for="(fd,idx) in searchedChatFriendlist"
          :key="idx"
          class="friend-item"
          :class="{ 'noborder': !fd.initial}">
        <div class="list-title"
             v-if="fd.initial">{{fd.initial}}</div>
        <div class="friend-info"
             :class="{ 'active': selectedChatFriend ? fd.id === selectedChatFriend.id : false }"
             @click="selectFriend(fd.id)">

          <Avatar icon="ios-person"
                  size="large"
                  shape="square"
                  class="avatar"
                  :src="fd.smallAvatar"></Avatar>

          <div class="words">
            <div class="remark">
              {{fd.name}}
            </div>
            <div>
              <span class="admin"
                    v-show="fd.isAdmin">主管</span>
              <span :class="{ 'pad':fd.isAdmin === true }"
                    class="job">{{fd.job}}</span>
            </div>
          </div>

        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'selectedChatFriend',
      'searchedChatFriendlist'
    ])
  },
  methods: {
    ...mapActions({
      'selectFriend': 'IM_SELECT_FRIEND'
    })
  }
}
</script>

<style lang="less" scoped>
.friend-list {
  // height: 540px;
  height: 100%;
  overflow-y: auto;

  .friend-item {
    border-top: 1px solid #dadada;

    &:first-child,
    &.noborder {
      border-top: none;
    }

    .list-title {
      box-sizing: border-box;
      width: 100%;
      font-size: 12px;
      padding: 15px 0 3px 12px;
      color: #999;
    }

    .friend-info {
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

      .words {
        .remark {
          // line-height: 36px;
          font-size: 14px;
        }

        .admin,
        .job {
          display: inline-block;
          font-size: 12px;
        }

        .admin {
          color: #f39999;
        }

        .job {
          color: #aaa;
        }
        .job.pad {
          margin-left: 0.5em;
        }
      }
    }
  }
}
</style>
