<template>
  <Modal
    v-model="modal"
    width="500"
    title="查看拜访详情"
    @on-ok="cancel"
    @on-cancel="cancel">
    <template v-if="visitData">
      <Tabs type="card" tab="card">
        <TabPane label="拜访详情">
          <Form :label-width="120">
            <FormItem :label="`拜访${visitData.clientGroup === 'CLIENT' ? '客户' : '商家'}：`">
              <span>{{visitData.clientName}}</span>
            </FormItem>

            <FormItem :label="`${visitData.clientGroup === 'CLIENT' ? '客户' : '商家'}联系人：`">
              <span>{{visitData.clientLinkmanName}}</span>
            </FormItem>

            <FormItem :label="`${visitData.clientGroup === 'CLIENT' ? '客户' : '商家'}类型：`">
              <span>{{visitData.typeName}}</span>
            </FormItem>

            <FormItem label="拜访方式：">
              <span>{{visitData.clientVisitingType === 'TEL' ? '电话拜访' : '走访拜访'}}</span>
            </FormItem>

            <FormItem label="截止时间：">
              <span>{{visitData.deadline}}</span>
            </FormItem>

            <FormItem label="拜访人：" >
              <span>{{visitData.visitorList && visitData.visitorList[0].name}}</span>
            </FormItem>

            <FormItem label="拜访内容：">
              <Input :value="visitData.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 240px"  readonly>
              </Input>
            </FormItem>

            <FormItem label="图片：" style="margin-bottom: 5px">
              <upload-pic :defaultList="visitData.visitingPhotos" :disabled="true" />
            </FormItem>
          </Form>
        </TabPane>

        <TabPane label="拜访结果">
          <span v-if="visitData.clientVisitingStatus === 'CREATED' && moment().isAfter(visitData.deadline)">很遗憾，该拜已失效，以后记得按时拜访</span>
          <span v-else-if="visitData.clientVisitingStatus === 'CREATED'">你还没有完成拜访，请到手机端完成拜访</span>
          <span v-else-if="visitData.clientVisitingStatus === 'CANCELED'">该拜访已取消</span>
          <Form :label-width="120" v-else>
            <FormItem label="拜访时间：">
              <span>{{visitData.finishedAt && moment(visitData.visitTime).format('YYYY-MM-DD')}}</span>
            </FormItem>

            <FormItem label="拜访位置：" v-if="visitData.type === '走访'">
              <span>{{visitData.location}}</span>
            </FormItem>

            <FormItem label="拜访相片：">
              <upload-pic :defaultList="visitData.visitedPhotos.filter(v => v.length) || []" :disabled="true" />
            </FormItem>

            <FormItem label="拜访总结：">
              <Input :value="visitData.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 240px"  readonly>
              </Input>
            </FormItem>
          </Form>
        </TabPane>

        <span slot="extra" style="color: red; display: block; height: 30px; line-height: 30px;">PC端不支持完成拜访任务，请在手机端完成</span>
      </Tabs>
    </template>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import uploadPic from '_c/upload/upload-pic.vue'
import moment from 'moment'
export default {
  name: 'visitDetail',
  components: { uploadPic },
  data () {
    return {
      modal: false,
      visitData: null,
      card: '拜访详情'
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    moment,
    show (data) {
      this.visitData = data
      this.visitData.visitingPhotos = data.visitingPhotos.filter(v => v.length)
      this.modal = true
    },
    cancel () {
      this.modal = false
      this.visitData = null
      this.card = '拜访详情'
    }
  }
}
</script>

<style scoped>

</style>
