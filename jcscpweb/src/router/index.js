import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/query',
    meta: { title: '采购', icon: 'purchase' },
    expanded: true,
    children: [
      {
        path: 'contract',
        name: 'PurchaseContract',
        component: () => import('@/views/purchase/contract/index'),
        meta: { title: '采购合同', icon: 'contract' }
      },
      {
        path: 'order',
        name: 'PurchaseOrder',
        component: () => import('@/views/purchase/order/index'),
        meta: { title: '采购订单', icon: 'purchase-order' }
      },
      {
        path: 'query',
        name: 'PurchaseQuery',
        component: () => import('@/views/purchase/query/index'),
        meta: { title: '采购列表', icon: 'query' }
      },
      {
        path: 'detailQuery',
        name: 'PurchaseDetailQuery',
        component: () => import('@/views/purchase/detailQuery/index'),
        meta: { title: '采购明细列表', icon: 'query' }
      },
      {
        path: 'export',
        name: 'ContractExport',
        component: () => import('@/views/purchase/export'),
        meta: { title: '导出合同' },
        hidden: true
      }
    ]
  },

  {
    path: '/basicInfo',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'BasicInfoIndex',
        component: () => import('@/views/basicInfo/index'),
        meta: { title: '基础资料', icon: 'basic-info' }
      },
      {
        path: 'table',
        name: 'BasicInfoIndexTable',
        component: () => import('@/views/basicInfo/table'),
        meta: { title: '资料设置' },
        hidden: true
      }
    ]
  },

  // {
  //   path: '/message',
  //   component: Layout,
  //   redirect: '/index',
  //   children: [{
  //     path: 'index',
  //     name: 'MessageIndex',
  //     component: () => import('@/views/message/index'),
  //     meta: { title: '消息中心', icon: 'message' }
  //   }]
  // },

  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/company',
    meta: { title: '账号管理', icon: 'account' },
    children: [
      {
        path: 'company',
        name: 'UserManageCompany',
        component: () => import('@/views/userManage/company'),
        meta: { title: '员工账号', icon: 'account' }
      },
      {
        path: 'client',
        name: 'UserManageClient',
        component: () => import('@/views/userManage/client'),
        meta: { title: '客户账号', icon: 'account' }
      },
      {
        path: 'temp',
        name: 'UserManageTemp',
        component: () => import('@/views/userManage/temp'),
        meta: { title: '账号模板' },
        hidden: true
      },
      {
        path: 'account',
        name: 'UserManageAccount',
        component: () => import('@/views/userManage/account'),
        meta: { title: '账号信息' },
        hidden: true
      }
    ]
  },

  {
    path: '/permission',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'PermissionIndex',
      component: () => import('@/views/permission/index'),
      meta: { title: '权限管理', icon: 'permission' }
    }]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
