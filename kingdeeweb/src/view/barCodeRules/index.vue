<template>
  <div>
    <Row style="margin-bottom: 10px;">
      <Input v-model="search" placeholder="输入规则名称" style="width: 250px" />
    </Row>

    <Row style="margin-bottom: 10px;">
      <Button style="margin-right: 10px;" >新增</Button>
      <Button style="margin-right: 10px;" >删除</Button>
      <Button style="margin-right: 10px;" >禁用</Button>
      <Button style="margin-right: 10px;" >启用</Button>
      <Button style="margin-right: 10px;" >刷新</Button>
    </Row>

    <Table :height="getTableHeight" border :columns="columns" :data="tableData" :loading="loading" @on-selection-change="selectTable">
    </Table>

    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Page :current.sync="current" :total="tableData.length" :page-size="pageSize" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
    </Row>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      current: 1,
      pageSize: 50,
      pageSizeOpts: [50, 100],
      search: null,
      loading: false,
      selectList: [],
      tableData: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '规则名称',
          key: 'name',
          width: 150
        },
        {
          title: '条码类型',
          key: 'type',
          width: 150
        },
        {
          title: '商品类型',
          key: 'commodityType',
          width: 150
        },
        {
          title: '长度',
          key: 'length',
          width: 150
        }
      ]
    }
  },
  computed: {
    getTableHeight () {
      return window.innerHeight - 250
    }
  },
  mounted () {
    for (let i = 0; i < 10; i++) {
      this.tableData.push({
        name: '测试' + Math.floor(Math.random() * 900),
        type: '条形码',
        commodityType: '普通',
        length: Math.floor(Math.random() * 90)
      })
    }
  },
  methods: {
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    }
  }
}
</script>

<style scoped>

</style>
