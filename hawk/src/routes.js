let toHomeing = false; //首页跳转标志 规定时间内只能执行一次跳转
const routes = [

  // landing pages
  {
    path: '/',
    component: require('./components/frame.vue')
    // beforeEnter: function (routeTo, routeFrom, resolve, reject) {
    //
    //   if (toHomeing) {
    //     return reject();
    //   }
    //   toHomeing = true
    //   const tt = setTimeout(() => {
    //     toHomeing = false;
    //     clearTimeout(tt);
    //   }, 1000);
    //
    //   console.log('返回路由跳转', routeTo.url, routeFrom.url);
    //   if (routeFrom.url == '/' && routeTo.url == '/') {
    //     reject();
    //   } else {
    //     resolve();
    //   }
    // }
  },
  {
    path: '/home/',
    component: require('./components/home.vue')
  },
  {
    path: '/login/',
    component: require('./components/auth/login.vue'),
    options: {reloadAll: true}
  },
  {
    path: '/registrate/',
    component: require('./components/auth/registrate.vue')
  },
  {
    path: '/selectList',
    component: require('./components/_module/selectList.vue')
  },
  {
    path: '/selectListMore',
    component: require('./components/_module/selectListMore.vue')
  },
  {
    path: '/selectCommodity',
    component: require('./components/_module/selectCommodity.vue')
  },
  {
    path: '/resetPassword/',
    component: require('./components/auth/password.vue')
  },
  {
    path: '/selectSubject',
    component: require('./components/_module/subject.vue')
  },

  // charts
  {
    path: '/chart/mystats/',
    component: require('./components/chart/mystats.vue')
  },

  // views
  {
    path: '/preference/',
    component: require('./components/preference.vue')
  },
  {
    path: '/message/',
    component: require('./components/message.vue')
  },
  {
    path: '/statistic/',
    component: require('./components/statistic.vue')
  },

  // office
  {
    path: '/office/trace/',
    component: require('./components/office/trace.vue')
  },
  {
    path: '/office/position/',
    component: require('./components/office/position.vue')
  },
  {
    path: '/office/task/',
    component: require('./components/office/task.vue')
  },
  {
    path: '/office/taskdetail/',
    component: require('./components/office/taskdetail.vue')
  },
  {
    path: '/office/taskmanager/',
    component: require('./components/office/taskmanager.vue')
  },
  {
    path: '/office/taskself/',
    component: require('./components/office/taskself.vue')
  },
  {
    path: '/office/taskstaff/',
    component: require('./components/office/taskstaff.vue')
  },
  {
    path: '/office/taskindex/',
    component: require('./components/office/taskindex.vue')
  },
  {
    path: '/office/tasklist/',
    component: require('./components/office/tasklist.vue')
  },
  {
    path: '/office/tasksearch/',
    component: require('./components/office/tasksearch.vue')
  },
  {
    path: '/office/announce/',
    component: require('./components/office/announce.vue')
  },
  {
    path: '/office/announcemgr/',
    component: require('./components/office/announcemgr.vue')
  },
  {
    path: '/office/report/',
    component: require('./components/office/report.vue')
  },
  {
    path: '/office/submitreport/',
    component: require('./components/office/submitreport.vue')
  },
  {
    path: '/office/reportmgr/',
    component: require('./components/office/reportmgr.vue')
  },
  {
    path: '/office/contacts/',
    component: require('./components/office/contacts.vue')
  },
  {
    path: '/office/expensemgr/',
    component: require('./components/office/expensemgr.vue')
  },
  {
    path: '/office/paymentmgr/',
    component: require('./components/office/paymentmgr.vue')
  },
  {
    path: '/office/procurementmgr/',
    component: require('./components/office/procurementmgr.vue')
  },
  {
    path: '/office/applicamgr/',
    component: require('./components/office/applicamgr.vue')
  },
  {
    path: '/office/checkin/',
    component: require('./components/office/checkin.vue')
  },
  {
    path: '/office/timerecord/',
    component: require('./components/office/timerecord.vue')
  },
  {
    path: '/office/leave/',
    component: require('./components/office/leave.vue')
  },
  {
    path: '/office/travel/',
    component: require('./components/office/travel.vue')
  },
  {
    path: '/office/overtime/',
    component: require('./components/office/overtime.vue')
  },
  {
    path: '/office/goOut/',
    component: require('./components/office/goOut.vue')
  },
  {
    path: '/office/expense/',
    component: require('./components/office/expense.vue')
  },
  {
    path: '/office/expensebxmgr/',
    component: require('./components/office/expensebxmgr.vue')
  },
  {
    path: '/office/expensedateil/',
    component: require('./components/office/expensedateil.vue')
  },
  {
    path: '/office/expenseList/',
    component: require('./components/office/expenseList.vue')
  },
  {
    path: '/office/procurement/',
    component: require('./components/office/procurement.vue')
  },
  {
    path: '/office/procurementbxmgr/',
    component: require('./components/office/procurementbxmgr.vue')
  },
  {
    path: '/office/procurementdateil/',
    component: require('./components/office/procurementdateil.vue')
  },
  {
    path: '/office/procurementList/',
    component: require('./components/office/procurementList.vue')
  },
  {
    path: '/office/senderdateil/',
    component: require('./components/office/senderdateil.vue')
  },
  {
    path: '/office/payment/',
    component: require('./components/office/payment.vue')
  },
  {
    path: '/office/paymentbxmgr/',
    component: require('./components/office/paymentbxmgr.vue')
  },
  {
    path: '/office/paymentdateil/',
    component: require('./components/office/paymentdateil.vue')
  },
  {
    path: '/office/paymentList/',
    component: require('./components/office/paymentList.vue')
  },
  {
    path: '/office/journaldetail/',
    component: require('./components/office/journaldetail.vue')
  },
  {
    path: '/office/journalList/',
    component: require('./components/office/journalList.vue')
  },
  {
    path: '/office/journalmgr/',
    component: require('./components/office/journalmgr.vue')
  },
  {
    path: '/office/scoremgr/',
    component: require('./components/office/scoremgr.vue')
  },
  {
    path: '/office/scorelist/',
    component: require('./components/office/scorelist.vue')
  },
  {
    path: '/office/scorepersonal/',
    component: require('./components/office/scorepersonal.vue')
  },
  {
    path: '/office/scorepersonallist/',
    component: require('./components/office/scorepersonallist.vue')
  },
  {
    path: '/office/scoredetails/',
    component: require('./components/office/scoredetails.vue')
  },
  {
    path: '/office/journalset/',
    component: require('./components/office/journalset.vue')
  },

  {
    path: '/office/privilege/',
    component: require('./components/office/privilege.vue'),
  },
  {
    path: '/office/privilegeadmin/',
    component: require('./components/office/privilegeadmin.vue'),
  },
  {
    path: '/office/privilegefinance/',
    component: require('./components/office/privilegefinance.vue'),
  },
  {
    path: '/office/privilegeadministrative/',
    component: require('./components/office/privilegeadministrative.vue'),
  },
  {
    path: '/office/privilegesuperadmin/',
    component: require('./components/office/privilegesuperadmin.vue'),
  },
  {
    path: '/office/privilegetemporary/',
    component: require('./components/office/privilegetemporary.vue'),
  },
  {
    path: '/office/contracts/',
    component: require('./components/office/files.vue'),
    options: {props: {title: '合同', root: 'contracts'}}
  },
  {
    path: '/office/carList/',
    component: require('./components/office/carList.vue'),
  },
  {
    path: '/office/carList/apply/',
    component: require('./components/office/carapply.vue'),
  },
  {
    path: '/office/carList/detail/',
    component: require('./components/office/cardetail.vue'),
  },
  {
    path: '/office/sealList/',
    component: require('./components/office/sealList.vue')
  },
  {
    path: '/office/sealList/apply/',
    component: require('./components/office/sealapply.vue'),
  },
  {
    path: '/office/sealList/detail/',
    component: require('./components/office/sealdetail.vue'),
  },
  {
    path: '/office/contractList/',
    component: require('./components/office/contractList.vue'),
  },
  {
    path: '/office/contractList/apply/',
    component: require('./components/office/contractapply.vue'),
  },
  {
    path: '/office/contractList/detail/',
    component: require('./components/office/contractdetail.vue'),
  },
  {
    path: '/office/performanceList/',
    component: require('./components/office/performanceList.vue'),
  },
  {
    path: '/office/performanceList/apply/',
    component: require('./components/office/performanceapply.vue'),
  },
  {
    path: '/office/performanceList/detail/',
    component: require('./components/office/performancedetail.vue'),
  },
  {
    path: '/office/goodsList/',
    component: require('./components/office/goodsList.vue'),
  },
  {
    path: '/office/goodsList/apply/',
    component: require('./components/office/goodsapply.vue'),
  },
  {
    path: '/office/goodsList/detail/',
    component: require('./components/office/goodsdetail.vue'),
  },
  {
    path: '/office/salesmanageList/',
    component: require('./components/office/salesmanageList.vue'),
  },
  {
    path: '/office/salesmanageList/apply/',
    component: require('./components/office/salesmanageapply.vue'),
  },
  {
    path: '/office/salesmanageList/detail/',
    component: require('./components/office/salesmanagedetail.vue'),
  },
  {
    path: '/office/internalContact/',
    component: require('./components/office/internalContact.vue'),
  },
  {
    path: '/office/internalContact/update/',
    component: require('./components/office/internalContactUpdate.vue'),
  },
  {
    path: '/office/internalContact/detail/',
    component: require('./components/office/internalContactDetail.vue'),
  },
  {
    path: '/office/internalContact/reply/',
    component: require('./components/office/internalContactReply.vue'),
  },
  {
    path: '/office/employeesScore/',
    component: require('./components/office/employeesScore.vue'),
  },
  {
    path: '/office/employeesScore/reply',
    component: require('./components/office/employeesScoreReply.vue'),
  },

  // client pages
  {
    path: '/client/client/',
    component: require('./components/client/client.vue')
  },
  {
    path: '/client/clientmgr/',
    component: require('./components/client/clientmgr.vue')
  },
  {
    path: '/client/clientsearch/',
    component: require('./components/client/clientsearch.vue')
  },
  {
    path: '/client/clientsearchresult/',
    component: require('./components/client/clientsearchresult.vue')
  },
  {
    path: '/client/visit/',
    component: require('./components/client/visit.vue')
  },

  {
    path: '/client/visitdateil/',
    component: require('./components/client/visitdateil.vue')
  },
  {
    path: '/client/visitmgr/',
    component: require('./components/client/visitmgr.vue')
  },
  {
    path: '/client/visitdateil/',
    component: require('./components/client/visitdateil.vue')
  },
  {
    path: '/client/visitemployees/',
    component: require('./components/client/visitemployees.vue')
  },
  {
    path: '/client/summary/',
    component: require('./components/client/summary.vue')
  },
  {
    path: '/client/selectcustomers/',
    component: require('./components/client/selectcustomers.vue')
  },
  {
    path: '/client/customersproson/',
    component: require('./components/client/customersproson.vue')
  },
  {
    path: '/client/visitset/',
    component: require('./components/client/visitset.vue')
  },
  {
    path: '/client/visitseacher/',
    component: require('./components/client/visitseacher.vue')
  },
  {
    path: '/client/visitseacherresult/',
    component: require('./components/client/visitseacherresult.vue')
  },
  {
    path: '/client/ocr/',
    component: require('./components/client/ocr.vue')
  },
  {
    path: '/client/invitationList/',
    component: require('./components/client/invitationList.vue'),
  },
  {
    path: '/client/invitationList/apply/',
    component: require('./components/client/invitationapply.vue'),
  },
  {
    path: '/client/invitationList/detail/',
    component: require('./components/client/invitationdetail.vue'),
  },

  // company setting pages
  {
    path: '/setting/profile/',
    component: require('./components/setting/profile.vue'),
  },
  {
    path: '/setting/holiday/',
    component: require('./components/setting/holiday.vue'),
  },
  {
    path: '/setting/tree/',
    component: require('./components/setting/tree.vue'),
  },
  {
    path: '/setting/company/',
    component: require('./components/setting/company.vue')
  },
  {
    path: '/office/organization',
    component: require('./components/setting/organization.vue')
  },
  {
    path: '/setting/company/timecards',
    component: require('./components/setting/timecards.vue')
  },
  {
    path: '/setting/company/timecard',
    component: require('./components/setting/timecard.vue')
  },
  {
    path: '/setting/company/personnel',
    component: require('./components/setting/personnel.vue')
  },
  {
    path: '/setting/meta/',
    component: require('./components/setting/meta.vue'),
  },
  {
    path: '/setting/devicelock/',
    component: require('./components/setting/devicelock.vue'),
  },
  {
    path: '/setting/performance/',
    component: require('./components/setting/performance.vue'),
  },
  {
    path: '/setting/expense/',
    component: require('./components/setting/expense.vue'),
  },
  {
    path: '/setting/car/',
    component: require('./components/setting/car.vue'),
  },
  {
    path: '/setting/seal/',
    component: require('./components/setting/seal.vue'),
  },
  {
    path: '/setting/paymenttype/',
    component: require('./components/setting/paymenttype.vue'),
  },
  {
    path: '/setting/commodityNote/',
    component: require('./components/setting/commodityNote.vue'),
  },
  {
    path: '/setting/clientNote/',
    component: require('./components/setting/clientNote.vue'),
  },
  {
    path: '/setting/internalContact/',
    component: require('./components/setting/internalContact.vue'),
  },
  {
    path: '/setting/employeesScore/',
    component: require('./components/setting/employeesScore.vue'),
  },

  // software setting
  {
    path: '/software/about/',
    component: require('./components/software/about.vue'),
  },
  {
    path: '/software/help/',
    component: require('./components/software/help.vue'),
  },
  {
    path: '/software/helpContent/',
    component: require('./components/software/help_content.vue'),
  },
  {
    path: '/software/moduleeditor/',
    component: require('./components/software/moduleeditor.vue'),
  },
  {
    path: '/software/reminder/',
    component: require('./components/software/reminder.vue'),
  },
  {
    path: '/software/subscriber/',
    component: require('./components/software/subscriber.vue'),
  },
  {
    path: '/software/system/',
    component: require('./components/software/system.vue'),
  },
  {
    path: '/software/setting/',
    component: require('./components/software/setting.vue'),
  },
  {
    path: '/software/visitingService/',
    component: require('./components/software/visitingService.vue'),
  },
  {
    path: '/software/partTime/',
    component: require('./components/software/partTime.vue'),
  },
  {
    path: '/software/message/',
    component: require('./components/software/message.vue'),
  },

  // finance
  {
    path: '/finance/reportForms/',
    component: require('./components/finance/reportForms/index.vue')
  },
  {
    path: '/finance/reportForms/profit',
    component: require('./components/finance/reportForms/profit.vue')
  },
  {
    path: '/finance/reportForms/ownerEquity',
    component: require('./components/finance/reportForms/ownerEquity.vue')
  },
  {
    path: '/finance/reportForms/balanceSheet',
    component: require('./components/finance/reportForms/balanceSheet.vue')
  },

  {
    path: '/finance/credentials/',
    component: require('./components/finance/credentials/index.vue')
  },
  {
    path: '/finance/credentials/detail',
    component: require('./components/finance/credentials/detail.vue')
  },
  {
    path: '/finance/credentials/add',
    component: require('./components/finance/credentials/add.vue')
  },
  {
    path: '/finance/credentials/input',
    component: require('./components/finance/credentials/input.vue')
  },


  {
    path: '/finance/detailAccount/',
    component: require('./components/finance/detailAccount/index.vue')
  },
  {
    path: '/finance/detailAccount/detail',
    component: require('./components/finance/detailAccount/detail.vue')
  },

  {
    path: '/finance/subjectBalance/',
    component: require('./components/finance/subjectBalance/index.vue')
  },


  {
    path: '/finance/fixedcost/',
    component: require('./components/finance/transactionviewer.vue'),
    options: {props: {contextType: 'fixedCost'}}
  },
  {
    path: '/finance/receivable/',
    component: require('./components/finance/transactionviewer.vue'),
    options: {props: {contextType: 'receivable'}}
  },
  {
    path: '/finance/payable/',
    component: require('./components/finance/transactionviewer.vue'),
    options: {props: {contextType: 'payable'}}
  },
  {
    path: '/finance/transaction/',
    component: require('./components/finance/transaction.vue'),
  },
  {
    path: '/finance/auditlist/',
    component: require('./components/finance/auditlist.vue'),
  },
  {
    path: '/finance/transsearchresult/',
    component: require('./components/finance/transsearchresult.vue'),
  },
  {
    path: '/finance/entry/',
    component: require('./components/finance/entry.vue'),
  },
  {
    path: '/finance/ledger/',
    component: require('./components/finance/ledger.vue'),
  },
  {
    path: '/finance/ledgerlist/',
    component: require('./components/finance/ledgerlist.vue'),
  },
  {
    path: '/finance/docs/',
    component: require('./components/office/files.vue'),
    options: {props: {title: '财务', root: 'financialdocs'}}
  },
  {
    path: '/finance/salary/',
    component: require('./components/finance/salary.vue')
  },
  {
    path: '/finance/salary/enterSalary',
    component: require('./components/finance/enterSalary.vue')
  },
  {
    path: '/setting/finance/',
    component: require('./components/setting/finance.vue')
  },
  // 终端上报
  {
    path: '/terminalManage/terminalVisit/',
    component: require('./components/terminalManage/terminalVisit/index.vue')
  },
  {
    path: '/terminalManage/terminalVisit/list',
    component: require('./components/terminalManage/terminalVisit/list.vue')
  },
  {
    path: '/terminalManage/terminalVisit/search',
    component: require('./components/terminalManage/terminalVisit/search.vue')
  },
  {
    path: '/terminalManage/terminalVisit/plan',
    component: require('./components/terminalManage/terminalVisit/plan/index.vue')
  },
  {
    path: '/terminalManage/terminalVisit/plan/search',
    component: require('./components/terminalManage/terminalVisit/plan/search.vue')
  },
  {
    path: '/terminalManage/terminalVisit/plan/update',
    component: require('./components/terminalManage/terminalVisit/plan/update.vue')
  },
  {
    path: '/terminalManage/terminalVisit/plan/detail',
    component: require('./components/terminalManage/terminalVisit/plan/detail.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit',
    component: require('./components/terminalManage/terminalVisit/visit/index.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit/search',
    component: require('./components/terminalManage/terminalVisit/visit/search.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit/update',
    component: require('./components/terminalManage/terminalVisit/visit/update.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit/flow',
    component: require('./components/terminalManage/terminalVisit/visit/flow.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit/detail',
    component: require('./components/terminalManage/terminalVisit/visit/detail.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit/location',
    component: require('./components/terminalManage/terminalVisit/visit/location.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit/summary',
    component: require('./components/terminalManage/terminalVisit/visit/summary.vue')
  },
  {
    path: '/terminalManage/terminalVisit/visit/lost',
    component: require('./components/terminalManage/terminalVisit/visit/lost.vue')
  },
  {
    path: '/terminalManage/terminalVisit/circuit',
    component: require('./components/terminalManage/terminalVisit/circuit/index.vue')
  },
  {
    path: '/terminalManage/terminalVisit/circuit/search',
    component: require('./components/terminalManage/terminalVisit/circuit/search.vue')
  },
  {
    path: '/terminalManage/terminalVisit/circuit/update',
    component: require('./components/terminalManage/terminalVisit/circuit/update.vue')
  },
  {
    path: '/terminalManage/terminalVisit/circuit/detail',
    component: require('./components/terminalManage/terminalVisit/circuit/detail.vue')
  },
  {
    path: '/terminalManage/shopGoods/',
    component: require('./components/terminalManage/shopGoods/index.vue')
  },
  {
    path: '/terminalManage/shopGoods/list',
    component: require('./components/terminalManage/shopGoods/list.vue')
  },
  {
    path: '/terminalManage/shopGoods/detail',
    component: require('./components/terminalManage/shopGoods/detail.vue')
  },
  {
    path: '/terminalManage/shopGoods/search',
    component: require('./components/terminalManage/shopGoods/search.vue')
  },
  {
    path: '/terminalManage/inventory/',
    component: require('./components/terminalManage/inventory/index.vue')
  },
  {
    path: '/terminalManage/inventory/list',
    component: require('./components/terminalManage/inventory/list.vue')
  },
  {
    path: '/terminalManage/inventory/detail',
    component: require('./components/terminalManage/inventory/detail.vue')
  },
  {
    path: '/terminalManage/inventory/search',
    component: require('./components/terminalManage/inventory/search.vue')
  },
  {
    path: '/terminalManage/salesVolume/',
    component: require('./components/terminalManage/salesVolume/index.vue')
  },
  {
    path: '/terminalManage/salesVolume/update',
    component: require('./components/terminalManage/salesVolume/update.vue')
  },
  {
    path: '/terminalManage/salesVolume/search',
    component: require('./components/terminalManage/salesVolume/search.vue')
  },
  {
    path: '/terminalManage/salesVolume/detail',
    component: require('./components/terminalManage/salesVolume/detail.vue')
  },
  {
    path: '/terminalManage/salesIntegrated/',
    component: require('./components/terminalManage/salesIntegrated/index.vue')
  },
  {
    path: '/terminalManage/salesIntegrated/list',
    component: require('./components/terminalManage/salesIntegrated/list.vue')
  },
  {
    path: '/terminalManage/salesIntegrated/search',
    component: require('./components/terminalManage/salesIntegrated/search.vue')
  },
  {
    path: '/terminalManage/salesIntegrated/detail',
    component: require('./components/terminalManage/salesIntegrated/detail.vue')
  },
  {
    path: '/terminalManage/imageAcquisition/',
    component: require('./components/terminalManage/imageAcquisition/index.vue')
  },
  {
    path: '/terminalManage/imageAcquisition/update',
    component: require('./components/terminalManage/imageAcquisition/update.vue')
  },
  {
    path: '/terminalManage/imageAcquisition/type',
    component: require('./components/terminalManage/imageAcquisition/type.vue')
  },
  {
    path: '/terminalManage/imageAcquisition/detail',
    component: require('./components/terminalManage/imageAcquisition/detail.vue')
  },
  {
    path: '/terminalManage/competingGoods/',
    component: require('./components/terminalManage/competingGoods/index.vue')
  },
  {
    path: '/terminalManage/competingGoods/update',
    component: require('./components/terminalManage/competingGoods/update.vue')
  },
  {
    path: '/terminalManage/competingGoods/detail',
    component: require('./components/terminalManage/competingGoods/detail.vue')
  },
  // 进存销管理
  {
    path: '/psiManage/orderManage/',
    component: require('./components/psiManage/orderManage/index.vue')
  },
  {
    path: '/psiManage/orderManage/list',
    component: require('./components/psiManage/orderManage/list.vue')
  },
  {
    path: '/psiManage/orderManage/search',
    component: require('./components/psiManage/orderManage/search.vue')
  },
  {
    path: '/psiManage/orderManage/department',
    component: require('./components/psiManage/orderManage/department.vue')
  },
  {
    path: '/psiManage/orderManage/statistics',
    component: require('./components/psiManage/orderManage/statistics.vue')
  },
  {
    path: '/psiManage/orderManage/type',
    component: require('./components/psiManage/orderManage/type.vue')
  },
  {
    path: '/psiManage/commodityManage/',
    component: require('./components/psiManage/commodityManage/index.vue')
  },
  {
    path: '/psiManage/commodityManage/update',
    component: require('./components/psiManage/commodityManage/update.vue')
  },
  {
    path: '/psiManage/commodityManage/type',
    component: require('./components/psiManage/commodityManage/type.vue')
  },
  {
    path: '/psiManage/commodityManage/addType',
    component: require('./components/psiManage/commodityManage/addType.vue')
  },
  {
    path: '/psiManage/commodityManage/other',
    component: require('./components/psiManage/commodityManage/other.vue')
  },
  {
    path: '/psiManage/commodityManage/class',
    component: require('./components/psiManage/commodityManage/class.vue')
  },
  {
    path: '/psiManage/commodityManage/detail',
    component: require('./components/psiManage/commodityManage/detail.vue')
  },
  {
    path: '/psiManage/stock/',
    component: require('./components/psiManage/stock/index.vue')
  },
  {
    path: '/psiManage/stock/list',
    component: require('./components/psiManage/stock/list.vue')
  },
  {
    path: '/psiManage/stock/detail',
    component: require('./components/psiManage/stock/detail.vue')
  },
  {
    path: '/psiManage/stock/qrCode',
    component: require('./components/psiManage/stock/qrCode.vue')
  },
  {
    path: '/psiManage/salesOrder/',
    component: require('./components/psiManage/salesOrder/index.vue')
  },
  {
    path: '/psiManage/salesOrder/search',
    component: require('./components/psiManage/salesOrder/search.vue')
  },
  {
    path: '/psiManage/salesOrder/update',
    component: require('./components/psiManage/salesOrder/update.vue')
  },
  {
    path: '/psiManage/salesOrder/detail',
    component: require('./components/psiManage/salesOrder/detail.vue')
  },
  {
    path: '/psiManage/salesReturn/',
    component: require('./components/psiManage/salesReturn/index.vue')
  },
  {
    path: '/psiManage/salesReturn/search',
    component: require('./components/psiManage/salesReturn/search.vue')
  },
  {
    path: '/psiManage/salesReturn/update',
    component: require('./components/psiManage/salesReturn/update.vue')
  },
  {
    path: '/psiManage/salesReturn/detail',
    component: require('./components/psiManage/salesReturn/detail.vue')
  },
  {
    path: '/psiManage/paymentRegistration/',
    component: require('./components/psiManage/paymentRegistration/index.vue')
  },
  {
    path: '/psiManage/paymentRegistration/search',
    component: require('./components/psiManage/paymentRegistration/search.vue')
  },
  {
    path: '/psiManage/paymentRegistration/update',
    component: require('./components/psiManage/paymentRegistration/update.vue')
  },
  {
    path: '/psiManage/paymentRegistration/detail',
    component: require('./components/psiManage/paymentRegistration/detail.vue')
  },
  {
    path: '/psiManage/customerReceivable/',
    component: require('./components/psiManage/customerReceivable/index.vue')
  },
  {
    path: '/psiManage/customerReceivable/search',
    component: require('./components/psiManage/customerReceivable/search.vue')
  },
  {
    path: '/psiManage/customerReceivable/detail',
    component: require('./components/psiManage/customerReceivable/detail.vue')
  },
  {
    path: '/psiManage/transfersDocuments/',
    component: require('./components/psiManage/transfersDocuments/index.vue')
  },
  {
    path: '/psiManage/transfersDocuments/search',
    component: require('./components/psiManage/transfersDocuments/search.vue')
  },
  {
    path: '/psiManage/transfersDocuments/detail',
    component: require('./components/psiManage/transfersDocuments/detail.vue')
  },
  {
    path: '/psiManage/transfersDocuments/update',
    component: require('./components/psiManage/transfersDocuments/update.vue')
  },
  {
    path: '/psiManage/operationAnalysis/',
    component: require('./components/psiManage/operationAnalysis/index.vue')
  },
  {
    path: '/psiManage/operationAnalysis/list',
    component: require('./components/psiManage/operationAnalysis/list.vue')
  },
  {
    path: '/psiManage/inventoryVerification/',
    component: require('./components/psiManage/inventoryVerification/index.vue')
  },
  {
    path: '/psiManage/inventoryVerification/update',
    component: require('./components/psiManage/inventoryVerification/update.vue')
  },
  {
    path: '/psiManage/inventoryVerification/search',
    component: require('./components/psiManage/inventoryVerification/search.vue')
  },
  {
    path: '/psiManage/inventoryVerification/detail',
    component: require('./components/psiManage/inventoryVerification/detail.vue')
  },
  {
    path: '/psiManage/carSales/',
    component: require('./components/psiManage/carSales/index.vue')
  },
  {
    path: '/psiManage/carSales/bill',
    component: require('./components/psiManage/carSales/bill/index.vue')
  },
  {
    path: '/psiManage/carSales/bill/search',
    component: require('./components/psiManage/carSales/bill/search.vue')
  },
  {
    path: '/psiManage/carSales/bill/update',
    component: require('./components/psiManage/carSales/bill/update.vue')
  },
  {
    path: '/psiManage/carSales/bill/detail',
    component: require('./components/psiManage/carSales/bill/detail.vue')
  },
  {
    path: '/psiManage/carSales/truck',
    component: require('./components/psiManage/carSales/truck/index.vue')
  },
  {
    path: '/psiManage/carSales/truck/search',
    component: require('./components/psiManage/carSales/truck/search.vue')
  },
  {
    path: '/psiManage/carSales/truck/update',
    component: require('./components/psiManage/carSales/truck/update.vue')
  },
  {
    path: '/psiManage/carSales/truck/detail',
    component: require('./components/psiManage/carSales/truck/detail.vue')
  },
  {
    path: '/psiManage/carSales/inventorySearch',
    component: require('./components/psiManage/carSales/inventorySearch/index.vue')
  },
  {
    path: '/psiManage/carSales/inventorySearch/search',
    component: require('./components/psiManage/carSales/inventorySearch/search.vue')
  },
  {
    path: '/psiManage/carSales/store',
    component: require('./components/psiManage/carSales/store/index.vue')
  },
  {
    path: '/psiManage/carSales/back',
    component: require('./components/psiManage/carSales/back/index.vue')
  },
  {
    path: '/psiManage/carSales/back/search',
    component: require('./components/psiManage/carSales/back/search.vue')
  },
  {
    path: '/psiManage/carSales/back/update',
    component: require('./components/psiManage/carSales/back/update.vue')
  },
  {
    path: '/psiManage/carSales/back/detail',
    component: require('./components/psiManage/carSales/back/detail.vue')
  },
  {
    path: '/psiManage/carSales/inventoryCheck',
    component: require('./components/psiManage/carSales/inventoryCheck/index.vue')
  },
  {
    path: '/psiManage/carSales/inventoryCheck/search',
    component: require('./components/psiManage/carSales/inventoryCheck/search.vue')
  },
  {
    path: '/psiManage/carSales/inventoryCheck/update',
    component: require('./components/psiManage/carSales/inventoryCheck/update.vue')
  },
  {
    path: '/psiManage/carSales/inventoryCheck/detail',
    component: require('./components/psiManage/carSales/inventoryCheck/detail.vue')
  },
  {
    path: '/psiManage/carSales/order',
    component: require('./components/psiManage/carSales/order/index.vue')
  },
  {
    path: '/psiManage/carSales/order/search',
    component: require('./components/psiManage/carSales/order/search.vue')
  },
  {
    path: '/psiManage/carSales/order/update',
    component: require('./components/psiManage/carSales/order/update.vue')
  },
  {
    path: '/psiManage/carSales/order/detail',
    component: require('./components/psiManage/carSales/order/detail.vue')
  },
  {
    path: '/psiManage/carSales/refundable',
    component: require('./components/psiManage/carSales/refundable/index.vue')
  },
  {
    path: '/psiManage/carSales/refundable/search',
    component: require('./components/psiManage/carSales/refundable/search.vue')
  },
  {
    path: '/psiManage/carSales/refundable/update',
    component: require('./components/psiManage/carSales/refundable/update.vue')
  },
  {
    path: '/psiManage/carSales/refundable/detail',
    component: require('./components/psiManage/carSales/refundable/detail.vue')
  },
  {
    path: '/psiManage/carSales/car',
    component: require('./components/psiManage/carSales/car/index.vue')
  },
  {
    path: '/psiManage/carSales/car/search',
    component: require('./components/psiManage/carSales/car/search.vue')
  },
  {
    path: '/psiManage/carSales/car/update',
    component: require('./components/psiManage/carSales/car/update.vue')
  },
  {
    path: '/psiManage/carSales/car/detail',
    component: require('./components/psiManage/carSales/car/detail.vue')
  },
  {
    path: '/psiManage/dispatchBill/',
    component: require('./components/psiManage/dispatchBill/index.vue')
  },
  {
    path: '/psiManage/dispatchBill/search',
    component: require('./components/psiManage/dispatchBill/search.vue')
  },
  {
    path: '/psiManage/dispatchBill/detail',
    component: require('./components/psiManage/dispatchBill/detail.vue')
  },
  {
    path: '/psiManage/purchase/',
    component: require('./components/psiManage/purchase/index.vue')
  },
  {
    path: '/psiManage/purchase/update',
    component: require('./components/psiManage/purchase/update.vue')
  },
  {
    path: '/psiManage/purchase/search',
    component: require('./components/psiManage/purchase/search.vue')
  },
  {
    path: '/psiManage/purchase/detail',
    component: require('./components/psiManage/purchase/detail.vue')
  },
  // test only
  {
    path: '/test/',
    component: require('./components/test.vue')
  },
  {
    path: '/inprogress/',
    component: require('./components/inprogress.vue')
  },
  {
    path: '/report/report',
    component: require('./components/report/report.vue')
  },
  {
    path: '/report/datatemplate',
    component: require('./components/report/datatemplate.vue')
  },
  {
    path: '/report/selectdepartment',
    component: require('./components/report/selectdepartment.vue')
  },
  {
    path: '/report/submitdata',
    component: require('./components/report/submitdata.vue')
  },
  {
    path: '/report/history',
    component: require('./components/report/history.vue')
  },
  {
    path: '/report/reportdetail',
    component: require('./components/report/reportdetail.vue')
  },
  {
    path: '/report/statistics/',
    component: require('./components/report/statistics.vue')
  },
  {
    path: '/report/selfstatistics',
    component: require('./components/report/selfstatistics.vue')
  },
  {
    path: '/report/statisticsindex',
    component: require('./components/report/statisticsindex.vue')
  },
  {
    path: '/report/companystatistics',
    component: require('./components/report/companystatistics.vue')
  },
  {
    path: '/report/departmentstatistics',
    component: require('./components/report/departmentstatistics.vue')
  },
  {
    path: '/report/staffstatistics',
    component: require('./components/report/staffstatistics.vue')
  },
  {
    path: '/report/reportlist',
    component: require('./components/report/reportlist.vue')
  },
  {
    path: '/report/reportaudit',
    component: require('./components/report/reportaudit')
  },
  {
    path: '/trade/buy',
    component: require('./components/trade/buy')
  },
  {
    path: '/trade/info',
    component: require('./components/trade/info')
  },
  {
    path: '/trade/pay',
    component: require('./components/trade/pay')
  },
  {
    path: '/notification/messagelist',
    component: require('./components/notification/messagelist')
  },
  {
    path: '/notification/detail',
    component: require('./components/notification/detail')
  },
  {
    path: '/chat/chat',
    component: require('./components/chat/chat')
  },
  {
    path: '/chat/people',
    component: require('./components/chat/people')
  }
];

module.exports = routes;
