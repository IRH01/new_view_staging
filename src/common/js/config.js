import Vue from 'vue';
import Router from '../../router/index';
import store from '../../store/state';

/*开发环境*/
//Vue.prototype.GamingId="10110";
//Vue.prototype.wxGoodsId="294";

/*测试环境*/
 //Vue.prototype.GamingId="10110";
 //Vue.prototype.wxGoodsId="294";

/*预发布环境*/
Vue.prototype.GamingId="10100";
Vue.prototype.wxGoodsId="673";

/*生产环境*/
//Vue.prototype.GamingId="10100";
//Vue.prototype.wxGoodsId="70";

Vue.prototype.domain=document.domain.split('.').slice(-2).join('.');
Vue.prototype.Url ='http://'+ window.location.host;
Vue.prototype.prefile = 'http://prefile.w1x.com/upload/uploadImage.do';
if(location.protocol=='https:'){
  Vue.prototype.Url = 'https://'+ window.location.host;
  Vue.prototype.prefile = 'https://prefile.w1x.com/upload/uploadImage.do';
}

if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
  Vue.prototype.platformTerminal=2
}else if(/(Android)/i.test(navigator.userAgent)){
  Vue.prototype.platformTerminal=3
}

Vue.prototype.exitLogin = function(){
  this.axios.get('/api/login/exits').then((res)=>{
    res = res.data;
    if(res.result==0){
      this.$store.state.userInfo.token = '';
      localStorage.removeItem('token');
      store.state.isLogin = false;
      store.state.userInfo= {};
    }
  }).catch( (response) => {
    console.log(response);
  });
};

Vue.prototype.getUserInfo = function (token) {
  Router.beforeEach(function (to, from, next) {
    if((to.path==='/pay'||to.path==='/remitAccount'||to.path==='/mygold'||to.path==='/gameLog'||to.path==='/information'||to.path==='/qiandao'||to.path==='/integral'||to.path==='/set')&&!store.state.isLogin){
      next({path:'/login'});
    }else {
      next();
    }
  });

  this.axios.get('/api/userMsg/getUnreadMsg', {
    params: {
      plateformId:4
    }
  }).then((res)=>{
    res = res.data;
    if(res.result==0){
      store.state.userInfo.unreads = res.data.unreads;
    }
  }).catch( (response) => {
    console.log(response);
  });
  if(token){
    localStorage.setItem('token',token);
    $.fn.cookie("token",token,{expires:7,domain:"."+this.domain});
  }else if(localStorage.getItem('token')){
    $.fn.cookie("token",localStorage.getItem('token'),{expires:7,domain:"."+this.domain});
  } else if($.fn.cookie("token",{domain:"."+this.domain})){
    localStorage.setItem('token',$.fn.cookie("token",{domain:"."+this.domain}));
  }
  console.log('---getUserInfo---3' + 'token:' + '-' + localStorage.getItem('token') + '--' + token)
  if(!localStorage.getItem('token')&&!token){
    //this.exitLogin();
    // 无token不允许登录
    store.state.isLogin = false;
    store.state.userInfo= {};
    return;
  }

  this.axios.get('/api/user/getUserInfo', {
    params: {
      platformTerminal:4,
      country:0,
      token:token
    }
  }).then((response)=>{
    response = response.data;
    if(response.result==0){
      store.state.isLogin=true;
      store.state.userInfo.jf = response.jf;
      store.state.userInfo.lyb = response.lyb;
      store.state.userInfo.lyq = response.lyq;
      store.state.userInfo.address = response.user.address;
      store.state.userInfo.location = response.user.location;
      store.state.userInfo.nickname = response.user.nickname;
      store.state.userInfo.phone = response.user.phone;
      store.state.userInfo.qq = response.user.qq;
      store.state.userInfo.realName = response.user.realName;
      store.state.userInfo.sex = response.user.sex;
      store.state.userInfo.userId = response.user.userId;
      store.state.userInfo.loginType = response.user.loginType;
      if(response.user.headIcon&&response.user.headIcon.indexOf('http')>-1){
        store.state.userInfo.headIcon = response.user.headIcon;
      }else if(response.user.headIcon){
        store.state.userInfo.headIcon = '../../static/'+response.user.headIcon.split('././')[1];
      }
    }else {
      store.state.isLogin = false;
      store.state.userInfo= {};
      localStorage.removeItem('token');
      try{
        $.fn.cookie("token",null,{domain:"."+this.domain});
      }catch (err){
        console.log('login:'+err)
      }
      if(token){
        console.log( '登录失败'+ JSON.stringify(response))
      }
    }
  }).catch( (response) => {
    console.log(response);
  });
};

Vue.prototype.getSystemConfig = function () {

  this.axios.get('/api/common/getSystemConfig', {
    params: {
      configKey:'hhly:playOne:systemConfig:0:5.recharge.minMoney'
    }
  }).then((res)=>{
    res = res.data;
    store.state.minPay=res.data;
  }).catch( (response) => {
    console.log(response);
  });

}

Vue.prototype.getGameIdSystemConfig = function () {
  this.axios.get('/api/common/getSystemConfig', {
    params: {
      configKey:'hhly:playOne:systemConfig:common:platformCode'
    }
  }).then((res)=>{
    res = res.data;
  }).catch( (response) => {
    console.log(response);
  });
}


Vue.prototype.statisticsPageTraffic = function (pV,uId,url) {
  url = (url.slice(url.lastIndexOf('/')).split('?')[0]).indexOf('com')==-1?url.slice(url.lastIndexOf('/')).split('?')[0]:'';
  this.axios.get('/api/dataBuriedPoint/view', {
    params: {
      pageView: pV,userId:uId,urlPath:url
    }
  }).then((res)=>{}).catch( (response) => {
    console.log(response);
  });
}
Vue.prototype.gameStatisticsClick = function (uId,url,pName,pId) {
  this.axios.get('/api/dataBuriedPoint/gameStart', {
    params: {
      userId:uId,
      urlPath:url,
      platformName:pName,
      platformId:pId
    }
  }).then((res)=>{}).catch( (response) => {
    console.log(response);
  });
}
