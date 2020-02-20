/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

const baseUrl = `/nursing/oms`
const treeUrl = `${baseUrl}/aid/itemtrees`
const zoneUrl = `${baseUrl}/zone/zone/trees`
const DIC = {
  sex: [{
    label: '不填',
    value: "0"
  }, {
    label: '男',
    value: "1"
  }, {
    label: '女',
    value: "2"
  }],
  staff_state: [{
    label: '待审核',
    value: 0
  }, {
    label: '审核通过',
    value: 1
  }, {
    label: '审核未通过',
    value: 2
  }],
  is_lock: [{
    label: '是',
    value: "1"
  }, {
    label: '否',
    value: "0"
  }],
  is_certificated: [{
    label: '是',
    value: "1"
  }, {
    label: '否',
    value: "0"
  }],
  is_examined: [{
    label: '是',
    value: "1"
  }, {
    label: '否',
    value: "0"
  }],
  is_orderReceiving: [{
    label: '是',
    value: "1"
  }, {
    label: '否',
    value: "0"
  }]
  }
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'left',
  // menuWidth: 390,
  maxHeight: 690,
  size: 'small',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  // expand: true,
  defaultExpandAll: false,
  idKey: 'staffId',
  // menuType: 'menu',
  column: [
    {
      label: '人员id',
      prop: 'staffId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '人员代码',
      prop: 'staffCode',
      rules: [{required: true, message: '请输入人员代码', trigger: 'blur'}]
    },
    {
      label: '人员姓名',
      prop: 'staffName',
      rules: [{required: true, message: '请输入人员姓名', trigger: 'blur'}]
    },
    {
      label: '人员状态',
      prop: 'staffState',
      type: 'tree',
      defaultExpandAll: false,
      // dicData: DIC.staff_state,
      dicUrl: `${treeUrl}/staff_state`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      // viewDisplay: true,
      // editDisplay: false,
      // addDisplay: false,
      disabled: true
    },
    {
      label: '人员类别',
      prop: 'staffType',
      // search: true,
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/staff_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择人员类别', trigger: 'blur'}]
    },
    {
      label: '身份证号',
      prop: 'idNo',
      hide: true,
      rules: [
        {required: true, message: '请输入身份证号', trigger: 'blur'},
        {min: 15, max: 18, message: "身份证号长度为15-18位", trigger: "blur"}
      ]
    },
    {
      label: '性别',
      prop: 'sex',
      hide: true,
      type: 'radio',
      dicData: DIC.sex,
      valueDefault: "0",
      rules: [{
        required: true,
        message: '请选择性别',
        trigger: 'blur'
      }]
    },
    {
      label: '年龄',
      prop: 'age',
      hide: true,
      type: 'number',
    },
    {
      label: '手机号码',
      prop: 'phone',
      type: 'phone',
      width: 120,
      // search: true,
      rules: [{required: true, message: '请输入手机号码', trigger: 'blur'}]
    },
    {
      label: '学历',
      prop: 'education',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/education`,
      hide: true,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择学历', trigger: 'blur'}]
    },
    {
      label: '职称',
      prop: 'professionalTitle',
      hide: true,
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/professional_title`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择职称', trigger: 'blur'}]
    },
    {
      label: '职务',
      prop: 'job',
      hide: true,
    },
    {
      label: '工作单位',
      prop: 'jobOrg',
      rules: [{required: true, message: '请输入工作单位', trigger: 'blur'}],
      hide: true,
    },
    {
      label: '工作年限',
      prop: 'serviceYears',
      type: 'number',
      rules: [{required: true, message: '请输入工作年限', trigger: 'blur'}],
      hide: true,
    },
    {
      label: '特长',
      prop: 'speciality',
      hide: true,
    },
    {
      label: '专业介绍',
      prop: 'professionalIntro',
      hide: true,
    },
    // {
    //   label: '所在区域',
    //   prop: 'zoneId',
    //   type: 'tree',
    //   dicUrl: zoneUrl,
    //   props: {
    //     children: 'childNodes',
    //     label: 'zoneName',
    //     value: 'zoneId'
    //   },
    //   rules: [{
    //     required: true, message: '请选择所在区域', trigger: 'blur'
    //   }]
    // },
    {
      label: '备注',
      prop: 'remark',
      span: 24,
      hide: true,
    },
    // {
    //   label: '头像',
    //   prop: 'iconUrl'
    // },
    {
      label: '账户余额',
      prop: 'balance',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '积分余额',
      prop: 'point',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '关联id',
      prop: 'userId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '关联用户',
      prop: 'userName',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '是否禁用',
      prop: 'isLocked',
      type: "switch",
      dicData: DIC.is_lock,
      slot: true,
    },
    {
      label: '通过认证',
      prop: 'isCertificated',
      type: "switch",
      dicData: DIC.is_certificated,
      slot: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '通过考核',
      prop: 'isExamined',
      type: "switch",
      dicData: DIC.is_examined,
      slot: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    // {
    //   label: '是否删除',
    //   prop: 'delFlag'
    // },
    {
      label: '审核人id',
      prop: 'checkerId',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
      hide: true,
    },
    {
      label: '审核人',
      prop: 'checkerName',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '审核时间',
      prop: 'checkTime',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '建档人id',
      prop: 'creatorId',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
      hide: true,
    },
    {
      label: '建档人',
      prop: 'creatorName',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: '170',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '可接单',
      prop: 'isOrderReceiving',
      type: "switch",
      dicData: DIC.is_orderReceiving
    },

    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
    // {
    //   label: '版本号',
    //   prop: 'versionNo'
    // },
  ]
}

export const detailOption = {
  group: [{
    label: '个人信息',
    prop: 'personalInfo',
    icon: 'el-icon-view',
    column: [{
      label: '人员代码',
      prop: 'staffCode',
    }, {
      label: '人员姓名',
      prop: 'staffName',
    }, {
      label: '身份证号',
      prop: 'idNo',
    }, {
      label: '性别',
      prop: 'sex',
      type: 'radio',
      dicData: DIC.sex,
    }, {
      label: '年龄',
      prop: 'age',
    }, {
      label: '手机号码',
      prop: 'phone',
      type: 'phone',
    }, {
      label: '学历',
      prop: 'education',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/education`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    }, {
      label: '职称',
      prop: 'professionalTitle',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/professional_title`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    }, {
      label: '职务',
      prop: 'job',
    }, {
      label: '工作单位',
      prop: 'jobOrg',
    }, {
      label: '工作年限',
      prop: 'serviceYears',
    }, {
      label: '特长',
      prop: 'speciality',
    }, {
      label: '专业介绍',
      prop: 'professionalIntro',
    }]

  }, {
    label: '状态信息',
    prop: 'personalInfo',
    icon: 'el-icon-view',
    column: [{
      label: '人员状态',
      prop: 'staffState',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/staff_state`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      }
    }, {
      label: '人员类别',
      prop: 'staffType',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/staff_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      }
    }, {
      label: '通过认证',
      prop: 'isCertificated',
      type: "switch",
      dicData: DIC.is_certificated,
    }, {
      label: '通过考核',
      prop: 'isExamined',
      type: "switch",
      dicData: DIC.is_examined,
    }, {
      label: '创建时间',
      prop: 'createTime',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
      {
        label: '可接单',
        prop: 'isOrderReceiving',
        type: "switch",
        dicData: DIC.is_orderReceiving,
      },
    ]
  }]
}
