<template>
  <Modal
    v-model="modal"
    width="350"
    :title="title"
    :loading="isCommit"
    :mask-closable="false"
    @on-ok="ok"
    @on-cancel="cancel">
    <div v-for="(v, i) in score" :key="i" :style="`${i > 0 ? 'border-top: 1px solid #e5e5e5; padding-top: 15px;' : ''}`">
      <Row type="flex">
        <label style="width: 60px; text-align: right; line-height: 32px; margin-bottom: 15px; padding-right: 5px;">数值：</label>
        <InputNumber v-model="v.value" :min="1" @on-change="(val) => { v.operator = parseInt(val) < parseInt(target) ? 'SUBTRACT' : 'PLUS'}" style="width: 180px" placeholder="请填写数值"></InputNumber>
      </Row>
      <Row type="flex">
        <label style="width: 60px; text-align: right; line-height: 32px; margin-bottom: 15px; padding-right: 5px;">{{v.operator === 'PLUS' ? '加分' : '减分'}}：</label>
        <InputNumber v-model="v.score" :min="1" style="width: 180px" placeholder="请填写分值"></InputNumber>
        <Button type="error" @click="deleteScore(i)" style="margin: 1px 0 15px 10px; height: 30px;">删除</Button>
      </Row>
    </div>
    <Button type="success" @click="add" style="width: 100%; margin-top: 15px;">添加</Button>
  </Modal>
</template>

<script>
export default {
  name: 'score-modal',
  data () {
    return {
      title: '',
      modal: false,
      isCommit: true,
      score: [],
      updateFun: null,
      target: 0
    }
  },
  methods: {
    add () {
      this.score.push({
        value: this.target,
        operator: 'PLUS',
        score: 10
      })
    },
    deleteScore (i) {
      this.score.splice(i, 1)
    },
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    show (data, target, cb) {
      this.target = parseFloat(target)
      this.title = `考核设置（达标：${this.target} 个）`
      if (data && data.length) {
        this.score = []
        data.forEach(v => {
          this.score.push({
            value: v.value,
            operator: parseInt(v.value) < this.target ? 'SUBTRACT' : 'PLUS',
            score: v.score
          })
        })
      } else {
        this.score = [
          {
            value: this.target,
            operator: 'PLUS',
            score: 10
          }
        ]
      }
      if (cb) this.updateFun = cb
      this.$forceUpdate()
      this.modal = true
    },
    ok () {
      let isUpdate = true
      if (this.score.length) {
        this.score.map((v, i) => {
          if (!v.value || !v.score) {
            isUpdate = false
            this.$Notice.error({
              title: '错误提示',
              desc: '请检查所有数值，不能为空'
            })
          }
          if (this.score.filter(val => val.value === v.value).length > 1) {
            isUpdate = false
            this.$Notice.error({
              title: '错误提示',
              desc: '请检查所有数值，数值不能重复'
            })
          }
        })
      } else {
        isUpdate = false
        this.$Notice.error({
          title: '错误提示',
          desc: '请添加考核设置'
        })
      }
      if (isUpdate) {
        if (this.updateFun) this.updateFun(Object.assign([], this.score))
        this.cancel()
      } else {
        this.changeStatus()
      }
    },
    cancel () {
      this.score = []
      this.target = 0
      this.modal = false
      this.updateFun = null
      this.changeStatus()
    }
  }
}
</script>

<style scoped>

</style>
