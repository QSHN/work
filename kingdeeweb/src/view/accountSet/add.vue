<template>
  <Modal
    v-model="modal"
    :title="`授权用户`"
    :mask-closable="false"
    width="600"
    height="1200"
    @on-cancel="cancel">
    <div class="add_user_layer">
      <CheckboxGroup v-model="selectList">
        <Checkbox v-for="(v, i) in userList" :key="i" :label="v._id" style="width: 100px;">
          <span>{{ v.name }}</span>
        </Checkbox>
      </CheckboxGroup>
    </div>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="save">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    load: Function,
    update: Function
  },
  data () {
    return {
      modal: false,
      selectList: [],
      form: null
    }
  },
  computed: {
    ...mapGetters([
      'userList'
    ])
  },
  methods: {
    show (row) {
      this.form = row
      this.selectList = JSON.parse(JSON.stringify(row.userList))
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    save () {
      let data = JSON.parse(JSON.stringify(this.form))
      data.userList = this.selectList
      this.update(data).then(res => {
        this.load()
        this.cancel()
      }).catch(err => {
        this.$Notice.error({
          title: '账套管理',
          desc: err.message
        })
      })
    }
  }
}
</script>

<style lang="less" >
  .add_user_layer {
  }
</style>
