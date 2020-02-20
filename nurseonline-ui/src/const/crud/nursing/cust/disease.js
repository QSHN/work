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

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
	  {
      label: '客户疾病id',
      prop: 'custDiseaseId'
    },
	  {
      label: '客户id，引用cust.cust_id',
      prop: 'custId'
    },
	  {
      label: '疾病id，引用disease.disease_id',
      prop: 'diseaseId'
    },
	  {
      label: '疾病名称【冗余】，来自disease.disease_name',
      prop: 'diseaseName'
    },
	  {
      label: '创建时间，默认=当前时间',
      prop: 'createTime'
    },
  ]
}
