<template>
  <Card shadow style="height: 100%; overflow:hidden;">
    <Table border ref="userTable" :columns="tableColumns" :data="province" :height="height" :width="420">
    </Table>
  </Card>
</template>

<script>
import { province } from '../../libs/province'
export default {
  name: 'index',
  data () {
    return {
      province,
      tableColumns: [
        {
          title: '省份编号',
          key: 'code',
          width: 200
        },
        {
          title: '省份名称',
          key: 'title',
          width: 200
        }
      ],
      height: 100
    }
  },
  created () {
    this.height = window.innerHeight - 172
  }
}
</script>

<style scoped>

</style>
