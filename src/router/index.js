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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
  //首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  //项目管理
  {
    path: '/project',
    component: Layout,
    redirect: '/ProjectManagement',
    children: [{
      path: 'ProjectManagement',
      name: 'projectManagement',
      component: () => import('@/views/ProjectManagement/index'),
      meta: { title: '项目管理', icon: 'el-icon-s-management' }
    },]
  },
  //接口测试
  {
    path: '/interface',
    component: Layout,
    redirect: '/interface/interfaceTesting',
    name: 'interface',
    meta: { title: '接口测试', icon: 'el-icon-s-help' },
    children: [
      // //项目管理
      // {
      //   path: 'ProjectManagement',
      //   name: 'projectManagement',
      //   component: () => import('@/views/ProjectManagement/index'),
      //   meta: { title: '项目管理', icon: 'el-icon-s-management' }
      // },
      //环境配置
      {
        path: '/environmentConfiguration',
        name: 'environmentConfiguration',
        component: () => import('@/views/InterfaceTest/environmentConfiguration'),
        meta: { title: '环境配置', icon: 'el-icon-menu' },
      },
      //全局变量
      {
        path: '/globalVariable',
        name: 'globalVariable',
        component: () => import('@/views/InterfaceTest/globalVariable'),
        meta: { title: '全局变量', icon: 'el-icon-menu' },
      },
      // //变量管理
      // {
      //   path: 'variableManage',
      //   name: 'variableManage',
      //   component: () => import('@/views/variableManage'),
      //   // redirect: '/interface/variableManage/globalVariable',
      //   meta: { title: '变量管理', icon: 'el-icon-menu' },
      //   children: [
      //     //全局变量
      //     {
      //       path: 'globalVariable',
      //       name: 'globalVariable',
      //       component: () => import('@/views/variableManage/globalVariable'),
      //       meta: { title: '全局变量', icon: 'el-icon-menu' },
      //     },
      //     //环境配置
      //     {
      //       path: 'environmentConfiguration',
      //       name: 'environmentConfiguration',
      //       component: () => import('@/views/variableManage/environmentConfiguration'),
      //       meta: { title: '环境配置', icon: 'el-icon-menu' },
      //     }
      //   ]
      // },
      //接口调试
      {
        path: 'interfaceTesting',
        name: 'interfaceTesting',
        component: () => import('@/views/InterfaceTest/interfaceTesting/index'),
        meta: { title: '接口调试', icon: 'table' ,keepAlive: true}
      },
      //我的接口
      {
        path: 'myInterface',
        name: 'myInterface',
        // alwaysShow: true,
        component: () => import('@/views/InterfaceTest/myInterface/index'),
        meta: { title: '我的接口', icon: 'el-icon-user-solid' },
      },
      // //接口列表
      // {
      //   path: 'InterfaceList',
      //   name: 'InterfaceList',
      //   component: () => import('@/views/myInterface/InterfaceList'),
      // },
      //我的接口
      {
        path: 'CaseManagement',
        name: 'CaseManagement',
        component: () => import('@/views/InterfaceTest/caseManagement/index'),
        meta: { title: '用例管理', icon: 'el-icon-user-solid' },
      },
      //测试计划
      {
        path: 'TestPlan',
        name: 'TestPlan',
        component: () => import('@/views/InterfaceTest/testPlan/index'),
        meta: { title: '测试计划', icon: 'el-icon-user-solid' },
      },
      //执行结果
      {
        path: 'ExecutiveOutcomes',
        name: 'ExecutiveOutcomes',
        component: () => import('@/views/InterfaceTest/executiveOutcomes/index'),
        meta: { title: '测试计划', icon: 'el-icon-user-solid' },
      },
    ]
  },
  
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

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
