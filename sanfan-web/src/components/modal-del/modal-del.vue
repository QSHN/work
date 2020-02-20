<template>
  <Modal v-model="modal" width="360">
    <p slot="header" style="color:#f60;text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>确定{{way}}</span>
    </p>
    <div style="text-align:center">
      <p>{{content}}</p>
    </div>
    <div slot="footer">
      <Button type="error" size="large" long :loading="modal_loading" @click="del(modalData)">{{way}}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'modal-del',
  props: {
    way: {
      type: String,
      default: '删除'
    },
    content: {
      type: String,
      required: true
    },
    del: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      modal_loading: false,
      modalData: null
    }
  },
  methods: {
    open (data) {
      this.modal = true
      this.modalData = data
      console.log(this.modalData)
    },
    close () {
      this.modal = false
      this.modal_loading = false
      this.modalData = null
    },
    success (desc) {
      this.$Notice.success({
        title: `${this.way}提示`,
        desc: desc
      })
      this.close()
    },
    error (desc) {
      this.$Notice.error({
        title: `${this.way}提示`,
        desc: desc
      })
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
