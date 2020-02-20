<template>
  <div>
    <Form ref="form"
          :model="apply"
          :rules="rule"
          :label-width="80">

      <FormItem :label="typeStr + '事由:'"
                prop="cause">
        <span v-if="readonlyAll">{{apply.cause}}</span>
        <Input v-else
               v-model="apply.cause"
               :readonly="readonlyAll"
               type="textarea"
               placeholder="请填写事由" />
      </FormItem>

      <FormItem label="相片"
                prop="photos">
        <images-viewer v-if="readonlyAll"
                       :photos="photoFilter()" />
        <upload-pic v-else
                    v-model="apply.photos" />
      </FormItem>

      <FormItem label="审核人:"
                prop="approval"
                required>
        <Workflow v-model="apply.approvalProcessDTOS"
                  :readonly="readonlyAll" />
      </FormItem>

      <FormItem v-if="apply.result"
                label="拒绝原因">
        <p style="color:#ed4014">{{apply.result}}</p>
      </FormItem>

      <FormItem label="抄送人:">
        <span v-if="readonlyAll"> {{copyListIDNames()}} </span>
        <employee-selector v-else
                           v-model="apply.copyToIds"
                           :readonly="readonlyAll"
                           :multiple="true"
                           range="allManager" />
      </FormItem>

      <div class="palce-holder">&nbsp;</div>
    </Form>
  </div>
</template>
<script>
import EmployeeSelector from '_c/employees/selector.vue'
import UploadPic from '_c/upload/upload-pic'
import ImagesViewer from '_c/images/viewer.vue'
import Workflow from '_c/workflow/workflow'
// import { APPLICATION_TYPE, AUDIT_STATUS } from './apply.consts'

export default {
  name: 'ApplyWorkflow',
  components: {
    EmployeeSelector,
    UploadPic,
    ImagesViewer,
    Workflow
  },
  props: {
    'readonlyAll': {
      type: Boolean,
      default: () => false
    },
    'typeStr': {
      type: String,
      default: () => ''
    },
    'initApply': {
      type: Object,
      required: true
    }
  },
  data () {
    let self = this
    return {
      // APPLICATION_TYPE: APPLICATION_TYPE,
      // AUDIT_STATUS: AUDIT_STATUS,
      rule: {
        cause: [{ required: true, message: '请填写事由' }],
        approval: [
          {
            validator: (rule, value, callback) => {
              if (!self.apply.approvalProcessDTOS || !self.apply.approvalProcessDTOS.length) {
                return callback(new Error('请添加审核人'))
              }
              return callback()
            }
          }
        ]
      },
      apply: {
        copyToIds: [],
        approvalProcessDTOS: []
      }
    }
  },
  watch: {
    initApply (val) {
      // console.log('Init Apply %o', val)
      if (!val) return
      // 赋值
      Object.assign(this.apply, val)
      this.$forceUpdate()
    }
  },
  computed: {
  },
  methods: {
    validate () {
      return new Promise(resolve => {
        this.$refs.form.validate(async valid => resolve(valid))
      })
    },
    copyListIDNames () {
      // console.log('Init CopyListIDNames : %o ', this.apply.copyToId)
      if (!this.apply.copyToId || !this.apply.copyToId.length) return ''
      return this.apply.copyToId.map(item => item.name).join('，')
    },
    photoFilter () {
      if (this.apply.photos && this.apply.photos.length) {
        return this.apply.photos.filter(p => !!p)
      }
      return []
    }
  }
}
</script>
<style lang="less" scoped>
.palce-holder {
  height: 80px;
}
</style>
