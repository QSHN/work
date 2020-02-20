<template>
  <Modal
    v-model="modal"
    :title="`${title}管理`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="800"
    @on-cancel="cancel">
    <Row style="margin-bottom: 10px;">
      <Button type="success" @click="setInfo('add', null)">添加{{title}}</Button>
    </Row>

    <Table border ref="userTable" :columns="infoColumns" :data="infoList" :height="480" style="width: 100%">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="setInfo('edit', row)">修改</Button>
        <Button type="error" size="small" style="margin-right: 5px" @click="setInfo('delete', row)">删除</Button>
      </template>
    </Table>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  updateSelectInfo,
  deleteSelectInfo
} from '../../api/selectInfo'
export default {
  name: 'index',
  data () {
    return {
      modal: false,
      title: '',
      category: '',
      infoList: [],
      infoColumns: [
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    show (title, category, list) {
      this.modal = true
      this.title = title
      this.category = category
      this.infoList = list
    },
    cancel () {
      this.title = ''
      this.category = ''
      this.infoList = []
      this.modal = false
    },
    setInfo (type, item) {
      let formData
      let edit = (title, info) => {
        let newObj = Object.assign({}, info)
        this.$Modal.confirm({
          title: `${title}${this.title}`,
          render: (h) => {
            return h('div', [
              h('Input', {
                props: {
                  value: newObj.code,
                  readonly: true
                },
                style: {
                  marginTop: '10px'
                }
              }),
              h('Input', {
                props: {
                  value: newObj.name,
                  autofocus: true,
                  placeholder: `输入名称`
                },
                style: {
                  marginTop: '20px'
                },
                on: {
                  input: (val) => {
                    newObj.name = val
                  }
                }
              })
            ])
          },
          onOk: () => {
            if (newObj.code && newObj.name) {
              if (newObj.name !== formData.name && this.infoList.filter(v => v.name.trim() === newObj.name.trim()).length) {
                this.$Notice.error({
                  title: `${title}${this.title}`,
                  desc: `已存在该${this.title}名称，无法${title}`
                })
              } else {
                formData = newObj
                updateSelectInfo(formData).then(res => {
                  this.$Notice.success({
                    title: `${this.title}`,
                    desc: `成功${title}${this.title}：${formData.name}`
                  })
                  if (formData._id) {
                    this.infoList.forEach(v => {
                      if (v._id === formData._id) {
                        v.name = formData.name
                      }
                    })
                    this.$forceUpdate()
                  } else {
                    this.infoList.push(formData)
                  }
                  this.$store.dispatch('getSelectInfo', this.accountSet._id)
                }).catch(err => {
                  this.$Notice.error({
                    title: `${this.title}`,
                    desc: err.message
                  })
                })
              }
            } else {
              this.$Notice.error({
                title: `${title}${this.title}`,
                desc: `${this.title}名称必填`
              })
            }
          }
        })
      }
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            code: this.category + (this.infoList.length + 1),
            name: '',
            category: this.category
          }
          edit('新增', formData)
          break
        case 'edit':
          formData = Object.assign({}, item)
          edit('修改', formData)
          break
        case 'delete':
          this.$Modal.confirm({
            title: `删除${this.title}`,
            content: `是否删除${this.title}：${item.name}`,
            onOk: () => {
              deleteSelectInfo({
                id: item._id
              }).then(res => {
                this.$Notice.success({
                  title: `${this.title}`,
                  desc: `成功删除${this.title}：${item.name}`
                })
                this.infoList.forEach((v, i) => {
                  if (v._id === item._id) {
                    this.infoList.splice(i, 1)
                  }
                })
                this.$store.dispatch('getSelectInfo', this.accountSet._id)
              }).catch(err => {
                this.$Notice.error({
                  title: `${this.title}`,
                  desc: err.message
                })
              })
            }
          })
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
