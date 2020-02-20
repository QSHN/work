<template>
  <el-dialog key="purchaseTempType" title="设置字段" :visible.sync="dialog" width="820px" :show-close="false" :close-on-click-modal="false">
    <template v-if="form">
      <el-form :model="form" inline>
        <el-form-item label="标题：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-input v-model="form.name" size="small" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item v-if="!whichTemp.includes('Table')" label="宽度：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-select
            v-model="form.width"
            size="small"
          >
            <el-option
              v-for="(v, i) in ['100', '50', '33.33333', '25', '20']"
              :key="i"
              :label="v"
              :value="v"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="form" inline>
        <el-form-item v-if="whichTemp.includes('Table')" label="是否合计：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-switch v-model="form.isTotal" size="small" />
        </el-form-item>
        <el-form-item label="是否必填：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-switch v-model="form.isRequired" size="small" />
        </el-form-item>
        <el-form-item label="是否显示：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-switch v-model="form.isShow" size="small" />
        </el-form-item>
        <el-form-item label="是否修改：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-switch v-model="form.isEdit" size="small" />
        </el-form-item>
        <el-form-item label="是否换行：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-switch v-model="form.lineBreak" size="small" />
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="类型：" :label-width="'100px'" style="margin-bottom: 5px;">
          <el-radio-group v-model="form.type" size="small">
            <el-radio-button v-for="item in typeList" :key="item.type" :label="item.type">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template v-if="form.type === 'select'">
        <el-form :model="form">
          <el-form-item v-if="form.selectInfo !== 'systemAccount'" label="列表：" :label-width="'100px'" style="margin-bottom: 5px;">
            <span>基础资料：</span>
            <el-select
              v-model="form.selectInfo"
              size="small"
              @change="selectVal($event)"
            >
              <el-option
                v-for="(item, key) in basicInfo"
                :key="key"
                :label="item.name"
                :value="key"
              />
            </el-select>
            <template v-if="form.selectInfo">
              <span style="margin-left: 10px;">绑定值：</span>
              <el-select
                v-model="form.target"
                size="small"
              >
                <el-option
                  v-for="(item, index) in basicInfo[form.selectInfo].temp"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-form>
        <el-form v-if="isSelectContract" :model="form">
          <el-form-item label="" :label-width="'100px'" style="margin-bottom: 5px;">
            <span>合同数据：</span>

            <el-select v-model="form.selectContract" placeholder="请选择绑定值" size="small" @change="selectContract($event)">
              <template v-for="(item, key) in tempDate">
                <template v-for="(v, i) in item.temp">
                  <el-option
                    v-if="item.type === 'contract' && v.code === 'contractNumber'"
                    :key="key + i"
                    :label="v.name"
                    :value="v.code"
                  />
                </template>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form v-if="(form.selectInfo && form.selectInfo !== 'systemAccount') || form.selectContract" :model="form">
          <el-form-item label="关联：" :label-width="'100px'" style="margin-bottom: 5px;">
            <div v-for="(v, i) in form.relevance" :key="i">
              <span>关联值：</span>
              <template v-if="v.code.includes('.')">
                <el-select
                  v-model="v.code.split('.')[0]"
                  size="small"
                  style="width: 120px;"
                  @change="selectRelevance($event, i, 0)"
                >
                  <template v-for="(item, key) in tempDate">
                    <el-option
                      v-if="(form.selectContract && item.type.includes(which)) || (form.selectInfo && item.type === which)"
                      :key="key"
                      :label="item.name"
                      :value="item.code"
                    />
                  </template>
                </el-select>
                <el-select
                  v-model="v.code.split('.')[1]"
                  size="small"
                  style="width: 120px;"
                  @change="selectRelevance($event, i, 1)"
                >
                  <el-option
                    v-for="(v1, i1) in tempDate[v.code.split('.')[0]].temp"
                    :key="i1"
                    :label="v1.name"
                    :value="v1.code"
                  />
                </el-select>
              </template>
              <template v-else>
                <el-select
                  v-model="v.code"
                  size="small"
                  style="width: 120px;"
                  @change="selectRelevance($event, i, null)"
                >
                  <template v-for="(item, key) in tempDate">
                    <el-option
                      v-if="(form.selectContract && item.type.includes(which)) || (form.selectInfo && item.type === which)"
                      :key="key"
                      :label="item.name"
                      :value="item.code"
                    />
                  </template>
                </el-select>
              </template>
              <template v-if="v.code">
                <span style="margin-left: 10px;">绑定值：</span>
                <template v-if="form.selectContract">
                  <el-select v-model="v.target" placeholder="请选择绑定值" size="small">
                    <template v-if="v.code.includes('.')">
                      <template v-for="(item, key) in tempDate">
                        <el-option-group
                          v-if="item.type === which"
                          :key="key"
                          :label="item.name"
                        >
                          <el-option
                            v-for="(v1, i1) in item.temp"
                            :key="key + i1"
                            :label="v1.name"
                            :value="v1.code"
                          />
                        </el-option-group>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="(item, key) in tempDate">
                        <el-option
                          v-if="item.type === 'contractTable'"
                          :key="key"
                          :label="item.name"
                          :value="item.code"
                        />
                      </template>
                    </template>
                  </el-select>
                </template>
                <template v-else>
                  <el-select
                    v-model="v.target"
                    size="small"
                  >
                    <el-option
                      v-for="(item, index) in basicInfo[form.selectInfo].temp"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </template>
              </template>
              <el-button v-if="form.relevance && form.relevance.length > 0" type="error" size="small" @click="setRelevance('delete', i)">删除</el-button>
            </div>
            <el-button type="primary" size="small" @click="setRelevance('add')">增加</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template v-if="form.type === 'number'">
        <el-form v-if="form.formula" :model="form">
          <el-form-item label="计算范围：" :label-width="'100px'" style="margin-bottom: 5px;">
            <span>最小值：</span>
            <el-input
              v-model.number="form.formula.min"
              size="small"
              clearable
              placeholder="请输入"
              style="width: 150px;"
            />
            <span style="margin-left: 10px;">最大值：</span>
            <el-input
              v-model.number="form.formula.max"
              size="small"
              clearable
              placeholder="请输入"
              style="width: 150px;"
            />
            <span style="margin-left: 10px;">小数：</span>
            <el-input
              v-model.number="form.float"
              size="small"
              clearable
              placeholder="不填不限制"
              style="width: 150px;"
            />
          </el-form-item>
          <el-form-item label="公式：" :label-width="'100px'" style="margin-bottom: 5px;">
            <div v-for="(v, i) in form.formula.child" :key="i">
              <span>取值：</span>
              <el-select v-if="!v.val" v-model="v.code" placeholder="请选择" size="small" clearable>
                <template v-for="(item, key) in tempDate">
                  <el-option-group
                    v-if="item.type.includes(which)"
                    :key="key"
                    :label="item.name"
                  >
                    <el-option
                      v-for="(v1, i1) in item.temp"
                      :key="key + i1"
                      :label="v1.name"
                      :value="item.code + '.' + v1.code"
                    />
                  </el-option-group>
                </template>
              </el-select>
              <template v-if="!v.code">
                <span v-if="!v.val" style="margin: 0 10px;">or</span>
                <el-input
                  v-model="v.val"
                  min="0.1"
                  size="small"
                  clearable
                  placeholder="请输入"
                  style="width: 200px;"
                />
              </template>
              <span style="margin-left: 10px;">方法</span>
              <el-select v-model="v.mode" size="small" style="width: 100px;">
                <el-option
                  v-for="(v1, i1) in mode"
                  :key="i1"
                  :label="v1.name"
                  :value="v1.type"
                />
              </el-select>
              <el-button type="error" size="small" @click="setFormula('delete', i)">删除</el-button>
            </div>
            <el-button type="primary" size="small" @click="setFormula('add')">增加</el-button>
          </el-form-item>
        </el-form>
      </template>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import pinyin from 'pinyin'
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
      success: null,
      typeList: [
        { type: 'input', name: '输入框' },
        { type: 'textarea', name: '文本框' },
        { type: 'date', name: '日期选择' },
        { type: 'boolean', name: '是/否' },
        { type: 'select', name: '选择框' },
        { type: 'number', name: '金额/数字输入' }
      ],
      mode: [
        { type: 'plus', name: '+' },
        { type: 'minus', name: '-' },
        { type: 'times', name: '*' },
        { type: 'divide', name: '/' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'basicInfo'
    ])
  },
  watch: {
    form: {
      handler() {
        if (this.form) {
          if (this.form.type === 'number') {
            if (!this.form.formula) {
              this.$set(this.form, 'formula', {
                min: null,
                max: null,
                child: []
              })
            }
            if (this.form.float === undefined) this.$set(this.form, 'float', null)
          } else if (this.form.formula) {
            delete this.form.formula
          }
        }
      },
      deep: true
    },
    dialog() {
      if (!this.dialog) this.form = null
    }
  },
  methods: {
    show(obj, whichTemp, tempDate, which, cb) {
      this.form = obj ? JSON.parse(JSON.stringify(obj)) : {
        name: '',
        code: '',
        type: 'input',
        isRequired: false,
        isShow: true,
        isEdit: true,
        lineBreak: false,
        width: 100
      }
      this.tempDate = tempDate
      this.which = which
      this.whichTemp = whichTemp
      this.success = cb
      if (this.whichTemp.includes('Table') && !obj) this.$set(this.form, 'isTotal', false)
      this.dialog = true
      console.log(this.form)
    },
    save() {
      const name = this.form.name.trim()
      if (!name) {
        this.$message.error('标题不能为空')
      } else {
        let isHave = false
        let num = 0
        let code = pinyin(name.substr(0, 2), {
          style: pinyin.STYLE_NORMAL
        }).join('')
        for (const k in this.tempDate) {
          const item = this.tempDate[k]
          if (
            (item.type === this.which && !this.whichTemp.includes('Table')) ||
            (this.whichTemp.includes('Table') && item.type === this.whichTemp)
          ) {
            item.temp.forEach(f => {
              if (f.name === name && f.code !== this.form.code) isHave = true
              const index = f.code.indexOf('_')
              if (f.code.substr(0, index > 0 ? index : f.code.length) === code) num++
            })
          }
        }
        if (isHave) {
          this.$message.error('已存在该名称')
        } else {
          if (num > 0) code += ('_' + num)
          if (!this.form.code) this.form.code = code
          if (this.form.type === 'number') {
            if (this.form.formula && this.form.formula.child.filter(f => !f.code && !f.val).length) {
              this.$message.error('公式存在空行，请删除多余行')
            } else {
              this.success(this.form)
              this.dialog = false
            }
          } else if (this.form.type === 'select') {
            if (!this.form.selectInfo && !this.form.selectContract) {
              this.$message.error('请选择列表数据')
            } else if (!this.form.target) {
              this.$message.error('请选择列表绑定值')
            } else if (this.form.relevance && this.form.relevance.filter(f => (!f.code || (f.code.includes('.') && !f.code.split('.')[1])) || !f.target).length) {
              this.$message.error('存在非法关联数据，请检查')
            } else {
              this.success(this.form)
              this.dialog = false
            }
          } else {
            this.success(this.form)
            this.dialog = false
          }
        }
      }
      // console.log(this.form)
    },
    selectVal(value) {
      const temp = this.basicInfo[value].temp
      this.$set(this.form, 'target', temp[0].code)
      if (this.form.selectContract) delete this.form.selectContract
    },
    selectContract() {
      if (this.form.selectInfo) delete this.form.selectInfo
    },
    setRelevance(action, index) {
      if (action === 'add') {
        const obj = { code: '', target: '' }
        if (this.form.relevance) {
          this.form.relevance.push(obj)
        } else {
          this.$set(this.form, 'relevance', [obj])
        }
      } else {
        this.form.relevance.splice(index, 1)
      }
    },
    selectRelevance(val, i, sub) {
      if (sub === null) {
        if (val.includes('Table')) {
          this.$set(this.form.relevance[i], 'code', val)
          this.$set(this.form.relevance[i], 'target', 'contractTable')
        } else {
          this.$set(this.form.relevance[i], 'code', val + '.')
          this.$set(this.form.relevance[i], 'target', '')
        }
      } else {
        let code = this.form.relevance[i].code.split('.')
        code[sub] = val
        if (code[0].includes('Table')) {
          code = val
          this.$set(this.form.relevance[i], 'target', code)
        } else {
          code = code.join('.')
        }
        this.$set(this.form.relevance[i], 'code', code)
      }
    },
    setFormula(action, index) {
      if (action === 'add') {
        const obj = { code: null, val: null, mode: null }
        if (this.form.formula.child) {
          this.form.formula.child.push(obj)
        } else {
          this.$set(this.form.formula, 'child', [obj])
        }
      } else {
        this.form.formula.child.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>

</style>
