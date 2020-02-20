<template>
  <Card>
    <Tabs value="汇报">
      <TabPane v-for="(item,index) in list" :key="index" :label="item.name" :name="item.name"><ScoreList :ruleModule="item.code"></ScoreList></TabPane>
    </Tabs>
  </Card>
</template>

<script>
import ScoreList from './scorelist'
import { checkModules } from '@/api/score'
export default {
  name: 'scoreset',
  data () {
    return {
      list: []
    }
  },
  components: {
    ScoreList
  },
  mounted () {
    checkModules().then(res => {
      this.list = res.data
    })
  }
}
</script>

<style scoped>

</style>
