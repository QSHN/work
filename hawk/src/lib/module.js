const mods = [
    {
        // please note these items must be array in pair for the sake of page layout
        category: "日常办公",
        target: 'office',
        tasks: [
          {name: "我的考勤", target: "checkin", icon: require('assets/images/icon_my_attendance_big@2x.png')},
          {name: "考勤管理", target: 'applicamgr', icon: require('assets/images/icon_attendance_management_big@2x.png')},
          {name: "实时查岗", target: "position", icon: require('assets/images/icon_real_time_on_inspection_big@2x.png')},
          {name: "工作轨迹", target: "trace", icon: require('assets/images/icon_work_iocus_big@2x.png')},
          {name: "通讯目录", target: "contacts", icon: require('assets/images/icon_communication_directory_big@2x.png')},
          {name: "日报管理", target: 'journalList', icon: require('assets/images/icon_daily_management_big@2x.png')},
          {name: "任务管理", target: "taskindex", icon: require('assets/images/icon_task_management_big@2x.png')},
          {name: "权限管理", target: "privilege", icon: require('assets/images/icon_authority_management_big@2x.png')},
          {name: "填写汇报", target: "submitreport", icon: require('assets/images/icon_data_report_big@2x.png')},
          {name: "绩效设置", target: "scoremgr", icon: require('assets/images/icon_appraisal_management_big@2x.png')},
          {name: "绩效结算", target: "scorepersonal", icon: require('assets/images/icon_job_rating_big@2x.png')},
          {name: "通知公告", target: "announcemgr", icon: require('assets/images/icon_announcements_big@2x.png')},
          {name: "合同管理", target: "contracts", icon: require('assets/images/icon_contract_management_big@2x.png')},
          {name: "组织构架", target: "organization", icon: require('assets/images/icon_organizational_structure_big@2x.png')},
          {name: "公司内部联络单", target: "internalContact", icon: require('assets/images/internalContact.png')},
          {name: "员工评分", target: "employeesScore", icon: require('assets/images/grade.png')},
          // {
          //     title: "组织构架", icon: "sitemap", link: "/setting/company/organization"
          // },
        ]
    },
    {
        category: "审批申请",
        target: "office",
        tasks: [
            {name: "费用报销", target: "expenseList", icon: require('assets/images/icon_reimbursement_big@2x.png')},
            {name: "用车申请", target: "carList", icon: require('assets/images/icon_apply_car_big@2x.png')},
            {name: "用章申请", target: "sealList", icon: require('assets/images/icon_apply_stamper_big@2x.png')},
            {name: "采购申请", target: "procurementList", icon: require('assets/images/icon_apply_procurement_big@2x.png')},
            {name: "付款申请", target: "paymentList", icon: require('assets/images/icon_apply_payment_big@2x.png')},
            {name: "合同审批", target: "contractList", icon: require('assets/images/icon_contract_approve_big@2x.png')},
            {name: "绩效报告", target: "performanceList", icon: require('assets/images/icon_the_performance_of_big@2x.png')},
            {name: "物品领用", target: "goodsList", icon: require('assets/images/icon_items_of_recipients_big@2x.png')},
            {name: "销售业绩", target: "salesmanageList", icon: require('assets/images/icon_sales_management_big@2x.png')}
        ]
    },
    {
        category: "客户管理",
        target: "client",
        tasks: [
            // {name: "新增客户", target: "client", icon: require('assets/images/icon_new_customer_big@2x.png')},
            {name: "客户管理", target: "clientmgr", icon: require('assets/images/icon_customer_management_big@2x.png')},
            // {name: "新增拜访", target: "visit", icon: require('assets/images/icon_new_visit_big@2x.png')},
            {name: "拜访管理", target: "visitmgr", icon: require('assets/images/icon_visit_management_big@2x.png')},
            {name: "扫名片", target: "ocr", icon: require('assets/images/icon_scan_card_big@2x.png')},
            {name: "邀约到访", target: "invitationList", icon: require('assets/images/icon_invitation_to_visit_big@2x.png')}
        ]
    },
    {
        category: "房源管理", tasks: [
            {name: "新增房源", icon: "modx"},
            {name: "房源管理", icon: "modx"},
            {name: "房源分析", icon: "modx"},
            {name: "房源预测", icon: "modx"},
        ]
    },
    {
        category: "财务管理",
        target: 'finance',
        role: ['admin', 'accountant'],
        tasks: [
          {name: "报表", target: "reportForms", icon: require('assets/images/icon_company_general_ledger_big@2x.png')},
          {name: "凭证", target: "credentials", icon: require('assets/images/icon_financial_input_big@2x.png')},
          // {name: "固定支出", target: "fixedcost", icon: require('assets/images/icon_fixed_expenses_big@2x.png')},
          // {name: "应收账款", target: "receivable", icon: require('assets/images/icon_should_e_paying_big@2x.png')},
          // {name: "应付账款", target: "payable", icon: require('assets/images/icon_accounts_payable_big@2x.png')},
          {name: "明细账", target: "detailAccount", icon: require('assets/images/icon_financial_examination_and_approval_big@2x.png')},
          {name: "科目余额", target: "subjectBalance", icon: require('assets/images/icon_salary_big@2x.png')},
          // {name: "财务审批", target: "auditlist", icon: require('assets/images/icon_financial_examination_and_approval_big@2x.png')},
        ]
    },
    {
      category: "终端上报",
      target: 'terminalManage',
      role: ['admin', 'accountant'],
      tasks: [
        {name: "终端拜访", target: "terminalVisit", icon: require('assets/images/terminalManage1.png')},
        {name: "铺货上报", target: "shopGoods", icon: require('assets/images/terminalManage2.png')},
        {name: "库存上报", target: "inventory", icon: require('assets/images/terminalManage3.png')},
        {name: "销量上报", target: "salesVolume", icon: require('assets/images/terminalManage4.png')},
        {name: "综合上报", target: "salesIntegrated", icon: require('assets/images/terminalManage5.png')},
        {name: "终端形象采集", target: "imageAcquisition", icon: require('assets/images/terminalManage6.png')},
        {name: "竞品上报", target: "competingGoods", icon: require('assets/images/terminalManage7.png')}
      ]
    },
    {
      category: "进销存管理",
      target: 'psiManage',
      role: ['admin', 'accountant'],
      tasks: [
        {name: "订单管理", target: "orderManage", icon: require('assets/images/psiManage1.png')},
        {name: "商品管理", target: "commodityManage", icon: require('assets/images/psiManage2.png')},
        {name: "库存查询", target: "stock", icon: require('assets/images/psiManage3.png')},
        {name: "销售订单", target: "salesOrder", icon: require('assets/images/psiManage4.png')},
        {name: "销售退货单", target: "salesReturn", icon: require('assets/images/psiManage5.png')},
        {name: "收款登记", target: "paymentRegistration", icon: require('assets/images/psiManage6.png')},
        {name: "客户应收", target: "customerReceivable", icon: require('assets/images/psiManage7.png')},
        {name: "调拨单据", target: "transfersDocuments", icon: require('assets/images/psiManage8.png')},
        {name: "经营分析", target: "operationAnalysis", icon: require('assets/images/psiManage9.png')},
        {name: "库存盘点", target: "inventoryVerification", icon: require('assets/images/psiManage10.png')},
        {name: "车销", target: "carSales", icon: require('assets/images/psiManage11.png')},
        {name: "发货单", target: "dispatchBill", icon: require('assets/images/psiManage12.png')},
        {name: "进货单", target: "purchase", icon: require('assets/images/psiManage13.png')},
      ]
    },
];

function getValidMods(role) {
    // filtering permitted mods with configuration
    var industry = process.env.HAWK_INDUSTRY;

    if (!industry) {
        industry = "kx"; // 默认标准版
    }

    var setting = CONFIG.industries[industry];

    if (!setting) {
        console.log("Invalid industry setting: %s", industry);
        return null;
    }

    var wanted = Object.keys(setting.categories).map(function(key) {
        return setting.categories[key];
    });

    return mods.filter((mod) => {
        return wanted.includes(mod.category);
    });
} // getValidMods

function getAllMods() {
    return mods.reduce((accum, mod) => { return accum.concat(mod.tasks) }, []);
}

export {
    getValidMods,
    getAllMods
}
