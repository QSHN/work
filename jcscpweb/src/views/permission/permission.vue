<template>
  <el-dialog title="权限管理" class="purchase_temp" :visible.sync="dialog" width="600px" :show-close="false" :close-on-click-modal="false">
    <template v-if="permission">
      <el-tree
        :data="getPermission"
        show-checkbox
        node-key="id"
        :default-expanded-keys="permission.expanded"
        :default-checked-keys="checked"
        :props="defaultProps"
        @check-change="handleCheckChange"
      />
    </template>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialog = false">取 消</el-button>
      <el-button size="small" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryPermission, updatePermission } from '../../api/permission'
export default {
  data() {
    return {
      dialog: false,
      permission: null,
      checked: [],
      disabled: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    getPermission() {
      const list = this.permission ? this.permission.permission : []
      if (this.disabled.length) {
        this.setDisabled(list)
        console.log(list)
      }
      return list
    }
  },
  watch: {
    permission: {
      handler() {
        if (this.permission) {
          let list = []
          const disabled = []
          list = Object.assign([], this.permission.checked)
          if (this.permission.groupChecked) {
            this.permission.groupChecked.forEach(f => {
              disabled.push(f)
              if (!list.includes(f)) list.push(f)
            })
          }
          this.disabled = disabled
          this.checked = list
        }
      },
      deep: true
    }
  },
  methods: {
    show(userId, groupId) {
      const filter = {}
      if (userId) filter.userId = userId
      if (groupId) filter.groupId = groupId
      this.permission = null
      this.checked = []
      this.disabled = []
      queryPermission(filter).then(res => {
        this.permission = res
      })
      this.dialog = true
    },
    setDisabled(list) {
      list.forEach(v1 => {
        if (this.disabled.includes(v1.id)) {
          v1.disabled = true
        } else {
          if (v1.disabled) delete v1.disabled
        }
        if (v1.children && v1.children.length) this.setDisabled(v1.children)
      })
    },
    handleCheckChange(data, checked) {
      if (checked) {
        if (!this.checked.includes(data.id)) {
          this.checked.push(data.id)
        }
      } else {
        const index = this.checked.indexOf(data.id)
        if (index > -1) {
          this.checked.splice(index, 1)
        }
      }
    },
    save() {
      const ajaxData = JSON.parse(JSON.stringify(this.permission))
      ajaxData.checked = this.checked
      if (this.permission.groupChecked) {
        const checked = []
        this.checked.forEach(f => {
          if (!this.permission.groupChecked.includes(f)) checked.push(f)
        })
        ajaxData.checked = checked
      }
      updatePermission(ajaxData).then(res => {
        this.$message.success('保存成功')
        this.dialog = false
      })
    }
  }
}
</script>

<style lang="scss">
  .purchase_temp {
    .el-dialog {
      margin-top: 0 !important;
    }
    .el-dialog__body {
      padding-top: 0;
    }
  }
</style>
