import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style/element_visiable.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入封装的router
import run from '@/core/settings.js'
import router from '@/router/index'
import '@/permission'
import auth from '@/directive/auth'
import { store } from '@/pinia'
import App from './App.vue'
import { initDom } from './utils/positionToCode'
initDom()
/**
 * @description 导入加载进度条，防止首屏加载时间过长，用户等待
 *
 * */
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
Nprogress.configure({ showSpinner: false, ease: 'ease', speed: 500 })
Nprogress.start()

/**
 * 无需在这块结束，会在路由中间件中结束此块内容
 * */

const app = createApp(App)
app.config.productionTip = false

app
  .use(run)
  .use(store)
  .use(auth)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app')

export default app
