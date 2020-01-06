import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/element-variables.scss'
import '@/icons' // icon
import '@/styles/index.scss' // glo

import App from './App'
import store from './store'
import router from './router'
import moment from 'moment'
import VueSocketIO from 'vue-socket.io'

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://127.0.0.1:3000'
  })
)
Vue.use(ElementUI)

Vue.prototype.$moment = moment
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
