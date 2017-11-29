<template>
    <div class="pay pay_vertical">
      <div class="pay-content">
        <vtitle title="充值" :isRUl="isRUl" :isFixed="false" @RUrl="back" :isShow="notApp" :ishorizen="this.hor"></vtitle>
        <slider :sImage="slideImage" urlName="pictureUrl" :paySlide="this.horDispper" ></slider>
        <div class="pay-content-type">
          <div class="user">
            <span>充值账号:</span>
            <span>{{uid}}</span>
          </div>
          <div class="gameName" v-if="gameName!='玩一下平台'">
            <span>充值游戏:</span>
            <span>{{gameName}}</span>
          </div>
          <ul>
            <li class="type-list" :class="{lmxuanzhong:payMoney==item}" @click="paySelect(item)" v-for="(item,index) in payMoneyList" :key='index'>{{item}}</li>
            <li class="type-list" :class="{lmxuanzhong:payMoney=='input'}">
              <input type="text" placeholder="输入充值金额" id="money-input" v-model="moneyinput" @click="paySelect('input')" @keyup="_input" onkeyup="value=value.replace(/[^\d]/g,'') " oninput="if(value.length>5)value=value.slice(0,10)"  pattern="/[^a-zA-Z]/"/>
            </li>
          </ul>
          <div class="gold">
            <div>
              <span>获得金币:</span>
              <span>{{gold}}</span>
            </div>
            <div>
              <span>充值兑换金币比例</span>
              <span>1:100</span>
            </div>
          </div>
          <button class="payButton" @click="_confirmPay">确&nbsp;定</button>
        </div>
        <popUps ref="pop"></popUps>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';
  import Slider from '../../base/slider/slider.vue';
  import popUps from '../../base/popUps/popUps.vue';

  let fromGamingUrl = window.location.search;
  let getUidTimer;

  export default {
    data(){
      return {
        agent:'',
        Requres:{},//获取url后面的参数值
        notApp:true,
        slideImage:[],//轮播图数据
        payMoneyList:[20,50,100,200,300],
        payMoney:20,
        isSelect:true,
        moneyinput:"",
        uid:this.$store.state.userInfo.userId,
        gold:"2000",
        rUrl:'',//充值需要传递的参数
        pid:'31111',//默认平台id
        gameName:'玩一下平台',
        goodsName:'乐盈币充值',
        to : 1,//0充值到子游戏，1充值平台
        hor:false,//横屏
        horDispper:true,//横屏消失
        isRUl:true
      }
    },
    watch:{
      $route(){
        if(this.$route.path.indexOf("pay")!=-1&&this.$route.path.indexOf("payType")<0&&this.$route.path.indexOf("payBank")<0&&this.$route.path.indexOf("payresult")<0) {
          this.Requres = new UrlSearch();
          this.agent='';
          this.notApp=true;
          this.payMoneyList=[20,50,100,200,300];
          this.payMoney=20;
          this.isSelect=true;
          this.moneyinput="";
          this.uid=this.$store.state.userInfo.userId;
          this.gold="2000";
          this.rUrl='';//充值需要传递的参数
          this.pid='31111';//默认平台id
          this.gameName='玩一下平台';
          this.goodsName='乐盈币充值';
          this.to= 1;//0充值到子游戏，1充值平台
          this.uid=this.userInfo.userId;
          this.isRUl = true;

          this.Requres = new UrlSearch();
          if(this.Requres.platformCode=='dj'){
            this.Requres.gid = this.GamingId;

          }
          if(this.Requres.gid){
            this.pid = this.Requres.gid;
          }
          if(this.Requres.rUrl) {
            this.rUrl=decodeURIComponent(this.Requres.rUrl);
            if(this.Requres.token){
              if(this.rUrl.indexOf('?')!=-1){
                this.rUrl = this.rUrl+'&token='+this.Requres.token;
              }else {
                this.rUrl = this.rUrl+'?token='+this.Requres.token;
              }
            }
          }else if(this.Requres.gid){
            if(localStorage.getItem('token')){
              this.rUrl = this.Url+'/games/'+this.Requres.gid+'?token='+localStorage.getItem('token');
            }else {
              this.rUrl = this.Url+'/games/'+this.Requres.gid;
            }
          }else {
            this.rUrl=this.Url;
          }
          if(!this.isLogin&&this.Requres.token){

            this.axios.get('/api/login/tokenLogin', {
              params: {
                token: decodeURIComponent(this.Requres.token)
              }
            }).then((res)=>{
              res = res.data;
              if(res.result==0){
                this.getUserInfo(decodeURIComponent(this.Requres.token));
              }else {
                setTimeout(()=>{
                  this.$router.push({path:`login${fromGamingUrl}`});
                },100);
              }
            }).catch( (response) => {
              console.log(response);
            });
          }
          setTimeout(()=>{
            this.uid=this.userInfo.userId;
          },1000);
          var u_agent =  navigator.userAgent;
          if(this.Requres.osType=='app'){
            this.notApp = false;
          }
          if(u_agent.indexOf("native_Android")>-1||u_agent.indexOf("native_iOS")>-1){
            this.notApp = false;
            if(!(this.Requres.gid&&this.Requres.token)){
              this.GetPayParam();
            }
          }else if(!this.isLogin&&!this.Requres.token){
            setTimeout(()=>{
              this.$router.push({path:`login${fromGamingUrl}`});
            },100);
          }
          let _this = this;
          window['AppSetPayParam'] = function (userId,token,gid) {
            if(gid){
              _this.pid = gid;
              _this.rUrl = _this.Url+'/pay';
              _this.to = 0;//0充值到子游戏，1充值平台

              _this.axios.get('/api/index/getGameById', {
                params: {
                  platformId:gid
                }
              }).then((res)=>{
                res = res.data;
                if(res.result==0&&res.data!=null){
                  _this.gameName = _this.Requres.gname?decodeURIComponent(_this.Requres.gname):res.data.name;
                }
              }).catch( (response) => {
                console.log(response);
              });
              if(token){
                let i = 1;
                _this.getUserInfo(token);
                setTimeout(()=>{
                  _this.uid=_this.userInfo.userId;
                },150);
                if(!_this.uid){
                  getUidTimer = setInterval(()=>{
                    i++;
                    if(!_this.uid&&i>2){
                      _this.getUserInfo(token);
                    }else if(_this.uid||i>20){
                      clearInterval(getUidTimer);
                      if(!_this.uid){
                        _this.userInfo.userId = userId;
                      }
                    }
                    _this.uid=_this.userInfo.userId;
                  },100);
                }
              }
            }
          };
          this.$nextTick(()=>{
            this.hor = false;
            this.horDispper = true;
            this._dispper();
            let self = this;
            if($(window).width()>$(window).height()){
              self.hor = true;
              $('.pay').removeClass('pay_vertical').addClass('pay_Horizen');
              self._dispper();
            }else{
              self.horDispper=true;
              $('.pay').removeClass('pay_Horizen').addClass('pay_vertical');
              self._dispper();
            }
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(){
              if(window.orientation === 180|| window.orientation === 0){
                self.hor = false;
                $('.pay').removeClass('pay_Horizen').addClass('pay_vertical');
                self.horDispper=true;
              }
              if(window.orientation === 90 || window.orientation === -90 ){
                self.hor = true;
                $('.pay').removeClass('pay_vertical').addClass('pay_Horizen');
                self.horDispper=true;
              }
            }, false);
            if(this.Requres.sliderHidden!=1){//隐藏轮播图
              this.getlbt();
            }
            this.PayInit();
            this.moneyListConfig();
            this.and();
            if(this.pid!='31111'){
              this.to = 0;//0充值到子游戏，1充值平台
              this.axios.get('/api/index/getGameById', {
                params: {
                  platformId:this.pid
                }
              }).then((res)=>{
                res = res.data;
                if(res.result==0&&res.data!=null){
                  _this.gameName = _this.Requres.gname?decodeURIComponent(_this.Requres.gname):res.data.name;
                }
              }).catch( (response) => {
                console.log(response);
              });
            }
          });
          this.statisticsPageTraffic('3',this.userInfo.userId?this.userInfo.userId:'',window.location.href);
        }
      }
    },
    created(){
      this.Requres = new UrlSearch();
      var u_agent =  navigator.userAgent;

      if(this.Requres.platformCode=='dj'){//电竞所有马甲包充值采用gid皆为电竞
        this.Requres.gid = this.GamingId;
      }
      if(this.Requres.osType=='app'){
        this.notApp = false;
      }

      if(u_agent.indexOf("native_Android")>-1||u_agent.indexOf("native_iOS")>-1){
        this.notApp = false;
        if(!(this.Requres.gid&&this.Requres.token)){
          this.GetPayParam();
        }
      } else if(!this.isLogin&&!this.Requres.token){
        setTimeout(()=>{
          this.$router.push({path:`login${fromGamingUrl}`});
        },100);
      }
      if(this.Requres.gid){
        this.pid = this.Requres.gid;
      }
      if(this.Requres.rUrl) {
        this.rUrl=decodeURIComponent(this.Requres.rUrl);
        if(this.Requres.token){
          if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){

          } else if(this.rUrl.indexOf('?')!=-1){
            this.rUrl = this.rUrl+'&token='+this.Requres.token;
          }else {
            this.rUrl = this.rUrl+'?token='+this.Requres.token;
          }
        }
      }else if(this.Requres.gid){
        if(localStorage.getItem('token')){
          this.rUrl = this.Url+'/games/'+this.Requres.gid+'?token='+localStorage.getItem('token');
        }else {
          this.rUrl = this.Url+'/games/'+this.Requres.gid;
        }
      }else {
        if(u_agent.indexOf("native_iOS")>-1){//判断ios内嵌中调用获取支付参数
          this.rUrl = this.Url+'/transferPage.html';
        }else if(u_agent.indexOf("native_Android")>-1){
          this.rUrl = this.Url+'/transferPage.html';
          console.log('andorid:'+this.rUrl);
        }else {
          this.rUrl=this.Url;
        }
      }
      if(!this.isLogin&&this.Requres.token){
        this.axios.get('/api/login/tokenLogin', {
          params: {
            token: decodeURIComponent(this.Requres.token)
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            this.getUserInfo(decodeURIComponent(this.Requres.token));
          }else {
            setTimeout(()=>{
              this.$router.push({path:`login${fromGamingUrl}`});
            },100);
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
      let _this = this;
      window['AppSetPayParam'] = function (userId,token,gid) {
        if(gid){
          _this.pid = gid;
          _this.to = 0;//0充值到子游戏，1充值平台
          _this.axios.get('/api/index/getGameById', {
            params: {
              platformId:gid
            }
          }).then((res)=>{
            res = res.data;
            if(res.result==0&&res.data!=null){
              _this.gameName = _this.Requres.gname?decodeURIComponent(_this.Requres.gname):res.data.name;
            }
          }).catch( (response) => {
            console.log(response);
          });
          if(token){
            let i = 1;
            _this.getUserInfo(token);
            setTimeout(()=>{
              _this.uid=_this.userInfo.userId;
            },150);
            if(!_this.uid){
              getUidTimer = setInterval(()=>{
                i++;
                if(!_this.uid&&i>2){
                  _this.getUserInfo(token);
                } else if(_this.uid||i>20){
                  clearInterval(getUidTimer);
                  if(!_this.uid){
                    _this.userInfo.userId = userId;
                  }
                }
                _this.uid=_this.userInfo.userId;
              },100);
            }
          }
        }
      };
//      AppSetPayParam('app','app:IOS3040b4f2fce34fb398f52d93c53bac6e',110119)
      setTimeout(()=>{
        this.uid=this.userInfo.userId;
      },1000);

      this.$nextTick(()=>{
        if(this.Requres.sliderHidden!=1){
          this.getlbt();
        }
        this.PayInit();
        this.moneyListConfig();
        this.and();
        if(this.pid!='31111'){
          this.to = 0;//0充值到子游戏，1充值平台

          this.axios.get('/api/index/getGameById', {
            params: {
              platformId:this.pid
            }
          }).then((res)=>{
            res = res.data;
            if(res.result==0&&res.data!=null){
              this.gameName = this.Requres.gname?decodeURIComponent(this.Requres.gname):res.data.name;
            }
          }).catch( (response) => {
            console.log(response);
          });
        }
        this._dispper();
        let self = this;
        if($(window).width()>$(window).height()){
          self.hor = true;
          $('.pay').removeClass('pay_vertical').addClass('pay_Horizen');
          self._dispper();
        }else{
          self.horDispper=true;
          $('.pay').removeClass('pay_Horizen').addClass('pay_vertical');
          self._dispper();
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(){
          if(window.orientation === 180|| window.orientation === 0){
            self.hor = false;
            $('.pay').removeClass('pay_Horizen').addClass('pay_vertical');
            self.horDispper=true;
          }
          if(window.orientation === 90 || window.orientation === -90 ){
            self.hor = true;
            $('.pay').removeClass('pay_vertical').addClass('pay_Horizen');
            self.horDispper=true;
          }
        }, false);




      });
      //判断show=n隐藏返回按钮
      if(this.Requres.show=="n"){
//      	this.notApp=false;
      	this.isRUl=false;
      }
      this.statisticsPageTraffic('3',this.userInfo.userId?this.userInfo.userId:'',window.location.href);
    },
    methods:{
      and() {
        var bIsAndroid = navigator.userAgent.toLowerCase().match(/android/i) == "android";
        if (bIsAndroid == true) {//兼容android键盘弹起遮挡事件

          var wHeight = window.innerHeight;   //获取初始可视窗口高度
          window.addEventListener('resize', function(){       //监测窗口大小的变化事件
            var hh = window.innerHeight;     //当前可视窗口高度

            if(wHeight > hh){           //可以作为虚拟键盘弹出事件
              var scroH = wHeight-hh;
              setTimeout(()=>{
                  $('.pay').scrollTop(scroH);
              },200)
            }else{         //可以作为虚拟键盘关闭事件

            }
            wHeight = hh;
          });
        }
      },
      back(){
        if(this.Requres.rUrl){
          window.location.href = decodeURIComponent(this.Requres.rUrl);
        }else if(this.pid!='31111'){
          window.location.href = this.Url+'/'+this.pid;
        }else {
          this.$router.push({path:'/mine'})
        }
      },
      PayInit(){
          var forIOS = function(){
            let UA = window.navigator.userAgent.toLowerCase();
            if(!UA.match(/iPad/) && !UA.match(/iPhone/) && !UA.match(/iPod/)){return;}
            if($('#wrapper').length){return;}
            $('body').children().not('script').wrapAll('<div id="wrapper" style="height: 100%"></div>');
          }();
          if(this.Requres.money!=null){
            $("#money-input").attr("readonly","readonly");
            this.isSelect=false;
            if(this.Requres.money==10||this.Requres.money==50||this.Requres.money==100||this.Requres.money==500||this.Requres.money==1000){
              this.payMoney=this.Requres.money;
            }else{
              this.payMoney='input';
              this.moneyinput=this.Requres.money;
            }
          }
      },
      _confirmPay(){
        this.uid=this.userInfo.userId;
        if(!this.uid){
          this.$refs.pop.show('账户不存在');
          return;
        }
        if(this.payMoney=='input'&&!this.moneyinput){
          this.$refs.pop.show('请输入金额');
          return;
        }else if(this.payMoney=='input'){
          if(this.moneyinput>4999){
            this.$refs.pop.show('最大充值金额为4999元');
            this.moneyinput='';
            this.gold = 0;
            return;
          }else if(this.moneyinput<this.minPay){
            this.$refs.pop.show(`最小充值金额为${this.minPay}元`);
            this.moneyinput='';
            this.gold = 0;
            return
          }
        }
        let payData={
          to:this.to,
          rUrl: this.rUrl,
          uid:this.uid,
          money:this.payMoney=='input'?this.moneyinput:this.payMoney,
          pid:this.pid,//pid为平台id，默认为31111
          gameName:this.gameName,
          goodsName:this.Requres.product?encodeURI(this.Requres.product):'乐盈币充值',
          extra:this.Requres.gid?JSON.stringify({
              "pId":this.pid!='31111'?this.pid:'',//gid为游戏id
              "uid":this.uid,
              "ext":this.Requres.ext?this.Requres.ext:"",
              "money":this.payMoney=='input'?this.moneyinput:this.payMoney,
              "callbackUrl":this.Requres.callbackUrl?this.Requres.callbackUrl:""
          }):''
        };
        sessionStorage.setItem("payData",JSON.stringify(payData));
        sessionStorage.setItem("busysearch",window.location.search);
        let fromGamingUrl = window.location.search;//从电竞跳转到平台充值所需要的url参数
        setTimeout(()=>{
          this.$router.push({path:`/payType${fromGamingUrl}`});
        },500);
      },
      paySelect(index){
        if(this.isSelect){
          this.payMoney=index;
          if(index!='input'){
            this.moneyinput="";
            this.gold=Number(index)*100;
            $("#money-input").blur()
          }else {
            this.gold = 0;
          }
        }
      },
      _input(){
        if(String(this.moneyinput).indexOf(".")!=-1){
          this.moneyinput=this.moneyinput.replace(".","")
        }
        this.moneyinput = Number(this.moneyinput);
        if(!this.moneyinput){
            this.moneyinput = '';
        }
        this.gold=Number(this.moneyinput)*100;
      },
      getlbt(){
        this.axios.get('/api/index/getIndexlbt', {
          params: {
            pictureType:8
          }
        }).then((res)=>{
          res = res.data;
          if(res.result===0){
            this.slideImage = res.data.list;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      moneyListConfig() {
        if(this.GamingId==this.Requres.gid){

          this.axios.get('/api/common/getSystemConfig', {
            params: {
              configKey:'hhly:playOne:systemConfig:0:5.pay.amount.lydj'
            }
          }).then((res)=>{
            res = res.data;
            if(res.result==0){
              if(res.data) {
                this.payMoneyList=[];
                for(let i= 0;i<JSON.parse(res.data).length;i++){
                  this.payMoneyList.push(JSON.parse(res.data)[i].amount);
                }
                this.payMoney = this.payMoneyList[0]
                this.gold=Number(this.payMoney)*100;
              }else {
                this.payMoneyList=[20,50,100,200,300];
              }
            }
          }).catch( (response) => {
            console.log(response);
          });
        }else {
          this.axios.get('/api/common/getSystemConfig', {
            params: {
              configKey:'hhly:playOne:systemConfig:0:5.pay.amount.normal'
            }
          }).then((res)=>{
            res = res.data;
            if(res.result==0){
              if(res.data) {
                this.payMoneyList=[];
                for(let i= 0;i<JSON.parse(res.data).length;i++){
                  this.payMoneyList.push(JSON.parse(res.data)[i].amount);
                }
                this.payMoney = this.payMoneyList[0]
                this.gold=Number(this.payMoney)*100;
              }else {
                this.payMoneyList=[20,50,100,200,300];
              }
            }
          }).catch( (response) => {
            console.log(response);
          });
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
      },
      GetPayParam(){
        function appPayParamMessage(){
          var u_agent =  navigator.userAgent;
          if(u_agent.indexOf("native_iOS")>-1){
            window.webkit.messageHandlers.AppGetPayParam.postMessage(null);
          }else if(u_agent.indexOf("native_Android")>-1){
            wyx.AppGetPayParam();
          }
        }
        try{
          appPayParamMessage();
        }catch(err) {

        }
      }
    },
    computed:{
      ...mapState([
        'minPay',
        'isLogin',
        'userInfo'
      ])
    },
    components:{
      Vtitle,
      Slider,
      popUps
    }
  }

</script>

<style  rel="stylesheet/less" lang="less" scoped>

  .pay_vertical{/*竖屏时*/
  display: block;
  display: flex;
  flex-direction: column;
  overflow-y:auto;
  width: 100%;
  height: 100%;
  .pay-content{
    display: block;
    flex: 1;
    background-color: #f5f7f8;
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
    .pay-content-type{
      background-color: #F5F5F5;
      padding-bottom:0.01rem;
      .user{
        margin-top: 0.10rem;
        font-size: 0.15rem;
        padding-left: 0.13rem;
        height: 0.40rem;
        color: #161616;
        line-height: 0.6rem;
        background-color: #fff;
      }
      .gameName{
        font-size: 0.15rem;
        padding-left: 0.13rem;
        height: 0.40rem;
        color: #161616;
        line-height: 0.6rem;
        background-color: #fff;
      }
      .gold {
        display: block;
        line-height: 0.25rem;
        font-size: 0.11rem;
        background-color: #fff;
        padding-left: 0.13rem;
        padding-bottom: 0.10rem;
        div>span {
          color: #161616;
        }
        div>span:nth-of-type(2n){
          color: #FF8D4C;
        }
        div>span:nth-of-type(3){
          margin-left: 0.15rem;
        }
      }

      ul{
        overflow: hidden;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #fff;
        display: block;
        /*display: flex;*/
        /*flex-wrap: wrap;*/
        /*justify-content: space-around;*/
        padding: 0.10rem 0;
        li{
          width: 30%;
          float: left;
          display: inline-block;
          background-color: #F5F5F5;
          height: 0.4rem;
          color: #999;
          line-height: 0.4rem;
          font-size: 0.13rem;
          text-align: center;
          margin-top: 0.07rem;
          margin-bottom: 0.07rem;
          float: left;
          margin-left:2.2%;
          >span:nth-of-type(1){
            display: block;
            height: 0.51rem;
            background-size:0.5rem 0.5rem ;
            background-repeat: no-repeat;
            background-position: center;
          }
          .type-lyb{
            display: block;
            line-height: 0.38rem;
            height: 0.38rem;
            text-align: center;
            color: #FFB212;
          }
          .type-money{
            display: block;
            height: 0.35rem;
            line-height: 0.35rem;
            color: #fff;
            background-color:#E7384A ;
            text-align: center;
          }
          h5{
            height: 0.32rem;
            text-align: center;
            line-height: 0.32rem;
            font-size: 0.16rem;
            color: #E7384A;
            margin: 0;
            margin-top: 0.22rem;
            font-weight: 100;
          }
        }
        li:nth-last-child(1){
          height: 0.38rem;
          line-height: 0.38rem;
          border: 1px solid #DADADA;
          background: #FFFFFF;
          input {
            display: block;
            font-size: 0.11rem;
            color: #999999;
            height: 0.2rem;
            margin-top:0.1rem;
            text-align: center;
            border: 0;
            width: 100%;
            outline: 0;
          }
        }
        li:nth-last-child(1).lmxuanzhong {
          border-color: #FF8D4C;
        }
        .lmxuanzhong {
          background-color: #FF8D4C;
          color: #fff;
          border-color: #FF8D4C;
        }
      }
    }
    .payButton{
      display: block;
      border: none;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.15rem;
      color: #fff;
      border-radius: 0.5rem;
      width: 3rem;
      margin: 0.3rem auto 0;
      background-color: #00a8ff;
    }
  }
}
.pay_Horizen{  /*横屏时*/
  display: block;
  display: flex;
  flex-direction: column;
  overflow-y:auto;
  width: 100%;
  height: 100%;
  .pay-content{
    display: block;
    flex: 1;
    background-color: #f5f7f8;
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
    .pay-content-type{
      background-color: #F5F5F5;
      padding-bottom:0.01rem;
      .user{
        margin-top: 0.06rem;
        font-size: 0.09rem;
        padding-left: 0.13rem;
        height: 0.25rem;
        color: #161616;
        line-height: 0.28rem;
        background-color: #fff;
      }
      .gameName{
        font-size: 0.09rem;
        padding-left: 0.13rem;
        height: 0.25rem;
        color: #161616;
        line-height: 0.25rem;
        background-color: #fff;
      }
      .gold {
        display: block;
        line-height: 0.15rem;
        font-size: 0.08rem;
        background-color: #fff;
        padding-left: 0.13rem;
        padding-bottom: 0.10rem;
        margin-bottom: 0.25rem;
        div>span {
          color: #161616;
        }
        div>span:nth-of-type(2n){
          color: #FF8D4C;
        }
        div>span:nth-of-type(3){
          margin-left: 0.15rem;
        }
      }

      ul{
        overflow: hidden;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: #fff;
        display: block;
        /*display: flex;*/
        /*flex-wrap: wrap;*/
        /*justify-content: space-around;*/
        padding: 0.02rem 0;
        li{
          width: 30%;
          float: left;
          display: inline-block;
          background-color: #F5F5F5;
          height: 0.3rem;
          color: #999;
          line-height: 0.3rem;
          font-size: 0.09rem;
          text-align: center;
          /*margin-top: 0.07rem;*/
          margin-bottom: 0.07rem;
          float: left;
          margin-left:2.2%;
          >span:nth-of-type(1){
            display: block;
            height: 0.51rem;
            background-size:0.5rem 0.5rem ;
            background-repeat: no-repeat;
            background-position: center;
          }
          .type-lyb{
            display: block;
            line-height: 0.38rem;
            height: 0.38rem;
            text-align: center;
            color: #FFB212;
          }
          .type-money{
            display: block;
            height: 0.35rem;
            line-height: 0.35rem;
            color: #fff;
            background-color:#E7384A ;
            text-align: center;
          }
          h5{
            height: 0.32rem;
            text-align: center;
            line-height: 0.32rem;
            font-size: 0.16rem;
            color: #E7384A;
            margin: 0;
            margin-top: 0.22rem;
            font-weight: 100;
          }
        }
        li:nth-last-child(1){
          height: 0.28rem;
          line-height: 0.28rem;
          border: 1px solid #DADADA;
          background: #FFFFFF;
          input {
            display: block;
            font-size: 0.08rem;
            color: #999999;
            height: 0.1rem;
            margin-top:0.1rem;
            text-align: center;
            border: 0;
            width: 100%;
            outline: 0;
          }
        }
        li:nth-last-child(1).lmxuanzhong {
          border-color: #FF8D4C;
        }
        .lmxuanzhong {
          background-color: #FF8D4C;
          color: #fff;
          border-color: #FF8D4C;
        }
      }
    }
    .payButton{
      display: block;
      border: none;
      height: 0.25rem;
      line-height: 0.25rem;
      font-size: 0.1rem;
      color: #fff;
      border-radius: 0.5rem;
      width: 80%;
      background-color: #00a8ff;
      margin-left: 10%;
    }
  }
}

.pay::-webkit-scrollbar {
  width: 0.5px;
  height: 0.5px;;
  width:0;
  height:0;
}
#wrapper {
  height:100%;
  -webkit-overflow-scrolling:touch;
  overflow:auto
}
</style>
