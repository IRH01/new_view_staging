import 'babel-polyfill'

import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'

import router from './router/index'
import store from './store/state'

import './common/style/index.less'

import './common/js/util'
import './common/js/config'

Vue.prototype.axios = axios

axios.interceptors.request.use((config) =>{
  config.params = {
    ...config.params,
    platformTerminal: 4,
    country: 0
  }

  return config
}, function(error){
  return Promise.reject(error)
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
