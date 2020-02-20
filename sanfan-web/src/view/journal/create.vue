<template >
  <div class="journal-form">
    <Card title="写日报">
      <Form ref="journal"
            :model="journal"
            :rules="rule"
            :label-width="80">

        <FormItem label="日报类型:"
                  prop="dailyType">
          <RadioGroup v-model="journal.dailyType">
            <Radio label="DAILY">
              <Tag color="green">日报</Tag>
            </Radio>
            <Radio label="WEEKLY">
              <Tag color="gold">周报</Tag>
            </Radio>
            <Radio label="MONTHLY">
              <Tag color="volcano">月报</Tag>
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="审批人:"
                  prop="auditUserListIds">
          <Selector v-model="journal.auditUserListIds"
                    :multiple="true"
                    range="directlyAdmin" />
        </FormItem>

        <FormItem label="日报内容:"
                  prop="content">
          <Input v-model="journal.content"
                 type="textarea"
                 :autosize="{minRows: 3}"
                 placeholder="请填写内容" />
        </FormItem>

        <FormItem label="照片">
          <upload-pic @change="uploadImg"
                      v-model="journal.photos"></upload-pic>
        </FormItem>

        <FormItem>
          <Button v-if="showSubmit"
                  type="success"
                  size="large"
                  @click="handleSubmit('journal')">提交</Button>
          <Button v-else
                  type="warning"
                  size="large"
                  @click="handleReset('journal')">再写一份</Button>
        </FormItem>

      </Form>
    </Card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import UploadPic from '_c/upload/upload-pic'
import Selector from '_c/employees/selector'
import { createOne } from '@/api/daily'

export default {
  name: 'journalcreate',
  components: {
    Selector,
    UploadPic
  },
  data () {
    return {
      // 是否是编辑页面
      isEdit: false,
      // 显示提交按钮
      showSubmit: false,
      journal: {
        auditUserListIds: [],
        dailyType: '',
        content: '',
        photos: []
      },
      rule: {
        auditUserListIds: [
          { required: true, type: 'array', min: 1, message: '请选添加审批人', trigger: 'change' }
        ],
        dailyType: [
          { required: true, message: '请选择一种日报类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写日报', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    initPage (id) {
      this.showSubmit = true
    },

    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Loading.start()
          createOne(this.journal).then(res => {
            this.$Loading.finish()
            this.$Modal.success({
              title: '填写成功',
              onOk: () => {
                this.showSubmit = false
              }
            })
          }).catch(err => {
            this.$Loading.error()
            this.$Message.error(err.errorMsg || '提交失败')
          })
        } else {
          this.$Message.error('请填写必填项目')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.showSubmit = true
    },
    uploadImg (imgList) {
      this.journal.photos = imgList
    }

  },
  computed: {
    ...mapGetters([
      'isDepartmentAdmin',
      'userDepartment',
      'getUserInfo',
      // 'organization',
      'superAdmin',
      'getSuperiorAdmin'
    ])
  },
  created () {
    this.showSubmit = true
  }

}
</script>
<style lang="less" scoped>
@import "./form.less";
</style>
