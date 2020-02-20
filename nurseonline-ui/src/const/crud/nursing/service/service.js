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

const baseUrl = `/nursing`
const treeUrl = `${baseUrl}/oms/aid/itemtrees`
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 200,
  align: 'center',
  maxWidth: 380,
  maxHeight: 520,
  size: 'small',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      fixed: true,
      label: '服务Id',
      hide: true,
      prop: 'serviceId',
      editDisabled: true,
      addDisplay: false
    },
    {
      label: '服务代码',
      prop: 'serviceCode',
      editDisabled: true,
      // width: 120,
      // slot: true,
      // search: true,
      // span: 24,
      rules: [{
        required: true,
        message: '请输入服务代码'
      }, {
        min: 3,
        max: 32,
        message: '长度在 3 到 32 个字符',
        trigger: 'blur'
      }
        // {validator: validateGoodsCode, trigger: 'blur'}
      ]
    },
    {
      label: '服务名称',
      prop: 'serviceName',
      // width: 200,
      overHidden: true,
      rules: [{
        required: true,
        message: '请输入机服务名称'
      }]
    },
    {
      label: '服务描述',
      prop: 'serviceCaption',
      hide: true
    },
    {
      label: '服务类别',
      prop: 'serviceType',
      // width: 120,
      // type: 'tree',
      // search: true,
      // searchslot: true,
      type: "select",
      dicUrl: `${treeUrl}/service_type`,
      formslot: true,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: false, message: '请选择服务类别', trigger: 'blur'}]
    },
    {
      label: '规格',
      prop: 'spec'
    },
    {
      label: '单位',
      prop: 'unit'
    },
    {
      label: '服务时长',
      prop: 'duration',
      append: "分钟"
    },
    {
      label: '服务提示',
      prop: 'guide',
      width: 200,
      hide: true,
      type: 'textarea',
      span: 24
    },
    {
      label: '温馨提醒',
      prop: 'caution',
      hide: true,
      width: 200,
      type: 'textarea',
      span: 24
    },
    {
      label: '适用对象',
      prop: 'targets',
      hide: true,
      type: 'textarea',
      span: 24
    },
    {
      // 标准图链接地址，需要用户上传
      label: '服务图片',
      prop: 'imgUrl',
      // slot: true,
      hide: true,
      formslot: true,
      formWidth: "100%",
      span: 12
    },
    {
      // 图标链接地址，用于移动版橱窗式浏览，需要用户上传
      label: '图标',
      prop: 'iconUrl',
      hide: true,
      formslot: true,
      formWidth: "100%",
      span: 12
    },
    // {
    //   label: '小图链接地址，用于移动版列表式浏览（如搜索结果），基于标准图自动生成，图片规格按照设计部门要求确定',
    //   prop: 'img11Url'
    // },
    // {
    //   label: '小图链接地址，用于移动版详情页（可与img11共用），基于标准图自动生成，图片规格按照设计部门要求确定',
    //   prop: 'img12Url'
    // },
    // {
    //   label: '小图链接地址，用于PC版浏览页，基于标准图自动生成，图片规格按照设计部门要求确定',
    //   prop: 'img21Url'
    // },
    // {
    //   label: '中图链接地址，用于PC版详情页，基于标准图自动生成，图片规格按照设计部门要求确定',
    //   prop: 'img22Url'
    // },
    {
      label: '服务人员类别要求',  // 参见item_class_code='staff_type'定义，如=0则表示不限制
      prop: 'staffType',
      hide: true,
      type: 'select',
      dicUrl: `${treeUrl}/staff_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: false, message: '请选择服务人员类别要求', trigger: 'blur'}]
    },
    {
      label: '服务人员职称要求',  // 参见item_class_code='professional_title'定义
      prop: 'professionalTitle',
      hide: true,
      type: 'select',
      dicUrl: `${treeUrl}/professional_title`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: false, message: '请选择服务人员职称要求', trigger: 'blur'}]
    },
    {
      // 如果非空则表明需要指定的专科护士，可以多选（id之间逗号分隔），默认为空表示没有要求，专科列表参见item_class_code='specialist'定义
      label: '要求专科护士',
      prop: 'specialist',
      hide: true,
      type: 'select',
      multiple: true,
      dicUrl: `${treeUrl}/specialist`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: false, message: '请指定要求的专科护士，可多选', trigger: 'blur'}]
    },
    {
      label: '扩展描述',  // 格式："标签":"{?}"，如有多个则逗号分隔
      prop: 'extDesc',
      hide: true,
      type: 'textarea'
    },
    {
      label: '材料要求',
      prop: 'certDesc',
      hide: true,
      type: 'textarea'
    },
    {
      label: '扩展属性配置',
      prop: 'profile',
      hide: true,
      type: 'textarea'
    },
    // {
    //   label: '是否删除，0：正常（默认），1：已删除',
    //   prop: 'delFlag'
    // },
    {
      label: '评估表',  // 参见item_class_code='professional_title'定义
      prop: 'evaluateTplId',
      hide: true,
      type: 'select',
      // dicUrl: `${treeUrl}/professional_title`,
      dicData: [
        {
          label: 'VTE风险评估表',
          value: 1
        },
        {
          label: 'PICC居家护理评估表',
          value: 2
        },
        {
          label: '淋巴水肿居家护理评估表',
          value: 3
        },
        {
          label: '造口居家护理评估表',
          value: 4
        },
        {
          label: '康复治疗居家护理评估表',
          value: 5
        },
        {
          label: '导管居家护理评估表',
          value: 6
        },
      ],
      props: {
        children: 'childNodes',
        label: 'label',
        value: 'value'
      },
      rules: [{required: false, message: '请选择评估表', trigger: 'blur'}]
    },
    {
      label: '知情通知书',  // 参见item_class_code='professional_title'定义
      prop: 'informedId',
      hide: true,
      type: 'select',
      dicUrl: `${baseUrl}/oms/informed/all`,
      props: {
        children: 'childNodes',
        label: 'name',
        value: 'id'
      },
      rules: [{required: false, message: '请选择知情通知书', trigger: 'blur'}]
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd',
      width: 100,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      addDisplay: false,
      editDisplay: false
    },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
    // {
    //   label: '版本号，默认=1，每次变更递增',
    //   prop: 'versionNo'
    // },
  ]
}
