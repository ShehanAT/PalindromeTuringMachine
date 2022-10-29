import Vue from 'vue'
import App from './App.vue'

import VuePixi from './'

Vue.use(VuePixi)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
