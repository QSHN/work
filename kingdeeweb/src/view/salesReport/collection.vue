<template>
  <div>
    <Row type="flex" justify="space-between">
      <Row></Row>
      <ButtonGroup>
        <Button style="width: 80px; margin-left: 10px;">导出</Button>
        <Button style="width: 80px; margin-left: 10px;">刷新</Button>
        <Button style="width: 80px; margin-left: 10px;">列设置</Button>
        <Button style="width: 80px; margin-left: 10px;">打印</Button>
      </ButtonGroup>
    </Row>

    <Card style="margin-top: 10px;">
      <Form label-position="top">
        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="单据日期" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="排序方式" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="单据编号" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="客户分类" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="客户" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="部门" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
        </Row>

        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="业务员" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="仓库" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="商品" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="单据类型" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
        </Row>

        <Row type="flex" style="margin-top: 20px;">
          <Button style="width: 80px; margin-right: 10px;">收起更多</Button>
          <Button style="width: 80px; margin-right: 10px;">重置</Button>
        </Row>
      </Form>
    </Card>

    <Table height="380" border :columns="columns" :data="[]" style="margin-top: 10px;">
    </Table>

    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Page :total="100" show-sizer show-elevator/>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'salesReportCollection',
  data () {
    return {
      columns: [
        {
          title: '单据日期'
        },
        {
          title: '单据编号'
        },
        {
          title: '单据类型'
        },
        {
          title: '客户'
        },
        {
          title: '价税合计'
        },
        {
          title: '已收款'
        },
        {
          title: '未收款'
        },
        {
          title: '回款率%'
        },
        {
          title: '单据备注'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
