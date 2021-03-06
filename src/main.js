import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Editor from 'bin-ace-editor';

require('brace/mode/json')
require('brace/snippets/json')
require('brace/theme/chrome')

import '@/icons' // icon
import '@/permission' // permission control


// 实现图片点击放大
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// Vue.use(Viewer);
Vue.use(Viewer, {
  defaultOptions: {
      zIndex: 9999,
　　　　} })
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});
//_____________________________
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

 // 注册组件后即可使用
Vue.component(Editor.name, Editor)


if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  beforeCreate() {
		Vue.prototype.$bus = this //安装全局事件总线
	},
})
