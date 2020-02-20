<template>
  <Card>
    <Alert show-icon>要满足下面的所有条件才可以算是完成拜访</Alert>

    <Form :label-width="200">

      <FormItem label="电话拜访时不得少于(分钟):">
        <InputNumber :min="0"
                     v-model="visitset.conversationTime"></InputNumber>
      </FormItem>

      <FormItem label="拜访内容字数不得少于(个):">
        <InputNumber :min="0"
                     v-model="visitset.visitingContentLong"></InputNumber>
      </FormItem>

      <FormItem label="走访总结拍照上传不得少于(张):">
        <InputNumber :min="0"
                     v-model="visitset.photoListLong"></InputNumber>
      </FormItem>

      <FormItem label="填写拜访结果:">
        <i-switch v-model="visitset.visitingReportRequest"
                  size="large"
                  class="visit-switch">
          <span slot="open">需要</span>
          <span slot="close">不需要</span>
        </i-switch>
      </FormItem>

      <FormItem label="拜访结果总结字数不得少于(个):">
        <InputNumber :min="0"
                     v-model="visitset.visitingResultLong"></InputNumber>
      </FormItem>

      <div class="visit-btns">
        <Button @click="submit"
                icon="md-checkmark"
                type="success">保存修改</button>
      </div>
    </Form>

  </Card>
</template>
<script>
import { updateVisitSetting, getVisitSetting } from '@/api/client'
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      visitset: {
        conversationTime: 0,
        visitingContentLong: 50,
        photoListLong: 1,
        visitingResultLong: 100,
        visitingReportRequest: false
      }
    }
  },
  computed: {},
  methods: {
    submit () {
      let self = this
      this.$Modal.confirm({
        title: `保存并更新拜访设置`,
        onOk () {
          self.$Loading.start()
          updateVisitSetting(self.visitset).then(res => {
            self.$Loading.finish()
            self.$Message.success('更新成功')
          }).catch(err => {
            console.error(err)
            self.$Loading.error()
            self.$Message.error('更新失败')
          })
        }

      })
    }
  },
  mounted () {
    this.$Loading.start()
    getVisitSetting().then(res => {
      this.$Loading.finish()
      this.visitset = res.data
    }).catch(err => {
      console.error(err)
      this.$Loading.error()
      this.$Message.error('获取设置失败')
    })
  }
}
</script>
<style lang="less">
@hd: ~".visit-switch.ivu-switch-large";
@{hd} {
  width: 76px;
}
@{hd}:active:after {
  width: 46px;
}
@{hd}:active:after {
  width: 50px;
}
@{hd}.ivu-switch-checked:after {
  left: 55px;
}
@{hd}.ivu-switch-checked:before {
  left: 57px;
}
@{hd}:active.ivu-switch-checked:after {
  left: 43px;
}

.visit-btns {
  button:first-child {
    margin: auto 10px auto 60px;
  }
}
</style>
