<template>
  <el-dialog key="purchaseTempType" title="设置字段" :visible.sync="dialog" width="820px" :show-close="false" :close-on-click-modal="false">
    <template v-if="form">
      <el-form :model="form" inline>
        <el-form-item label="标题：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-input v-model="form.name" size="small" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="是否显示：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-switch v-model="form.isShow" size="small" />
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="绑定值：" :label-width="'100px'" style="margin-bottom: 5px;">
          <span v-if="form.code === 'status'">审核状态</span>
          <template v-else-if="form.code.includes('.')">
            <el-select
              v-model="form.code.split('.')[0]"
              size="small"
              style="width: 120px;"
              clearable
              @change="selectRelevance($event, 0)"
              @clear="clear"
            >
              <template v-for="(item, key) in tempDate">
                <el-option
                  v-if="(item.type !== which)"
                  :key="key"
                  :label="item.name"
                  :value="item.code"
                />
              </template>
            </el-select>
            <el-select
              v-model="form.code.split('.')[1]"
              size="small"
              style="width: 120px;"
              @change="selectRelevance($event, 1, tempDate[form.code.split('.')[0]].temp)"
            >
              <el-option
                v-for="(v1, i1) in tempDate[form.code.split('.')[0]].temp"
                :key="i1"
                :label="v1.name"
                :value="v1.code"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select
              v-model="form.code"
              size="small"
              style="width: 120px;"
              @change="selectRelevance($event, null)"
            >
              <template v-for="(item, key) in tempDate">
                <el-option
                  v-if="(item.type !== which)"
                  :key="key"
                  :label="item.name"
                  :value="item.code"
                />
              </template>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    isSelectContract: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      form: null,
      tempDate: {},
      which: null,
      whichTemp: null,
      success: null
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo'
    ])
  },
  watch: {
    dialog() {
      if (!this.dialog) this.form = null
    }
  },
  methods: {
    show(obj, whichTemp, tempDate, which, cb) {
      this.form = obj ? JSON.parse(JSON.stringify(obj)) : {
        name: '',
        code: '',
        type: 'select',
        isShow: true
      }
      this.tempDate = tempDate
      this.which = which
      this.whichTemp = whichTemp
      this.success = cb
      this.dialog = true
      console.log(this.form)
    },
    save() {
      const name = this.form.name.trim()
      if (!name) {
        this.$message.error('标题不能为空')
      } else if (!this.form.code) {
        this.$message.error('绑定值不能为空')
      } else {
        this.success(this.form)
        this.dialog = false
      }
      // console.log(this.form)
    },
    selectRelevance(val, sub, temp = null) {
      if (sub === null) {
        this.$set(this.form, 'code', val + '.')
      } else {
        let code = this.form.code.split('.')
        code[sub] = val
        code = code.join('.')
        this.$set(this.form, 'code', code)
        if (temp) {
          this.$set(this.form, 'type', temp.find(v => v.code === val).type)
          console.log(this.form)
        }
      }
    },
    clear() {
      this.form.code = ''
    }
  }
}
</script>

<style scoped>

</style>
