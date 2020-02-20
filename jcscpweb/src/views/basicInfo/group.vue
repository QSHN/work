<template>
  <el-dialog :title="isBI ? '基础资料组' : '分类'" :visible.sync="dialog" width="600px">
    <template v-if="form">
      <el-form :model="form">
        <el-form-item :label="isBI ? '组名：' : '分类：'" :label-width="'180px'">
          <el-input v-model="form.name" :placeholder="`请输入${isBI ? '组名' : '分类'}`" style="width: 240px;" />
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
export default {
  props: {
    isBI: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      form: {},
      group: [],
      success: null
    }
  },
  methods: {
    show(name, group, cb) {
      this.form = {
        name: name
      }
      this.group = group
      this.success = cb
      this.dialog = true
    },
    save() {
      const name = this.form.name.trim()
      if (!name) {
        this.$message.error(`${this.isBI ? '组名' : '分类'}不能为空`)
      } else {
        if (this.group.filter(f => f.name === name).length > 0) {
          this.$message.error(`已存在该${this.isBI ? '组' : '分类'}`)
        } else {
          this.success(name)
          this.dialog = false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
