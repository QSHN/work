<template>
  <Card>
    <div slot="title">
      <Input search
             v-model="search"
             placeholder="输入员工姓名、职位、部门" />
    </div>
    <div class="contact-list">

      <Card :class="'person-contact'"
            v-for="(p,idx) in pageList "
            :key="idx">
        <Row type="flex"
             justify="space-between">
          <Col span="3">
          <Avatar icon="ios-person"
                  size="large"
                  shape="square"
                  :src="p.smallAvatar" />
          </Col>
          <Col span="8">
          <div class="person-name">
            {{p.name}}
          </div>
          <div class="person-info">{{p.departmentName}} {{p.positionName}} </div>
          </Col>
          <Col span="10">
          <div v-if="!p.hiddenPhone">

            <Icon type="ios-call"
                  color="#19be6b"
                  size="24" />
            <span class="person-phone">{{p.phone}}</span>

          </div>
          <div @click="goChat(p.id)">
            <Icon type="ios-chatbubbles"
                  color="#19be6b"
                  size="24" />
            <span class="person-chat">发起对话</span>
          </div>
          </Col>
        </Row>
      </Card>

    </div>
    <div class="contact-page">
      <Page :total="filterList.length"
            :page-size="pageSize"
            :current.sync="currentPage"
            simple
            show-total />
    </div>
  </Card>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data: () => {
    return {
      // 每页大小
      pageSize: 60,
      currentPage: 1,
      // 搜索内容
      search: '',
      // 添加部门后的通讯录
      contactList: []
    }
  },
  mounted () {
    this.$Loading.start()
    this.$store.dispatch('IM_INIT_FRIEND_LIST').then(() => {
      this.contactList = this.chatFriendList
      this.$Loading.finish()
    })
  },
  computed: {
    ...mapGetters([
      'chatFriendList'
    ]),
    // 当前显示
    filterList () {
      return this.contactList.filter(p => {
        // debugger
        return (p.name && p.name.indexOf(this.search) >= 0) ||
          (p.departmentName && p.departmentName.indexOf(this.search) >= 0) ||
          (p.positionName && p.positionName.indexOf(this.search) >= 0)
      })
    },
    pageList () {
      return this.filterList.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    }
  },
  methods: {
    ...mapMutations({
      changeTab: 'IM_CHANGE_TAG'
    }),
    ...mapActions({
      selectFriend: 'IM_SELECT_FRIEND',
      selectSession: 'IM_SELECT_SESSION'
    }),
    // 发起聊天
    goChat (targetId) {
      this.selectFriend(targetId)
      this.selectSession(targetId)
      this.$store.dispatch('IM_SEARCH', '')
      this.changeTab('chat')

      this.$router.push({
        name: 'chat',
        meta: {
          targetId
        }
      })
    }
  }

}
</script>
<style lang="less">
.contact-list {
  display: flex;
  flex-wrap: wrap;
}
.contact-page {
  display: flex;
  justify-content: center;
  margin: 1em auto;
}
.person-contact {
  width: 320px;
  margin: 6px;

  .ivu-card-body {
    padding: 12px;
  }

  .person-name {
    font-size: larger;
  }

  .person-info {
    font-size: smaller;
    color: #aaa;
  }

  .person-phone {
    color: #666;
  }
  .person-chat {
    color: #19be6b;
  }
  .person-phone,
  .person-chat {
    display: inline-block;
    margin-left: 0.5em;
  }
}
</style>
