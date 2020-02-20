<template>
  <div class="user-manage-temp-container">
    <el-row style="margin-bottom: 10px;">
      <el-button type="text" style="color: #409EFF" @click="back">返回{{ $route.query.role === 'company' ? '员工账号' : '客户账号' }}</el-button>
      <span style="font-size: 15px;">/ 模板管理</span>
    </el-row>

    <div v-for="(v, i) in formData" :key="i">
      <el-row style="margin-bottom: 20px" type="flex" align="middle">
        <temp-form :form-data="v" :which="i" @changeForm="changeForm" />
        <el-button type="danger" icon="el-icon-delete" size="small" circle @click="deleteFun(i)" />
      </el-row>
    </div>

    <el-row style="margin-top: 30px;">
      <el-button size="small" style="margin-right: 20px; width: 100px;" @click="addDialog = true">添加</el-button>
      <el-button type="success" size="small" style="width: 100px;" @click="save">保存</el-button>
    </el-row>

    <el-dialog title="添加内容" :visible.sync="addDialog">
      <el-form :model="addForm">
        <el-form-item label="标题：" label-width="20%">
          <el-input v-model="addForm.name" autocomplete="off" style="width: 60%;" />
        </el-form-item>
        <el-form-item label="类型：" label-width="20%">
          <el-select v-model="addForm.type" placeholder="请选择" style="width: 60%;">
            <el-option label="输入框" value="input" />
            <el-option label="文本框" value="textarea" />
            <el-option label="图片上传" value="img" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryUserTemp, updateUserTemp } from '../../api/user'
import tempForm from './tempForm'
export default {
  name: 'UserManageTemp',
  components: {
    tempForm
  },
  data() {
    return {
      tempData: {},
      formData: [],
      addForm: {
        name: '',
        type: null,
        val: ''
      },
      addDialog: false
    }
  },
  mounted() {
    this.loadTemp()
  },
  methods: {
    back() {
      this.$router.push({
        name: this.$route.query.role === 'company' ? 'UserManageCompany' : 'UserManageClient'
      })
    },
    loadTemp() {
      queryUserTemp().then(res => {
        const { customCustomer, customEmployee } = res
        this.tempData = res
        this.formData = this.$route.query.role === 'company' ? customEmployee : customCustomer
      })
    },
    changeForm(item, i) {
      this.formData[i] = item
      this.$forceUpdate()
    },
    deleteFun(i) {
      this.formData.splice(i, 1)
    },
    add() {
      if (!this.addForm.name) {
        this.$message.error('标题必填')
      } else if (!this.addForm.type) {
        this.$message.error('类型必填')
      } else {
        this.formData.push(this.addForm)
        this.addDialog = false
        this.addForm = {
          name: '',
          type: null,
          val: ''
        }
      }
    },
    save() {
      let isSave = true
      for (let i = 0; i < this.formData.length; i++) {
        if (!this.formData[i].name) {
          this.$message.error(`第${i + 1}条标题必填`)
          isSave = false
          return
        }
      }
      if (isSave) {
        const ajaxData = JSON.parse(JSON.stringify(this.tempData))
        ajaxData[this.$route.query.role === 'company' ? 'customEmployee' : 'customCustomer'] = this.formData
        updateUserTemp(ajaxData).then(res => {
          this.$message.success(`保存成功！`)
          this.loadTemp()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-manage-temp {
    &-container {
      margin: 10px 30px;
    }
  }
</style>
