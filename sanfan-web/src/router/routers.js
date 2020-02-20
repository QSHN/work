import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '今日工作',
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/approval',
    name: 'approval',
    component: Main,
    meta: {
      icon: 'md-calendar',
      title: '考勤管理'
    },
    children: [
      {
        path: 'apply',
        name: 'approvalapply',
        meta: {
          icon: 'ios-alert-outline',
          title: '考勤申请'
        },
        component: () => import('@/view/approval/apply.vue')
      },
      {
        path: 'log',
        name: 'approvallog',
        meta: {
          icon: 'ios-albums',
          title: '考勤记录'
        },
        component: () => import('@/view/approval/log.vue')
      },
      {
        path: 'statistic',
        name: 'approvalstatistic',
        meta: {
          icon: 'ios-stats',
          title: '考勤统计'
        },
        component: () => import('@/view/approval/statistic.vue')
      }
    ]
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Main,
    meta: {
      icon: 'ios-contact',
      title: '通讯目录'
      // access: ['通讯目录']
    },
    children: [
      {
        path: 'list',
        name: 'contactslist',
        meta: {
          title: '通讯目录',
          icon: 'ios-contact'
        },
        component: () => import('@/view/chat/contacts')
      },
      {
        path: 'chat',
        name: 'chat',
        meta: {
          title: '对话列表',
          icon: 'ios-chatbubbles'
        },
        component: () => import('@/view/chat/window.vue')
      }
    ]
  },
  {
    path: '/journalindex',
    name: 'journalindex',
    component: Main,
    meta: {
      icon: 'ios-bookmarks',
      title: '日报管理'
    },
    children: [
      {
        path: 'journalself',
        name: 'journalself',
        meta: {
          icon: 'md-copy',
          title: '我的日报',
          access: ['DEPARTMENTADMIN', 'EMPLOYEE'],
          page: 'self'
        },
        component: () => import('@/view/journal/list.vue')
      },
      {
        path: 'journalmanager',
        name: 'journalmanager',
        meta: {
          icon: 'ios-copy',
          title: '员工日报',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN'],
          page: 'manager'
        },
        component: () => import('@/view/journal/list.vue')
      },
      {
        path: 'journalcreate',
        name: 'journalcreate',
        meta: {
          icon: 'ios-create',
          title: '写日报',
          access: ['DEPARTMENTADMIN', 'EMPLOYEE']
        },
        component: () => import('@/view/journal/create.vue')
      },
      {
        path: 'journalsetting',
        name: 'journalsetting',
        meta: {
          icon: 'ios-settings',
          title: '日报设置',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN']
        },
        component: () => import('@/view/journal/setting.vue')
      }
    ]
  },
  {
    path: '/taskindex',
    name: 'taskindex',
    component: Main,
    meta: {
      icon: 'md-locate',
      title: '任务管理'
    },
    children: [
      {
        path: 'taskself',
        name: 'taskself',
        meta: {
          title: '我的任务',
          icon: 'md-analytics',
          access: ['DEPARTMENTADMIN', 'EMPLOYEE']
        },
        component: () => import('@/view/task/self.vue')
      },
      {
        path: 'taskmanager',
        name: 'taskmanager',
        meta: {
          title: '直属员工',
          icon: 'ios-analytics',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN']
        },
        component: () => import('@/view/task/manager.vue')
      },
      {
        path: 'taskstaff',
        name: 'taskstaff',
        meta: {
          title: '员工任务',
          icon: 'ios-analytics-outline',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN'],
          hideInMenu: true
        },
        component: () => import('@/view/task/staff.vue')
      },
      {
        path: 'taskcreate',
        name: 'taskcreate',
        meta: {
          title: '添加任务',
          icon: 'ios-bookmark'
        },
        component: () => import('@/view/task/create.vue')
      },
      {
        path: 'tasksearch',
        name: 'tasksearch',
        meta: {
          title: '任务搜索',
          icon: 'ios-bookmark'
        },
        component: () => import('@/view/task/search.vue')
      }
    ]
  },
  {
    path: '/report',
    name: 'report',
    component: Main,
    meta: {
      icon: 'md-analytics',
      title: '填写汇报',
      access: ['DEPARTMENTADMIN', 'EMPLOYEE']
    },
    children: [
      {
        path: 'submitR',
        name: 'submitR',
        meta: {
          icon: 'md-analytics',
          title: '填写汇报',
          access: ['DEPARTMENTADMIN', 'EMPLOYEE']
        },
        component: () => import('@/view/report/submitReport.vue')
      }
    ]
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Main,
    meta: {
      title: '汇报统计',
      icon: 'ios-stats',
      access: ['SUPERADMIN', 'DEPARTMENTADMIN', 'EMPLOYEE']
    },
    children: [
      {
        path: 'reportStatistics',
        name: 'reportStatistics',
        meta: {
          icon: 'md-trending-up',
          title: '汇报统计',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN', 'EMPLOYEE']
        },
        component: () => import('@/view/statistics/statistics.vue')
      },
      {
        path: 'reportList',
        name: 'reportList',
        meta: {
          icon: 'md-list',
          title: '汇报列表',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN', 'EMPLOYEE']
        },
        component: () => import('@/view/statistics/report-list.vue')
      },
      {
        path: 'reportTemp',
        name: 'reportTemp',
        meta: {
          icon: 'ios-options',
          title: '汇报模板',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN']
        },
        component: () => import('@/view/statistics/report-temp.vue')
      }
    ]
  },
  {
    path: '/announcemgr',
    name: 'announcemgr',
    component: Main,
    meta: {
      title: '公告栏',
      hideInBread: true,
      icon: 'md-browsers',
      access: ['announcement']
    },
    children: [
      {
        path: 'announce',
        name: 'announce',
        meta: {
          icon: 'md-browsers',
          title: '公告栏',
          access: ['announcement']
        },
        component: () => import('@/view/announcemgr/announcemgr.vue')
      }
    ]
  },
  {
    path: '/reimbursement',
    name: 'reimbursement',
    component: Main,
    meta: {
      icon: 'md-clipboard',
      title: '费用报销',
      access: ['SUPERADMIN', 'expense']
    },
    children: [
      {
        path: 'myExpense',
        name: 'myExpense',
        meta: {
          title: '我的报销',
          icon: 'logo-buffer',
          access: ['SUPERADMIN', 'expense']
        },
        component: () => import('../view/reimbursement/myExpense.vue')
      },
      {
        path: 'auditExp',
        name: 'auditExp',
        meta: {
          title: '报销审批',
          icon: 'md-checkmark-circle-outline',
          access: ['SUPERADMIN', 'expense']
        },
        component: () => import('../view/reimbursement/audit.vue')
      }
    ]
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: Main,
    meta: {
      title: '合同管理'
    },
    children: [
      {
        path: '/contractsFiles',
        name: 'contractsFiles',
        meta: {
          title: '合同管理',
          notCache: true,
          icon: 'md-home',
          access: ['SUPERADMIN', 'contractsFiles']
        },
        component: () => import('@/view/contracts/contractsFiles.vue')
      }
    ]
  },
  {
    path: '/privilege',
    name: 'privilege',
    component: Main,
    meta: {
      icon: 'ios-list',
      // access: ['SUPERADMIN', '权限管理'],
      title: '权限管理'
    },
    children: [
      // {
      //   path: 'employees',
      //   name: 'employees',
      //   meta: {
      //     title: '员工权限',
      //     // access: ['SUPERADMIN', '权限管理'],
      //     icon: 'md-people'
      //   },
      //   component: () => import('@/view/privilege/employees.vue')
      // },
      {
        path: 'department',
        name: 'department',
        meta: {
          title: '部门管理员',
          // access: ['SUPERADMIN', '权限管理'],
          icon: 'ios-person'
        },
        component: () => import('@/view/privilege/department.vue')
      },
      {
        path: 'financial',
        name: 'financial',
        meta: {
          title: '财务人员',
          // access: ['SUPERADMIN', '权限管理'],
          icon: 'ios-person-outline'
        },
        component: () => import('@/view/privilege/financial.vue')
      },
      {
        path: 'administration',
        name: 'administration',
        meta: {
          title: '行政人员',
          // access: ['SUPERADMIN', '权限管理'],
          icon: 'md-person'
        },
        component: () => import('@/view/privilege/administration.vue')
      },
      {
        path: 'superAdmin',
        name: 'superAdmin',
        meta: {
          title: '超级管理员',
          // access: ['SUPERADMIN', '权限管理'],
          icon: 'ios-photos'
        },
        component: () => import('@/view/privilege/superAdmin.vue')
      },
      {
        path: 'temp',
        name: 'temp',
        meta: {
          title: '临时权限',
          // access: ['SUPERADMIN', '权限管理'],
          icon: 'ios-timer-outline'
        },
        component: () => import('@/view/privilege/temp.vue')
      }
    ]
  },
  {
    path: '/finance',
    name: 'finance',
    component: Main,
    meta: {
      icon: 'ios-card-outline',
      access: [
        'SUPERADMIN',
        'companyLedger',
        'financeEntry',
        'fixedCost',
        'receivable',
        'payable',
        'salaryEntry',
        'financeAudit',
        'financeFiles'
      ],
      title: '财务管理'
    },
    children: [
      {
        path: 'balance',
        name: 'Balance',
        meta: {
          title: '公司总账',
          access: ['SUPERADMIN', 'companyLedger'],
          icon: 'logo-yen'
        },
        component: () => import('../view/finance/balance/index.vue')
      },
      {
        path: 'audit',
        name: 'audit',
        meta: {
          title: '财务审批',
          access: ['SUPERADMIN', 'financeAudit'],
          icon: 'md-checkmark-circle-outline'
        },
        component: () => import('../view/finance/audit/audit.vue')
      },
      {
        path: 'inputer',
        name: 'inputer',
        meta: {
          title: '财务录入',
          icon: 'ios-browsers',
          access: ['SUPERADMIN', 'financeEntry'],
          codeType: 'S',
          codeTypes: ['LS', 'LC', 'LO']
        },
        component: () => import('../view/finance/viewer/inputer.vue')
      },
      {
        path: 'fixed_charge',
        name: 'fixed_charge',
        meta: {
          title: '固定支出',
          icon: 'ios-cash',
          access: ['SUPERADMIN', 'fixedCost'],
          codeType: 'GZ',
          codeTypes: ['GZ']
        },
        component: () => import('../view/finance/viewer/fixed_charge.vue')
      },
      {
        path: 'receivables',
        name: 'receivables',
        meta: {
          title: '应收账款',
          icon: 'md-arrow-down',
          access: ['SUPERADMIN', 'receivable'],
          codeType: 'YS',
          codeTypes: ['YS']
        },
        component: () => import('../view/finance/viewer/receivables.vue')
      },
      {
        path: 'accounts_payable',
        name: 'accounts_payable',
        meta: {
          title: '应付账款',
          icon: 'md-arrow-up',
          access: ['SUPERADMIN', 'payable'],
          codeType: 'YF',
          codeTypes: ['YF']
        },
        component: () => import('../view/finance/viewer/accounts_payable.vue')
      },
      {
        path: '/financeFiles',
        name: 'financeFiles',
        meta: {
          title: '财务文件',
          access: ['SUPERADMIN', 'financeFiles'],
          icon: 'md-home'
        },
        component: () => import('@/view/finance/financeFiles.vue')
      },
      {
        path: 'salary',
        name: 'salary',
        meta: {
          title: '薪资录入',
          access: ['SUPERADMIN', 'salaryEntry'],
          icon: 'ios-card'
        },
        component: () => import('../view/finance/salary/index.vue')
      }
    ]
  },
  {
    path: '/organization',
    name: 'organization',
    component: Main,
    meta: {
      title: '组织构架',
      hideInBread: true,
      icon: 'ios-man',
      access: ['SUPERADMIN', 'organization']
    },
    children: [
      {
        path: 'index',
        name: 'index',
        meta: {
          icon: 'ios-man',
          title: '组织构架',
          access: ['SUPERADMIN', 'organization']
        },
        component: () => import('@/view/organization/organization.vue')
      }
    ]
  },
  {
    path: '/clientmgr',
    name: 'clientmgr',
    component: Main,
    meta: {
      title: '客户管理',
      icon: 'ios-man',
      access: ['SUPERADMIN', 'DEPARTMENTADMIN', 'client']
    },
    children: [
      {
        path: 'client',
        name: 'client',
        meta: {
          icon: 'ios-man',
          title: '客户'
        },
        component: () => import('@/view/clientmgr/client.vue')
      },
      {
        path: 'merchant',
        name: 'merchant',
        meta: {
          icon: 'md-card',
          title: '商家'
        },
        component: () => import('@/view/clientmgr/merchant.vue')
      },
      {
        path: 'subordinate',
        name: 'subordinate',
        meta: {
          icon: 'md-git-merge',
          title: '下属私有',
          access: ['SUPERADMIN', 'DEPARTMENTADMIN']
        },
        component: () => import('@/view/clientmgr/subordinate.vue')
      }
    ]
  },
  {
    path: '/visit',
    name: 'visit',
    component: Main,
    meta: {
      title: '拜访管理',
      icon: 'md-git-compare',
      access: ['telVisiting', 'interviewVisiting']
    },
    children: [
      {
        path: 'visitStatisticsT',
        name: 'visitStatisticsT',
        meta: {
          icon: 'md-trending-up',
          title: '电话-拜访统计',
          access: ['telVisiting']
        },
        component: () => import('@/view/visit/statistics_t.vue')
      },
      {
        path: 'visitStatisticsZ',
        name: 'visitStatisticsZ',
        meta: {
          icon: 'md-trending-up',
          title: '走访-拜访统计',
          access: ['interviewVisiting']
        },
        component: () => import('@/view/visit/statistics_z.vue')
      },
      {
        path: 'visitListT',
        name: 'visitListT',
        meta: {
          icon: 'md-list',
          title: '电话-拜访列表',
          access: ['telVisiting']
        },
        component: () => import('@/view/visit/visit-list_t.vue')
      },
      {
        path: 'visitListZ',
        name: 'visitListZ',
        meta: {
          icon: 'md-list',
          title: '走访-拜访列表',
          access: ['interviewVisiting']
        },
        component: () => import('@/view/visit/visit-list_z.vue')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    component: Main,
    meta: {
      title: '公司设置',
      icon: 'ios-settings',
      access: ['SUPERADMIN']
    },
    children: [
      {
        path: 'timecard',
        name: 'timecard',
        meta: {
          title: '考勤设置',
          icon: 'ios-clock-outline',
          access: ['SUPERADMIN']
        },
        component: () => import('@/view/setting/timecardlist.vue')
      },
      {
        path: 'clientGrade',
        name: 'clientGrade',
        meta: {
          title: '客户等级',
          icon: 'ios-star-outline',
          access: ['SUPERADMIN'],
          src: 'CLIENT_LEVEL', // store company getter 下的属性
          name: '客户等级' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      {
        path: 'clientType',
        name: 'clientType',
        meta: {
          title: '客户类型',
          icon: 'ios-card-outline',
          access: ['SUPERADMIN'],
          src: 'CLIENT_TYPE', // store company getter 下的属性
          name: '客户类型' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      {
        path: 'intentionType',
        name: 'intentionType',
        meta: {
          title: '意向类型',
          icon: 'ios-happy-outline',
          access: ['SUPERADMIN'],
          src: 'INTENTION_TYPE', // store company getter 下的属性
          name: '意向类型' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      {
        path: 'jobType',
        name: 'jobType',
        meta: {
          title: '职位类型',
          icon: 'ios-attach',
          access: ['SUPERADMIN'],
          src: 'POSITION', // store company getter 下的属性
          name: '职位类型' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      {
        path: 'pictureType',
        name: 'pictureType',
        meta: {
          title: '拍照类型',
          icon: 'ios-images-outline',
          access: ['SUPERADMIN'],
          src: 'PHOTO_TYPE', // store company getter 下的属性
          name: '拍照类型' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      {
        path: 'taskType',
        name: 'taskType',
        meta: {
          title: '任务类型',
          icon: 'ios-checkbox-outline',
          access: ['SUPERADMIN'],
          src: 'TASK_TYPE', // store company getter 下的属性
          name: '任务类型' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      {
        path: 'leaveType',
        name: 'leaveType',
        meta: {
          title: '请假类型',
          icon: 'ios-medkit -outline',
          access: ['SUPERADMIN'],
          src: 'LEAVE_TYPE', // store company getter 下的属性
          name: '请假类型' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      {
        path: 'expenseType',
        name: 'expenseType',
        meta: {
          title: '报销类型',
          icon: 'ios-cash-outline',
          access: ['SUPERADMIN'],
          src: 'REIMBURSEMENT_TYPE', // store company getter 下的属性
          name: '报销类型' // 对应的中文名称
        },
        component: () => import('@/view/setting/components/meta.vue')
      },
      // {
      //   path: 'financeSet',
      //   name: 'financeSet',
      //   meta: {
      //     title: '财务设置',
      //     icon: 'ios-card-outline'
      //     // access: ['SUPERADMIN']
      //   },
      //   component: () => import('@/view/setting/financeset.vue')
      // },
      {
        path: 'visitSet',
        name: 'visitSet',
        meta: {
          title: '拜访设置',
          icon: 'ios-briefcase-outline',
          access: ['SUPERADMIN']
        },
        component: () => import('@/view/setting/visitset.vue')
      }
    ]
  },
  {
    path: '/buy',
    name: 'buy',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'buy_page',
        name: 'buy_page',
        meta: {
          icon: 'md-notifications',
          title: '企业套餐'
        },
        component: () => import('@/view/buy/buy.vue')
      }
    ]
  },
  {
    path: '/pay',
    name: 'pay',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'pay_page',
        name: 'pay_page',
        meta: {
          icon: 'md-notifications',
          title: '企业套餐'
        },
        component: () => import('@/view/buy/pay.vue')
      }
    ]
  },
  {
    path: '/trade',
    name: 'trade',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'trade_page',
        name: 'trade_page',
        meta: {
          icon: 'md-notifications',
          title: '购买企业套餐'
        },
        component: () => import('@/view/buy/trade.vue')
      }
    ]
  },
  {
    path: '/scoremrg',
    name: 'scoremrg',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '工作考核',
      access: ['SUPERADMIN', 'workAssess', 'assessSetting']
    },
    children: [
      {
        path: 'score',
        name: 'score',
        meta: {
          title: '工作考核',
          icon: 'ios-list-box-outline',
          access: ['SuperAdmin', 'workAssess']
        },
        component: () => import('../view/score/score.vue')
      },
      {
        path: 'scoreset',
        name: 'scoreset',
        meta: {
          title: '考核设置',
          icon: 'ios-cog-outline',
          access: ['SUPERADMIN', 'assessSetting']
        },
        component: () => import('../view/score/scoreset.vue')
      }
    ]
  },
  {
    path: '/location',
    name: 'location',
    component: Main,
    meta: {
      icon: 'ios-navigate-outline',
      title: '工作轨迹',
      access: ['SUPERADMIN', 'track', 'RT-Position']
    },
    children: [
      {
        path: 'trace',
        name: 'trace',
        meta: {
          title: '工作轨迹',
          icon: 'md-map',
          access: ['SUPERADMIN', 'track']
        },
        component: () => import('../view/location/trace.vue')
      },
      {
        path: 'position',
        name: 'position',
        meta: {
          title: '实时查岗',
          icon: 'md-locate',
          access: ['SUPERADMIN', 'RT-Position']
        },
        component: () => import('../view/location/position.vue')
      }
    ]
  },
  {
    path: '/personal',
    name: 'personal',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'personalInfo',
        name: 'personalInfo',
        meta: {
          icon: 'md-notifications',
          title: '个人信息'
        },
        component: () => import('@/view/personal/personal-info.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
