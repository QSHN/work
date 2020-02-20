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
  indexLabel: ' ',
  indexWidth: 60,
  stripe: true,
  menuAlign: 'center',
  menuWidth: 120,
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  column: [
	  {
      label: '服务单号',
      prop: 'billId',
      viewDisplay: false,
      // searchDefault: 0,
      search: true,
      minWidth: 102
    },
	  {
      label: '业务单号',
      hide: true,
      prop: 'billNo'
    },
	  {
      label: '服务机构id',
      prop: 'orgId',
      hide: true
    },
	  {
      label: '服务机构名称',
      prop: 'orgName',
      minWidth: 150,
      overHidden: true,
      //search: true,
      type: "select",
      search: true,
      searchDefault: null,
      dicUrl: `/nursing/oms/org/all`,
      props: {
        children: 'childNodes',
        label: 'orgName',
        value: 'orgName'
      },
      align: "left"
    },
	  {
      label: '服务项目id',
      prop: 'serviceId',
      hide: true
    },
	  {
      label: '服务项目id',
      prop: 'orgServiceId',
      hide: true
    },
	  {
      label: '服务名称',
      prop: 'serviceLabel',
      minWidth: 100,
      overHidden: true,
      align: "left"
    },
	  {
      label: '服务人员级别',
      prop: 'staffLevel',
      hide: true
    },
	  {
      label: '服务单价',
      prop: 'price',
      hide: true
    },
	  {
      label: '平均服务单价',
      prop: 'avgPrice',
      hide: true
    },
	  {
      label: '服务对象Id',
      prop: 'custId',
      hide: true
    },
	  {
      label: '服务对象',
      prop: 'custName',
      search: true,
      minWidth: 70,
      overHidden: true
      // hide: true
    },
	  {
      label: '服务区域id',
      prop: 'custZoneId',
      hide: true
    },
	  {
      label: '计价单位',
      prop: 'unit',
      width: 48,
      overHidden: true
    },
	  {
      label: '购买数量',
      prop: 'qty',
      width: 48
    },
	  {
      label: '已完成数量',
      prop: 'qtyFinished',
      width: 60
    },
	  {
      label: '已锁定数量',
      prop: 'qtyLocked',
      hide: true
    },
	  {
      label: '下单会员id',
      prop: 'vipId',
      hide: true
    },
	  {
      label: '下单会员',
      prop: 'vipName',
      minWidth: 70,
      overHidden: true,
      search: true
    },
	  {
      label: '上门服务地址',
      prop: 'custAddress',
      minWidth: 200,
      overHidden: true,
      align: "left"
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
      label: '投保人与客户的关系',
      prop: 'relationForCust',
      hide: true
    },
	  {
      label: '耗材包单价',
      prop: 'kitPrice',
      hide: true
    },
	  {
      label: '上门费单价',
      prop: 'visitPrice',
      hide: true
    },
	  {
      label: '保险费单价',
      prop: 'premiumPrice',
      hide: true
    },
	  {
      label: '耗材包/工具包费用',
      prop: 'kitAmt',
      hide: true
    },
	  {
      label: '上门费',
      prop: 'visitAmt',
      hide: true
    },
	  {
      label: '保险费',
      prop: 'premiumAmt',
      hide: true
    },
	  {
      label: '优惠金额',
      prop: 'discountAmt',
      hide: true
    },
	  {
      label: '礼券金额',
      prop: 'couponAmt',
      hide: true
    },
	  {
      label: '折后服务金额',
      prop: 'itemAmt',
      width: 60
    },
	  {
      label: '应付金额',
      prop: 'paymentAmt',
      hide: true
    },
	  {
      label: '服务人员佣金比例',
      prop: 'staffRate',
      hide: true
    },
	  {
      label: '服务机构佣金比例',
      prop: 'serviceRate',
      hide: true
    },
	  {
      label: '运营机构佣金比例',
      prop: 'operatorRate',
      hide: true
    },
	  {
      label: '订单类型',
      prop: 'billType',
      // search: true,
      type: "select",
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      dicUrl: `${treeUrl}/bill_type`,
      width: 88,
      overHidden: true
    },
	  {
      label: '支付状态',
      prop: 'payState',
      // search: true,
      type: "select",
      // searchDefault: -1,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      dicUrl: `${treeUrl}/pay_state`,
      searchClearable: false,
      width: 70
    },
	  {
      label: '订单状态',
      prop: 'billState',
      // search: true,
      type: "select",
      searchMmultiple:true,
      searchDefault: null,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      dicUrl: `${treeUrl}/bill_state`,
      searchClearable: false,
      width: 120,
      overHidden: true
    },
	  {
      label: '单据日期',
      prop: 'billDate',
      format: "yyyy-MM-dd",
      // type: "datetime",
      search: true,
      type: "daterange",
      valueFormat: 'yyyy-MM-dd',
      width: 90
    },
	  {
      label: '开票状态',
      prop: 'invoiceState',
      type: "select",
      hide: true,
      search: true,
      searchDefault: null,
      dicUrl: `${treeUrl}/invoice_state`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
	  {
      label: '耗材包/工具包id',
      prop: 'kitGoodsId',
      hide: true
    },
	  {
      label: '耗材包/工具包名称',
      prop: 'kitGoodsLabel',
      hide: true
    },
	  {
      label: '优惠券代码',
      prop: 'couponCode',
      hide: true
    },
	  {
      label: '预约日期',
      prop: 'reserveDate',
      hide: true
    },
	  {
      label: '预约时间（起始）',
      prop: 'reserveTime1',
      hide: true
    },
	  {
      label: '预约时间（结束）',
      prop: 'reserveTime2',
      hide: true
    },
	  {
      label: '有效期至',
      prop: 'validDate',
      hide: true
    },
	  {
      label: '是否删除',
      prop: 'delFlag',
      hide: true
    },
	  {
      label: '审核人id',
      prop: 'checkerId',
      hide: true
    },
	  {
      label: '审核人姓名',
      prop: 'checkerName',
      hide: true
    },
	  {
      label: '审核时间',
      prop: 'checkTime',
      hide: true
    },
	  {
      label: '修改时间',
      prop: 'updateTime',
      hide: true
    },
	  {
      label: '开始时间',
      prop: 'startDate',
      hide: true
    },
	  {
      label: '结束时间',
      prop: 'endDate',
      hide: true
    },
	  {
      label: '创建时间',
      prop: 'createTime',
      format: 'yyyy-MM-dd',
      width: 144,
      more: true,
      valueFormat: 'yyyy-MM-dd',
      hide: true
    }
  ]
}
