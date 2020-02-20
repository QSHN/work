<template>
  <div class="cert">
    <basic-container>
      <div class="conditionPanel">
        <div class="cp-top">
          <div class="cascaderTitle">
            <div>目标人群</div>
            <div>人群分类</div>
            <div>证件类别</div>
          </div>
          <el-cascader-panel ref="cascader"
                             :options="cascaderOption"
                             :props="cascaderProps"
                             v-model="selectedCertType"
                             @change="handleCascaderChange"></el-cascader-panel>
        </div>
        <div class="cp-bottom">
          <div class="tagList" v-if="selectedCertTypeDescr.length>0">
            <div class="tagListTitle">
              <span>资质标签列表：</span>
              <!--<span style="font-size: 12px; margin-left: 8px; color: #6f7180">[CertTag List]</span>-->
            </div>
            <div class="tagListMain">
              <div class="el-badge">
                <el-tag class="addTagBtn" type="primary" @click="handleTagClick(undefined)">
                  <i class="el-icon-document-add"></i> 增加标签
                </el-tag>
              </div>
              <el-badge :value="item.isRequired==0?'选':'必'" :type="item.isRequired==0?'warning':'success'"
                        v-for="(item, index) in certCheckRuleList"
                        :key="index">

                <el-tag :type="item.isEnabled==1?'success':'warning'" @click="handleTagClick(item)">
                  <i class="el-icon-edit"></i> {{item.certTag}}
                </el-tag>
              </el-badge>
            </div>
          </div>
        </div>
      </div>

      <div class="operatePanel" v-if="showEditPanel">
        <div class="breadcrumb">
          <span>当前证件类别：</span>
          <template v-if="selectedCertTypeDescr.length>0">
            <span>{{selectedCertTypeDescr[0].label}}</span>
            <i class="el-icon-caret-right"></i>
            <span>{{selectedCertTypeDescr[1].label}}</span>
            <i class="el-icon-caret-right"></i>
            <span>{{selectedCertTypeDescr[2].label}}</span>
            <span>
            {{selectedCertTypeDescr[0].value+" > "
            +selectedCertTypeDescr[1].value+" > "
            +selectedCertTypeDescr[2].value}}
            </span>
          </template>
        </div>

        <el-form class="op-form" ref="form" size="mini" :model="currCertCheckRule" label-width="80px">
          <el-form-item label="资质名称">
            <el-input maxlength="32" show-word-limit v-model="currCertCheckRule.certName" disabled></el-input>
          </el-form-item>
          <el-form-item label="资质标签">
            <el-input maxlength="16" show-word-limit v-model="currCertCheckRule.certTag"></el-input>
          </el-form-item>
          <el-form-item label="分组代码">
            <el-input maxlength="16" show-word-limit v-model="currCertCheckRule.groupCode"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="currCertCheckRule.sortNo" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="是否必选">
            <el-switch v-model="currCertCheckRule.isRequired" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="currCertCheckRule.isEnabled" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="控制选项" class="certOption">

            <el-col>
              <el-input placeholder="字段名（英文）" v-model="tempField" style="width: 200px;"
                        @input.native="handleInputTempField">
                <template slot="append">
                  <el-button type="success" @click="handleAddOptionField('', true)">
                    <i class="el-icon-plus"></i> 增加
                  </el-button>
                </template>
              </el-input>

              <el-button type="success" v-for="(item, index) in defaultOption" :key="index"
                         v-if="!currCertCheckRule.option || !currCertCheckRule.option[index]"
                         @click="handleAddOptionField(index)">
                <i class="el-icon-plus"></i> 使用“{{item.fieldName}}”模板
              </el-button>
            </el-col>

            <el-col v-for="(item, index) in currCertCheckRule.option" :key="index">
              <el-input placeholder="可选填别名" v-model="currCertCheckRule.option[index].fieldName">
                <template slot="prepend">{{index}}</template>
                <template slot="append">
                  <el-switch
                    v-model="currCertCheckRule.option[index].isRequired"
                    active-value="1"
                    inactive-value="0"
                    active-text="必填"
                    inactive-text="选填">
                  </el-switch>
                </template>
              </el-input>
              <el-button type="danger" icon="el-icon-delete" circle @click="handleRemoveOptionField(index)"></el-button>
            </el-col>

          </el-form-item>
          <el-form-item label="备注描述">
            <el-input maxlength="128" show-word-limit type="textarea" v-model="currCertCheckRule.remark"></el-input>
          </el-form-item>

          <el-form-item style="margin-top: 20px;">
            <el-button type="primary" @click="handleSaveCertCheckRule">{{currCertCheckRule.ruleId?'保存':'新增'}}
            </el-button>
            <el-button type="danger" @click="handleDeleteCertCheckRule" v-if="currCertCheckRule.ruleId">删除</el-button>
          </el-form-item>
        </el-form>
      </div>

    </basic-container>
  </div>
</template>

<script>
  import {fetchList, putObj, addObj, delObj} from '@/api/nursing/cert/cert'
  import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'
  import {mapGetters} from 'vuex'
  import ElSelectDropdown from "element-ui/packages/select/src/select-dropdown";

  export default {
    name: 'cert',
    components: {ElSelectDropdown},
    // components: {},
    data() {
      return {
        cascaderOption: [
          {
            itemId: 'staff',
            itemName: '服务人员',
            children: [],
          },
          {
            itemId: 'vip',
            itemName: '会员',
            children: [],
          },
          {
            itemId: 'cust',
            itemName: '客户',
            children: [],
          },
          {
            itemId: 'employee',
            itemName: '员工',
            children: [],
          }
        ],
        cascaderProps: {
          label: "itemName",
          value: 'itemId'
        },
        selectedCertType: [],
        selectedCertTypeDescr: [],
        certCheckRuleList: [],
        currCertCheckRule: {},
        showEditPanel: false,
        defaultOption: {
          certNo: {fieldName: "资质编号", isRequired: 1},
          fromDate: {fieldName: "生效日期", isRequired: 1},
          validDate: {fieldName: "有效期至", isRequired: 1}
        },
        tempField: ""
      }
    },
    created() {
      this.cascaderProps.lazy = true
      this.cascaderProps.lazyLoad = async function (node, resolve) {
        const {level, value, path} = node;
        // 加载人群分类
        if (level === 1) {
          const res = await fetchTreeByItemClassCode(value + "_type")
          if (res.data && res.data.data) {
            let nodes = Array.from({length: res.data.data.length})
              .map((item, index) => {
                item = Object.assign({}, res.data.data[index], {
                  children: []
                })
                return item;
              })
            nodes.unshift({
              itemId: 0,
              itemName: '通用',
              children: []
            })
            resolve(nodes);
          }
          // 加载证件类别
        } else if (level === 2) {
          const res = await fetchTreeByItemClassCode(path[0] + "_cert_type");
          if (res.data && res.data.data) {
            let nodes = Array.from({length: res.data.data.length})
              .map((item, index) => {
                item = Object.assign({}, res.data.data[index], {
                  leaf: true
                })
                return item;
              })
            resolve(nodes);
          }
        }
      }
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions']),
    },
    methods: {
      getCertList(node) {
        let params = {
          targetCode: node[0],
          targetType: node[1],
          certType: node[2]
        }
        fetchList(params).then(res => {
          if (res.data && res.data.data) {
            this.certCheckRuleList = res.data.data
            this.certCheckRuleList.map((item) => {
              item.option = JSON.parse(item.option)
              return item;
            })
          }
        })
      },
      handleCascaderChange: function (node) {
        this.selectedCertTypeDescr[0] = this.$refs.cascader.$children[0].nodes.find(function (item) {
          return item.value == node[0];
        })
        this.selectedCertTypeDescr[1] = this.$refs.cascader.$children[1].nodes.find(function (item) {
          return item.value == node[1]
        })
        // console.log(this.selectedCertTypeDescr[1].children)
        this.selectedCertTypeDescr[2] = this.$refs.cascader.$children[2].nodes.find(function (item) {
          return item.value == node[2]
        })
        this.getCertList(node)
        this.showEditPanel = false
      },
      handleTagClick: function (cert) {
        this.showEditPanel = true
        if (cert) {
          this.currCertCheckRule = this.deepClone(cert)
        } else {
          this.currCertCheckRule = this.deepClone({
            targetCode: this.selectedCertType[0],
            targetType: this.selectedCertType[1],
            certType: this.selectedCertType[2],
            certName: this.selectedCertTypeDescr[2].label,
            certTag: "",
            groupCode: "",
            isEnabled: "1",
            isRequired: "1",
            option: {},
            remark: "",
            sortNo: 99,
          })
        }
      },
      handleAddOptionField: function (field, defined) {
        if (defined) {
          if (this.tempField && this.tempField != '') {
            this.$set(this.currCertCheckRule.option, this.tempField, {fieldName: '', isRequired: 1})
            this.tempField = ''
          }
        } else {
          this.$set(this.currCertCheckRule.option, field, this.defaultOption[field])
        }
      },
      handleRemoveOptionField: function (field) {
        this.$delete(this.currCertCheckRule.option, field)
      },
      handleInputTempField: function () {
        // 限制只能输入英文数字 a-zA-Z0-9
        this.$nextTick(() => {
          if (this.tempField !== null) {
            this.tempField = this.tempField.replace(/[^\w]/g, '')
          }
        })
      },
      handleSaveCertCheckRule: function () {
        let tempCheckRule = this.deepClone(this.currCertCheckRule)
        if (tempCheckRule.option && tempCheckRule.option != null) {
          // 字符串化 option字段
          tempCheckRule.option = JSON.stringify(tempCheckRule.option)
        }
        if (tempCheckRule.ruleId && tempCheckRule.ruleId != '') {
          putObj(tempCheckRule).then(res => {
            this.$message.success('保存校验规则信息成功')
            this.getCertList(this.selectedCertType)
            this.showEditPanel = false
          })
        } else {
          addObj(tempCheckRule).then(res => {
            this.$message.success('新增校验规则信息成功')
            this.getCertList(this.selectedCertType)
            this.showEditPanel = false
          })
        }
      },
      handleDeleteCertCheckRule: function () {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currCertCheckRule.ruleId).then(res => {
            this.getCertList(this.selectedCertType)
            this.showEditPanel = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .cert {
    .el-card {
      padding-bottom: 30px;

      .conditionPanel {
        float: left;
        width: 540px;

        .cp-top {
          .cascaderTitle {
            display: flex;
            width: 538px;
            border-top: 1px solid #E4E7ED;;
            border-left: 1px solid #E4E7ED;;
            border-right: 1px solid #E4E7ED;
            border-radius: 4px 4px 0 0;

            div {
              margin-bottom: 0px;
              width: 179px;
              line-height: 42px;
              font-size: 14px;
              color: #6f7180;
              text-align: center;
              border-right: 1px solid #E4E7ED;
            }

            div:nth-child(3) {
              width: 178px;
              border: unset;
            }
          }

          .el-cascader-panel.is-bordered {
            border-radius: 0 0 4px 4px;
          }
        }

        .cp-bottom {
          margin-top: 10px;
          margin-bottom: 30px;

          .tagList {
            margin-top: 30px;
            margin-left: 10px;
            margin-right: 10px;

            .tagListTitle {
              font-size: 14px;
              margin-bottom: -10px;
            }

            .tagListMain {
              .addTagBtn {
                margin-right: -10px;
              }

              .el-badge {
                margin-top: 15px;
                margin-right: 20px;
              }

              .el-tag:hover {
                border-color: #6E8CFA;
                cursor: pointer;
              }
            }
          }
        }
      }

      .operatePanel {
        margin-top: 20px;
        margin-left: 50px;
        margin-bottom: 50px;
        padding: 20px;
        float: left;
        width: calc(100% - 680px);
        border: 1px solid #ebebeb;
        border-radius: 3px;
        transition: .2s;
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);


        .breadcrumb {
          margin-left: 20px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: bold;

          i {
            margin-left: 2px;
            margin-right: 2px;
          }

          span:last-child {
            display: block;
            float: right;
          }
        }

        .op-form {
          /*width: 500px;*/

          .certOption {
            .el-input {
              margin-top: 5px;
              margin-right: 10px;
              width: calc(100% - 50px)
            }
          }
        }

      }
    }
  }

</style>
