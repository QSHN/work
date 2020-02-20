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
  menuWidth: 150,
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
	  {
      label: '预约单号',
      prop: 'taskId',
      search: true,
      minWidth: 100
    },
	  {
      label: '任务单号',
      prop: 'taskNo',
      hide: true
    },
	  {
      label: '服务单号',
      prop: 'billNo',
      hide: true
    },
	  {
      label: '服务单号',  //引用bill.bill_id，一个订单可以分解成多个任务',
      prop: 'billId',
      search: true,
      minWidth: 100
    },
	  {
      label: '订单类型', //，参考item_class_code=bill_type定义',
      prop: 'billType',
      hide: true
    },
	  {
      label: '服务机构id', //，引用org.org_id',
      prop: 'orgId',
      hide: true
    },
	  {
      label: '服务机构名称',
      prop: 'orgName',
      minWidth: 150,
      overHidden: true,
      search: true,
      align: "left"
    },
	  {
      label: '服务对象Id', //，引用cust.cust_id，如果=0则为预订团购单',
      prop: 'custId',
      hide: true
    },
	  {
      label: '服务对象', //Name【冗余】，应用cust.cust_name',
      prop: 'custName',
      hide: true
      // minWidth: 70,
      // overHidden: true
    },
	  {
      label: '服务项目id',//，引用org_service.service_id，关联该Id主要用于统计，如果是自定义套餐则=-1',
      prop: 'serviceId',
      hide: true
    },
	  {
      label: '服务项目id',//，引用org_service.org_service_id，如果是自定义套餐则=-1',
      prop: 'orgServiceId',
      hide: true
    },
	  {
      label: '服务名称',//，引用org_goods.goods_label或者org_service.service_label',
      prop: 'serviceLabel',
      minWidth: 100,
      overHidden: true,
      align: "left"
    },
	  {
      label: '计价单位',//，默认=org_service.unit，如果是自定义套餐则=“套”',
      prop: 'unit',
      width: 48,
      overHidden: true
    },
	  {
      label: '单价',//，=bill.avg_price',
      prop: 'price',
      minWidth: 60
    },
	  {
      label: '数量',//，=1',
      prop: 'qty',
      width: 50
    },
	  {
      label: '下单会员id',//，引用vip.vip_id',
      prop: 'vipId',
      hide: true
    },
	  {
      label: '下单会员',//【冗余】',
      prop: 'vipName',
      search: true,
      minWidth: 70,
      overHidden: true
    },
	  {
      label: '服务对象所在区域id', //，引用zone.zone_id',
      prop: 'custZoneId',
      hide: true
    },
	  {
      label: '服务所在地址',
      prop: 'custAddress',
      minWidth: 200,
      overHidden: true,
      align: "left"
    },
	  {
      label: '耗材包/工具包费用',//，=bill.kit_price',
      prop: 'kitAmt',
      hide: true
    },
	  {
      label: '上门费',//，=bill.visit_price',
      prop: 'visitAmt',
      hide: true
    },
	  {
      label: '保险费',//，=bill.insurance_price',
      prop: 'premiumAmt',
      hide: true
    },
	  {
      label: '服务金额',//，=bill.item_avg_price',
      prop: 'itemAmt',
      width: 80
    },
	  {
      label: '服务人员应得收入',//，=item_amt x bill.staff_rate+ visit_amt',
      prop: 'staffAmt',
      hide: true
    },
	  {
      label: '服务机构应得收入',//，=item_amt x bill.service_rate + kit_amt',
      prop: 'orgAmt',
      hide: true
    },
	  {
      label: '运营机构应得收入',//，=item_amt x bill.operator_rate',
      prop: 'operatorAmt',
      hide: true
    },
	  {
      label: '耗材包/工具包id',//，引用org_goods.org_goods_id，为0表示无需耗材包，根据该id生成领货(出库)单',
      prop: 'kitGoodsId',
      hide: true
    },
	  {
      label: '耗材包/工具包名称',//，引用org_goods.goods_label',
      prop: 'kitGoodsLabel',
      hide: true
    },
	  {
      label: '联系人',
      prop: 'linkman',
      hide: true
    },
	  {
      label: '联系人电话',
      prop: 'linkmanPhone',
      hide: true
    },
	  {
      label: '分派的服务人员id', //，默认=0，分派成功后更新该字段',
      prop: 'staffId',
      hide: true
    },
	  {
      label: '服务人员',//name，默认=""，分派成功后更新该字段',
      prop: 'staffName',
      minWidth: 70,
      overHidden: true,
      search: true
    },
	  {
      label: '投保人',
      prop: 'applicant',
      hide: true
    },
	  {
      label: '投保人身份证号',
      prop: 'applicantIdNo',
      hide: true
    },
	  {
      label: '投保人与客户的关系',//，参见数据字典（cust_relation）设置',
      prop: 'relationForCust',
      hide: true
    },
	  {
      label: '执行状态', //，参见item_class_code=execute_state定义',
      prop: 'executeState',
      type: "select",
      search: true,
      dicUrl: `${treeUrl}/execute_state`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      width: 70,
      overHidden: true
    },
	  {
      label: '预约状态', //，参见item_class_code=task_state定义',
      prop: 'taskState',
      type: "select",
      search: true,
      dicUrl: `${treeUrl}/task_state`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      searchClearable: false,
      width: 120,
      overHidden: true
    },
	  {
      label: '预约日期',//，格式yyyy-mm-dd，如果是套餐则应是首次预约日期',
      prop: 'reserveDate',
      width: 90
    },
	  {
      label: '预约时间（起始',//），用户只能选择整点时刻',
      prop: 'reserveTime1',
      hide: true
    },
	  {
      label: '预约时间（结束）',//，用户只能选择整点时刻，必须大于起始时刻',
      prop: 'reserveTime2',
      hide: true
    },
	  {
      label: '是否删除',//，0：正常（默认），1：已删除  ',
      prop: 'delFlag',
      hide: true
    },
	  {
      label: '分派时间',//，分派成功后更新',
      prop: 'assignTime',
      hide: true
    },
	  {
      label: '创建时间',//，默认=当前时间',
      prop: 'createTime',
      search: true,
      type: "daterange",
      format: 'yyyy-MM-dd',
      width: 146,
      more: true,
      valueFormat: 'yyyy-MM-dd',
      hide: true
    },
    {
      label: '预约时间',//，默认=当前时间',
      prop: 'reserveTime',
      search: true,
      type: "daterange",
      format: 'yyyy-MM-dd',
      width: 146,
      more: true,
      valueFormat: 'yyyy-MM-dd',
      hide: true
    },
	  {
      label: '修改时间',
      prop: 'updateTime',
      hide: true
    },
	  {
      label: '版本号',//，默认=1，每次变更递增',
      prop: 'versionNo',
      hide: true
    }
  ]
}
