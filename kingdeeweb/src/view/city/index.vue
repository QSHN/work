<template>
  <Card shadow style="height: 100%; overflow: auto;">
    <Table border ref="userTable" :columns="tableColumns" :data="city" :height="height" :width="620">
    </Table>
  </Card>
</template>

<script>
import { city } from '../../libs/province'
export default {
  name: 'index',
  data () {
    return {
      city,
      tableColumns: [
        {
          title: '省份名称',
          key: 'pCity',
          width: 200
        },
        {
          title: '城市编号',
          key: 'code',
          width: 200
        },
        {
          title: '城市名称',
          key: 'city',
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
