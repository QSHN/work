<template>
  <el-dialog key="purchaseTempType" title="分类" :visible.sync="dialog" width="30%" :show-close="false" :close-on-click-modal="false">
    <template v-if="form">
      <el-form :model="form">
        <el-form-item label="分类：" :label-width="'180px'">
          <el-input v-model="form.name" placeholder="请输入分类" style="width: 240px;" />
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
import pinyin from 'pinyin'
export default {
  data() {
    return {
      dialog: false,
      form: {},
      tempDate: {},
      which: null,
      success: null
    }
  },
  methods: {
    show(obj, tempDate, which, cb) {
      this.form = obj ? JSON.parse(JSON.stringify(obj)) : {
        name: '',
        code: '',
        type: which,
        temp: []
      }
      this.tempDate = tempDate
      this.which = which
      this.success = cb
      this.dialog = true
    },
    save() {
      const name = this.form.name.trim()
      if (!name) {
        this.$message.error('分类不能为空')
      } else {
        let isHave = false
        let num = 0
        let code = pinyin(name.substr(0, 2), {
          style: pinyin.STYLE_NORMAL
        }).join('')
        for (const k in this.tempDate) {
          const item = this.tempDate[k]
          if (item.name === name && item.type === this.which) isHave = true
          const index = k.indexOf('_')
          if (k.substr(0, index > 0 ? index : k.length) === code) num++
        }
        if (isHave) {
          this.$message.error('已存在该名称')
        } else {
          if (num > 0) code += ('_' + num)
          if (!this.form.code) this.form.code = code
          this.success(this.form)
          this.dialog = false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
