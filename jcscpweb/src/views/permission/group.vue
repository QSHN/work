<template>
  <el-dialog :title="which === 'employee' ? '员工组' : '客户组'" :visible.sync="dialog" width="1000px" :show-close="false" :close-on-click-modal="false">
    <el-row type="flex">
      <el-table
        :data="groupData[which]"
        size="small"
        border
        resizable
      >
        <el-table-column
          prop="name"
          label="组名"
          sortable
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit('edit', scope.row, scope.$index)">编辑</el-button>
            <el-button type="text" size="small" @click="setP(scope.row.id)">权限管理</el-button>
            <el-button type="text" size="small" style="color: #F56C6C" @click="edit('delete', scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="form" style="margin-left: 30px;">
        <el-form :model="form" :inline="true">
          <el-form-item label="组名：">
            <el-input v-model="form.name" placeholder="请输入组名" style="width: 228px;" size="small" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" @click="saveForm">{{ form._index !== undefined ? '保存' : '添加' }}</el-button>
            <el-button type="primary" size="small" @click="edit('add', null)">清空</el-button>
          </el-form-item>
        </el-form>

        <el-transfer
          v-model="form.userList"
          :data="userList"
          :titles="[which === 'employee' ? '所有员工' : '所有客户', form.name || '待输入']"
        />
      </div>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialog = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateUserGroup } from '../../api/user'
import { mapGetters } from 'vuex'
export default {
  props: {
    group: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      form: null,
      groupData: {},
      which: null
    }
  },
  computed: {
    ...mapGetters([
      'allUserList'
    ]),
    userList() {
      const list = []
      this.allUserList.map((v, i) => {
        if (v.role === (this.which === 'employee' ? 'company' : 'client') && v.accountStatus !== '已删除') {
          list.push({
            key: v._id,
            id: v._id,
            label: v.name
          })
        }
      })
      return list
    }
  },
  watch: {
    group: {
      handler() {
        if (this.group) this.groupData = JSON.parse(JSON.stringify(this.group))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    show(which) {
      this.form = {
        id: '',
        name: '',
        userList: []
      }
      this.which = which
      this.dialog = true
    },
    saveForm() {
      const obj = JSON.parse(JSON.stringify(this.form))
      if (obj.name) {
        if (
          this.groupData.customer.find(f => f.name === obj.name && f.id !== obj.id) ||
          this.groupData.employee.find(f => f.name === obj.name && f.id !== obj.id)
        ) {
          this.$message.error('已存在该组名')
        } else {
          if (obj.id) {
            const index = obj._index
            delete obj._index
            this.groupData[this.which].splice(index, 1, obj)
          } else {
            obj.id = new Date().getTime()
            this.groupData[this.which].push(obj)
          }
          updateUserGroup(this.groupData).then(res => {
            this.$emit('loadGroup')
            this.$message.success('保存成功')
          })
        }
      } else {
        this.$message.error('组名必填')
      }
    },
    edit(action, row, index) {
      switch (action) {
        case 'edit':
          this.form = Object.assign({}, row)
          this.form._index = index
          break
        case 'add':
          this.form = {
            id: '',
            name: '',
            userList: []
          }
          break
        case 'delete':
          this.$confirm(`确定删除该组吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.groupData[this.which].splice(index, 1)
            updateUserGroup(this.groupData).then(res => {
              this.$emit('loadGroup')
              this.$message.success('删除成功')
            })
          }).catch(() => {
          })
          break
      }
    },
    setP(id) {
      this.$emit('setPermission', null, id)
    }
  }
}
</script>

<style scoped>

</style>
