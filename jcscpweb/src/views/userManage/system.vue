<template>
  <el-dialog title="系统参数" :visible.sync="dialog" width="30%">
    <template v-if="form">
      <el-form :model="form">
        <el-form-item label="密码错误次数：" :label-width="'180px'">
          <el-input-number v-model="form.passErr" controls-position="right" :min="1" :max="10" style="width: 240px;" />
        </el-form-item>
        <el-form-item label="员工账号默认密码：" :label-width="'180px'">
          <el-input v-model="form.customerHash" placeholder="请输入密码" show-password style="width: 240px;" />
        </el-form-item>
        <el-form-item label="客户账号默认密码：" :label-width="'180px'">
          <el-input v-model="form.employeeHash" placeholder="请输入密码" show-password style="width: 240px;" />
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
import { querySystemSet, updateSystemSet } from '../../api/systemSet'
export default {
  name: 'System',
  data() {
    return {
      dialog: false,
      form: null
    }
  },
  computed: {
    ...mapGetters([
      'myInfo'
    ])
  },
  methods: {
    show() {
      if (!this.form) {
        this.load()
        this.dialog = true
      } else {
        this.dialog = true
      }
    },
    load() {
      querySystemSet().then(res => {
        this.form = res
      })
    },
    save() {
      if (!this.judgeAuthority()) {
        this.$message.error(`对不起，您没有修改系统参数的权限，请联系管理员`)
        return
      }
      updateSystemSet(this.form).then(res => {
        this.load()
        this.$message.success(`系统参数已更新`)
        this.dialog = false
      })
    },
    judgeAuthority() {
      let bool = false
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin') {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === '系统参数') {
              const look = list[i].children[0]
              bool = !!checked.find(id => look.id.substr(0, id.length) === id)
              return
            } else if (list[i].children && list[i].children.length) {
              findFun(list[i].children)
            }
          }
        }
        findFun(pList)
      } else {
        bool = true
      }
      return bool
    }
  }
}
</script>

<style scoped>

</style>
