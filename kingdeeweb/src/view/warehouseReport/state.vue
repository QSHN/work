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
          <FormItem label="批次" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="商品" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="商品类别" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="商品标签" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="商品品牌" style="margin: 0 30px 0 0;">
            <Input style="width: 200px" />
          </FormItem>
          <FormItem label="仓库" style="margin: 0 30px 0 0;">
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
  name: 'warehouseReportState',
  data () {
    return {
      columns: [
        {
          title: '商品编码'
        },
        {
          title: '商品名称'
        },
        {
          title: '批次'
        },
        {
          title: '仓库'
        },
        {
          title: '基本单位'
        },
        {
          title: '基本单位',
          children: [
            {
              title: '即时库存'
            },
            {
              title: '可用库存'
            },
            {
              title: '销售待出'
            },
            {
              title: '调拨待出'
            },
            {
              title: '其他待出'
            }
          ]
        },
        {
          title: '辅助单位',
          children: [
            {
              title: '即时库存'
            },
            {
              title: '可用库存'
            },
            {
              title: '销售待出'
            },
            {
              title: '调拨待出'
            },
            {
              title: '其他待出'
            }
          ]
        },
        {
          title: '整件散包',
          children: [
            {
              title: '即时库存'
            },
            {
              title: '可用库存'
            }
          ]
        },
        {
          title: '保质期'
        },
        {
          title: '保质期单位'
        },
        {
          title: '生产日期'
        },
        {
          title: '到期日'
        },
        {
          title: '剩余天数'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
