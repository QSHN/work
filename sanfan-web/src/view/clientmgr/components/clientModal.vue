<template>
  <Modal v-model="modal"
         width="1050"
         :title="title + classify"
         :loading="isCommit"
         class="clientModal"
         @on-ok="ok"
         @on-cancel="cancel">
    <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="125">
      <Row>
        <Col span="12">
          <FormItem :label="classify + '名称：'"  prop="name">
            <Input v-model="formData.name" :maxlength="30" style="width: 300px" :placeholder="`请填写${classify}名称`" :disabled="isLook"></Input>
          </FormItem>

          <FormItem :label="classify + '归属：'" prop="clientBelong">
            <RadioGroup v-model="formData.clientBelong">
              <Radio label="DEPARTMENT" :disabled="isLook">部门（公有）</Radio>
              <Radio label="MINE" :disabled="isLook">我的（私有）</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem :label="classify + '类型：'" prop="typeId">
            <Select v-model="formData.typeId" :disabled="isLook" filterable style="width: 300px">
              <Option v-for="item in clientType"
                      :value="item.id"
                      :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>

          <FormItem :label="classify + '等级：'" prop="levelId">
            <Select v-model="formData.levelId" :disabled="isLook" filterable style="width: 300px">
              <Option v-for="item in clientLevel"
                      :value="item.id"
                      :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>

          <FormItem :label="classify + '区域：'" prop="areaId">
            <Cascader :data="cityData" :disabled="isLook" v-model="formData.areaId" style="width: 300px"></Cascader>
          </FormItem>

          <FormItem :label="classify + '意向：'" prop="intentionId">
            <Select v-model="formData.intentionId" :disabled="isLook" filterable style="width: 300px">
              <Option v-for="item in clientIntention"
                      :value="item.id"
                      :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>

          <FormItem label="经手人：">
            <employee-selector :multiple="false"
                               :range="'allEmployee'"
                               :disabled="isLook"
                               v-model="formData.operatorId"
                               style="width: 305px" />
          </FormItem>

          <FormItem :label="classify + '地址：'" prop="address">
            <span v-if="formData.address" style="margin-right: 10px">{{formData.address}}</span>
            <Button type="success" @click="$refs.amapsearch.show()" :disabled="isLook">定位</Button>
          </FormItem>

          <FormItem label="详细地址：" style="margin-bottom: 15px">
            <Input v-model="formData.detailedAddress" style="width: 300px" placeholder="补充详细地址" :disabled="isLook"></Input>
          </FormItem>

          <FormItem label="图片：" style="margin-bottom: 5px">
            <upload-pic v-model="formData.photos"  :disabled="isLook" />
          </FormItem>

          <FormItem label="备注：" :disabled="isLook">
            <Input v-model="formData.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="`请填写${classify}备注`" style="width: 300px" :disabled="isLook"  />
          </FormItem>
        </Col>

        <Col span="12">
          <FormItem :label="classify + '联系人：'" prop="clientLinkmanDTOList" class="contacts">
            <span style="height: 4px; display: block;"></span>
          </FormItem>

          <FormItem v-for="(v, i) in formData.clientLinkmanDTOList" :key="i" :label="'姓名：' + v.name" >
            <span>手机号：{{v.tel}}</span>
            <Button type="info" size="small" style="margin-left: 10px;" @click="$refs.contactTable.select(v)" :disabled="isLook">修改</Button>
            <Button type="error" size="small" style="margin-left: 10px;" @click="deleteContact(v.id)" :disabled="isLook || getUserInfo.role !== 'SUPERADMIN'">删除</Button>
          </FormItem>

          <template v-if="!isLook">
            <contact-table ref="contactTable" @add="addContact"/>
          </template>
        </Col>
      </Row>
    </Form>

    <amap-search @location="getLocation" ref="amapsearch"/>
  </Modal>
</template>

<script>
import amapSearch from '_c/amap/search.vue'
import uploadPic from '_c/upload/upload-pic.vue'
import contactTable from './contactTable'
import { setClient } from '@/api/client'
import { mapGetters, mapActions } from 'vuex'
import { selectData } from '@/libs/select.js'
import EmployeeSelector from '_c/employees/selector.vue'
export default {
  name: 'clientModal',
  components: {
    amapSearch,
    uploadPic,
    contactTable,
    EmployeeSelector
  },
  props: {
    classify: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      title: '',
      modal: false,
      isCommit: true,
      isLook: false,
      formData: {
        name: '',
        clientBelong: 'DEPARTMENT',
        typeId: '',
        levelId: '',
        areaId: [],
        intentionId: '',
        operatorId: '',
        address: '',
        longitude: '',
        latitude: '',
        detailedAddress: '',
        photos: [],
        note: '',
        clientLinkmanDTOList: []
      },
      ruleValidate: {
        name: [
          { required: true, message: `请选择${this.classify}名称`, trigger: 'blur' }
        ],
        clientBelong: [
          { required: true, message: `请选择${this.classify}归属`, trigger: 'change' }
        ],
        typeId: [
          { required: true, message: `请选择${this.classify}类型`, trigger: 'change' }
        ],
        levelId: [
          { required: true, message: `请选择${this.classify}等级`, trigger: 'change' }
        ],
        areaId: [
          { required: true, message: `请选择${this.classify}区域`, trigger: 'change', type: 'array' }
        ],
        intentionId: [
          { required: true, message: `请选择${this.classify}意向`, trigger: 'change' }
        ],
        address: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formData.address && this.formData.longitude && this.formData.latitude) {
                callback()
              } else {
                callback(new Error('请选择客户地址'))
              }
            }
          }
        ],
        clientLinkmanDTOList: [
          {
            type: Array,
            required: true,
            validator: (rule, value, callback) => {
              if (this.formData.clientLinkmanDTOList.length) {
                callback()
              } else {
                callback(new Error('请创建客户联系人'))
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'clientLevel',
      'clientType',
      'clientIntention',
      'cityData',
      'getUserInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getCompanySetting',
      'getCityData'
    ]),
    selectData,
    getLocation (location) {
      if (!location) return
      this.formData.address = location.address
      this.formData.longitude = location.position[0]
      this.formData.latitude = location.position[1]
      this.$forceUpdate()
    },
    addContact (data) {
      let isAdd = true
      this.formData.clientLinkmanDTOList.forEach((v, i) => {
        if (v._id === data._id || v.phone === data.phone) {
          this.formData.clientLinkmanDTOList[i] = data
          isAdd = false
          this.$forceUpdate()
        }
      })
      if (isAdd) this.formData.clientLinkmanDTOList.push(data)
    },
    deleteContact (id) {
      this.formData.clientLinkmanDTOList.forEach((v, i) => {
        if (v._id === id) {
          this.formData.clientLinkmanDTOList.splice(i, 1)
        }
      })
    },
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    loadAreaId (cbArr, arr, id) {
      cbArr.unshift(id)
      arr.forEach(v => {
        if (v.value !== id && v.children && v.children.length) {
          v.children.forEach(v1 => {
            if (v1.value === id) {
              cbArr.unshift(v.value)
            } else if (v1.children && v1.children.length) {
              v1.children.forEach(v2 => {
                if (v2.value === id) {
                  cbArr.unshift(v1.value)
                  cbArr.unshift(v.value)
                }
              })
            }
          })
        }
      })
      return cbArr
    },
    show (data, isLook) {
      if (data) {
        let fD = Object.assign({}, data)
        this.formData = fD
        this.formData.areaId = this.loadAreaId([], this.cityData, fD.areaId)
        this.formData.photos = data.photos.filter(v => v.length)
      }
      // this.formData.areaId = this.loadAreaId([], this.cityData, '310101')
      console.log('formData', this.formData)
      this.title = data.id ? isLook ? '查看' : '编辑' : '新建'
      this.formData.clientGroup = this.classify === '商家' ? 'MERCHANT' : 'CLIENT'
      this.modal = true
      this.isLook = isLook
    },
    ok () {
      if (this.isLook) {
        this.cancel()
        return
      }
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.formData)
          data.belongToWhoID = data.clientBelong === 'MINE' ? this.getUserInfo.id : this.getUserInfo.departmentId
          data.areaId = data.areaId[data.areaId.length - 1]
          console.log(data)
          setClient(data, data._id).then((res) => {
            this.$emit('update')
            this.cancel()
          }).catch((err) => {
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
              this.changeStatus()
            }
          })
          this.changeStatus()
        } else {
          this.changeStatus()
        }
      })
    },
    cancel () {
      this.$refs.formValidate.resetFields()
      this.changeStatus()
      this.formData = {
        name: '',
        clientBelong: 'DEPARTMENT',
        typeId: '',
        levelId: '',
        areaId: [],
        intentionId: '',
        operatorId: '',
        address: '',
        longitude: '',
        latitude: '',
        detailedAddress: '',
        photos: [],
        note: '',
        clientLinkmanDTOList: []
      }
      if (!this.isLook) this.$refs.contactTable.clear()
      this.modal = false
    }
  },
  created () {
    this.getCompanySetting('CLIENT_LEVEL')
    this.getCompanySetting('CLIENT_TYPE')
    this.getCompanySetting('INTENTION_TYPE')
    this.getCityData()
  }
}
</script>

<style lang="less">
  .clientModal {
    .contacts label {
      text-align: left;
      padding-left: 6px;
    }
  }
</style>
