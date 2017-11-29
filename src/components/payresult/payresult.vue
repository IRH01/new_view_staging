<template>
  <div class="payresult">
    <vtitle title="充值" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp" ref="title"></vtitle>
    <div class="payresult-con-s" v-if="status==0">
      <div class="pay-img borderBottom-1px">
        <img src="./paysuccess.png">
        <p>充值成功</p>
      </div>
      <ul>
        <li class="borderBottom-1px">
          <span>账户：</span>
          <span>{{userName}}</span>
        </li>
        <li class="borderBottom-1px">
          <span>充值订单号：</span>
          <span>{{userD}}</span>
        </li>
        <li class="borderBottom-1px">
          <span>充值金额：</span>
          <span class="money">{{money}}元</span>
        </li>
      </ul>
    </div>
    <div class="payresult-con-f" v-if="status==1">
      <div class="pay-img">
        <img src="./payfail.png">
        <p>充值失败</p>
        <p>原因：{{payMsg}}</p>
      </div>
    </div>
    <div class="returnRoute">
      <span v-if="status==0&&appnone" @click="goIndex()">返回首页</span>
      <span v-if="status==0" @click="_returnRoute('pay')">再充一笔</span>
      <span v-if="status==1" @click="_returnRoute('me')">联系客服</span>
      <span v-if="status==1" @click="_returnRoute('pay')">继续充值</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';

  let fromGamingUrl = window.location.search;

  export default {
    data(){
      return {
        notApp:true,
        Requres:{},
        title:'充值',
        status:1, //0成功状态 1失败状态
        payMsg:'操作超时',
        userName:'',
        userD:'',
        money:'',
        appnone:true
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('payresult')!=-1){
          this.Requres = new UrlSearch();
          this.$nextTick(() => {
            this.init();
          });
        }
      }
    },
    created(){
      this.Requres = new UrlSearch();
      this.$nextTick(() => {
       this.init();
      });
    },
    methods:{
      back(){
        if(JSON.parse(sessionStorage.getItem('bankPayData'))&&JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl){
          window.location.href = JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl;
        }else {
          this.$router.push({
            path:'/mine'
          });
        }
      },
      init(){
        let height=$(window).height();
        var u_agent =  navigator.userAgent;
        if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
          this.notApp = false;
          this.appnone = false;
          $(".payresult .payresult-con-f").css("padding-top","0");
          $(".payresult .payresult-con-s").css("padding-top","0");
          $(".payresult-con-f").height(height-$(".payresult .returnRoute").height());
          $(".payresult-con-s").height(height-$(".payresult .returnRoute").height());
        }else {
          this.notApp = true;
          this.appnone = true;
          $(".payresult-con-f").height(height-$(this.$refs.title.$el).height()-$(".payresult .returnRoute").height()-parseInt($(".payresult .payresult-con-f").css('padding-top')));
          $(".payresult-con-s").height(height-$(this.$refs.title.$el).height()-$(".payresult .returnRoute").height()-parseInt($(".payresult .payresult-con-f").css('padding-top')));
        }
        console.log(JSON.parse(sessionStorage.getItem('bankPayData')))
        if(sessionStorage.getItem('payresult')) {
          this.status = JSON.parse(sessionStorage.getItem('payresult')).status;
          this.payMsg = JSON.parse(sessionStorage.getItem('payresult')).msg;
          this.userName=JSON.parse(sessionStorage.getItem('bankPayData')).busyId;
          this.userD=JSON.parse(sessionStorage.getItem('bankPayData')).outTradeNo;
          this.money=JSON.parse(sessionStorage.getItem('bankPayData')).payMomey;
        }
      },
      _returnRoute(value){
        if(value=="me"){
          window.location.href="http://71chat.com/scsf/phone/visitor.html?cmpcd=178019";
        }else{
          if(JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl&&value=="index"){
            if(decodeURIComponent(JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl).indexOf("?")!=-1){
              if(this.status==1){
                window.location.href=JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl+"&result=false&money="+this.money;
              }else{
                window.location.href=JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl+"&result=true&money="+this.money;
              }
            }else{
              if(this.status==1){
                window.location.href=JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl+"?result=false&money="+this.money;
              }else{
                window.location.href=JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl+"?result=true&money="+this.money;
              }
            }
          }else{
            if(sessionStorage.getItem('bankPayData')&&JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl&&value=="pay"){
              this.$router.push({path:'/'+value+"?"+fromGamingUrl});
            }else{
              this.$router.push({path:'/'+value})
            }
          }
        }
        sessionStorage.removeItem("bankFalse")
      },
      goIndex() {
        if(JSON.parse(sessionStorage.getItem('bankPayData'))&&JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl){
          window.location.href = JSON.parse(sessionStorage.getItem('bankPayData')).bankreturnUrl;
        }else {
          this.$router.push({
            path:'/index'
          });
        }
      }
    },
    components:{
      Vtitle
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>
  .payresult {
    background:#f5f5f5;
    height: 100%;
    width: 100%;
    display: block;
    .returnRoute {
      display: block;
      height: 0.45rem;
      line-height:0.45rem;
      width:100%;
      background: #00A8FF;
      position: relative;
      span {
        width: 50%;
        display: block;
        float: left;
        text-align: center;
        color: #FFFFFF;
        font-size: 0.16rem;
      }
    }
  }
    .payresult-con-s {
      background:#fff;
      padding-top: 0.45rem;
      .pay-img {
        text-align: center;
        padding-bottom:0.14rem;
        img {
          display: block;
          margin:0rem auto;
          width: 1.2rem;
          height: 1.2rem;
        }
        p {
          font-size:0.18rem;
          color:#00e80b;
        }
      }
      ul {
        li {
          padding:0 0.15rem;
          height: 0.4rem;
          line-height:0.4rem;
          font-size:0.14rem;
          span:nth-child(1){
            display: block;
            display: inline-block;
            float: left;
          }
          span:nth-child(2){
            display: block;
            display: inline-block;
            float: right;
          }
          .money {
            color:#ee8600;
          }
        }
      }
    }
    .payresult-con-f {
      background:#fff;
      padding-top: 0.45rem;
      .pay-img {
        text-align: center;
        padding-bottom:0.06rem;
        img {
          display: block;
          margin:0 auto ;
          width: 1.2rem;
          height: 1.2rem;
        }
        p {
          font-size:0.18rem;
          color:#e7384a;
        }
        p:nth-child(3) {
          color:#ff0000;
          line-height:0.3rem;
          font-size:0.14rem;
        }
      }
    }
</style>
