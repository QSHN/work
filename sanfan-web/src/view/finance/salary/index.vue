<template>
  <Card>
    <div class="search-con search-con-top">
      <Input class="search-col" v-model="search" placeholder="全局搜索"></Input>
    </div>
    <Table border :columns="columns" :data="search?searchDate:tableData">
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="!row.edit" type="primary" size="small" style="margin-right: 5px" @click="row.edit=true">编辑</Button>
        <Button v-if="row.edit" type="primary" size="small" style="margin-right: 5px" @click="row.edit=false;row.salaryEdit=row.salary">取消</Button>
        <Button v-if="row.edit" type="error" size="small" @click="save(row)">保存</Button>
      </template>
      <template slot-scope="{ row, index }" slot="salary">
        <Input v-if="row.edit" v-model="row.salaryEdit"></Input>
        <strong v-else>{{row.salary}}</strong>
      </template>
    </Table>
  </Card>
</template>
<style lang="less" scoped>
  .search-con{
    text-align: right;
    padding: 10px 0;
    .search{
      &-col{
        display: inline-block;
        width: 200px;
        margin-right: 6px;
      }
      &-input{
        display: inline-block;
        width: 200px;
        margin-left: 2px;
      }
      &-btn{
        margin-left: 2px;
      }
    }
  }
</style>
<script>
import { mapGetters } from 'vuex'
import { setSalary } from '@/api/company'
import { getAllEmployee } from '@/api/employee'
export default {
  name: 'Salary',
  data () {
    return {
      search: '',
      searchDate: [],
      tableData: [],
      columns: [
        {
          title: '名字',
          key: 'name',
          sortable: true
        },
        {
          title: '性别',
          key: 'gender',
          sortable: true
        },
        {
          title: '手机',
          key: 'phone',
          sortable: true
        },
        {
          title: '部门',
          key: 'departmentName',
          sortable: true
        },
        {
          title: '薪资',
          slot: 'salary',
          key: 'salary',
          sortable: true
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ]
    }
  },
  watch: {
    search (value) {
      if (value === '') this.searchDate = []
      this.searchDate = this.tableData.filter(item => {
        if (item.name && item.name.toString().indexOf(value) !== -1) return true
        if (item.gender && item.gender.toString().indexOf(value) !== -1) return true
        if (item.phone && item.phone.toString().indexOf(value) !== -1) return true
        if (item.department && item.department.toString().indexOf(value) !== -1) return true
        if (item.salary && item.salary.toString().indexOf(value) !== -1) return true
        return false
      })
    }
  },
  computed: {
    ...mapGetters([
      'personnel',
      'userDepartmentName'
    ])
  },
  mounted () {
    // this.tableData = deepCopy(this.personnel)
    getAllEmployee().then(res => {
      this.tableData = res.data
      this.tableData.forEach(item => {
        this.$set(item, 'salaryEdit', item.salary)
        this.$set(item, 'edit', false)
        if (item.gender === 'FEMALE') item.gender = '女'
        if (item.gender === 'MALE') item.gender = '男'
        if (item.gender === 'UNKNOWN') item.gender = '未知'
      })
    })
  },
  methods: {
    save (item) {
      item.edit = false
      setSalary({ id: item.id, salary: item.salaryEdit }).then(res => {
        item.salary = item.salaryEdit
      }).catch(err => {
        console.log(err)
        this.$Message.error({ title: '警告', content: '保存失败' })
      })
    }
  }
}
</script>

<style scoped>

</style>
