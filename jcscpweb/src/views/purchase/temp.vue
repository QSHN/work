<template>
  <el-dialog key="purchaseTemp" title="自定义" class="purchase_temp" :visible.sync="dialog" width="1200px" :show-close="false" :close-on-click-modal="false">
    <template v-if="tempData && which && whichTemp">
      <el-tabs v-model="whichTemp">
        <template v-for="(item, key) in tempData.temp">
          <el-tab-pane v-if="item.type.includes(which)" :key="key" :label="item.name" :name="key">
            <el-row style="margin-bottom: 10px;">
              <el-button size="small" @click="setType('add', null)">添加分类</el-button>
              <el-button size="small" @click="setType('edit', key)">修改分类</el-button>
              <el-button size="small" @click="setType('delete', key)">删除分类</el-button>
              <el-button size="small" @click="set('add', key, null, null)">添加字段</el-button>
              <el-button size="small" @click="changLocation">调换位置</el-button>
              <span style="margin-left: 5px;">选中两项后可以互换位置</span>
            </el-row>

            <el-table
              :key="key"
              :ref="'tempTable_' + key"
              :data="item.temp"
              border
              size="small"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="36"
              />
              <el-table-column
                prop="name"
                label="标题"
              />
              <el-table-column
                label="类型"
              >
                <template slot-scope="scope">
                  {{ typeList.find(f => f.type === scope.row.type).name }}
                </template>
              </el-table-column>

              <template v-if="item.type === which">
                <el-table-column
                  prop="width"
                  label="宽度"
                />
              </template>
              <template v-else>
                <el-table-column
                  label="是否合计"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.isTotal">是</span>
                    <span v-else style="color: #f56c6c">否</span>
                  </template>
                </el-table-column>
              </template>

              <el-table-column
                label="是否必填"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.isRequired">是</span>
                  <span v-else style="color: #f56c6c">否</span>
                </template>
              </el-table-column>
              <el-table-column
                label="是否显示"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.isShow">是</span>
                  <span v-else style="color: #f56c6c">否</span>
                </template>
              </el-table-column>
              <el-table-column
                label="是否修改"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.isEdit">是</span>
                  <span v-else style="color: #f56c6c">否</span>
                </template>
              </el-table-column>
              <el-table-column
                label="是否换行"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.lineBreak">是</span>
                  <span v-else style="color: #f56c6c">否</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="set('edit', key, scope.row, scope.$index)">编辑</el-button>
                  <el-button type="text" size="small" style="color: #F56C6C" @click="set('delete', key, scope.row, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </template>
      </el-tabs>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePurchaseTemp } from '../../api/purchase'
export default {
  name: 'Temp',
  data() {
    return {
      dialog: false,
      tempData: null,
      which: null,
      whichTemp: null,
      typeList: [
        { type: 'input', name: '输入框' },
        { type: 'textarea', name: '文本框' },
        { type: 'date', name: '日期选择' },
        { type: 'number', name: '金额/数字输入' },
        { type: 'boolean', name: '是/否' },
        { type: 'select', name: '选择框' }
      ],
      multipleSelection: [],
      isChangeTableSelect: false
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo'
    ])
  },
  methods: {
    show(tempData, which) {
      this.tempData = JSON.parse(JSON.stringify(tempData))
      this.which = which
      this.dialog = true
      this.initType()
    },
    initType() {
      for (const k in this.tempData.temp) {
        const item = this.tempData.temp[k]
        if (item && item.type.includes(this.which)) {
          this.whichTemp = k
          return
        }
      }
    },
    setType(type, key) {
      if (type === 'delete') {
        const name = this.tempData.temp[key].name
        this.$confirm(`确定删除${name}分类?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.initType()
          delete this.tempData.temp[key]
        })
      } else {
        const fData = key ? this.tempData.temp[key] : null
        this.$emit('setType', fData, (obj) => {
          console.log(obj)
          this.$set(this.tempData.temp, obj.code, obj)
          this.whichTemp = obj.code
        })
      }
    },
    set(type, key, row, index) {
      if (type === 'delete') {
        const name = this.tempData.temp[key].temp[index].name
        this.$confirm(`确定删除${name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tempData.temp[key].temp.splice(index, 1)
        })
      } else {
        const fData = row || null
        this.$emit('setTemp', fData, this.whichTemp, (obj) => {
          if (index !== null) {
            this.tempData.temp[key].temp.splice(index, 1, obj)
          } else {
            this.tempData.temp[key].temp.push(obj)
          }
          console.log(obj)
        })
      }
    },
    save() {
      updatePurchaseTemp(this.tempData).then(res => {
        this.$message.success('更新模板成功')
        this.$emit('loadTemp')
        this.dialog = false
      })
    },
    handleSelectionChange(val) {
      if (val.length > 2 && !this.isChangeTableSelect) {
        this.isChangeTableSelect = true
        val.forEach((row, i) => {
          if (i === 0 || (i === val.length - 1)) {
            this.$refs['tempTable_' + this.whichTemp][0].toggleRowSelection(row, true)
            this.$nextTick(() => {
              if (i === val.length - 1) this.isChangeTableSelect = false
            })
          } else {
            this.$refs['tempTable_' + this.whichTemp][0].toggleRowSelection(row, false)
          }
        })
      } else {
        console.log(val)
        this.multipleSelection = val
      }
    },
    changLocation() {
      if (this.multipleSelection.length === 2) {
        const temp = JSON.parse(JSON.stringify(this.tempData.temp[this.whichTemp].temp))
        let start = 0
        let end = 0
        temp.forEach((f, i) => {
          if (f.code === this.multipleSelection[0].code) start = i
          if (f.code === this.multipleSelection[1].code) end = i
        })
        this.tempData.temp[this.whichTemp].temp.splice(start, 1, this.multipleSelection[1])
        this.tempData.temp[this.whichTemp].temp.splice(end, 1, this.multipleSelection[0])
        // console.log(start, end)
      } else {
        this.$message.error('请选中要换位置的两行')
      }
    }
  }
}
</script>

<style lang="scss">
.purchase_temp {
  .el-dialog {
    margin-top: 0 !important;
  }
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
