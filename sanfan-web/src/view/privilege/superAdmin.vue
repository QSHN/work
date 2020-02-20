<template>
  <div>
    <Card>
      <Button v-if="type" style="margin-bottom: 10px" @click="addModal.show=true">添加超级管理员</Button>
      <Table :data="list" :columns="columns">
        <template slot-scope="{ row }" slot="gender">
          <span v-if="row.gender=='MALE'">男</span>
          <span v-if="row.gender=='FEMALE'">女</span>
          <!--          <span v-if="row.gender!='MALE'&&row.gender!='FEMALE'"></span>-->
        </template>
        <template slot-scope="{ row }" slot="action">
<!--          <Button @click="setPrivilege(row)" size="small">设置权限</Button>-->
          <Button @click="deletePermission(row)" type="error" size="small" style="margin-left: 10px">删除</Button>
        </template>
      </Table>
    </Card>
    <Modal
      v-model="addModal.show"
      title="设置超级管理员"
      @on-ok="add">
      <Selector v-model="addModal.userId" range="allEmployee"></Selector>
    </Modal>
  </div>
</template>

<script>
import permission from './components/permission'
import { authorization, deleteEmployeePermission, employeePermissionList } from '../../api/permission'
import Selector from '../../components/employees/selector'
export default {
  name: 'privilegeBase',
  components: {
    permission,
    Selector
  },
  data () {
    return {
      type: 'SUPERADMIN',
      columns: [
        {
          title: '名字',
          key: 'employeeName'
        },
        {
          title: '部门',
          key: 'departmentName'
        },
        {
          title: '权限',
          key: 'typeName'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      list: [],
      addModal: {
        show: false,
        userId: ''
      }
    }
  },
  computed: {
  },
  mounted () {
    this.updateList()
  },
  methods: {
    updateList () {
      this.$Spin.show()
      employeePermissionList(this.type).then(res => {
        this.list = res.data
        this.$Spin.hide()
      }).catch(() => {
        this.$Spin.hide()
      })
    },
    add () {
      this.$Spin.show()
      authorization({
        employeeId: this.addModal.userId,
        type: this.type
      }).then(() => {
        this.$Spin.hide()
        this.$Message.success('添加成功')
        this.updateList()
      }).catch(() => {
        this.$Spin.hide()
        this.$Message.error(err.errorMsg)
      })
    },
    deletePermission (item) {
      deleteEmployeePermission(item.id).then(res => {
        this.$Message.success('删除成功')
        this.updateList()
      }).catch(() => {
        this.$Message.error(err.errorMsg)
      })
    }
  }
}
</script>

<style scoped>

</style>
