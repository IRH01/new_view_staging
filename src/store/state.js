import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  minPay:0,
  isLogin:false,
  userInfo:{}
};

export default new Vuex.Store({
  state
});
