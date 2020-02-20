<template>
  <el-dialog title="设置模板" :visible.sync="dialog" width="800px" :show-close="false" :close-on-click-modal="false">
    <template v-if="form">
      <el-form :model="form" :inline="true">
        <el-form-item label="添加：">
          <el-input v-model="form.name" placeholder="请输入标题" style="width: 200px;" size="small" />
        </el-form-item>

        <el-form-item label="类型：" style="margin-left: 20px;">
          <el-radio-group v-model="form.type" size="small">
            <el-radio label="input">输入框</el-radio>
            <el-radio label="textarea">文本框</el-radio>
            <el-radio label="boolean">是/否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="margin-left: 20px;">
          <el-button type="primary" size="small" @click="saveForm">{{ form._index !== undefined ? '修改' : '添加' }}</el-button>
          <el-button type="primary" size="small" @click="edit('add', null)">清空</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table
      :data="tempList"
      size="small"
      border
      resizable
    >
      <el-table-column
        prop="name"
        label="标题"
        align="center"
        sortable
      />
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.type === 'input' ? '输入框' : scope.row.type === 'textarea' ? '文本框' : '是/否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit('edit', scope.row, scope.$index)">编辑</el-button>
          <el-button type="text" size="small" style="color: #F56C6C" @click="edit('delete', scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateBasicInfo } from '../../api/basicInfo'
import pinyin from 'pinyin'
export default {
  data() {
    return {
      dialog: false,
      form: {},
      which: null,
      tempList: []
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo',
      'basicData'
    ])
  },
  watch: {
    basicInfo: {
      handler() {
        if (this.which && this.basicInfo[this.which]) {
          this.tempList = Object.assign([], this.basicInfo[this.which].temp)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    show(which) {
      this.form = {
        name: '',
        type: 'input',
        code: ''
      }
      this.which = which
      if (this.which && this.basicInfo[this.which]) {
        this.tempList = Object.assign([], this.basicInfo[this.which].temp)
      }
      this.dialog = true
    },
    saveForm() {
      const form = Object.assign({}, this.form)
      const name = form.name.trim()
      if (!name) {
        this.$message.error('名称不能为空')
      } else {
        let isHave = false
        let num = 0
        let code = pinyin(name.substr(0, 2), {
          style: pinyin.STYLE_NORMAL
        }).join('')
        this.tempList.forEach((v, i) => {
          if (v.name === name && this.form._index !== i) isHave = true
          const index = v.code.indexOf('_')
          if (v.code.substr(0, index > 0 ? index : v.code.length) === code) num++
        })
        if (isHave) {
          this.$message.error('已存在该名称')
        } else {
          if (this.form._index !== undefined) {
            delete form._index
            this.tempList.splice(this.form._index, 1, form)
          } else {
            if (num > 0) code += ('_' + num)
            form.code = code
            this.tempList.push(form)
          }
        }
      }
    },
    edit(action, row, index) {
      switch (action) {
        case 'edit':
          this.form = Object.assign({}, row)
          this.form._index = index
          break
        case 'add':
          this.form = {
            name: '',
            type: 'input',
            code: ''
          }
          break
        case 'delete':
          this.tempList.splice(index, 1)
          break
      }
    },
    save() {
      // const ajaxData = JSON.parse(JSON.stringify(this.basicData))
      // this.$set(ajaxData.info[this.which], 'temp', this.tempList)
      updateBasicInfo({
        type: 'updateTemp',
        which: this.which,
        setData: this.tempList
      }).then(res => {
        this.$store.dispatch('basicInfo/queryBasicInfo')
        this.$message.success(`成功更新模板内容`)
        this.dialog = false
      })
    }
  }
}
</script>

<style scoped>

</style>
