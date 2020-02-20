<template>
  <Modal
    v-model="modal"
    title="修改标题"
    :mask-closable="false"
    width="1000"
    @on-cancel="cancel">

    <Row type="flex" style="line-height: 32px; margin-bottom: 10px;">
      <p style="width: 100px; text-align: right; margin-right: 5px;">标题：</p>
      <Input v-model="formData.val" style="width: 200px" />
    </Row>

    <Row v-if="formData.type" type="flex" style="line-height: 32px; margin-bottom: 10px;">
      <p style="width: 100px; text-align: right; margin-right: 5px;">类型：</p>
      <RadioGroup v-model="formData.type" style="margin-right: 10px;">
        <Radio label="title" style="margin-right: 20px;">标题</Radio>
        <Radio label="formula">公式</Radio>
      </RadioGroup>
    </Row>

    <Row type="flex" style="line-height: 32px; margin-bottom: 10px;">
      <p style="width: 100px; text-align: right; margin-right: 5px;">对齐方式：</p>
      <RadioGroup v-model="formData.align" style="margin-right: 10px;">
        <Radio label="left" style="margin-right: 20px;">左对齐</Radio>
        <Radio label="center">居中</Radio>
      </RadioGroup>
    </Row>

    <Row v-if="formData.align === 'left'"  type="flex" style="line-height: 32px; margin-bottom: 10px;">
      <p style="width: 100px; text-align: right; margin-right: 5px;">左间距：</p>
      <InputNumber v-model="formData.padding" style="width: 200px" />
    </Row>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button @click="sure">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { formulaUpdate } from '../../api/formula'
export default {
  name: 'currency',
  data () {
    return {
      modal: false,
      type: '',
      which: '',
      formData: {},
      row: {},
      ajaxData: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    show (type, data, row, which) {
      this.modal = true
      this.type = type
      this.which = which
      this.ajaxData = JSON.parse(JSON.stringify((data)))
      this.row = JSON.parse(JSON.stringify((row)))
      this.formData = JSON.parse(JSON.stringify(row[which]))
    },
    cancel () {
      this.modal = false
      this.formData = {}
      this.row = {}
      this.ajaxData = []
    },
    sure () {
      this.ajaxData[this.row._index][this.which] = this.formData
      let fData = {
        accountSetId: this.accountSet._id,
        list: this.ajaxData,
        type: this.type
      }
      formulaUpdate(fData).then(res => {
        this.cancel()
        this.$emit('load')
      }).catch(err => {
        this.$Notice.error({
          title: '标题',
          desc: err.message
        })
      })
    },
    editRow (isDelete, type, data, index) {
      this.$Modal.confirm({
        title: `${isDelete ? '删除' : '增加'}`,
        content: `确定是否${isDelete ? '删除该行' : '增加一行'}`,
        onOk: () => {
          let list = JSON.parse(JSON.stringify(data))
          let error = ''
          if (isDelete) {
            if (list.length <= 2) {
              error = '至少两行，无法删除'
            } else {
              list.splice(index, 1)
            }
          } else {
            let obj = JSON.parse(JSON.stringify(list[index]))
            for (let key in list[0]) {
              if (list[0][key].type === 'formula') {
                delete obj[key].formula
              }
              obj[key].val = null
            }
            list.push(obj)
          }
          if (error) {
            this.$Message.error(error)
          } else {
            let fData = {
              accountSetId: this.accountSet._id,
              list: list,
              type: type
            }
            formulaUpdate(fData).then(res => {
              this.cancel()
              this.$emit('load')
            }).catch(err => {
              this.$Notice.error({
                title: '标题',
                desc: err.message
              })
            })
          }
        }
      })
    },
    editColumn (isDelete, type, data, key) {
      this.$Modal.confirm({
        title: `${isDelete ? '删除' : '增加'}`,
        content: `确定是否${isDelete ? '删除该列' : '增加一列'}`,
        onOk: () => {
          let list = []
          let updateList = () => {
            let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
            data.forEach(f => {
              let obj = {}
              let i = 0
              for (let k in f) {
                if (k === key) {
                  if (!isDelete) {
                    this.$set(obj, arr[i], f[k])
                    i++
                    let add = Object.assign({}, f[k])
                    if (add.formula) delete add.formula
                    add.val = add.type ? '' : null
                    this.$set(obj, arr[i], add)
                    i++
                  }
                } else {
                  this.$set(obj, arr[i], f[k])
                  i++
                }
              }
              list.push(obj)
            })
          }
          let error = ''
          if (isDelete) {
            if (Object.keys(data[0]).length <= 2) {
              error = '至少两列，无法删除'
            } else {
              updateList()
            }
          } else {
            if (Object.keys(data[0]).length > 26) {
              error = '该表格列数超过限制，无法在添加'
            } else {
              updateList()
            }
          }
          if (error) {
            this.$Message.error(error)
          } else {
            let fData = {
              accountSetId: this.accountSet._id,
              list: list,
              type: type
            }
            formulaUpdate(fData).then(res => {
              this.cancel()
              this.$emit('load')
            }).catch(err => {
              this.$Notice.error({
                title: '标题',
                desc: err.message
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
