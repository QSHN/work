<template>
  <div style="height: 100%; display: flex;">
    <div style="height: 100%; width: 100%; display: flex" ref="unitLayer">
      <Table border ref="userTable" :columns="groupColumns" :data="accountingProgram" :height="height" style="width: 100%">
      </Table>
    </div>
  </div>
</template>

<script>
import { accountingProgram } from '../../libs/accountingProgram'
export default {
  name: 'apMain',
  data () {
    return {
      accountingProgram,
      groupColumns: [
        {
          title: '编码',
          key: 'code',
          width: 180
        },
        {
          title: '名称',
          key: 'title',
          width: 180
        },
        {
          title: '备注',
          key: 'des'
        }
      ],
      height: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.height = this.$refs.unitLayer && this.$refs.unitLayer.offsetHeight
    })
  }
}
</script>

<style scoped>

</style>
