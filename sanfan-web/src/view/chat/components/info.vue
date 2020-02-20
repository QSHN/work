<!-- 好友信息 -->
<template>
  <div>

    <div class="Info-wrapper"
         v-if="selectedChatFriend">

      <div class="friendInfo"
           v-show="selectedChatFriend.id">
        <div class="esInfo">
          <div class="left">
            <div class="people">
              <div class="nickname">{{selectedChatFriend.name}}</div>
              <Icon :type="genderType"
                    :color="genderColor"
                    size="20"
                    class="gender" />
            </div>
            <div class="signature">{{selectedChatFriend.signature}}</div>
          </div>
          <div class="right">
            <Avatar v-if="selectedChatFriend.avatar"
                    shape="square"
                    class="avatar"
                    :src="selectedChatFriend.avatar"></Avatar>
            <div v-else
                 class="avatar">
              <Icon type="ios-person"
                    color="#fff"
                    size="48" />
            </div>
          </div>
        </div>
        <div class="detInfo">
          <div class="remark">
            <span>部门</span>{{selectedChatFriend.departmentName}}
          </div>
          <div class="area">
            <span>职位</span>
            {{selectedChatFriend.positionName}}
            <span v-show="selectedChatFriend.role === 'DEPARTMENTADMIN'"
                  class="admin">部门管理员</span>
          </div>
          <div v-if="selectedChatFriend.phoneHidden !== true"
               class="wxid">
            <span>手机</span>{{selectedChatFriend.phone}}
          </div>
        </div>
        <div class="send"
             @click="send">
          <span>发消息</span>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

const GENDER_PARAMS = {
  'MALE': {
    type: 'md-male',
    color: '#46b6ef'
  },
  'FEMALE': {
    type: 'md-female',
    color: '#f37e7d'
  },
  'UNKNOWN': {
    type: '',
    color: ''
  }

}

export default {
  computed: {
    ...mapGetters([
      'selectedChatFriend'
    ]),
    genderType () { return this.selectedChatFriend.gender ? GENDER_PARAMS[this.selectedChatFriend.gender].type : '' },
    genderColor () { return this.selectedChatFriend.gender ? GENDER_PARAMS[this.selectedChatFriend.gender].color : '' }
  },
  methods: {
    ...mapMutations({
      changeTab: 'IM_CHANGE_TAG'
    }),
    ...mapActions({
      selectSession: 'IM_SELECT_SESSION'
    }),
    send () {
      this.selectSession(this.selectedChatFriend.id)
      this.$store.dispatch('IM_SEARCH', '')
      this.changeTab('chat')
    }
  }

}
</script>

<style lang="less" scoped>
.newfriend {
  height: 60px;
  padding: 28px 0 0 30px;
  box-sizing: border-box;
  border-bottom: 1px solid #e7e7e7;

  .nickname {
    font-size: 18px;
  }
}

.friendInfo {
  padding: 0 90px;
}

.esInfo {
  display: flex;
  align-items: center;
  padding: 100px 0 45px 0;

  .left {
    flex: 1;

    .people {
      .nickname {
        display: inline-block;
        font-size: 20px;
        margin-bottom: 16px;
        line-height: 1;
      }

      .gender {
        display: inline-block;
        vertical-align: top;
        margin-left: 0.5em;
      }

      // .gender-male {
      //   background-image: url("man.png");
      //   background-size: cover;
      // }

      // .gender-female {
      //   background-image: url("woman.png");
      //   background-size: cover;
      // }
    }

    .signature {
      font-size: 14px;
      color: rgba(153, 153, 153, 0.8);
    }
  }

  .right {
    .avatar {
      border-radius: 3px;
      width: 72px;
      height: 72px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ddd;
    }
  }
}

.detInfo {
  padding: 40px 0;
  border-top: 1px solid #e7e7e7;
  border-bottom: 1px solid #e7e7e7;

  .remark,
  .area,
  .wxid {
    font-size: 14px;
    margin-top: 20px;

    span {
      font-size: 14px;
      color: rgba(153, 153, 153, 0.8);
      margin-right: 40px;
    }
  }

  .remark {
    margin-top: 0;
  }
}

.send {
  position: relative;
  text-align: center;
  width: 140px;
  height: 36px;
  left: 115px;
  top: 50px;
  line-height: 36px;
  font-size: 14px;
  color: #fff;
  background-color: #1aad19;
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    background: rgb(18, 150, 17);
  }
}
</style>
