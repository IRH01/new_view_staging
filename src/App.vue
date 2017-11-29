<template>
  <div id="app">
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tab from './components/tab/tab.vue';
  import {mapState} from 'vuex';
  export default {
    created(){
      this.init();
      this.getSystemConfig();
    },
    methods:{
      init(){
        let Requres = new UrlSearch();
        if(Requres.token&&Requres.token!='undefined'){
          localStorage.setItem('token',decodeURIComponent(Requres.token));
        }
        if (window.frames.length != parent.frames.length) {
          let fromGamingUrl = window.location.search;
          top.location.href = this.Url+fromGamingUrl;
        }
        if(Requres.token&&!this.isLogin){
          let token = decodeURI(Requres.token);
          token = decodeURIComponent(token);
          this.axios.get('/api/login/tokenLogin', {
            params: {
              token: token
            }
          }).then((res)=>{
            res = res.data;
            if(res.result==0){
              localStorage.setItem('token',decodeURIComponent(Requres.token));
              this.getUserInfo(decodeURIComponent(Requres.token));
            }else {
              localStorage.removeItem('token');
              try{
                $.fn.cookie("token",null,{domain:"."+this.domain});
              }catch (err){
                console.log('token:'+err)
              }
            }
          }).catch( (response) => {
            console.log(response);
          });
        }else{
          if(Requres.token){
            this.getUserInfo(decodeURIComponent(Requres.token));
          }else {
            this.getUserInfo();
          }
        }
      }
    },
    components: {
      Tab
    },
    computed:{
    ...mapState([
        'isLogin'
      ])
    }
  }
</script>

<style>
  #app{
    height: 100%;
    width: 100%;
  }
</style>
