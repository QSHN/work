<template>
  <el-dialog title="设置资料" :visible.sync="dialog" width="600px" :show-close="false" :close-on-click-modal="false">
    <template v-if="form">
      <el-form :model="form">
        <el-form-item label="分类：" :label-width="'150px'">
          <el-select v-model="form.group" placeholder="请选择" size="small" @change="selectGroup">
            <el-option
              v-for="(item, index) in groupList"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-for="(v, i) in tempList" :key="i" :label="v.name + '：'" :label-width="'150px'">
          <template v-if="v.type === 'input'">
            <el-input v-model="form[v.code]" placeholder="请输入" style="width: 280px;" size="small" />
          </template>
          <template v-if="v.type === 'textarea'">
            <el-input
              v-model="form[v.code]"
              type="textarea"
              :rows="2"
              placeholder="请输入"
              style="width: 280px;"
            />
          </template>
          <template v-if="v.type === 'boolean'">
            <el-switch v-model="form[v.code]" />
          </template>
        </el-form-item>

        <!--        <el-form-item label="是否默认：" :label-width="'150px'">-->
        <!--          <el-switch v-model="form.isDefault" />-->
        <!--        </el-form-item>-->
      </el-form>
    </template>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateBasicInfo } from '../../api/basicInfo'
export default {
  data() {
    return {
      dialog: false,
      form: {},
      which: null,
      updateIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo',
      'basicData'
    ]),
    tempList() {
      let list = []
      if (this.which && this.basicInfo[this.which]) list = this.basicInfo[this.which].temp
      return list
    },
    groupList() {
      let list = []
      if (this.which && this.basicInfo[this.which]) list = this.basicInfo[this.which].group
      return list
    }
  },
  methods: {
    show(which, form, updateIndex) {
      this.which = which
      this.form = Object.assign({}, form)
      this.updateIndex = updateIndex
      this.dialog = true
    },
    selectGroup(name) {
      const g = this.groupList.find(f => f.name === name)
      this.$set(this.form, 'groupId', g ? g.id : null)
    },
    save() {
      // const ajaxData = JSON.parse(JSON.stringify(this.basicData))
      // if (this.form.isDefault) {
      //   ajaxData.info[this.which].list.forEach(f => {
      //     if (f.isDefault) f.isDefault = false
      //   })
      // }
      // if (this.updateIndex !== null) {
      //   ajaxData.info[this.which].list.splice(this.updateIndex, 1, this.form)
      // } else {
      //   ajaxData.info[this.which].list.push(this.form)
      // }
      updateBasicInfo({
        type: this.updateIndex !== null ? 'updateList' : 'addList',
        which: this.which,
        updateIndex: this.updateIndex !== null ? this.updateIndex : null,
        setData: this.form
      }).then(res => {
        this.$store.dispatch('basicInfo/queryBasicInfo')
        this.$message.success(`成功保存`)
        this.dialog = false
      })
    }
  }
}
</script>

<style scoped>

</style>
