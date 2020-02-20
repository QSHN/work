<template>
  <CheckboxGroup v-model="values" @on-change="change">
<!--    <div style="margin-top: 10px; color: #ff715a;" v-if="isSuperAdmin">超级管理员(已拥有所有权限)</div>-->
    <div v-for="(g, index) in getPerms" :key="index">
      <div style="margin-top: 10px; color: #01b38b;">{{getType(g.title)}}</div>
      <Checkbox v-for="(p,index) in g.permission" :label="p.id" :key="index">{{p.name}}</Checkbox>
    </div>
  </CheckboxGroup>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'permission',
  model: {
    prop: 'dList',
    event: 'change'
  },
  props: {
    dValues: Array,
    type: String,
    dList: Array
  },
  watch: {
    dList (val) {
      this.list = this.dList || []
      this.values = this.dList.filter(item => item.hasPermission).map(item => item.id)
    }
  },
  data () {
    return {
      list: [],
      values: []
    }
  },
  computed: {
    ...mapGetters([
      'userPermissions'
    ]),
    // isSuperAdmin () {
    //   return !!this.list.find(i => i === 'SuperAdmin')
    // },
    getPerms () {
      let obj = {}
      this.list.forEach(item => {
        if (!obj[item.permissionGroup]) {
          obj[item.permissionGroup] = { title: '', permission: [] }
        }
        obj[item.permissionGroup].title = item.permissionGroup
        obj[item.permissionGroup].permission.push(item)
      })
      return obj
    }
  },
  mounted () {
    this.list = this.dList || []
    this.values = this.dList.filter(item => item.hasPermission).map(item => item.id)
  },
  methods: {
    getType (key) {
      let type = { BASIC: '基础权限', FINANCE: '财务权限', ADMINISTRATION: '行政权限' }
      return type[key] || ''
    },
    change () {
      this.list.forEach(item => {
        if (this.values.filter(id => (id === item.id)).length) {
          item.hasPermission = true
        } else {
          item.hasPermission = false
        }
      })
      this.$emit('change', this.list)
    }
  }
}
</script>

<style scoped>

</style>
