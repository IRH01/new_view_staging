<template>
<div class="payType pay_vertical">
  <div class="content">
    <vtitle title="选择支付方式" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp" :ishorizen="this.hor"></vtitle>
    <div class="payMoney">
      <span>支付金额</span>
      <span>{{money}}.00</span>
    </div>
    <div class="type">
      <p>请选择支付方式</p>
      <ul>
        <li @click="_pt(1)" v-if="PayWayNone[0]" class="borderBottom-1px zfb">
          <span></span>
          <span>支付宝</span>
          <span :class="{typeTrue:pt==1}"></span>
        </li>
        <li @click="_pt(2)" v-if="PayWayNone[1]&&!isweixin" class="borderBottom-1px wx" >
          <span></span>
          <span>微信</span>
          <span :class="{typeTrue:pt==2}"></span>
        </li>
        <li @click="_pt(3)" v-if="PayWayNone[2]" class="ylk">
          <span></span>
          <span>银联卡</span>
          <span :class="{typeTrue:pt==3}"></span>
        </li>
      </ul>
    </div>
    <button class="button" @click="_confirm">确&nbsp;定</button>
    <div class="guidPageIos" v-show="showIos" @click="showIos=!showIos"> </div>
    <div class="guidPageAndroid" v-show="showAndroid" @click="showAndroid=!showAndroid"></div>
    <popUps ref="pop"></popUps>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';
  import {mapState} from 'vuex';


  let fromGamingUrl = window.location.search;

  export default {
    data(){
      return {
        showIos:false,
        showAndroid:false,
        Requres:{},
        payData:{},//支付所需的参数
        notApp:true,//不内嵌在app中
        isweixin:false,
        money:10,
        pt:1,//1：支付宝，2：微信，3：银联
        WxGoodsId:this.wxGoodsId,
        wxPcPayWayCode:'',//微信pc
        wxPfPayWayCode:'',//微信支付类型
        zfbPayWayCode:'',//支付宝渠道
        bankPayWayCode:'',//银行卡支付
        PayWayNone:[false,false,false],
        isPayNot:false,
        payBankType:1,
        paltId:11111,
        hor:false,//横屏
        horDispper:true,//横屏消失
        isRUl:true
      }
    },
    watch: {
      $route(){
        if (this.$route.path.indexOf('payType') != -1) {
          this.$nextTick(function () {
            this.isRUl = true;
            this.hor = false;
            this.horDispper = true;
            this._dispper();
            let self = this;
            if($(window).width()>$(window).height()){
//              console.log($(window).width()+'-1--'+$(window).height())
              self.hor = true;
              $('.payType').removeClass('pay_vertical').addClass('pay_Horizen');
              self._dispper();
            }else {
//              console.log($(window).width()+'-2--'+$(window).height())
              this.horDispper=true;
              $('.payType').removeClass('pay_Horizen').addClass('pay_vertical');
              self._dispper();
            }
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(){
              if(window.orientation === 180|| window.orientation === 0){
                self.hor = false;
                $('.payType').removeClass('pay_Horizen').addClass('pay_vertical');
                self.horDispper=true;
              }
              if(window.orientation === 90 || window.orientation === -90 ){
                self.hor = true;
                $('.payType').removeClass('pay_vertical').addClass('pay_Horizen');
                self.horDispper=true;
              }
            }, false);
          })

          var u_agent =  navigator.userAgent;
          if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
            this.notApp = false;
          }
          this.isweixin = false;
          sessionStorage.removeItem('selBank');//删除下一个页面选择银行的缓存
          this.pt = 1;
          this.WxGoodsId = this.wxGoodsId;

          this.Requres = new UrlSearch();
          if(sessionStorage.getItem('payData')){
            this.payData = JSON.parse(sessionStorage.getItem('payData'));
            this.money = this.payData.money;
          }

          this.WxGoodsId=this.wxGoodsId
          this.wxPcPayWayCode='';//微信pc
          this.wxPfPayWayCode='';//微信支付类型
          this.zfbPayWayCode='';//支付宝渠道
          this.bankPayWayCode='';//银行卡支付
          this.PayWayNone=[false,false,false];
          this.isPayNot=false;
          this._payWayInfo();
          this.showIos = false;
          this.showAndroid = false;
        }
      }
    },
    created(){
//      if(!this.isLogin){
//        this.$router.push({path:'login'});
//      }
    	this.Requres = new UrlSearch();
      var u_agent =  navigator.userAgent;
      if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1||this.Requres.osType=='app'){//判断ios内嵌中调用获取支付参数
        this.notApp = false;
      }
      sessionStorage.removeItem('selBank');//删除下一个页面选择银行的缓存
      this.Requres = new UrlSearch();
      if(sessionStorage.getItem('payData')){
        this.payData = JSON.parse(sessionStorage.getItem('payData'));
        this.money = this.payData.money;
      }

//      if(this.Requres.osType=="app"){
//        this.notApp = false;
//        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
//          this.WxGoodsId=296
//        }else{
//          this.WxGoodsId=358
//        }
//      }else{
//        this.WxGoodsId=this.wxGoodsId
//      }
      this.$nextTick(function () {
        this._dispper();
        let self = this;
        if($(window).width()>$(window).height()){
          self.hor = true;
          $('.payType').removeClass('pay_vertical').addClass('pay_Horizen');
          self._dispper();
        }else{
          this.horDispper=true;
          $('.payType').removeClass('pay_Horizen').addClass('pay_vertical');
          self._dispper();
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(){
          if(window.orientation === 180|| window.orientation === 0){
            self.hor = false;
            $('.payType').removeClass('pay_Horizen').addClass('pay_vertical');
            self.horDispper=true;
          }
          if(window.orientation === 90 || window.orientation === -90 ){
            self.hor = true;
            $('.payType').removeClass('pay_vertical').addClass('pay_Horizen');
            self.horDispper=true;
          }
        }, false);
      })

      this.WxGoodsId=this.wxGoodsId
      this._payWayInfo();
      //判断show=n隐藏返回按钮
      	if(this.Requres.show=="n"){
      		this.isRUl=false;
      	}
    },
    methods:{
      back(){
        this.$router.push({
          path:`/pay${fromGamingUrl}`
        });
      },
      _pt(value){
          this.pt=value;
      },
      _payWayInfo(){
        if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'||this.Requres.notWeChatPay==1){
          this.isweixin = true;
        }else {
          this.isweixin = false;
        }
        this.axios.get('/api/payWayInfo/list').then((response)=>{
          response = response.data;
          if(response.result==0){
            let ua = window.navigator.userAgent.toLowerCase(); //判断移动端类型
            for(let i=0;i<response.data.length;i++){
              if(response.data[i].payWayCode==16){//payWayCode 支付方式编号
                if(response.data[i].status==1){//status 状态 0-禁用,1-启用
                  this.bankPayWayCode=response.data[i].payWayCode;
                  sessionStorage.setItem('bankPayWayCode',this.bankPayWayCode);
                  this.PayWayNone.splice(2,1,true);
                }else{
                  this.PayWayNone.splice(2,1,false)
                }
              }else if(response.data[i].payWayCode==1){
                if(response.data[i].status==1){
                  this.zfbPayWayCode=response.data[i].payWayCode;
                  this.PayWayNone.splice(0,1,true);
                }else{
                  this.PayWayNone.splice(0,1,false);
                  this.pt=2;
                }
              }else if(response.data[i].payWayCode==14||response.data[i].payWayCode==20){
                if(response.data[i].status==1){
                  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                    this.wxPcPayWayCode=response.data[i].payWayCode;
                    this.PayWayNone.splice(1,1,true);
                  }
                }else{
                  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                    this.PayWayNone.splice(1,1,false);
                    this.pt=1;
                  }
                }
              }else if(response.data[i].payWayCode==2){
                if(response.data[i].status==1){
                  this.wxPfPayWayCode=response.data[i].payWayCode;
                  this.PayWayNone.splice(1,1,true);
                }else{
                  this.PayWayNone.splice(1,1,false);
                }
              }else if (response.data[i].payWayCode==21) {
                this.wxPfPayWayCode=response.data[i].payWayCode;
                if(ua.match(/MicroMessenger/i) != 'micromessenger'){
                  if(response.data[i].status==1){
                    this.PayWayNone.splice(1,1,true);
                    this.pt = 2;
                  }else{
                    this.PayWayNone.splice(1,1,false);
                  }
                }else {
                  this.PayWayNone.splice(1,1,false);
                }
              }else if(response.data[i].payWayCode==22) {
                if(response.data[i].status==1) {
                  this.PayWayNone.splice(2,1,true);
                }else {
                  this.PayWayNone.splice(2,1,false)
                }
              }else if(response.data[i].payWayCode==23) {//易宝支付宝
                if(response.data[i].status==1){
                  this.zfbPayWayCode=response.data[i].payWayCode;
                  this.PayWayNone.splice(0,1,true);
                }else{
                  this.PayWayNone.splice(0,1,false);
                  this.pt=2;
                }
              }
            }
            for(let j=0;j<this.PayWayNone.length;j++){
              if(!this.PayWayNone[0]){
                this.pt = 2;
              }else if(!this.PayWayNone[1]&&!this.PayWayNone[0]){
                this.pt = 3;
              }
            }
            let m = 0;
            this.PayWayNone.forEach((value)=>{
              if(value==false){
                m++;
              }
            });
            if(m>=3){
              this.isPayNot=true;
            }else {
              this.isPayNot=false;
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      _confirm(){
        let sId;//服id
        let to = this.payData.to;//0充值到游戏，1充值乐盈币
        let tm = this.money;
        let pt = this.pt; // 1:支付宝支付,2：微信支付,3:银联
        let uId = this.payData.uid;//用户id
        let pId = this.payData.pid;//应用id
        let pName = this.payData.gameName;//应用名称
        let rUrl = decodeURIComponent(this.payData.rUrl);
        let extra=this.payData.extra;//透传参数
        let _this = this;

        if(pId!='31111'){
          this.payBankType = 3;
        }
        if(window.location.href.split(".com")[0]!=rUrl.split(".com")[0]){//从其他域名跳转到平台充值需要跳到中转页面
          rUrl = this.Url+'/transferPage.html?rUrl='+rUrl;
        }
        if(pt==1){
          let ua = window.navigator.userAgent.toLowerCase();
          if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
              this.showIos = true;
              this.showAndroid = false
            }else if(/(Android)/i.test(navigator.userAgent)){
              this.showIos = false;
              this.showAndroid = true;
            }
            return false
          }
          $.ajax({
            type : 'GET',
            url : "/api/pay/pay",
            data : {
              'country': 0,
              'money' : 0.01,
              'type' : this.zfbPayWayCode,
              "platformTerminal":4,
              'game' : pId,
              'gameName' : pName,
              'to' : to,//平台传1，子游戏传0
              'service' : "1",
              'account' : uId,
              'source' :'4',
              'sonPlatformId' : sId,
              'extra' : extra,
              'returnUrl' : rUrl
            },
            dataType : 'jsonp',
            success : function(data) {
              if(data.result==0){
                if(_this.zfbPayWayCode==1){
                  _this.getOrderId(data.businessNo);
                  var pElement = document.createElement("div");
                  pElement.innerHTML = data.data;
                  document.body.appendChild(pElement);
                  document.forms[0].submit();
                  pElement.remove();
                }else if(_this.zfbPayWayCode==23){
                  window.location.href = data.data;
                }
              }
            },
            error : function(xhr, type) {
              return "error";
            }
          });
        }else if(pt==2){//微信支付
            $.ajax({
              type : 'GET',
              url : "/api/pay/pay",
              data : {
                'country': 0,
                'money' : tm,
                'type' :this.wxPfPayWayCode ,
                'game' : pId,
                "goodsId":this.WxGoodsId,
                "platformTerminal":4,
                'gameName' : pName,
                'to' : to,
                'service' : "1",
                'account' : uId,
                'sonPlatformId' : sId,
                'extra' : extra,
                'returnUrl' : rUrl,
                "wechatPayType":2,//1：微信威富通支付，2：浦发银行支付 默认是1
                'source' :'4'
              },
              dataType : 'jsonp',
              success : function(data) {
                _this.getOrderId(data.businessNo);
                if(_this.wxPfPayWayCode==21){//微信聚合支付
                  window.location.href = data.data;
                }else{
                  top.location.href="https://payh5.bbnpay.com/h5pay/way.php?"+data.data;
                }
              },
              error : function(xhr, type) {
                return "error";
              }
            });
        }else if(pt==3) {
              let bankPayData = {
                payWayCode:this.bankPayWayCode,
                payMomey:0.01,
                bankPid:pId,//默认为31111
                bankGameName:pName,
                bankTo:to,
                busyId:uId,
                bankExtra:uId+"|"+this.payBankType+"|"+pId+"|4|"+this.paltId+"|null|"+(extra?extra:"null"),
                bankreturnUrl:rUrl
              };
              sessionStorage.setItem("bankPayData",JSON.stringify(bankPayData));
              this.$router.push({path:`/payBankFill1${fromGamingUrl}`});
        }
      },
      getOrderId(obj){
        //电竞ios的通信方法，用来传递订单号的
        function getOrderId(obj){
          var con=obj;
          if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
            window.webkit.messageHandlers.iOSScriptMessage.postMessage({operation:'getOrderId',message:con});
          }else{
            wyx.getOrderId(con)
          }
        }
        try{
          getOrderId(obj)
        }catch(err) {

        }
      },
      _dispper(){
        let self = this;
        if(this.hor){
          let height = $(window).height();
          $(window).resize(function () {
            if(height<=$(window).height()){
              self.horDispper=true;
            }else {
              self.horDispper=false;
            }
          });
        }
      }
    },
    computed:{
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    },
    components:{
      Vtitle,
      popUps
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .pay_vertical{  /*竖屏时*/
    height: 100%;
    display: block;
    display: flex;
    flex-direction: column;
    .content{
      display: block;
      flex: 1;
      background-color: #F5F5F5;
      .payMoney{
        height: 0.51rem;
        line-height: 0.51rem;
        display: block;
        display: flex;
        justify-content: space-around;
        font-size: 0.14rem;
        padding:0 0.15rem;
        background-color: #fff;
        >span{
          display: block;
          height: 0.45rem;
          flex: 1;
        }
        >span:nth-of-type(2){
          color: #FF8D4C;
          text-align: right;
        }
      }
      .type{
        >p{
          height: 0.45rem;
          line-height: 0.6rem;
          padding-left: 0.15rem;
          font-size: 0.14rem;
          color: #A9ABA9;
        }
        >ul{
          background-color: #fff;
          padding-left: 0.15rem;
          font-size: 0.14rem;
          >li{
            height: 0.51rem;
            line-height: 0.51rem;
            display: block;
            display: flex;
            >span.typeTrue:nth-of-type(3){
              background-image: url("./select.png");
            }
            >span:nth-of-type(1){
              display: block;
              width: 0.2rem;
              height: 0.2rem;
              background-position: center center;
              background-repeat: no-repeat;
              background-size: 0.2rem 0.2rem;
              margin: 0.16rem 0.1rem 0 0;
            }
            >span:nth-of-type(2){
              display: block;
              flex: 1;
              height: 0.45rem;
              font-size: 0.14rem;
            }
            >span:nth-of-type(3){
              display: block;
              width: 0.45rem;
              height: 0.45rem;
              background-position: center center;
              background-repeat: no-repeat;
              background-size: 0.2rem 0.2rem;
              background-image: url("./notSelect.png");
            }

          }
          >.zfb>span:nth-of-type(1){
            background-image: url("./zfb.png");
          }
          >.wx>span:nth-of-type(1) {
            background-image: url("./wx.png");
          }
          >.ylk>span:nth-of-type(1){
            background-image: url("./bankCard.png");
          }
        }
      }
      .button{
        display: block;
        border: none;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.15rem;
        color: #fff;
        border-radius: 0.23rem;
        width: 3rem;
        margin: 0.3rem auto 0;
        background-color: #00a8ff;
      }
    }
  }
  .titleText {
    	  line-height: .44rem;
	      display: block;
	      font-size: .17rem;
	      height: .44rem;
	      text-align: center;
	      flex: 1;
	      background-image: linear-gradient(to right, #00C6FF, #0072FF);
	      color:#FFFFFF;
	    }

  .payType .guidPageIos{
    width:100%;
    height:100%;
    position: fixed;
    top:0;
    left:0;
    background:url("./ios.jpg") no-repeat center;
    background-size:100% 100%;
    z-index: 11;
  }
  .payType .guidPageAndroid{
    width:100%;
    height:100%;
    position: fixed;
    top:0;
    left:0;
    background:url("./Android.jpg") no-repeat center;
    background-size:100% 100%;
    z-index: 11;
  }
  .pay_Horizen{  /*横屏时*/
    height: 100%;
    display: block;
    display: flex;
    flex-direction: column;
    .content{
      display: block;
      flex: 1;
      background-color: #F5F5F5;
      .payMoney{
        height: 0.31rem;
        line-height: 0.31rem;
        display: block;
        display: flex;
        justify-content: space-around;
        font-size: 0.09rem;
        padding:0 0.15rem;
        background-color: #fff;
        >span{
          display: block;
          height: 0.45rem;
          flex: 1;
        }
        >span:nth-of-type(2){
          color: #FF8D4C;
          text-align: right;
        }
      }
      .type{
        >p{
          height: 0.25rem;
          line-height: 0.3rem;
          padding-left: 0.15rem;
          font-size: 0.09rem;
          color: #A9ABA9;
        }
        >ul{
          background-color: #fff;
          padding-left: 0.15rem;
          font-size: 0.09rem;
          >li{
            height: 0.31rem;
            line-height: 0.31rem;
            display: block;
            display: flex;
            >span.typeTrue:nth-of-type(3){
              background-image: url("./select.png");
            }
            >span:nth-of-type(1){
              display: block;
              width: 0.14rem;
              height: 0.14rem;
              background-position: center center;
              background-repeat: no-repeat;
              background-size: 0.14rem 0.14rem;
              margin: 0.09rem 0.1rem 0 0;
            }
            >span:nth-of-type(2){
              display: block;
              flex: 1;
              height: 0.45rem;
              font-size: 0.09rem;
            }
            >span:nth-of-type(3){
              display: block;
              width: 0.25rem;
              height: 0.25rem;
              background-position: center center;
              background-repeat: no-repeat;
              background-size: 0.16rem 0.16rem;
              background-image: url("./notSelect.png");
              margin-top:0.02rem;
            }

          }
          >.zfb>span:nth-of-type(1){
            background-image: url("./zfb.png");
          }
          >.wx>span:nth-of-type(1) {
            background-image: url("./wx.png");
          }
          >.ylk>span:nth-of-type(1){
            background-image: url("./bankCard.png");
          }
        }
      }
      .button{
        display: block;
        border: none;
        height: 0.26rem;
        line-height: 0.26rem;
        font-size: 0.1rem;
        color: #fff;
        border-radius: 0.23rem;
        width: 3rem;
        margin: 0.3rem auto 0;
        background-color: #00a8ff;
      }
    }
  }










</style>
