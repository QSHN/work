<template>
  <Modal v-model="modal"
         width="500"
         :title="title"
         :loading="isCommit"
         :mask-closable="false"
         @on-cancel="cancel">

    <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="120">
      <FormItem label="公告标题："  prop="title">
        <Input v-model="formData.title" :maxlength="30" style="width: 240px" placeholder="请填写公告标题" :disabled="isLook"></Input>
      </FormItem>

      <FormItem label="公告状态：">
        <RadioGroup v-model="formData.publishType">
          <Radio label="IMMEDIATELY">立即发布</Radio>
          <Radio label="TIMING">选择发布时间</Radio>
          <Radio label="NOTYET">暂时不发布</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="发布时间：" prop="publishTime" v-if="formData.publishType === 'TIMING'">
        <DatePicker type="datetime"
                    placeholder="请选择截止时间"
                    :value="formData.publishTime"
                    format="yyyy-MM-dd HH:mm"
                    :options="dateOption"
                    :disabled="isLook"
                    @on-change="val => formData.publishTime = val"
                    style="width: 200px">
        </DatePicker>
      </FormItem>

      <FormItem label="接收人：" prop="informationUserIds">
        <employee-selector :multiple="true"
                           :range="'allEmployee'"
                           :selectList = "formData.informationUserIds"
                           :disabled="isLook"
                           @change="changeEmpolyee"
                           style="width: 305px" />
      </FormItem>

      <FormItem label="公告内容："  prop="content">
        <Input v-model="formData.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 240px" placeholder="请填写公告内容" :disabled="isLook"></Input>
      </FormItem>

      <FormItem label="图片：" style="margin-bottom: 5px">
        <upload-pic v-model="formData.photos"  :disabled="isLook" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" v-if="!isLook && !formData.publish" @click="ok" :loading="!isCommit">确定</Button>
    </div>
  </Modal>
</template>

<script>
import uploadPic from '_c/upload/upload-pic.vue'
import EmployeeSelector from '_c/employees/selector.vue'
import { setAnnounce } from '@/api/announce.js'
export default {
  name: 'announceModal',
  components: {
    uploadPic,
    EmployeeSelector
  },
  data () {
    return {
      title: '新建公告',
      modal: false,
      isCommit: true,
      isLook: false,
      formData: {
        title: '',
        content: '',
        photos: [],
        informationUserIds: [],
        publishTime: '',
        publishType: 'IMMEDIATELY'
      },
      ruleValidate: {
        title: [
          { required: true, message: '请填写公告标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写公告正文', trigger: 'blur' }
        ],
        informationUserIds: [
          {
            required: true,
            type: Array,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formData.informationUserIds.length) {
                callback()
              } else {
                callback(new Error('请选择接收人'))
              }
            }
          }
        ],
        publishTime: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              console.log(this.formData.publishTime)
              if (this.formData.publishType !== 'TIMING' || (this.formData.publishType === 'TIMING' && this.formData.publishTime)) {
                callback()
              } else {
                callback(new Error('请选择公告发布时间'))
              }
            }
          }
        ]
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  methods: {
    changeEmpolyee (val) {
      this.formData.informationUserIds = val
    },
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    show (data, isLook) {
      if (data) {
        this.formData = Object.assign({}, data)
        this.formData.informationUserIds = data.informationUserList.map(v => v.id)
        this.formData.photos = data.photos.filter(v => v.length)
        this.$forceUpdate()
        this.title = isLook ? '查看公告' : '编辑公告'
      } else {
        this.title = '新建公告'
      }
      this.isLook = isLook
      this.modal = true
    },
    ok () {
      if (this.isLook) {
        this.cancel()
        return
      }
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.formData)
          setAnnounce(data).then(res => {
            this.$emit('update')
            this.cancel()
            this.$Notice.success({
              title: '成功提示',
              desc: `已成功${data.publishType === 'NOTYET' ? '保存' : '发布'}该公告`
            })
          }).catch((err) => {
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
              this.cancel()
            }
          })
        } else {
          this.changeStatus()
        }
      })
    },
    cancel () {
      this.$refs.formValidate.resetFields()
      this.changeStatus()
      this.formData = {
        title: '',
        content: '',
        photos: [],
        informationUserIds: [],
        deadline: ''
      }
      this.modal = false
      this.$nextTick(() => {
        this.$refs.formValidate.resetFields()
      })
    }
  }
}
</script>

<style scoped>

</style>
