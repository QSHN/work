<template>
  <el-dialog title="创建基础资料" :visible.sync="dialog" width="30%">
    <template v-if="form">
      <el-form :model="form">
        <el-form-item label="名称：" :label-width="'180px'">
          <el-input v-model="form.name" placeholder="请输入名称" style="width: 240px;" />
        </el-form-item>

        <el-form-item label="组名：" :label-width="'180px'">
          <el-select v-model="form.gId" placeholder="请选择" size="small" clearable>
            <el-option
              v-for="(v1, i1) in group"
              :key="i1"
              :label="v1.name"
              :value="v1.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateBasicInfo } from '../../api/basicInfo'
import pinyin from 'pinyin'
export default {
  name: 'CreateBI',
  data() {
    return {
      dialog: false,
      form: {},
      action: 'add',
      which: null,
      editData: {},
      group: []
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo',
      'basicData'
    ])
  },
  methods: {
    show(action, item, which, group, groupName) {
      this.form = {
        gId: item ? item.gId : group.find(g => g.name === groupName).id,
        name: item ? item.name : ''
      }
      this.action = action
      this.which = which
      this.editData = item
      this.group = group
      this.dialog = true
    },
    save() {
      const name = this.form.name.trim()
      if (!name) {
        this.$message.error('名称不能为空')
      } else {
        let isHave = false
        let num = 0
        let code = pinyin(name.substr(0, 2), {
          style: pinyin.STYLE_NORMAL
        }).join('')
        for (const i in this.basicInfo) {
          if (this.basicInfo[i].name === name && this.which !== i) isHave = true
          const index = i.indexOf('_')
          if (i.substr(0, index > 0 ? index : i.length) === code) num++
        }
        if (isHave) {
          this.$message.error('已存在该名称')
        } else {
          if (num > 0) code += ('_' + num)
          let obj = null
          if (this.action === 'edit') {
            obj = JSON.parse(JSON.stringify(this.editData))
            obj.name = name
            obj.gId = this.form.gId
          } else {
            obj = {
              gId: this.form.gId,
              name: name,
              group: [
                { id: 1, name: '默认' }
              ],
              temp: [
                {
                  name: name,
                  code: code,
                  type: 'input',
                  val: null
                }
              ],
              list: []
            }
          }
          // const ajaxData = JSON.parse(JSON.stringify(this.basicData))
          // this.$set(ajaxData.info, this.which || code, obj)
          // console.log(ajaxData.info)
          updateBasicInfo({
            type: this.action === 'edit' ? 'updateBI' : 'addBI',
            which: this.which || code,
            setData: obj
          }).then(res => {
            this.$store.dispatch('basicInfo/queryBasicInfo')
            this.dialog = false
          })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
