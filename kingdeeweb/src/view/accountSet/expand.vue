<template>
  <div class="expand_layer">
    <span style="float: left; height: 24px; line-height: 24px; display: block">账套成员：</span>
    <template v-if="userList.length">
      <div class="expand_tag">
        <Tag v-for="(id, index) in row.userList" :key="index" :name="id" type="border" color="error" closable @on-close="setUserList(false, index, userList.find(v => v._id === id).name)">
          {{ userList.find(v => v._id === id).name }}
        </Tag>
      </div>
      <Button icon="ios-add" type="success" size="small" @click="setUserList(true)" style="float: left;">添加授权</Button>
    </template>
    <AddUser ref="AddUser" :load="load" :update="update" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddUser from './add'
export default {
  props: {
    row: Object,
    load: Function,
    update: Function
  },
  components: {
    AddUser
  },
  computed: {
    ...mapGetters([
      'userList'
    ])
  },
  methods: {
    setUserList (isAdd, index, name) {
      if (isAdd) {
        this.$refs.AddUser.show(this.row)
      } else {
        let data = JSON.parse(JSON.stringify(this.row))
        if (data.userList.length > 1) {
          this.$Modal.confirm({
            title: '账套管理',
            content: `您确定取消${name}授权吗？`,
            onOk: () => {
              data.userList.splice(index, 1)
              this.update(data).then(res => {
                this.load()
              }).catch(err => {
                this.$Notice.error({
                  title: '账套管理',
                  desc: err.message
                })
              })
            }
          })
        } else {
          this.$Notice.error({
            title: '账套管理',
            desc: '账套至少要有一个用户'
          })
        }
      }
    }
  }
}
</script>

<style lang="less" >
  .expand_layer {
    overflow: hidden;

    .expand_tag {
      float: left;
      margin: 0 10px 10px;
      display: block;

      .ivu-tag { margin: 0 0 0 10px; }
    }
  }
</style>
