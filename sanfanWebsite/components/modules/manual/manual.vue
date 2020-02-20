<template lang="pug">
  el-table(:data="tableData" style="width: 100%")
    el-table-column(label="下载文件" prop="name")
    el-table-column(align="right")
      template(slot-scope="scope")
        el-button(size="mini" @click="download(scope.row.name)") 预览/下载

</template>

<script>
export default {
  name: 'Manual',
  data() {
    return {
      tableData: [],
      list: [
        {
          name: '三帆外勤功能说明'
        },
        {
          name: '三帆外勤用户使用手册-超级管理员(老板)'
        },
        {
          name: '三帆外勤用户使用手册-部门管理员(管理层)'
        },
        {
          name: '三帆外勤用户使用手册-财务员工'
        },
        {
          name: '三帆外勤用户使用手册-行政员工'
        },
        {
          name: '三帆外勤用户使用手册-基层员工'
        }
      ]
    }
  },
  created() {
    if (this.$route) {
      this.tableData = [this.list[this.$route.name.substr(6, 1) - 1]]
    }
  },
  mounted() {
    window.open(
      `https://hawk-book.oss-cn-shenzhen.aliyuncs.com/${
        this.list[this.$route.name.substr(6, 1) - 1].name
      }.pdf`
    )
  },
  methods: {
    download(name) {
      // console.log(name)
      window.open(`https://hawk-book.oss-cn-shenzhen.aliyuncs.com/${name}.pdf`)
    }
  }
}
</script>
