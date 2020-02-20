<template>
  <div>
    <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
      <div style="display: flex; align-items: center;">
        <Input v-model="search" placeholder="输入客户名称/商品编码/商品名称" style="width: 250px" />
      </div>
      <div>
        <Button style="margin-right: 10px;" >新增</Button>
        <Button style="margin-right: 10px;" >删除</Button>
        <Button style="margin-right: 10px;" >刷新</Button>
      </div>
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
          title: '客户编码',
          key: 'customerCode',
          width: 150
        },
        {
          title: '客户名称',
          key: 'customerName',
          width: 150
        },
        {
          title: '商品编码',
          key: 'commodityCode',
          width: 150
        },
        {
          title: '商品名称',
          key: 'commodityName',
          width: 150
        },
        {
          title: 'SKU代码',
          key: 'sku',
          width: 150
        },
        {
          title: '辅助属性',
          key: 'auxiliary',
          width: 150
        },
        {
          title: '客户商品编码',
          key: 'code',
          width: 150
        },
        {
          title: '客户商品名称',
          key: 'name',
          width: 150
        }
      ]
    }
  },
  computed: {
    getTableHeight () {
      return window.innerHeight - 230
    }
  },
  mounted () {
    for (let i = 0; i < 10; i++) {
      this.tableData.push({
        customerCode: Math.floor(Math.random() * 900),
        customerName: '客户名' + Math.floor(Math.random() * 900),
        commodityCode: Math.floor(Math.random() * 900),
        commodityName: '商品名' + Math.floor(Math.random() * 900),
        sku: 'sku' + Math.floor(Math.random() * 900),
        auxiliary: '测试属性',
        code: Math.floor(Math.random() * 900),
        name: '客户商品名称' + Math.floor(Math.random() * 900)
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
