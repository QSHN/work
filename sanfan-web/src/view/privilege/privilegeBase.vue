<template>
  <div>
    <Card>
      <Button v-if="type" style="margin-bottom: 10px" @click="addModal.show=true">添加人员</Button>
      <Table :data="list" :columns="columns">
        <template slot-scope="{ row }" slot="gender">
          <span v-if="row.gender=='MALE'">男</span>
          <span v-if="row.gender=='FEMALE'">女</span>
<!--          <span v-if="row.gender!='MALE'&&row.gender!='FEMALE'"></span>-->
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button @click="setPrivilege(row)" size="small">设置权限</Button>
          <Button @click="deletePermission(row)" type="error" size="small" style="margin-left: 10px">删除</Button>
        </template>
      </Table>
    </Card>
    <Modal
      v-model="addModal.show"
      title="添加"
      @on-ok="add">
      <Form :label-width="80">
        <FormItem v-if="type=='DEPARTMENT'" label="所在部门">
          <Cascader :data="departmentTree" v-model="addModal.departmentId"></Cascader>
        </FormItem>
        <FormItem :label="(type=='DEPARTMENT'?'部门员工':'员工')">
          <Selector v-model="addModal.userId" range="allEmployee"></Selector>
        </FormItem>
        <FormItem v-if="type=='TEMPORARY'" label="时间范围">
          <DatePicker v-model="addModal.date" type="daterange" placement="bottom-end" placeholder="请选择开始与结束时间" style="width: 200px"></DatePicker>
        </FormItem>
        <permission v-model="addModal.privilege" :type="type"></permission>
      </Form>
    </Modal>
    <Modal
      v-model="editModal.show"
      title="设置权限"
      @on-ok="edit">
      <Form>
        <FormItem v-if="type=='TEMPORARY'" label="时间范围">
          <DatePicker v-model="editModal.date" type="daterange" placement="bottom-end" placeholder="请选择开始与结束时间" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
      <permission v-model="editModal.privilege" :type="type"></permission>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import permission from './components/permission'
import { authorization, getDefaultPermissions, employeePermissionList, employeePermission, deleteEmployeePermission } from '../../api/permission'
import { getOrganizationTree } from '../../api/company'
import Selector from '../../components/employees/selector'
export default {
  name: 'privilegeBase',
  components: {
    permission,
    Selector
  },
  props: {
    type: String
  },
  data () {
    return {
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
        }
      ],
      editModal: {
        show: false,
        userId: '',
        departmentId: [],
        privilege: [],
        date: []
      },
      addModal: {
        show: false,
        userId: '',
        user: {},
        date: [],
        departmentId: [],
        privilege: []
      },
      list: [],
      defaultPermissions: [],
      organizationTree: {},
      departmentTree: []
    }
  },
  computed: {
    ...mapGetters([
      'userDepartmentName',
      'contacts'
    ])
  },
  mounted () {
    this.updateList()
    getDefaultPermissions(this.type).then(res => {
      this.defaultPermissions = res.data
    })
    if (this.type === 'DEPARTMENT') {
      getOrganizationTree().then(res => {
        this.organizationTree = res.data
        this.departmentTree = this.pDepartmentTree()
      })
    }
    this.columns.push({ title: '开始时间', key: 'startTime' })
    this.columns.push({ title: '结束时间', key: 'endTime' })
    this.columns.push({ title: '操作', slot: 'action', width: 160 })
  },
  methods: {
    ...mapActions([
      'getContacts'
    ]),
    pDepartmentTree () {
      let dir = (list) => {
        let data = []
        for (let listKey in list) {
          let item = list[listKey]
          data.push({ label: item.name, value: item.id })
          if (item.children && item.children.length) {
            let children = dir(item.children)
            if (children.length) {
              data.push({ label: item.name + '', value: item.id + '_d', children: children })
            }
          }
        }
        return data
      }
      return dir(this.organizationTree.children)
    },
    updateList () {
      this.$Spin.show()
      employeePermissionList(this.type).then(res => {
        this.list = res.data
        this.$Spin.hide()
      }).catch(() => {
        this.$Spin.hide()
      })
    },
    setPrivilege (item) {
      this.$Spin.show()
      this.editModal.userId = item.employeeId
      this.editModal.user = item
      this.editModal.date = [item.startTime, item.endTime]
      employeePermission(item.id).then(res => {
        this.$Spin.hide()
        this.editModal.privilege = res.data.permissions
        this.editModal.show = true
      }).catch(() => {
        this.$Spin.hide()
        this.$Message.error(err.errorMsg)
      })
    },
    add () {
      this.$Spin.show()
      let data = {
        employeeId: this.addModal.userId,
        type: this.type,
        permissions: this.defaultPermissions
      }
      if (this.addModal.departmentId && this.addModal.departmentId.length) {
        data.departmentId = this.addModal.departmentId[0]
      }
      if (this.addModal.date.length === 2) {
        data.startTime = moment(this.addModal.date[0]).format('YYYY-MM-DD HH:MM:SS')
        data.endTime = moment(this.addModal.date[1]).format('YYYY-MM-DD HH:MM:SS')
      }

      authorization(data).then(() => {
        this.$Spin.hide()
        this.$Message.success('添加成功')
        this.updateList()
      }).catch((err) => {
        this.$Spin.hide()
        this.$Message.error(err.errorMsg)
      })
    },
    edit () {
      this.$Spin.show()
      let data = {
        employeeId: this.editModal.userId,
        type: this.type,
        permissions: this.editModal.privilege
      }
      if (this.addModal.departmentId && this.addModal.departmentId.length) {
        data.departmentId = this.addModal.departmentId[0]
      }
      if (this.editModal.date.length === 2) {
        data.startTime = moment(this.editModal.date[0]).format('YYYY-MM-DD HH:MM:SS')
        data.endTime = moment(this.editModal.date[1]).format('YYYY-MM-DD HH:MM:SS')
      }
      authorization(data).then(() => {
        this.$Spin.hide()
        this.$Message.success('修改成功')
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
