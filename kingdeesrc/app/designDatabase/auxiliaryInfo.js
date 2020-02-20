const auxiliary = [
    {
        id: '001',
        name: '采购费用种类',
        child: [
            {
                code: '101',
                status: '启用',
                name: '运费'
            },
            {
                code: '102',
                status: '启用',
                name: '装卸费'
            },
            {
                code: '103',
                status: '启用',
                name: '途中保险费'
            },
            {
                code: '104',
                status: '启用',
                name: '整理费'
            }
        ]
    },
    {
        id: '002',
        name: '运输方式',
        child: [
            {
                code: '201',
                status: '启用',
                name: '长途运输'
            },
            {
                code: '202',
                status: '启用',
                name: '短途陆运'
            },
            {
                code: '203',
                status: '启用',
                name: '水运'
            },
            {
                code: '204',
                status: '启用',
                name: '海运'
            },
            {
                code: '205',
                status: '启用',
                name: '空运'
            },
            {
                code: '206',
                status: '启用',
                name: '集装箱运输'
            }
        ]
    },
    {
        id: '003',
        name: '原因',
        child: [
            {
                code: '301',
                status: '启用',
                name: '质量问题'
            },
            {
                code: '302',
                status: '启用',
                name: '质次价高'
            },
            {
                code: '303',
                status: '启用',
                name: '残损'
            },
            {
                code: '304',
                status: '启用',
                name: '过期变质'
            },
            {
                code: '305',
                status: '启用',
                name: '包装破损'
            }
        ]
    },
    {
        id: '004',
        name: '文化程度',
        child: [
            {
                code: '401',
                status: '启用',
                name: '初中'
            },
            {
                code: '402',
                status: '启用',
                name: '高中'
            },
            {
                code: '403',
                status: '启用',
                name: '中专'
            },
            {
                code: '404',
                status: '启用',
                name: '大专'
            },
            {
                code: '405',
                status: '启用',
                name: '本科'
            },
            {
                code: '406',
                status: '启用',
                name: '硕士'
            },
            {
                code: '407',
                status: '启用',
                name: '博士'
            }
        ]
    },
    {
        id: '005',
        name: '职称',
        child: [
            {
                code: '501',
                status: '启用',
                name: '技术员'
            },
            {
                code: '502',
                status: '启用',
                name: '助理工程师'
            },
            {
                code: '503',
                status: '启用',
                name: '工程师'
            },
            {
                code: '504',
                status: '启用',
                name: '高级工程师'
            },
            {
                code: '505',
                status: '启用',
                name: '会计员'
            },
            {
                code: '506',
                status: '启用',
                name: '助理会计师'
            },
            {
                code: '507',
                status: '启用',
                name: '会计师'
            },
            {
                code: '508',
                status: '启用',
                name: '高级会计师'
            },
            {
                code: '509',
                status: '启用',
                name: '设计师'
            },
            {
                code: '510',
                status: '启用',
                name: '助理设计师'
            },
            {
                code: '511',
                status: '启用',
                name: '高级设计师'
            },
            {
                code: '512',
                status: '启用',
                name: '经济员'
            },
            {
                code: '513',
                status: '启用',
                name: '助理经济师'
            },
            {
                code: '514',
                status: '启用',
                name: '经济师'
            },
            {
                code: '515',
                status: '启用',
                name: '高级经济师'
            }
        ]
    },
    {
        id: '006',
        name: '行业',
        child: [
            {
                code: '601',
                status: '启用',
                name: '制造业'
            },
            {
                code: '602',
                status: '启用',
                name: '商贸业'
            },
            {
                code: '603',
                status: '启用',
                name: '饮食旅游业'
            },
            {
                code: '604',
                status: '启用',
                name: '房地产业'
            }
        ]
    },
    {
        id: '007',
        name: '区域',
        child: [
            {
                code: '701',
                status: '启用',
                name: '东北区'
            },
            {
                code: '702',
                status: '启用',
                name: '华北区'
            },
            {
                code: '703',
                status: '启用',
                name: '华中区'
            },
            {
                code: '704',
                status: '启用',
                name: '华东区'
            },
            {
                code: '705',
                status: '启用',
                name: '华南区'
            },
            {
                code: '706',
                status: '启用',
                name: '西南区'
            },
            {
                code: '707',
                status: '启用',
                name: '西北区'
            },
            {
                code: '708',
                status: '启用',
                name: '港澳台'
            },
            {
                code: '709',
                status: '启用',
                name: '国外'
            }
        ]
    },
    {
        id: '008',
        name: '供应商分类',
        child: [
            {
                code: '801',
                status: '启用',
                name: '一级供应商'
            },
            {
                code: '802',
                status: '启用',
                name: '二级供应商'
            },
            {
                code: '803',
                status: '启用',
                name: '大宗供应商'
            },
            {
                code: '804',
                status: '启用',
                name: '中型供应商'
            },
            {
                code: '805',
                status: '启用',
                name: '小宗供应商'
            },
            {
                code: '806',
                status: '启用',
                name: '零散供应商'
            },
            {
                code: '807',
                status: '启用',
                name: '外协'
            }
        ]
    },
    {
        id: '009',
        name: '付款期限',
        child: [
            {
                code: '901',
                status: '启用',
                name: '10天'
            },
            {
                code: '902',
                status: '启用',
                name: '20天'
            },
            {
                code: '903',
                status: '启用',
                name: '一个月'
            },
            {
                code: '904',
                status: '启用',
                name: '三个月'
            },
            {
                code: '905',
                status: '启用',
                name: '半年'
            },
            {
                code: '906',
                status: '启用',
                name: '一年'
            }
        ]
    },
    {
        id: '010',
        name: '岗位',
        child: [
            {
                code: '1001',
                status: '启用',
                name: '总经理'
            },
            {
                code: '1002',
                status: '启用',
                name: '副总经理'
            },
            {
                code: '1003',
                status: '启用',
                name: '部门经理'
            },
            {
                code: '1004',
                status: '启用',
                name: '部门副经理'
            },
            {
                code: '1005',
                status: '启用',
                name: '办事员'
            },
            {
                code: '1006',
                status: '启用',
                name: '车间主任'
            },
            {
                code: '1007',
                status: '启用',
                name: '车间副主任'
            },
            {
                code: '1008',
                status: '启用',
                name: '技术员'
            },
            {
                code: '1009',
                status: '启用',
                name: '主管会计'
            },
            {
                code: '1010',
                status: '启用',
                name: '会计'
            },
            {
                code: '1011',
                status: '启用',
                name: '出纳'
            },
            {
                code: '1012',
                status: '启用',
                name: '检验员'
            },
            {
                code: '1013',
                status: '启用',
                name: '业务员'
            },
            {
                code: '1014',
                status: '启用',
                name: '工人'
            }
        ]
    },
    {
        id: '011',
        name: '职员类别',
        child: [
            {
                code: '1101',
                status: '启用',
                name: '一级业务员'
            },
            {
                code: '1102',
                status: '启用',
                name: '二级业务员'
            },
            {
                code: '1103',
                status: '启用',
                name: '计划内分配'
            },
            {
                code: '1104',
                status: '启用',
                name: '计划内招调'
            },
            {
                code: '1105',
                status: '启用',
                name: '招聘'
            },
            {
                code: '1106',
                status: '启用',
                name: '离退休员工'
            },
            {
                code: '1107',
                status: '启用',
                name: '外借工'
            },
            {
                code: '1108',
                status: '启用',
                name: '合同工'
            }
        ]
    },
    {
        id: '012',
        name: '交货方式',
        child: [
            {
                code: '1201',
                status: '启用',
                name: '提货'
            },
            {
                code: '1202',
                status: '启用',
                name: '送货'
            },
            {
                code: '1203',
                status: '启用',
                name: '发货'
            }
        ]
    },
    {
        id: '013',
        name: '交货地点',
        child: []
    },
    {
        id: '014',
        name: '结算期限',
        child: []
    },
    {
        id: '015',
        name: '所有制',
        child: []
    },
    {
        id: '016',
        name: '资产关系',
        child: []
    },
    {
        id: '017',
        name: '上级主管',
        child: []
    },
    {
        id: '018',
        name: '工序资料',
        child: []
    },
    {
        id: '019',
        name: '业务组',
        child: []
    },
    {
        id: '020',
        name: '销售方式',
        child: [
            {
                code: '2001',
                status: '启用',
                name: '直运销售'
            },
            {
                code: '2002',
                status: '启用',
                name: '受托代销'
            },
            {
                code: '2003',
                status: '启用',
                name: '零售'
            },
            {
                code: '2004',
                status: '启用',
                name: '现售'
            },
            {
                code: '2005',
                status: '启用',
                name: '赊销'
            },
            {
                code: '2006',
                status: '启用',
                name: '分期收款销售'
            },
            {
                code: '2007',
                status: '启用',
                name: '委托代销'
            }
        ]
    },
    {
        id: '021',
        name: '银行行号',
        child: []
    },
    {
        id: '022',
        name: '销售类型',
        child: [
            {
                code: '2201',
                status: '启用',
                name: '内销'
            },
            {
                code: '2202',
                status: '启用',
                name: '外销'
            }
        ]
    },
    {
        id: '023',
        name: '结算方式',
        child: [
            {
                code: '2301',
                status: '启用',
                name: '现金'
            },
            {
                code: '2302',
                status: '启用',
                name: '电汇'
            },
            {
                code: '2303',
                status: '启用',
                name: '信汇'
            },
            {
                code: '2304',
                status: '启用',
                name: '商业汇票'
            },
            {
                code: '2305',
                status: '启用',
                name: '银行汇票'
            },
            {
                code: '2306',
                status: '启用',
                name: '票据结算'
            }
        ]
    },
    {
        id: '024',
        name: '税目',
        child: []
    },
    {
        id: '025',
        name: '采购方式',
        child: [
            {
                code: '2501',
                status: '启用',
                name: '直运采购'
            },
            {
                code: '2502',
                status: '启用',
                name: '受托入库'
            },
            {
                code: '2503',
                status: '启用',
                name: '现购'
            },
            {
                code: '2504',
                status: '启用',
                name: '赊购'
            }
        ]
    },
    {
        id: '026',
        name: '仓库组',
        child: []
    },
    {
        id: '027',
        name: '是/否',
        child: [
            {
                code: '2701',
                status: '启用',
                name: '否'
            },
            {
                code: '2702',
                status: '启用',
                name: '是'
            }
        ]
    },
    {
        id: '028',
        name: '价格类型',
        child: [
            {
                code: '2801',
                status: '启用',
                name: '零售价'
            }
        ]
    },
    {
        id: '029',
        name: '结算单据用途',
        child: []
    },
    {
        id: '030',
        name: '现金管理账号及开户行',
        child: []
    },
    {
        id: '031',
        name: '报废原因',
        child: []
    },
    {
        id: '032',
        name: '银行支付地区',
        child: []
    },
    {
        id: '033',
        name: '风险等级',
        child: [
            {
                code: '3301',
                status: '启用',
                name: '高'
            },
            {
                code: '3302',
                status: '启用',
                name: '中'
            },
            {
                code: '3303',
                status: '启用',
                name: '低'
            }
        ]
    },
    {
        id: '034',
        name: '领料类型',
        child: [
            {
                code: '3401',
                status: '启用',
                name: '废品残值退料'
            },
            {
                code: '3402',
                status: '启用',
                name: '一般领料'
            },
            {
                code: '3403',
                status: '启用',
                name: '修复废品领料'
            }
        ]
    },
    {
        id: '035',
        name: '其他入库类型',
        child: [
            {
                code: '3501',
                status: '启用',
                name: '其他入库'
            }
        ]
    },
    {
        id: '036',
        name: '其他出库类型',
        child: [
            {
                code: '3601',
                status: '启用',
                name: '其他出库'
            }
        ]
    },
    {
        id: '037',
        name: '客户分类',
        child: [
            {
                code: '3701',
                status: '启用',
                name: '一级代销商'
            },
            {
                code: '3702',
                status: '启用',
                name: '二级代销商'
            }
        ]
    },
    {
        id: '038',
        name: '物料分类',
        child: [
            {
                code: '3801',
                status: '启用',
                name: '主推商品'
            },
            {
                code: '3802',
                status: '启用',
                name: '辅推商品'
            }
        ]
    },
    {
        id: '039',
        name: '公司类别',
        child: [
            {
                code: '3901',
                status: '启用',
                name: '制造商'
            },
            {
                code: '3902',
                status: '启用',
                name: '代理商'
            },
            {
                code: '3903',
                status: '启用',
                name: '承运商'
            }
        ]
    },
    {
        id: '040',
        name: '供应类别',
        child: [
            {
                code: '4001',
                status: '启用',
                name: '采购'
            },
            {
                code: '4002',
                status: '启用',
                name: '委外'
            },
            {
                code: '4003',
                status: '启用',
                name: '服务'
            }
        ]
    },
    {
        id: '041',
        name: '公司规模',
        child: [
            {
                code: '4101',
                status: '启用',
                name: '特大型企业'
            },
            {
                code: '4102',
                status: '启用',
                name: '大型企业'
            },
            {
                code: '4103',
                status: '启用',
                name: '中小型企业'
            },
            {
                code: '4104',
                status: '启用',
                name: '小型企业'
            }
        ]
    },
    {
        id: '042',
        name: '公司性质',
        child: [
            {
                code: '4201',
                status: '启用',
                name: '国有企业'
            },
            {
                code: '4202',
                status: '启用',
                name: '民营企业'
            },
            {
                code: '4203',
                status: '启用',
                name: '外商投资企业'
            },
            {
                code: '4204',
                status: '启用',
                name: '集体企业'
            },
            {
                code: '4205',
                status: '启用',
                name: '中外合资企业'
            },
            {
                code: '4206',
                status: '启用',
                name: '工商个体户'
            }
        ]
    },
    {
        id: '043',
        name: '分支机构发货类型',
        child: [
            {
                code: '4301',
                status: '启用',
                name: '发分支机构'
            },
            {
                code: '4302',
                status: '启用',
                name: '发客户'
            },
            {
                code: '4303',
                status: '启用',
                name: '分支机构退货'
            },
            {
                code: '4304',
                status: '启用',
                name: '客户退货'
            }
        ]
    },
    {
        id: '044',
        name: '信用证类型',
        child: []
    },
    {
        id: '045',
        name: '服务类型',
        child: [
            {
                code: '4501',
                status: '启用',
                name: '投诉'
            },
            {
                code: '4502',
                status: '启用',
                name: '请求'
            }
        ]
    },
    {
        id: '046',
        name: '服务请求来源',
        child: [
            {
                code: '4601',
                status: '启用',
                name: '电话'
            },
            {
                code: '4602',
                status: '启用',
                name: '邮件'
            },
            {
                code: '4603',
                status: '启用',
                name: '传真'
            },
            {
                code: '4604',
                status: '启用',
                name: '其他'
            }
        ]
    },
    {
        id: '047',
        name: '问题类型',
        child: [
            {
                code: '4701',
                status: '启用',
                name: '外观缺陷'
            },
            {
                code: '4702',
                status: '启用',
                name: '功能缺陷'
            }
        ]
    },
    {
        id: '048',
        name: '机会来源',
        child: [
            {
                code: '4801',
                status: '启用',
                name: '市场开括'
            },
            {
                code: '4802',
                status: '启用',
                name: '客户主动询问'
            },
            {
                code: '4803',
                status: '启用',
                name: '员工推荐'
            },
            {
                code: '4804',
                status: '启用',
                name: '老客户推荐'
            },
            {
                code: '4805',
                status: '启用',
                name: '自己开拓'
            }
        ]
    },
    {
        id: '049',
        name: '兴趣大小',
        child: [
            {
                code: '4901',
                status: '启用',
                name: '感兴趣'
            },
            {
                code: '4902',
                status: '启用',
                name: '无所谓'
            },
            {
                code: '4903',
                status: '启用',
                name: '不感兴趣'
            }
        ]
    },
    {
        id: '050',
        name: '输赢原因',
        child: [
            {
                code: '5001',
                status: '启用',
                name: '产品原因'
            },
            {
                code: '5002',
                status: '启用',
                name: '关系原因'
            },
            {
                code: '5003',
                status: '启用',
                name: '个人原因'
            },
            {
                code: '5004',
                status: '启用',
                name: '价格原因'
            },
            {
                code: '5005',
                status: '启用',
                name: '其他原因'
            }
        ]
    },
    {
        id: '051',
        name: '活动类型',
        child: [
            {
                code: '5101',
                status: '启用',
                name: '上门拜访'
            },
            {
                code: '5102',
                status: '启用',
                name: '约见'
            },
            {
                code: '5103',
                status: '启用',
                name: '电话'
            },
            {
                code: '5104',
                status: '启用',
                name: '邮件'
            },
            {
                code: '5105',
                status: '启用',
                name: '开会'
            },
            {
                code: '5106',
                status: '启用',
                name: '调查'
            }
        ]
    },
    {
        id: '052',
        name: '优先级',
        child: [
            {
                code: '5201',
                status: '启用',
                name: '高'
            },
            {
                code: '5202',
                status: '启用',
                name: '中'
            },
            {
                code: '5203',
                status: '启用',
                name: '低'
            }
        ]
    },
    {
        id: '053',
        name: '重要性',
        child: [
            {
                code: '5301',
                status: '启用',
                name: '很重要'
            },
            {
                code: '5302',
                status: '启用',
                name: '一般'
            },
            {
                code: '5303',
                status: '启用',
                name: '不重要'
            }
        ]
    },
    {
        id: '054',
        name: '客户级别',
        child: [
            {
                code: '5401',
                status: '启用',
                name: '战略客户'
            },
            {
                code: '5402',
                status: '启用',
                name: '重点客户'
            },
            {
                code: '5403',
                status: '启用',
                name: '普通客户'
            }
        ]
    },
    {
        id: '055',
        name: '开工延迟原因',
        child: [
            {
                code: '5501',
                status: '启用',
                name: '自动解除开工报警-所有看板调整为满状态'
            },
            {
                code: '5502',
                status: '启用',
                name: '自动解除开工报警-看板调整为下达状态'
            },
            {
                code: '5503',
                status: '启用',
                name: '自动解除开工报警-生产单元所有看板被删除'
            },
            {
                code: '5504',
                status: '启用',
                name: '自动解除开工报警-生产单元停产'
            },
            {
                code: '5505',
                status: '启用',
                name: '自动解除开工报警-换班'
            },
            {
                code: '5506',
                status: '启用',
                name: '自动解除开工报警-生产单元没有未挂起状态的空看板'
            }
        ]
    },
    {
        id: '056',
        name: '完工延迟原因',
        child: [
            {
                code: '5601',
                status: '启用',
                name: '自动解除完工报警-所有看板调整为满状态'
            },
            {
                code: '5602',
                status: '启用',
                name: '自动解除完工报警-看板调整为非下达状态'
            },
            {
                code: '5603',
                status: '启用',
                name: '自动解除完工报警-生产单元所有看板被删除'
            },
            {
                code: '5604',
                status: '启用',
                name: '自动解除完工报警-生产单元停产'
            },
            {
                code: '5605',
                status: '启用',
                name: '自动解除完工报警-换班'
            }
        ]
    },
    {
        id: '057',
        name: '异常报警原因',
        child: []
    },
    {
        id: '058',
        name: '换模延迟原因',
        child: []
    },
    {
        id: '059',
        name: '看板修正原因',
        child: []
    },
    {
        id: '060',
        name: '模具类型',
        child: []
    },
    {
        id: '061',
        name: '融资类别',
        child: [
            {
                code: '6101',
                status: '启用',
                name: '银行贷款'
            },
            {
                code: '6102',
                status: '启用',
                name: '票据'
            },
            {
                code: '6103',
                status: '启用',
                name: '债券'
            },
            {
                code: '6104',
                status: '启用',
                name: '银行借款'
            },
            {
                code: '6105',
                status: '启用',
                name: '银行承兌汇票'
            }
        ]
    },
    {
        id: '062',
        name: '融资方式',
        child: []
    },
    {
        id: '063',
        name: '供应商等级',
        child: []
    },
    {
        id: '064',
        name: '申请类型',
        child: [
            {
                code: '6401',
                status: '启用',
                name: '新产品'
            },
            {
                code: '6402',
                status: '启用',
                name: '设计变更'
            }
        ]
    },
    {
        id: '065',
        name: '公告类别',
        child: [
            {
                code: '6501',
                status: '启用',
                name: '规章制度'
            },
            {
                code: '6502',
                status: '启用',
                name: '文档模板'
            },
            {
                code: '6503',
                status: '启用',
                name: '行为准则'
            },
            {
                code: '6504',
                status: '启用',
                name: '业务指南'
            }
        ]
    },
    {
        id: '066',
        name: '文档类别',
        child: [
            {
                code: '6601',
                status: '启用',
                name: '标准作业指导书'
            },
            {
                code: '6602',
                status: '启用',
                name: '内控制度与规范'
            },
            {
                code: '6603',
                status: '启用',
                name: '外部政策法规'
            }
        ]
    },
    {
        id: '067',
        name: '客户类型',
        child: [
            {
                code: '6701',
                status: '启用',
                name: '直接客户'
            },
            {
                code: '6702',
                status: '启用',
                name: '代理商'
            },
            {
                code: '6703',
                status: '启用',
                name: '经销商'
            },
            {
                code: '6704',
                status: '启用',
                name: '会员'
            },
            {
                code: '6705',
                status: '启用',
                name: '政府机构'
            },
            {
                code: '6706',
                status: '启用',
                name: '个人客户'
            },
            {
                code: '6707',
                status: '启用',
                name: '合作伙伴'
            }
        ]
    },
    {
        id: '068',
        name: '市场活动类型',
        child: [
            {
                code: '6801',
                status: '启用',
                name: '市场促销'
            },
            {
                code: '6802',
                status: '启用',
                name: '展会'
            },
            {
                code: '6803',
                status: '启用',
                name: '市场推广'
            }
        ]
    },
    {
        id: '069',
        name: '情报来源',
        child: [
            {
                code: '6901',
                status: '启用',
                name: '专业杂志'
            },
            {
                code: '6902',
                status: '启用',
                name: '竞争对手'
            },
            {
                code: '6903',
                status: '启用',
                name: '市场渠道'
            }
        ]
    },
    {
        id: '070',
        name: '情报类型',
        child: [
            {
                code: '7001',
                status: '启用',
                name: '新产品'
            },
            {
                code: '7002',
                status: '启用',
                name: '新技术'
            },
            {
                code: '7003',
                status: '启用',
                name: '市场信息'
            }
        ]
    },
    {
        id: '071',
        name: '线索来源',
        child: [
            {
                code: '7101',
                status: '启用',
                name: '广告'
            },
            {
                code: '7102',
                status: '启用',
                name: '活动'
            },
            {
                code: '7103',
                status: '启用',
                name: '电话'
            },
            {
                code: '7104',
                status: '启用',
                name: '邮件'
            },
            {
                code: '7105',
                status: '启用',
                name: '合作伙伴'
            },
            {
                code: '7106',
                status: '启用',
                name: '外部引介'
            },
            {
                code: '7107',
                status: '启用',
                name: '公共关系'
            },
            {
                code: '7108',
                status: '启用',
                name: '口碑'
            },
            {
                code: '7109',
                status: '启用',
                name: '研讨会'
            },
            {
                code: '7120',
                status: '启用',
                name: '其他'
            }
        ]
    },
    {
        id: '072',
        name: '调查类型',
        child: [
            {
                code: '7201',
                status: '启用',
                name: '综合调查'
            },
            {
                code: '7202',
                status: '启用',
                name: '产品调查'
            },
            {
                code: '7203',
                status: '启用',
                name: '服务调查'
            }
        ]
    },
    {
        id: '073',
        name: '业绩依据',
        child: [
            {
                code: '7301',
                status: '启用',
                name: '商机嬴单'
            },
            {
                code: '7302',
                status: '启用',
                name: '销售合同'
            },
            {
                code: '7303',
                status: '启用',
                name: '销售出库'
            },
            {
                code: '7304',
                status: '启用',
                name: '销售（外销）订单'
            },
            {
                code: '7305',
                status: '启用',
                name: '销售发票'
            }
        ]
    },
    {
        id: '074',
        name: '社会阶层',
        child: [
            {
                code: '7401',
                status: '启用',
                name: '国家与社会管理阶层'
            },
            {
                code: '7402',
                status: '启用',
                name: '经理人员阶层'
            },
            {
                code: '7403',
                status: '启用',
                name: '私营企业主阶层'
            },
            {
                code: '7404',
                status: '启用',
                name: '专业技术人员阶层'
            },
            {
                code: '7405',
                status: '启用',
                name: '办事人员阶层'
            },
            {
                code: '7406',
                status: '启用',
                name: '个体工商户阶层'
            },
            {
                code: '7407',
                status: '启用',
                name: '商业服务业员工阶层'
            },
            {
                code: '7408',
                status: '启用',
                name: '产业工人阶层'
            },
            {
                code: '7409',
                status: '启用',
                name: '农业劳动者阶层'
            },
            {
                code: '7410',
                status: '启用',
                name: '城乡无业、失业、半失业者阶层'
            }
        ]
    },
    {
        id: '075',
        name: '客户喜好',
        child: [
            {
                code: '7501',
                status: '启用',
                name: '业余爱好'
            },
            {
                code: '7502',
                status: '启用',
                name: '喜好联系渠道'
            },
            {
                code: '7503',
                status: '启用',
                name: '方便联系时间'
            },
            {
                code: '7504',
                status: '启用',
                name: '产品偏好'
            }
        ]
    },
    {
        id: '076',
        name: '服务合同类型',
        child: [
            {
                code: '7601',
                status: '启用',
                name: '保修协议'
            },
            {
                code: '7602',
                status: '启用',
                name: '延保协议'
            },
            {
                code: '7603',
                status: '启用',
                name: '服务协议'
            }
        ]
    },
    {
        id: '077',
        name: '细分类型',
        child: [
            {
                code: '7701',
                status: '启用',
                name: '市场活动'
            },
            {
                code: '7702',
                status: '启用',
                name: '营销活动'
            },
            {
                code: '7703',
                status: '启用',
                name: '客户关怀'
            }
        ]
    },
    {
        id: '078',
        name: '营销类型',
        child: [
            {
                code: '7801',
                status: '启用',
                name: '短信营销'
            },
            {
                code: '7802',
                status: '启用',
                name: '电邮营销'
            },
            {
                code: '7803',
                status: '启用',
                name: '电话营销'
            },
            {
                code: '7804',
                status: '启用',
                name: '网络营销'
            },
            {
                code: '7805',
                status: '启用',
                name: '直邮营销'
            },
            {
                code: '7806',
                status: '启用',
                name: '其他营销'
            }
        ]
    },
    {
        id: '079',
        name: '营销工具',
        child: [
            {
                code: '7901',
                status: '启用',
                name: '短信'
            },
            {
                code: '7902',
                status: '启用',
                name: '电邮'
            },
            {
                code: '7903',
                status: '启用',
                name: '信函'
            },
            {
                code: '7904',
                status: '启用',
                name: '电话'
            },
            {
                code: '7905',
                status: '启用',
                name: '网络'
            },
            {
                code: '7906',
                status: '启用',
                name: '其他'
            }
        ]
    },
    {
        id: '080',
        name: '收入水平',
        child: [
            {
                code: '8001',
                status: '启用',
                name: '1000/月'
            },
            {
                code: '8002',
                status: '启用',
                name: '1000-2000/月'
            },
            {
                code: '8003',
                status: '启用',
                name: '2000-5000/月'
            },
            {
                code: '8004',
                status: '启用',
                name: '5000-8000/月'
            },
            {
                code: '8005',
                status: '启用',
                name: '8000-10000/月'
            },
            {
                code: '8006',
                status: '启用',
                name: '10000-15000/月'
            },
            {
                code: '8007',
                status: '启用',
                name: '15000-20000/月'
            },
            {
                code: '8008',
                status: '启用',
                name: '20000以上/月'
            }
        ]
    },
    {
        id: '081',
        name: '关怀类别',
        child: [
            {
                code: '8101',
                status: '启用',
                name: '节日问候'
            },
            {
                code: '8102',
                status: '启用',
                name: '积分回馈'
            },
            {
                code: '8103',
                status: '启用',
                name: '俱乐部活动'
            },
            {
                code: '8104',
                status: '启用',
                name: '礼品回馈'
            },
            {
                code: '8105',
                status: '启用',
                name: '定期回访'
            },
            {
                code: '8106',
                status: '启用',
                name: '其他'
            }
        ]
    },
    {
        id: '082',
        name: '关怀方式',
        child: [
            {
                code: '8201',
                status: '启用',
                name: '短信'
            },
            {
                code: '8202',
                status: '启用',
                name: '电邮'
            },
            {
                code: '8203',
                status: '启用',
                name: '信函'
            },
            {
                code: '8204',
                status: '启用',
                name: '电话'
            },
            {
                code: '8205',
                status: '启用',
                name: '拜访'
            },
            {
                code: '8206',
                status: '启用',
                name: '其他'
            }
        ]
    },
    {
        id: '083',
        name: '网店订单类型',
        child: [
            {
                code: '8301',
                status: '启用',
                name: '淘宝网'
            },
            {
                code: '8302',
                status: '启用',
                name: '京东商城'
            },
            {
                code: '8303',
                status: '启用',
                name: '手工订单'
            },
            {
                code: '8304',
                status: '启用',
                name: '换货订单'
            },
            {
                code: '8305',
                status: '启用',
                name: '一号店'
            },
            {
                code: '8306',
                status: '启用',
                name: '当当商城'
            },
            {
                code: '8307',
                status: '启用',
                name: '亚马逊'
            },
            {
                code: '8308',
                status: '启用',
                name: '淘宝分销'
            },
            {
                code: '8309',
                status: '启用',
                name: '唯品会'
            }
        ]
    },
    {
        id: '084',
        name: '运送方式',
        child: [
            {
                code: '8401',
                status: '启用',
                name: 'EMS'
            },
            {
                code: '8402',
                status: '启用',
                name: '平邮'
            },
            {
                code: '8403',
                status: '启用',
                name: '快递'
            },
            {
                code: '8404',
                status: '启用',
                name: '免邮'
            }
        ]
    },
    {
        id: '085',
        name: '物流方式',
        child: [
            {
                code: '8501',
                status: '启用',
                name: '无需物流'
            },
            {
                code: '8502',
                status: '启用',
                name: '自己联系'
            },
            {
                code: '8503',
                status: '启用',
                name: '在线下单'
            }
        ]
    },
    {
        id: '086',
        name: '交易类型',
        child: [
            {
                code: '8601',
                status: '启用',
                name: '一口价'
            },
            {
                code: '8602',
                status: '启用',
                name: '拍卖'
            },
            {
                code: '8603',
                status: '启用',
                name: '一口价/拍卖'
            },
            {
                code: '8604',
                status: '启用',
                name: '直冲'
            },
            {
                code: '8605',
                status: '启用',
                name: '货到付款'
            },
            {
                code: '8606',
                status: '启用',
                name: '分销'
            }
        ]
    },
    {
        id: '087',
        name: '验货状态',
        child: []
    },
    {
        id: '088',
        name: '售后处理状态',
        child: []
    },
    {
        id: '089',
        name: '商品评价类型',
        child: []
    },
    {
        id: '090',
        name: '变更类型',
        child: []
    },
    {
        id: '091',
        name: '交易状态',
        child: [
            {
                code: '9101',
                status: '启用',
                name: '待付款'
            },
            {
                code: '9102',
                status: '启用',
                name: '已付款'
            },
            {
                code: '9103',
                status: '启用',
                name: '已发货'
            },
            {
                code: '9104',
                status: '启用',
                name: '交易成功'
            },
            {
                code: '9105',
                status: '启用',
                name: '交易关闭'
            },
            {
                code: '9106',
                status: '启用',
                name: '货到付款'
            }
        ]
    },
    {
        id: '092',
        name: '处理方案',
        child: [
            {
                code: '9201',
                status: '启用',
                name: '返回修复'
            },
            {
                code: '9202',
                status: '启用',
                name: '提供租借的返回修复'
            },
            {
                code: '9203',
                status: '启用',
                name: '升级交换'
            },
            {
                code: '9204',
                status: '启用',
                name: '交换'
            },
            {
                code: '9205',
                status: '启用',
                name: '更换'
            },
            {
                code: '9206',
                status: '启用',
                name: '内部修复'
            },
            {
                code: '9207',
                status: '启用',
                name: '销售'
            },
            {
                code: '9208',
                status: '启用',
                name: '其他'
            }
        ]
    },
    {
        id: '093',
        name: '营销团队',
        child: [
            {
                code: '9301',
                status: '启用',
                name: '财务成员'
            },
            {
                code: '9302',
                status: '启用',
                name: '服务成员'
            },
            {
                code: '9303',
                status: '启用',
                name: '市场成员'
            },
            {
                code: '9304',
                status: '启用',
                name: '售前成员'
            },
            {
                code: '9305',
                status: '启用',
                name: '实施成员'
            },
            {
                code: '9306',
                status: '启用',
                name: '销售成员'
            }
        ]
    },
    {
        id: '094',
        name: '任务类型',
        child: [
            {
                code: '9401',
                status: '启用',
                name: '工作总结'
            },
            {
                code: '9402',
                status: '启用',
                name: '客户调用'
            },
            {
                code: '9403',
                status: '启用',
                name: '客户支持'
            },
            {
                code: '9404',
                status: '启用',
                name: '临时任务'
            },
            {
                code: '9405',
                status: '启用',
                name: '市场调研'
            },
            {
                code: '9406',
                status: '启用',
                name: '专题任务'
            }
        ]
    },
    {
        id: '095',
        name: '资源类型',
        child: [
            {
                code: '9501',
                status: '启用',
                name: '办公'
            },
            {
                code: '9502',
                status: '启用',
                name: '设备'
            }
        ]
    },
    {
        id: '096',
        name: '团队角色',
        child: [
            {
                code: '9601',
                status: '启用',
                name: '实施顾问'
            },
            {
                code: '9602',
                status: '启用',
                name: '项目监理'
            },
            {
                code: '9603',
                status: '启用',
                name: '项目经理'
            },
            {
                code: '9604',
                status: '启用',
                name: '项目总监'
            }
        ]
    },
    {
        id: '097',
        name: '成败原因',
        child: [
            {
                code: '9701',
                status: '启用',
                name: '高层异动'
            },
            {
                code: '9702',
                status: '启用',
                name: '交付进度'
            },
            {
                code: '9703',
                status: '启用',
                name: '交付质量'
            },
            {
                code: '9704',
                status: '启用',
                name: '项目资金'
            }
        ]
    },
    {
        id: '098',
        name: '销售数据来源',
        child: [
            {
                code: '9801',
                status: '启用',
                name: '收入单'
            },
            {
                code: '9802',
                status: '启用',
                name: '销售合同'
            },
            {
                code: '9803',
                status: '启用',
                name: '销售订单'
            },
            {
                code: '9804',
                status: '启用',
                name: '销售发票'
            },
            {
                code: '9805',
                status: '启用',
                name: '服务合同'
            }
        ]
    },
    {
        id: '099',
        name: '项目类型',
        child: []
    },
    {
        id: '100',
        name: '通讯工具',
        child: [
            {
                code: '10001',
                status: '启用',
                name: '移动电话'
            },
            {
                code: '10002',
                status: '启用',
                name: '固定电话'
            },
            {
                code: '10003',
                status: '启用',
                name: '传真'
            },
            {
                code: '10004',
                status: '启用',
                name: 'E-mail'
            },
            {
                code: '10005',
                status: '启用',
                name: '即时通讯'
            }
        ]
    },
    {
        id: '101',
        name: '工作计划类型',
        child: [
            {
                code: '10101',
                status: '启用',
                name: '日计划'
            },
            {
                code: '10102',
                status: '启用',
                name: '周计划'
            },
            {
                code: '10103',
                status: '启用',
                name: '月计划'
            },
            {
                code: '10104',
                status: '启用',
                name: '季计划'
            },
            {
                code: '10105',
                status: '启用',
                name: '年计划'
            }
        ]
    },
    {
        id: '102',
        name: '服务团队',
        child: [
            {
                code: '10201',
                status: '启用',
                name: '登记人'
            },
            {
                code: '10202',
                status: '启用',
                name: '派工人'
            },
            {
                code: '10203',
                status: '启用',
                name: '处理人'
            }
        ]
    },
    {
        id: '103',
        name: '网店类型',
        child: [
            {
                code: '10301',
                status: '启用',
                name: '淘宝网店'
            },
            {
                code: '10302',
                status: '启用',
                name: '美丽说'
            },
            {
                code: '10303',
                status: '启用',
                name: '对接商城'
            },
            {
                code: '10304',
                status: '启用',
                name: '线下ERP订单'
            },
            {
                code: '10305',
                status: '启用',
                name: '千米网'
            },
            {
                code: '10306',
                status: '启用',
                name: '蘑菇街'
            },
            {
                code: '10307',
                status: '启用',
                name: '速卖通'
            },
            {
                code: '10308',
                status: '启用',
                name: '国美'
            },
            {
                code: '10309',
                status: '启用',
                name: '拍拍商城'
            },
            {
                code: '10310',
                status: '启用',
                name: '微俱聚'
            },
            {
                code: '10312',
                status: '启用',
                name: 'Wish'
            },
            {
                code: '10313',
                status: '启用',
                name: '有赞'
            },
            {
                code: '10314',
                status: '启用',
                name: '京东商城'
            },
            {
                code: '10315',
                status: '启用',
                name: '微店'
            },
            {
                code: '10316',
                status: '启用',
                name: '楚楚街'
            },
            {
                code: '10317',
                status: '启用',
                name: 'eBay'
            },
            {
                code: '10318',
                status: '启用',
                name: '1号店'
            },
            {
                code: '10319',
                status: '启用',
                name: '亚马逊'
            },
            {
                code: '10320',
                status: '启用',
                name: '苏宁易购'
            },
            {
                code: '10321',
                status: '启用',
                name: '唯品会'
            },
            {
                code: '10322',
                status: '启用',
                name: '当当'
            },
            {
                code: '10323',
                status: '启用',
                name: '淘宝分销'
            },
            {
                code: '10324',
                status: '启用',
                name: '1688商城'
            },
            {
                code: '10325',
                status: '启用',
                name: '虚拟商城'
            }
        ]
    },
    {
        id: '104',
        name: '促销赠送类型',
        child: [
            {
                code: '10401',
                status: '启用',
                name: '买就送'
            },
            {
                code: '10402',
                status: '启用',
                name: '满就送'
            },
            {
                code: '10403',
                status: '启用',
                name: '全场送'
            }
        ]
    },
    {
        id: '105',
        name: '促销赠送模式',
        child: [
            {
                code: '10501',
                status: '启用',
                name: '购买所有商品赠送'
            },
            {
                code: '10502',
                status: '启用',
                name: '购买任一商品赠送'
            },
            {
                code: '10503',
                status: '启用',
                name: '以最高金额赠送'
            },
            {
                code: '10504',
                status: '启用',
                name: '满足金额叠加赠送'
            }
        ]
    },
    {
        id: '106',
        name: '贸易方式',
        child: []
    },
    {
        id: '107',
        name: '关区编码',
        child: []
    },
    {
        id: '108',
        name: '征免性质',
        child: []
    },
    {
        id: '109',
        name: '结汇方式',
        child: []
    },
    {
        id: '110',
        name: '加工项目',
        child: []
    },
    {
        id: '111',
        name: '坏账原因',
        child: []
    },
    {
        id: '112',
        name: '价格术语',
        child: [
            {
                code: '11201',
                status: '启用',
                name: 'CIF'
            },
            {
                code: '11202',
                status: '启用',
                name: 'C&F'
            },
            {
                code: '11203',
                status: '启用',
                name: 'FOB'
            },
            {
                code: '11204',
                status: '启用',
                name: 'C&I'
            },
            {
                code: '11205',
                status: '启用',
                name: '市场价'
            },
            {
                code: '11206',
                status: '启用',
                name: '垫仓'
            }
        ]
    }
]

module.exports = {
    auxiliary
}
