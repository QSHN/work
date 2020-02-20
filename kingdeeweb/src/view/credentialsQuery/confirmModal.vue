<template>
  <Modal
    v-model="modal"
    :title="title"
    :mask-closable="false"
    @on-cancel="cancel">
    <p>{{content}}</p>
    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="primary" @click="sure(false)">当前</Button>
      <Button type="success" @click="sure(true)">全部</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'confirmModal',
  data () {
    return {
      modal: false,
      title: '',
      content: '',
      cb: null
    }
  },
  methods: {
    show (title, content, cb) {
      this.modal = true
      this.title = title
      this.content = content
      this.cb = cb
    },
    cancel () {
      this.modal = false
      this.title = ''
      this.content = ''
      this.cb = null
    },
    sure (bool) {
      if (this.cb) this.cb(bool)
      this.cancel()
    }
  }
}
</script>

<style scoped>

</style>
