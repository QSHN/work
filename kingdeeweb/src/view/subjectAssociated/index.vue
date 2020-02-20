<template>
  <div>
    <RadioGroup v-model="which" type="button" size="large">
      <Radio label="客户"></Radio>
      <Radio label="供应商"></Radio>
      <Radio label="商品"></Radio>
      <Radio label="收入类别"></Radio>
      <Radio label="支出类别"></Radio>
      <Radio label="部门"></Radio>
      <Radio label="银行账户"></Radio>
      <Radio label="费用"></Radio>
      <Radio label="折扣"></Radio>
    </RadioGroup>

    <div style="display: flex; margin-top: 10px;">
      <div :class="{left_expand: true, active: !isExpand}" v-if="which !== '费用' && which !== '折扣'">
        <div class="le_c">
          <div class="le_m">
            <div class="title">
              <span>分类树</span>
            </div>

            <GeminiScrollbar
              class="scroll_layer"
              :autoshow="true"
              :forceGemini="true"
              :minThumbSize="20">
              <div style="padding: 0 10px;">
                <Tree :data="groupList" :render="renderContent"></Tree>
              </div>
            </GeminiScrollbar>
          </div>
        </div>

        <div :class="{expand_btn: true, active: !isExpand}" @click="isExpand = !isExpand">
          <img src="../../assets/images/icon/left.svg" :title="isExpand ? '收起' : '展开'" />
        </div>
      </div>

      <div class="measure_c">
        <div>
          <Row type="flex">
            <span style="margin-right: 5px; line-height: 30px;">{{ which === '商品' ? '库存商品科目' : '对应科目'}}：</span>
            <Select v-model="subjectCode" filterable clearable style="width: 150px">
              <Option v-for="item in subjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
            </Select>
            <Button type="default" style="margin-left: 10px;" @click="selectSubject('subjectCode')">选择</Button>
            <template v-if="which === '商品'">
              <span style="margin: 0 5px 0 20px; line-height: 30px;">主营业务收入匹配科目：</span>
              <Select v-model="incomeSubjectCode" filterable clearable style="width: 150px">
                <Option v-for="item in subjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
              </Select>
              <Button type="default" style="margin-left: 10px;" @click="selectSubject('incomeSubjectCode')">选择</Button>

              <span style="margin: 0 5px 0 20px; line-height: 30px;">主营业务成本匹配科目：</span>
              <Select v-model="costSubjectCode" filterable clearable style="width: 150px">
                <Option v-for="item in subjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
              </Select>
              <Button type="default" style="margin-left: 10px;" @click="selectSubject('costSubjectCode')">选择</Button>
            </template>
            <Button style="margin-left: 10px;" @click="setSubject(true, null, 'all')">{{ which === '费用' || which === '折扣' ? '保存' : '批量设置'}}</Button>
          </Row>

          <Table v-if="which !== '费用' && which !== '折扣'"
                 :width="getTableWidth"
                 :height="getTableHeight"
                 border :columns="columns"
                 :data="tableData"
                 :loading="loading"
                 @on-selection-change="selectTable"
                 style="margin-top: 10px;">
            <template slot-scope="{ row }" slot="subject">
              <span style="color: #2d8cf0; text-decoration: underline;" @click="setSubject(false, row, 'subjectCode')">
                {{ row.subjectCode ? subjectList.find(f => f.code === row.subjectCode) && subjectList.find(f => f.code === row.subjectCode).name : '无' }}
              </span>
            </template>

            <template slot-scope="{ row }" slot="incomeSubjectCode">
              <span style="color: #2d8cf0; text-decoration: underline;" @click="setSubject(false, row, 'incomeSubjectCode')">
                {{ row.incomeSubjectCode ? subjectList.find(f => f.code === row.incomeSubjectCode) && subjectList.find(f => f.code === row.incomeSubjectCode).name : '无' }}
              </span>
            </template>

            <template slot-scope="{ row }" slot="costSubjectCode">
              <span style="color: #2d8cf0; text-decoration: underline;" @click="setSubject(false, row, 'costSubjectCode')">
                {{ row.costSubjectCode ? subjectList.find(f => f.code === row.costSubjectCode) && subjectList.find(f => f.code === row.costSubjectCode).name : '无' }}
              </span>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <selectSubject ref="subject" :isReturnObj="true"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCustomerGroup, queryCustomer, customerUpdateSubject } from '../../api/customer'
import { querySupplierGroup, querySupplier, supplierUpdateSubject } from '../../api/supplier'
import { queryCommodityInfoGroup, queryCommodityInfo, commodityInfoUpdateSubject } from '../../api/commodityInfo'
import { queryIncomeCategory, incomeCategoryUpdateSubject } from '../../api/incomeCategory'
import { querySpendingCategory, spendingCategoryUpdateSubject } from '../../api/spendingCategory'
import { queryDepartment, departmentUpdateSubject } from '../../api/department'
import { queryBankAccount, bankAccountUpdateSubject } from '../../api/bankAccount'
import { queryFeeDiscount, updateFeeDiscount } from '../../api/feeDiscount'
import { querySubject } from '../../api/subject'
import selectSubject from '../../components/subject/index'
export default {
  name: 'subjectAssociated',
  components: {
    selectSubject
  },
  data () {
    return {
      which: '客户',
      customerGroup: [],
      customer: [],
      supplierGroup: [],
      supplier: [],
      commodityGroup: [],
      commodity: [],
      incomeCategoryGroup: [],
      incomeCategory: [],
      spendingCategoryGroup: [],
      spendingCategory: [],
      departmentGroup: [],
      department: [],
      bankAccountGroup: [],
      bankAccount: [],
      loading: false,
      isExpand: true,
      hoverId: null,
      selectGroup: null,
      subjectList: [],
      subjectCode: null,
      incomeSubjectCode: null,
      costSubjectCode: null,
      selectList: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '操作',
          width: 150,
          key: 'name'
        },
        {
          title: '对应科目',
          slot: 'subject'
        }
      ],
      feeDiscount: null
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission'
    ]),
    groupList () {
      let result = [{
        _id: null,
        name: this.which,
        expand: true,
        children: []
      }]
      let group = []
      switch (this.which) {
        case '客户':
          group = this.customerGroup
          break
        case '供应商':
          group = this.supplierGroup
          break
        case '商品':
          group = this.commodityGroup
          break
      }
      let add = (list, child) => {
        list.forEach(v => {
          let subList = group.filter(g => g.parentIds.length && g.parentIds[g.parentIds.length - 1] === v._id)
          let children = []
          if (subList.length) add(subList, children)
          child.push({
            _id: v._id,
            name: v.name,
            parentIds: v.parentIds,
            expand: true,
            children: children
          })
        })
      }
      add(group.filter(f => f.parentIds.length === 0), result[0].children)
      return result
    },
    getTableHeight () {
      return window.innerHeight - 245
    },
    getTableWidth () {
      return window.innerWidth - 110 - (this.isExpand ? 230 : 10)
    },
    tableData () {
      let list = []
      this.$set(this.columns[1], 'title', this.which)
      switch (this.which) {
        case '客户':
          list = this.customer
          break
        case '供应商':
          list = this.supplier
          break
        case '商品':
          list = this.commodity
          break
        case '收入类别':
          list = this.incomeCategory
          break
        case '支出类别':
          list = this.spendingCategory
          break
        case '部门':
          list = this.department
          break
        case '银行账户':
          list = this.bankAccount
          break
      }
      let parentIds = this.selectGroup ? this.groupList.filter(v => v.parentIds.includes(this.selectGroup)).map(m => m._id) : []
      if (this.selectGroup) {
        list = list.filter(v => v.groupId === this.selectGroup || parentIds.includes(v.groupId))
      }
      if (this.loading) this.closeLoading()
      if (this.selectList.length) {
        list.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadCustomer()
          this.loadSupplier()
          this.loadCommodity()
          this.loadIncomeCategory()
          this.loadSpendingCategory()
          this.loadDepartment()
          this.loadBankAccount()
          this.loadSubject()
          this.loadFeeDiscount()
        }
      },
      immediate: true,
      deep: true
    },
    which () {
      this.selectGroup = null
      this.subjectCode = null
      this.incomeSubjectCode = null
      this.costSubjectCode = null
      if (this.which === '商品' && this.columns[2].title === '对应科目') {
        this.$set(this.columns[2], 'title', '库存商品科目')
        this.columns.push({
          title: '主营业务收入匹配科目',
          slot: 'incomeSubjectCode'
        })
        this.columns.push({
          title: '主营业务成本匹配科目',
          slot: 'costSubjectCode'
        })
      } else if (this.which !== '商品' && this.columns[2].title === '库存商品科目') {
        this.$set(this.columns[2], 'title', '对应科目')
        this.columns.splice(2, 2)
      }
      if (this.which === '费用' && this.feeDiscount) {
        this.subjectCode = this.feeDiscount.feeSubjectCode
      }
      if (this.which === '折扣' && this.feeDiscount) {
        this.subjectCode = this.feeDiscount.discountSubjectCode
      }
    }
  },
  methods: {
    closeLoading () {
      this.loading = false
    },
    loadCustomer () {
      this.loading = true
      queryCustomerGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.customerGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户组',
          desc: err.message
        })
      })
      queryCustomer({ accountSetId: this.accountSet._id }).then(res => {
        this.customer = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户',
          desc: err.message
        })
      })
    },
    loadSupplier () {
      this.loading = true
      querySupplierGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商组',
          desc: err.message
        })
      })
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplier = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商',
          desc: err.message
        })
      })
    },
    loadCommodity () {
      this.loading = true
      queryCommodityInfoGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.commodityGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '商品组',
          desc: err.message
        })
      })
      queryCommodityInfo({
        filter: {
          accountSetId: this.accountSet._id
        },
        pageInfo: {
          limit: 99999999999999,
          page: 1
        }
      }).then(res => {
        this.commodity = res.data.list
      }).catch(err => {
        this.$Notice.error({
          title: '商品',
          desc: err.message
        })
      })
    },
    loadIncomeCategory () {
      this.loading = true
      queryIncomeCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.incomeCategory = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '收入类别',
          desc: err.message
        })
      })
    },
    loadSpendingCategory () {
      this.loading = true
      querySpendingCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.spendingCategory = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '支出类别',
          desc: err.message
        })
      })
    },
    loadDepartment () {
      this.loading = true
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.department = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadBankAccount () {
      this.loading = true
      queryBankAccount({ accountSetId: this.accountSet._id }).then(res => {
        this.bankAccount = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '银行账号',
          desc: err.message
        })
      })
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubject', res.data)
        this.subjectList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    loadFeeDiscount () {
      queryFeeDiscount({ accountSetId: this.accountSet._id }).then(res => {
        this.feeDiscount = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '费用、折扣对应科目',
          desc: err.message
        })
      })
    },
    renderContent (h, { root, node, data }) {
      return h('div', {
        style: {
          display: 'inline-block'
        },
        on: {
          'mouseenter': () => {
            this.hoverId = data._id
          },
          'mouseleave': () => {
            this.hoverId = null
          }
        }
      }, [
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center'
          }
        }, [
          h('span', {
            style: {
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              display: 'block',
              height: '24px',
              lineHeight: '24px',
              cursor: 'pointer',
              padding: '0 5px',
              background: data._id === this.selectGroup ? '#5cadff' : '',
              color: data._id === this.selectGroup ? '#fff' : ''
            },
            on: {
              click: () => {
                this.selectGroup = data._id
              }
            }
          }, data.name)
        ])
      ])
    },
    selectSubject (type) {
      this.$refs.subject.show(obj => {
        this[type] = obj.code
      })
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    setSubject (isMore, row, type) {
      if (isMore) {
        if (this.which !== '费用' && this.which !== '折扣' && this.selectList.length === 0) {
          this.$Message.error('请选择要修改的项')
        } else if (!this.subjectCode) {
          this.$Message.error('请选择对应科目')
        } else {
          this.save(this.selectList, this.subjectCode, type)
        }
      } else {
        this.$refs.subject.show(obj => {
          this.save([row._id], obj.code, type)
        })
      }
    },
    save (ids, subjectCode, type) {
      switch (this.which) {
        case '客户':
          customerUpdateSubject({
            ids,
            subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadCustomer()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '供应商':
          supplierUpdateSubject({
            ids,
            subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadSupplier()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '商品':
          let obj = { ids }
          if (type === 'all') {
            this.$set(obj, 'subjectCode', this.subjectCode)
            this.$set(obj, 'incomeSubjectCode', this.incomeSubjectCode)
            this.$set(obj, 'costSubjectCode', this.costSubjectCode)
          } else {
            this.$set(obj, type, subjectCode)
          }
          commodityInfoUpdateSubject(obj).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadCommodity()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '收入类别':
          incomeCategoryUpdateSubject({
            ids,
            subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadIncomeCategory()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '支出类别':
          spendingCategoryUpdateSubject({
            ids,
            subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadSpendingCategory()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '部门':
          departmentUpdateSubject({
            ids,
            subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadDepartment()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '银行账户':
          bankAccountUpdateSubject({
            ids,
            subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadBankAccount()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '费用':
          updateFeeDiscount({
            _id: this.feeDiscount ? this.feeDiscount._id : null,
            accountSetId: this.accountSet._id,
            feeSubjectCode: subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadFeeDiscount()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
        case '折扣':
          updateFeeDiscount({
            _id: this.feeDiscount ? this.feeDiscount._id : null,
            accountSetId: this.accountSet._id,
            discountSubjectCode: subjectCode
          }).then(res => {
            this.$Message.success('保存成功！！！')
            this.loadFeeDiscount()
          }).catch(err => {
            this.$Notice.error({
              title: '修改对应科目失败',
              desc: err.message
            })
          })
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .left_expand {
    position: relative;
    width: 210px;
    height: ~"calc(100vh - 182px)";
    margin-right: 10px;
    background: #fff;
    transition: 300ms;

    .expand_btn {
      position: absolute;
      right: 0;
      top: 50%;
      z-index: 1;
      width: 20px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c5c8ce;
      margin-top: -15px;
      cursor: pointer;
      transition: 300ms;

      img {
        width: 10px;
      }

      &:hover {
        opacity: .8;
      }
    }

    &.active {
      width: 0;
      margin-right: 0;

      .expand_btn {
        right: -20px;
        transform: rotateY(180deg);
      }
    }

    .le_c {
      width: 100%;
      height: 100%;
      overflow: hidden;

      .le_m {
        width: 210px;
        height: 100%;

        .title {
          width: 100%;
          height: 36px;
          min-height: 36px;
          border-bottom: 1px solid #dcdee2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;

          .add_btn {
            width: 18px;
            height: 18px;
            cursor: pointer;

            img {
              width: 100%;
              height: 100%;
              filter: grayscale(100%)
            }
          }
        }

        .search {
          padding: 8px 10px;
        }

        .scroll_layer {
          height: ~"calc(100% - 37px - 48px)";
          overflow: hidden;
        }
      }
    }
  }
  .measure_c {
    display: flex;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
    overflow: hidden;
  }
</style>
