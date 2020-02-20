<template>
  <Modal
    v-model="modal"
    :title="`${type}客户`"
    :mask-closable="false"
    width="500"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="公司名字" prop="companyName">
        <Input v-model="formData.companyName" style="width: 250px" />
      </FormItem>

      <FormItem label="公司账号" prop="companyAccount">
        <Input v-model="formData.companyAccount" readonly style="width: 250px" />
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input type="password" v-model="formData.password" style="width: 250px" />
      </FormItem>

      <FormItem label="确认密码" prop="confirmPassword">
        <Input type="password" v-model="formData.confirmPassword" style="width: 250px" />
      </FormItem>

      <FormItem label="联系人" prop="name">
        <Input v-model="formData.name" style="width: 250px" />
      </FormItem>

      <FormItem label="手机号码" prop="phone">
        <Input v-model="formData.phone" style="width: 250px" />
      </FormItem>

      <FormItem label="客户归属" prop="salesmanId">
        <Select v-model="formData.salesmanId"  style="width: 250px">
          <Option v-for="(v, i) in userList" :value="v._id" :key="i">{{ v.name }}</Option>
        </Select>
      </FormItem>

      <FormItem label="app账号数">
        <Input-number :min="0" v-model.number="formData.erpNumber" style="width: 250px"></Input-number>
      </FormItem>

      <FormItem label="财务账号数">
        <Input-number :min="0" v-model.number="formData.financeNumber" style="width: 250px"></Input-number>
      </FormItem>

      <FormItem label="财务账套数">
        <Input-number :min="0" v-model.number="formData.accountSetNumber" style="width: 250px"></Input-number>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateClient } from '../../api/user'
import pinyin from 'pinyin'
export default {
  name: 'currency',
  props: {
    userList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      type: '',
      oldData: {},
      formData: {},
      formDataRule: {
        companyName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('公司名字不能为空'))
              } else if (this.oldData.companyName !== value && this.clientList.filter(v => v.companyName === value.trim()).length) {
                callback(new Error('已存在该公司名字，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        companyAccount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('公司账号不能为空'))
              } else if (this.oldData.companyAccount !== value && this.clientList.filter(v => v.companyAccount === value.trim()).length) {
                callback(new Error('已存在该公司账号，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        password: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (value.length < 6) {
                callback(new Error('密码必须大于6位'))
              } else {
                callback()
              }
            }
          }
        ],
        confirmPassword: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!this.formData.password && !value) {
                callback()
              } else if (this.formData.password !== value) {
                callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            }
          }
        ],
        name: [
          { required: true, trigger: 'blur', message: '联系人名字不能为空' }
        ],
        phone: [
          { required: true, trigger: 'blur', message: '手机号码不能为空' }
        ],
        salesmanId: [
          { required: true, trigger: 'change', message: '客户归属不能为空' }
        ]
      },
      clientList: []
    }
  },
  watch: {
    'formData.companyName': {
      handler () {
        if (!this.formData._id && this.formData.companyName) {
          let name = this.formData.companyName
          this.formData.companyAccount = pinyin(name, {
            style: pinyin.STYLE_FIRST_LETTER,
            heteronym: true
          }).join('') + Math.floor(Math.random() * 9000)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'myUser'
    ])
  },
  methods: {
    show (type, data, clientList) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        companyName: '',
        companyAccount: '',
        name: '',
        phone: '',
        salesmanId: this.myUser._id,
        accountStatus: '禁用',
        recordList: [],
        password: '',
        confirmPassword: '',
        financeFunction: [
          {
            name: '采购管理',
            val: true,
            child: [
              {
                name: '采购单据',
                val: true,
                child: [
                  { name: '采购订单', val: true },
                  { name: '采购入库', val: true },
                  { name: '采购退货', val: true }
                ]
              },
              {
                name: '采购报表',
                val: true,
                child: [
                  { name: '采购明细表', val: true },
                  { name: '采购汇总表', val: true },
                  { name: '采购订单跟踪表', val: true }
                ]
              }
            ]
          },
          {
            name: '销售管理',
            val: true,
            child: [
              {
                name: '销售单据',
                val: true,
                child: [
                  { name: '销售订单', val: true },
                  { name: '销售出库', val: true },
                  { name: '销售退货', val: true }
                ]
              },
              {
                name: '销售报表',
                val: true,
                child: [
                  { name: '销售明细表', val: true },
                  { name: '销售订单跟踪表', val: true },
                  { name: '销售分析', val: true },
                  { name: '采购销售汇总表', val: true },
                  { name: '销售汇总表', val: true },
                  { name: '销售排行表', val: true }
                ]
              }
            ]
          },
          {
            name: '仓存管理',
            val: true,
            child: [
              {
                name: '仓存单据',
                val: true,
                child: [
                  { name: '其他入库', val: true },
                  { name: '其他出库', val: true },
                  { name: '移仓库', val: true },
                  { name: '调拨出库', val: true },
                  { name: '调拨入库', val: true },
                  { name: '调拨差异处理表', val: true },
                  { name: '盘点单', val: true },
                  { name: '盘盈单', val: true },
                  { name: '盘亏单', val: true }
                ]
              },
              {
                name: '仓存报表',
                val: true,
                child: [
                  { name: '库存查询表', val: true },
                  { name: '预计可用库存表', val: true },
                  { name: '商品收发明细表', val: true },
                  { name: '商品收发汇总表', val: true }
                ]
              }
            ]
          },
          {
            name: '应收应付',
            val: true,
            child: [
              {
                name: '应收单据',
                val: true,
                child: [
                  { name: '收款', val: true },
                  { name: '预收款', val: true },
                  { name: '预收退款', val: true },
                  { name: '其他应收', val: true },
                  { name: '核销', val: true }
                ]
              },
              {
                name: '应收单据',
                val: true,
                child: [
                  { name: '付款', val: true },
                  { name: '预付款', val: true },
                  { name: '预付退款', val: true },
                  { name: '其他应付', val: true }
                ]
              },
              {
                name: '报表',
                val: true,
                child: [
                  { name: '应收明细表', val: true },
                  { name: '应付明细表', val: true }
                ]
              }
            ]
          },
          {
            name: '财务处理',
            val: true,
            child: [
              {
                name: '凭证',
                val: true,
                child: [
                  { name: '录凭证', val: true },
                  { name: '查凭证', val: true },
                  { name: '凭证过账', val: true },
                  { name: '模式凭证', val: true }
                ]
              },
              {
                name: '账簿',
                val: true,
                child: [
                  { name: '总分类账', val: true },
                  { name: '明细分类账', val: true },
                  { name: '数量金额总账', val: true },
                  { name: '数量金额明细账', val: true },
                  { name: '多栏账', val: true },
                  { name: '核算项目分类总账', val: true },
                  { name: '核算项目明细账', val: true }
                ]
              },
              {
                name: '财务报表',
                val: true,
                child: [
                  { name: '科目余额表', val: true },
                  { name: '试算平衡表', val: true },
                  { name: '日报表查询', val: true },
                  { name: '摘要汇总表', val: true },
                  { name: '核算项目余额表', val: true },
                  { name: '核算项目明细表', val: true },
                  { name: '核算项目汇总表', val: true },
                  { name: '核算项目组合表', val: true },
                  { name: '核算项目与科目结合表', val: true },
                  { name: '科目利息计算表', val: true },
                  { name: '调汇历史信息表', val: true }
                ]
              },
              {
                name: '智能凭证中心',
                val: true,
                child: [
                  { name: '生成凭证', val: true },
                  { name: '科目关联设置', val: true },
                  { name: '业务凭证模板', val: true }
                ]
              },
              {
                name: '期末处理',
                val: true,
                child: [
                  { name: '期末调汇', val: true },
                  { name: '结转损益', val: true },
                  { name: '自动转账', val: true },
                  { name: '期末结账', val: true }
                ]
              }
            ]
          },
          {
            name: '财务报表',
            val: true,
            child: [
              {
                name: '财务报表',
                val: true,
                child: [
                  { name: '资产负债表', val: true },
                  { name: '利润表', val: true },
                  { name: '现金流量表', val: true },
                  { name: '部门利润表', val: true },
                  { name: '所有者权益变动表', val: true },
                  { name: '自定义报表', val: true }
                ]
              }
            ]
          },
          {
            name: '基础资料',
            val: true,
            child: [
              {
                name: '商品资料',
                val: true,
                child: [
                  { name: '商品信息', val: true },
                  { name: '计量单位', val: true },
                  { name: '商品品牌', val: true },
                  { name: '商品标签', val: true },
                  { name: '辅助属性', val: true },
                  { name: '客户商品编码', val: true },
                  { name: '商品价格资料', val: true },
                  { name: '客户价格资料', val: true },
                  { name: '价格取数优先级', val: true },
                  { name: '条码生成规则', val: true },
                  { name: '条码标签打印', val: true }
                ]
              },
              {
                name: '业务资料',
                val: true,
                child: [
                  { name: '客户', val: true },
                  { name: '供应商', val: true },
                  { name: '部门', val: true },
                  { name: '职员', val: true },
                  { name: '仓库', val: true },
                  // { name: '仓位', val: true },
                  { name: '收入类别', val: true },
                  { name: '支出类别', val: true },
                  // { name: '组织架构', val: true },
                  { name: '辅助资料', val: true }
                  // { name: '省份', val: true },
                  // { name: '城市', val: true }
                ]
              },
              {
                name: '财务资料',
                val: true,
                child: [
                  { name: '币别', val: true },
                  { name: '结算方式', val: true },
                  { name: '银行账户', val: true },
                  { name: '科目', val: true },
                  { name: '凭证字', val: true },
                  { name: '凭证模板', val: true }
                  // { name: '汇率体系', val: true },
                  // { name: '费用', val: true },
                  // { name: '现金流量项目', val: true },
                  // { name: '银行联行号', val: true }
                ]
              },
              {
                name: '期初录入',
                val: true,
                child: [
                  { name: '商品期初', val: true },
                  { name: '客户初始数据', val: true },
                  { name: '供应商初始数据', val: true },
                  { name: '财务初始余额', val: true },
                  { name: '现金流量初始数据', val: true },
                  { name: '结束初始化', val: true },
                  { name: '反初始化', val: true }
                ]
              }
            ]
          },
          {
            name: '系统设置',
            val: true,
            child: [
              {
                name: '基础设置',
                val: true,
                child: [
                  { name: '系统参数', val: true },
                  { name: '用户授权', val: true }
                ]
              }
            ]
          }
        ],
        erpFunction: [
          {
            category: '日常办公',
            val: true,
            tasks: [
              { name: '我的考勤', val: true },
              { name: '考勤管理', val: true },
              { name: '实时查岗', val: true },
              { name: '工作轨迹', val: true },
              { name: '通讯目录', val: true },
              { name: '日报管理', val: true },
              { name: '任务管理', val: true },
              { name: '权限管理', val: true },
              { name: '填写汇报', val: true },
              { name: '绩效设置', val: true },
              { name: '绩效结算', val: true },
              { name: '通知公告', val: true },
              { name: '合同管理', val: true },
              { name: '组织构架', val: true },
              { name: '公司内部联络单', val: true },
              { name: '员工评分', val: true }
            ]
          },
          {
            category: '审批申请',
            val: true,
            tasks: [
              { name: '费用报销', val: true },
              { name: '用车申请', val: true },
              { name: '用章申请', val: true },
              { name: '采购申请', val: true },
              { name: '付款申请', val: true },
              { name: '合同审批', val: true },
              { name: '绩效报告', val: true },
              { name: '物品领用', val: true },
              { name: '销售业绩', val: true }
            ]
          },
          {
            category: '客户管理',
            val: true,
            tasks: [
              { name: '客户管理', val: true },
              { name: '拜访管理', val: true },
              { name: '扫名片', val: true },
              { name: '邀约到访', val: true }
            ]
          },
          {
            category: '财务管理',
            val: true,
            tasks: [
              { name: '报表', val: true },
              { name: '凭证', val: true },
              { name: '科目余额', val: true },
              { name: '明细账', val: true }
            ]
          },
          {
            category: '终端上报',
            val: true,
            tasks: [
              { name: '终端拜访', val: true },
              { name: '铺货上报', val: true },
              { name: '库存上报', val: true },
              { name: '销量上报', val: true },
              { name: '综合上报', val: true },
              { name: '终端形象采集', val: true },
              { name: '竞品上报', val: true }
            ]
          },
          {
            category: '进销存管理',
            val: true,
            tasks: [
              { name: '订单管理', val: true },
              { name: '商品管理', val: true },
              { name: '库存查询', val: true },
              { name: '销售订单', val: true },
              { name: '销售退货单', val: true },
              { name: '收款登记', val: true },
              { name: '客户应收', val: true },
              { name: '调拨单据', val: true },
              { name: '经营分析', val: true },
              { name: '库存盘点', val: true },
              { name: '车销', val: true },
              { name: '发货单', val: true },
              { name: '进货单', val: true }
            ]
          }
        ],
        erpNumber: null,
        financeNumber: null,
        accountSetNumber: null,
        files: []
      })
      if (data) this.oldData = data
      this.clientList = clientList
      this.$refs.formData.resetFields()
      this.$forceUpdate()
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.oldData = {}
      this.$refs.formData.resetFields()
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let formData = Object.assign({}, this.formData)
          updateClient(formData).then(res => {
            this.$Notice.success({
              title: `${this.type}客户`,
              desc: `成功${this.type}客户`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: `${this.type}客户`,
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
