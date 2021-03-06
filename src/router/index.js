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
        component: () => import('@/views/InterfaceTest/interfaceTesting'),
        meta: { title: '接口调试', icon: 'table', keepAlive: true }
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
        meta: { title: '测试报告', icon: 'el-icon-user-solid' },
        redirect: '/interface/ExecutiveOutcomes/list',
        component: () => import('@/views/InterfaceTest/executiveOutcomes/index'),
        children: [
          {
            path: 'list',
            component: () => import('@/views/InterfaceTest/executiveOutcomes/list'),
            meta: { title: '报告列表' },
          },
          {
            path: 'testReport',
            name: 'testReport',
            component: () => import('@/views/InterfaceTest/executiveOutcomes/testReport'),
            meta: { title: '报告详情', guidePath: true, jumpPath: '/interface/ExecutiveOutcomes/list' },
            hidden: true,
            // activeMenu: '/interface/TestPlan',
          }

        ]
      },
      // //执行结果
      // {
      //   path: 'ExecutiveOutcomes',
      //   name: 'ExecutiveOutcomes',
      //   meta: { title: '测试报告', icon: 'el-icon-user-solid' },
      //   redirect: '/interface/ExecutiveOutcomes/list',
      //   component: () => import('@/views/InterfaceTest/executiveOutcomes/index'),
      //   children: [
      //     {
      //       path: 'list',
      //       component: () => import('@/views/InterfaceTest/executiveOutcomes/list'),
      //       meta: { title: '报告列表' },
      //       // hidden: true,
      //     },
      //     {
      //       path: 'testReport',
      //       name: 'testReport',
      //       component: () => import('@/views/InterfaceTest/executiveOutcomes/testReport'),
      //       meta: { title: '报告详情' },
      //       hidden: true,
      //       activeMenu: '/interface/ExecutiveOutcomes/list',
      //     }
      //   ]
      // },

    ]
  },
  //性能测试
  {
    path: '/performance',
    component: Layout,
    redirect: '/performance/ScriptManagement',
    meta: { title: '性能测试', icon: 'form' },
    children: [
      {
        //jmx脚本管理
        path: 'ScriptManagement',
        name: 'ScriptManagement',
        component: () => import('@/views/PerformanceTest/ScriptManagement/index'),
        meta: { title: 'jmx脚本管理', icon: 'form' }
      },
      //定时任务
      {
        path: 'testPlan',
        name: 'PerformanceTestPlan',
        component: () => import('@/views/PerformanceTest/testPlan/index'),
        meta: { title: '测试计划', icon: 'form' }
      },
      //报告列表
      {
        path: 'Report',
        name: 'Report',
        component: () => import('@/views/PerformanceTest/executiveOutcomes/index'),
        meta: { title: '测试报告', icon: 'form' }
      },
    ]
  },
  //WebUI自动化测试
  {
    path: '/webui',
    component: Layout,
    redirect: '/webui/PageElement',
    meta: { title: 'WebUI测试', icon: 'form' },
    children: [
      {
        //元素操作
        path: 'ElementAction',
        name: 'ElementAction',
        component: () => import('@/views/WebUiTest/ElementAction'),
        meta: { title: '元素操作', icon: 'form' }
      },
      {
        //页面元素
        path: 'PageElement',
        name: 'PageElement',
        component: () => import('@/views/WebUiTest/PageElement'),
        meta: { title: '页面元素', icon: 'form' }
      },
      {
        //用例管理
        path: 'UiCaseManagement',
        name: 'UiCaseManagement',
        component: () => import('@/views/WebUiTest/CaseManagement'),
        meta: { title: '用例管理', icon: 'form' }
      },
      //定时任务
      {
        path: 'testPlan',
        name: 'webuiTestPlan',
        component: () => import('@/views/WebUiTest/testPlan/index'),
        meta: { title: '测试计划', icon: 'form' }
      },
      //执行结果
      {
        path: 'ExecutiveOutcomes',
        name: 'WebuiExecutiveOutcomes',
        meta: { title: '测试报告', icon: 'el-icon-user-solid' },
        component: () => import('@/views/WebUiTest/executiveOutcomes/index'),
        children: [
          {
            path: 'list',
            component: () => import('@/views/WebUiTest/executiveOutcomes/list'),
            meta: { title: '报告列表' },
          },
          {
            path: 'testReport',
            name: 'webuiTestReport',
            component: () => import('@/views/WebUiTest/executiveOutcomes/testReport'),
            meta: { title: '报告详情', guidePath: true, jumpPath: '/webui/ExecutiveOutcomes/list' },
            hidden: true,
            // activeMenu: '/webui/ExecutiveOutcomes/list',
          }
        ]
      }
    ]
  },
  //工具
  {
    path: '/tools',
    component: Layout,
    redirect: '/tools/json',
    meta: { title: '工具', icon: 'form' },
    children: [
      {
        //jmx脚本管理
        path: 'json',
        name: 'json',
        component: () => import('@/views/tools/json/index'),
        meta: { title: 'json解析', icon: 'form' }
      },
      //测试页面
      {
        path: 'test',
        name: 'test',
        component: () => import('@/views/tools/test/index'),
        meta: { title: '测试页面', icon: 'form' }
      }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: '表单', icon: 'form' }
  //     },
  //   ]
  // },

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
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

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
