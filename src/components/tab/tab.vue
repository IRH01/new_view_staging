<template>
    <div class="tab show borderTop-1px" ref="tab">
      <router-link tag="div" class="tab-item" to="/index">
        <span class="indexImg"></span>
        <span class="tab-link">首页</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/gameCenter">
        <span class="gameImg"></span>
        <span class="tab-link">游戏中心</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/find">
        <span class="findImg"></span>
        <span class="tab-link">发现</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/mine">
        <span class="mineImg"></span>
        <span class="tab-link">我的</span>
           <span>
             <i class="redDot" v-if="unre"></i>
           </span>
      </router-link>
    </div>
</template>

<script type="text/ecmascript-6">

  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        unre:(this.$store.state.userInfo.unreads||!this.$store.state.userInfo.phone)&&this.$store.state.isLogin
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('index')!=-1||newVal.path.indexOf('gameCenter')!=-1||newVal.path.indexOf('find')!=-1&&newVal.path.indexOf('findPassword')==-1||newVal.path.indexOf('mine')!=-1){
          $('.tab').addClass('show');
          this.unre=(this.$store.state.userInfo.unreads||!this.$store.state.userInfo.phone)&&this.$store.state.isLogin;
        }else {
          $('.tab').removeClass('show');
        }
      }
    },
    computed:{
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/style/variable.less";
  .tab {
    display: none;
    position: fixed;
    bottom:0;
    left: 0;
    width: 100%;
    height:0.54rem;
    font-size: @font-size-medium;
    background:#fff;
    z-index:10000;
    /*border-top:1px solid #e5e5e5;*/
    .tab-item {
      display: block;
      position: relative;
      height:0.53rem;
      padding-top: 0.1rem;
      flex:1;
      text-align: center;
    }
    .tab-link{
      font-size: 0.12rem;
    }
    .tab-item.router-link-active {
      color: @main-color;
    }
    .tab-item.router-link-active .indexImg{
      background: url("./index.png") no-repeat center;
      background-size: 86% 86%;
    }
    .tab-item.router-link-active .gameImg{
      background: url("./gameCenter.png") no-repeat center;
      background-size: 86% 86%;
    }
    .tab-item.router-link-active .findImg{
      background: url("./find.png") no-repeat center;
      background-size: 86% 86%;
    }
    .tab-item.router-link-active .mineImg{
      background: url("./mine.png") no-repeat center;
      background-size: 86% 86%;
    }
    .indexImg {
      display: block;
      height:0.2rem;
      width: 0.21rem;
      margin: 0 auto 0.03rem;
      background: url("./index-2.png") no-repeat center;
      background-size: 86% 86%;
    }
    .gameImg {
      display: block;
      height:0.2rem;
      width: 0.23rem;
      margin: 0 auto 0.03rem;
      background: url("./gameCenter-2.png") no-repeat center;
      background-size: 86% 86%;
    }
    .findImg {
      display: block;
      height:0.2rem;
      width: 0.21rem;
      margin: 0 auto 0.03rem;
      background: url("./find-2.png") no-repeat center;
      background-size: 86% 86%;
    }
    .mineImg {
      display: block;
      height:0.2rem;
      width: 0.168rem;
      margin: 0 auto 0.03rem;
      background: url("./mine-2.png") no-repeat center;
      background-size: 86% 86%;
    }
    .redDot {
      display: block;
      position: absolute;
      height: 0.1rem;
      width: 0.1rem;
      right: 0.3rem;
      top: 0.1rem;
      border-radius: 50%;
      background: red;
    }
  }
  .show {
    display:block;
    display: flex;
  }
</style>
