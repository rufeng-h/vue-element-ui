import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from "./router"
import './assets/css/common.css'
import './assets/fonts/iconfont.css'
import axios from "axios"
import httpStatus from "@/httpStatus"

axios.defaults.baseURL = "/server"
axios.defaults.withCredentials = true
axios.defaults.timeout = 5000

Vue.config.productionTip = false
Vue.use(ElementUi)

new Vue({
  render: h => h(App),
  router,
  beforeMount () {
    Vue.prototype.$axios = axios
    Vue.prototype.$bus = this
    Vue.prototype.$message = ElementUi.Message
    Vue.prototype.$httpStatus = httpStatus

    axios.interceptors.response.use(
      (response) => {
        const data = response.data
        /*正常响应*/
        if (data.code >= 400) {
          this.$message.error(data.message)
          return
        }
        return response
      },
      (error) => {
        this.$message.error(error)
        console.error(error)
      }
    )

    this.$router.beforeEach(async (to, from, next) => {
      if (to.name === 'index') {
        next()
        return
      }
      let isLogin = false
      try {
        const { data: { data: res } } = await axios.get('/isLogin')
        isLogin = res.isLogin
      } catch (e) {
        // this.$message.error(e.message);
        console.error(e)
      }
      if (to.name === 'login') {
        if (isLogin) {
          next({ name: 'home' })
        } else {
          next()
        }
        return
      }
      if (isLogin) {
        next()
        return
      }
      if (to.name === 'welcome') {
        next({ name: 'login' })
      } else {
        next({ name: 'index' })
      }
    }
    )
  }
}).$mount('#app')
