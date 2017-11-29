<template>
    <div class="login pay_vertical">
      <div class="close" @click="close"></div>
      <div class="imgWrapper">
        <img src="./logo.png" alt="">
      </div>
      <div class="content">
        <div class="form-content">
          <div class="user-name borderBottom-1px">
            <input @keyup.13="enter" type="text"  autofocus="autofocus" @keydown="loginyx" placeholder="账号/绑定手机号码" v-model="user.name" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" maxlength="25">
            <i @click="delName" v-show="this.user.name"></i>
            <span></span>
          </div>
          <div class="user-pwd borderBottom-1px">
            <input @keyup.13="enter" type="password" @keydown="loginyx" placeholder="密码" maxlength="25" v-model="user.pwd"  onpaste="return false" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')">
            <span :class="{'showPwd':showPwd}" @click="togglePwdShow"></span>
            <i @click="delpwd" v-show="this.user.pwd"></i>
          </div>
          <div class="verification-code" v-if="isVcode">
            <div><input @keyup.13="enter" type="text" placeholder="输入验证码" maxlength="6" v-model="user.vcode"></div>
            <div><img :src="showcodes" class="v-code" @click="getVcode"></div>
          </div>
          <p class="hint"></p>
          <div class="go" ref="logins" @click="go" >登&nbsp;录</div>
        </div>
        <div class="forgetPwd"><span @click="goRegister">注册</span><span @click="goFindPassword">忘记密码?</span></div>
        <div class="title-line" v-if="thirdLoginShow">
          <span></span>
          <span>其他登录方式</span>
          <span></span>
        </div>
        <div class="third-login" v-if="thirdLoginShow">
          <div class="weixin" @click="thirdLogin('weixin')" v-if="weixinLogin">微信</div>
          <div class="weibo" @click="thirdLogin('weibo')">微博</div>
          <!--<div class="qq" @click="thirdLogin('qq')">QQ</div>-->
        </div>
        <popUps ref="pop"></popUps>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import {mapState} from 'vuex';
  import popUps from '../../base/popUps/popUps.vue';


  let fromGamingUrl = window.location.search;

  const ERR_OK = 0;
  const ERR_DIF_EQUIPMENT = 401;//异端登录
  const ERR_DIF_REGIONS = 402;//异地登录
  const ERR_POP_UP = 270;//弹出验证码

  export default {
    data(){
      return {
        showPwd:false,//默认密码为密文
        Requres:{},
        user:{name:'',pwd:'',vcode:''},
        isGo:false,//登录可点击
        isVcode:false,
        gid:'',
        cid:'',
        url:'',
        out_id:'',
        weixinLogin:false,
        thirdLoginShow:true,
        showcodes:'',
        platformId:'31111',
        hor:false,//横屏
        horDispper:true,//横屏消失
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('login')!=-1){
          this.user={name:'',pwd:'',vcode:''};
          this.showPwd = false;
          this.isGo=false;
          this.loginyx();
          $('.user-pwd input').attr('type','text');
          $('.user-pwd input').attr('type','password');
          this.gid = this.Requres.gid||'';
          this.cid = sessionStorage.getItem("gameCid")||sessionStorage.getItem("registerCid")||'';
          this.url = this.Requres.url;
          this.out_id = this.Requres.out_id;
          if(this.cid=='H00006' || this.cid=='H00007'){
            //当渠道号为H00006，H00007时将第三方登陆方式隐藏（电竞需求）
            this.thirdLoginShow = false;
          }else {
            this.thirdLoginShow = true;
          }
          this.$nextTick(() => {
            this._dispper();
            let self = this;
            if($(window).width()>$(window).height()){
              self.hor = true;
              $('.login').removeClass('pay_vertical').addClass('pay_Horizen');
              self._dispper();
            }else{
              self.horDispper=true;
              $('.login').removeClass('pay_Horizen').addClass('pay_vertical');
              self._dispper();
            }
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(){
              if(window.orientation === 180|| window.orientation === 0){
//            alert("竖屏状态！")
                self.hor = false;
                $('.login').removeClass('pay_Horizen').addClass('pay_vertical');
                self.horDispper=true;
              }
              if(window.orientation === 90 || window.orientation === -90 ){
//            alert("横屏状态！")
                self.hor = true;
                $('.login').removeClass('pay_vertical').addClass('pay_Horizen');
                self.horDispper=true;
              }
            }, false);
          })
        }
      }
    },
    created(){
      this.Requres = new UrlSearch();
      this.gid = this.Requres.gid?this.Requres.gid:'';
      this.cid = sessionStorage.getItem("gameCid")||sessionStorage.getItem("registerCid")||'';
      this.url = this.Requres.url;
      this.out_id = this.Requres.out_id;
      let _this = this;

      window['AppSetPlatformId'] = function (platformId) {
        console.log("---"+"获取platformId："+platformId+"---");
        _this.platformId = platformId;
      };
      if(this.Requres.gid == this.GamingId && this.Requres.url){//配合注册用户使用
        sessionStorage.setItem("GamingIdUrl",this.Requres.url);//给注册的时候使用
      }
      if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
        this.weixinLogin = true;
      }
      if(this.cid=='H00006' || this.cid=='H00007'){
        //当渠道号为H00006，H00007时将第三方登陆方式隐藏（电竞需求）
        this.thirdLoginShow = false;
      }else {
        this.thirdLoginShow = true;
      }
      this.$nextTick(() => {
        this._dispper();
        let self = this;
        if($(window).width()>$(window).height()){
          self.hor = true;
          $('.login').removeClass('pay_vertical').addClass('pay_Horizen');
          self._dispper();
        }else{
          self.horDispper=true;
          $('.login').removeClass('pay_Horizen').addClass('pay_vertical');
          self._dispper();
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(){
          if(window.orientation === 180|| window.orientation === 0){
//            alert("竖屏状态！")
            self.hor = false;
            $('.login').removeClass('pay_Horizen').addClass('pay_vertical');
            self.horDispper=true;
          }
          if(window.orientation === 90 || window.orientation === -90 ){
//            alert("横屏状态！")
            self.hor = true;
            $('.login').removeClass('pay_vertical').addClass('pay_Horizen');
            self.horDispper=true;
          }
        }, false);
      })
    },
    mounted(){
      var u_agent =  navigator.userAgent;
      if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1||this.Requres.osType=='app'){//判断ios内嵌中调用获取登录参数
//        $('.forgetPwd').css({display:'none'});
        $('.close').css({display:'none'});
        this.GetPlatformId();
      }
    },
    methods:{
      loginyx() {
        let _this = this;
        if(!this.user.name || !this.user.pwd){
          _this.$refs.logins.style.background = '#99dcff'
        }else{
          _this.$refs.logins.style.background = '#00a8ff'
        }
      },
      close(){
          if(this.Requres.url){
            window.location.href = decodeURIComponent(this.Requres.url);
          }else if(this.Requres.rUrl){
            window.location.href = decodeURIComponent(this.Requres.rUrl);
          }else if(this.Requres.gid){
            window.location.href = this.Url+'/games/'+this.gid;
          }else if(this.$route.query.mine=1){
          this.$router.push({path:'mine'})
          }else {
            this.$router.back();
          }
      },
      enter(){
        this.go();
      },
      togglePwdShow(){
        if(!this.showPwd){
          $('.user-pwd input').attr('type','text');
        }else{
          $('.user-pwd input').attr('type','password');
        }
        this.showPwd = !this.showPwd;
      },
      getVcode(){
        this.showcodes = this.Url+'/api/captcah/getImgCode?d='+(new Date()).getTime().toString();
      },
      goRegister(){
        if(this.Requres.cid){
          sessionStorage.setItem("registerCid",this.Requres.cid);
        }
//        if(this.Requres.gid){
//          sessionStorage.setItem("registerGid",this.Requres.gid);
//        }
        this.$router.push({path:'/register'+fromGamingUrl});
      },
      goFindPassword(){
        this.$router.push({path:'/findPassword'+fromGamingUrl});
      },
      go(){
          if(this.user.name=='' && this.user.pwd=='') {
            this.$refs.pop.show('');
            return
          }
        if(this.user.name==''){
          this.isGo = false;
          this.$refs.pop.show('请输入账号');
          return;
        }
        if(this.user.pwd==''){
          this.isGo = false;
          this.$refs.pop.show('请输入密码');
          return;
        }
        //帐号限制为：6-18位的数字和字母组合
//        if(Number(this.user.name)&&this.user.name.length==11){
//          if(!(/^1(3|4|5|7|8)\d{9}$/.test((String(this.user.name))))){
//            this.$refs.pop.show('请输入正确的手机号码');
//            this.isGo = false;
//            return;
//          }
//        }
//        if(!(/^[a-zA-Z0-9]{6,18}$/.test(String(this.user.name)))){
//          this.isGo = false;
//          this.$refs.pop.show('帐号限制为：6-18位的数字和字母组合');
//          return;
//        }
        this.isGo = true;
        if(this.isVcode){
          if(!this.user.vcode){
            this.$refs.pop.show('请输入验证码');
            return;
          }else {
            let sessionid = $.fn.cookie("imagecodeseesionid");

            this.axios.get('/api/captcah/vilidataImagCode', {
              params: {
                captcha:this.user.vcode,
                sessionId:sessionid
              }
            }).then((res)=>{
              res = res.data;
              if(res.result==0){
                this.login();
              }else {
                this.$refs.pop.show('验证码错误');
                this.getVcode();
              }
            }).catch( (response) => {
              console.log(response);
            });
          }
        }else {
          this.login();
        }
      },
      login(){

        this.axios.get('/api/login/doLogin/V2', {
          params: {
            platformId:this.platformId,
            account:this.user.name,
            password:hex_md5(this.user.pwd).toUpperCase(),
            autologin:true,
            channelId:this.cid
          }
        }).then((res)=>{
          res = res.data;
          if(res.result===ERR_OK){
            console.log("---"+"登录准备前"+"-----")
            this.loginJump('ERR_OK',res);
          }else if(res.result===ERR_DIF_EQUIPMENT){
            if(res.result!=undefined) {
              this.$refs.pop.show(res.msg);
              setTimeout(()=>{
                console.log("---"+"异端登录准备前"+"-----")
                this.loginJump('ERR_DIF_EQUIPMENT',res);
              },2000);
            }

          }else if(res.result===ERR_DIF_REGIONS){
            this.$refs.pop.show(res.msg);
            setTimeout(()=>{
              console.log("---"+"异地登录准备前"+"-----")
              this.loginJump('ERR_DIF_REGIONS',res);
            },2000)
          } else if(res.result===ERR_POP_UP){
            this.isVcode = true;
            this.getVcode();
            this.$refs.pop.show(res.msg);
          } else {
            this.$refs.pop.show(res.msg);
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      loginJump(status,res){
        localStorage.setItem('token',res.token);
        var u_agent =  navigator.userAgent;
        if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断app内嵌中调用获取支付参数
//          console.log("---"+"登录成功"+"-----")
          this.DidLoginSuccess(res.token);
          window.location.href = this.Url+'/transferPage.html';
        }else if(this.Requres.url){
          if(decodeURIComponent(this.Requres.url).indexOf('?')==-1){
            window.location.href = decodeURIComponent(this.Requres.url)+"?token="+res.token;
          }else {
            window.location.href = decodeURIComponent(this.Requres.url)+"&token="+res.token;
          }
        }else if(this.gid && !this.cid){
            window.location.href = this.Url+'/games/'+this.gid;
        }else if(this.gid && this.cid) {
            window.location.href = this.Url+'/games/'+this.gid+'?cid='+ this.cid;
        } else {
          this.getUserInfo();
          this.userInfo.token = res.token;
          $('.login input').blur();
          this.$router.push({path:'/index'});
        }
      },
      thirdLogin(third){
        let sanfanurl= this.Url;
        let url;
        var u_agent =  navigator.userAgent;
        if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
          url = this.Url+'/transferPage.html';
        }else if(this.gid){
          if(this.Requres.url){
            url = this.Requres.url;
          }else {
            url = this.Url+'/games/'+this.gid;
          }
        }else {
          url=this.Url;
        }
        if(third === 'qq'){
          this.axios.get('/api/QQLogin/authorize', {
            params: {
              currentURL:decodeURIComponent(url)?decodeURIComponent(url):encodeURI(sanfanurl),
              channelId:this.cid
            }
          }).then((res)=>{
            res = res.data;
            window.location.href = res.authorizeURL;
          }).catch( (response) => {
            console.log(response);
          });
        }else if(third == 'weibo'){

          this.axios.get('/api/weiBoLogin/authorize', {
            params: {
              platformId:this.platformId,
              currentURL:decodeURIComponent(url)?decodeURIComponent(url):encodeURI(sanfanurl),
              channelId:this.cid
            }
          }).then((res)=>{
            res = res.data;
            window.location.href = res.authorizeURL;
          }).catch( (response) => {
            console.log(response);
          });

        }else if(third == 'weixin'){
          this.axios.get('/api/wxLogin/authorize', {
            params: {
              currentURL:decodeURIComponent(url),
              channelId:this.cid
            }
          }).then((res)=>{
            res = res.data;
            window.location.href = res.authorizeURL;
          }).catch( (response) => {
            console.log(response);
          });
        }
      },
      delName() {
        this.user.name = ""
      },
      delpwd() {
          this.user.pwd = ""
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
      GetPlatformId(){
        function appPlatformIdMessage(){
          var u_agent =  navigator.userAgent;
          if(u_agent.indexOf("native_iOS")>-1){
            window.webkit.messageHandlers.AppGetPlatformId.postMessage(null);
          }else if(u_agent.indexOf("native_Android")>-1){
            wyx.AppGetPlatformId();
          }
        }
        try{
          appPlatformIdMessage();
        }catch(err) {
          console.log('---AppGetPlatformId调用失败')
        }
      },
      DidLoginSuccess(res){
        function appDidLoginSuccessMessage(){
          var u_agent =  navigator.userAgent;
          if(u_agent.indexOf("native_iOS")>-1){
            window.webkit.messageHandlers.AppDidLoginSuccess.postMessage({token:res});
          }else if(u_agent.indexOf("native_Android")>-1){
            wyx.AppDidLoginSuccess(res);
          }
        }
        try{
          appDidLoginSuccessMessage();
        }catch(err) {
          console.log('---AppDidLoginSuccess调用失败 token：'+res)
        }
      }
    },
    computed:{
      ...mapState([
        'userInfo'
      ])
    },
    components:{
      popUps
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>
  .pay_vertical {
    min-height: 100%;
    width:100%;
    background:#fff;
    .close {
      position: absolute;
      right: 0.1rem;
      top:0.1rem;
      width: 0.3rem;
      height:0.3rem;
      background: url("./close.png") no-repeat center;
      -webkit-background-size:0.13rem 0.13rem;
      background-size:0.13rem;
    }
    .imgWrapper {
      width: 100%;
      height:0.66rem;
      padding: 0.75rem 0 0.4rem;
      text-align:center;
      img {
        display: block;
        margin: 0 auto;
        height: 0.66rem;
        width: 1.01rem;
      }
    }
    .content {
      padding: 0 0.38rem;
    }
    .form-content {

      .user-name,
      .user-pwd {
          display: block;
          display: flex;
          margin: 0.3rem auto;
          height: 0.4rem;
          line-height:0.4rem;
          width: 100%;
          font-size:0.14rem;
          span {
            display: block;
            width: 0.5rem;
            height:0.4rem;
          }
          input {
            display: block;
            flex:1;
          }
        }
      .user-name{
        i{
          display: block;
          width: 0.3rem;
          height:0.4rem;
          background: url("xx.png") no-repeat right;
        }
      }
      .user-pwd{
        position: relative;
        i{
          display: block;
          width:0.3rem;
          height:0.4rem;
          position: absolute;
          top:0;
          right:0.45rem;
          background: url("xx.png") no-repeat center;
        }
      }
        .user-pwd span:nth-child(2){
          display: block;
          width: 0.5rem;
          height: 0.4rem;
          background: url("./biyan.png") no-repeat center;
          -webkit-background-size:45%;
          background-size:35%;
        }
        .user-pwd span:nth-child(2).showPwd {
          background: url("./zhengyan.png") no-repeat center;
          -webkit-background-size:45%;
          background-size:45%;
        }
      .verification-code {
        margin: 0.3rem auto;
        height: 0.3rem;
        width: 100%;
        font-size: 0.14rem;
        line-height:0.3rem;
        text-align: left;
        display: block;
        div:nth-child(1) {
          height:0.3rem;
          width: 1.6rem;
          float: left;
          border:1px solid #A0A0A0;
          input {
            font-size: 0.12rem;
            padding-left: 0.1rem;
            width: 60%;
            color:#999999 ;
          }
        }
        div:nth-child(2) {
          height:0.32rem;
          width:0.84rem;
          float: left;
          margin-left: 0.1rem;
          text-align: center;
          color: #FFFFFF;
          background: deepskyblue;
          img {
            position: relative;
            display: block;
            height:0.32rem;
            width:100%;
          }
        }
      }
      .hint {
        display: none;
      }
    }
    .go{
      margin: 0.3rem auto 0.1rem;
      height: 0.4rem;
      line-height:0.4rem;
      font-size:0.15rem;
      border-radius: 0.5rem;
      text-align: center;
      width: 100%;
      color: #FFFFFF;
      background-color: deepskyblue;
      background-image: linear-gradient(to right,#00C6FF,#0072FF);
      background:-webkit-linear-gradient(to right,#00C6FF,#0072FF);
      background: -moz-linear-gradient(to right,#00C6FF,#0072FF);
      background: -o-linear-gradient(to right,#00C6FF,#0072FF);
    }
    .forgetPwd {
      padding-top: 0.1rem;
      color:#0072FF;
      overflow:hidden;
      span:nth-child(1){
        display: block;
        float: left;
      }
      span:last-child {
        display: block;
        float: right;
      }
    }
    .title-line {
      display: block;
      width: 80%;
      margin: 0 auto;
      display: flex;
      color: #888;
      padding:0.5rem 0 0.27rem;
      span {
        display: block;
        text-align: center;
        flex:1;
      }
      span:nth-child(1),
      span:nth-child(3) {
        display: block;
        /*margin-top: 0.05rem;*/
        /*border-top: 1px solid #000;*/
      }
    }
    .third-login {
      display: block;
      display: flex;
      height:0.8rem;
      overflow: hidden;
      line-height:1.1rem;
      font-size: 0.12rem;
      width: 100%;
      text-align: center;
      color: #888;
      margin-top:0.15rem;
      div {
        display: block;
        flex:1;
      }
      .weixin {
        background: url("./weix.png") no-repeat top center;
        -webkit-background-size: 0.5rem;
        background-size: 0.4rem;
      }
      .weibo {
        background: url("./lgwb.png") no-repeat top center;
        -webkit-background-size: 0.5rem;
        background-size: 0.4rem;
      }
      .qq {
        background: url("./lgqq.png") no-repeat top center;
        -webkit-background-size: 0.5rem;
        background-size: 0.4rem;
      }
    }
  }
  .pay_Horizen{
    min-height: 100%;
    width:100%;
    background:#fff;
    .close {
      width: 0.08rem;
      height:0.08rem;
      background: url("./close.png") no-repeat center;
      -webkit-background-size:0.1rem 0.1rem;
      background-size:0.13rem;
      margin-left:95%;
      margin-top:0.1rem;
    }
    .imgWrapper {
      width: 100%;
      height:0.46rem;
      padding: 0.1rem 0 0.08rem;
      text-align:center;
      img {
        display: block;
        margin: 0 auto;
        height: 0.56rem;
        width: 0.8rem;
      }
    }
    .content {
      padding: 0 0.38rem;
    }
    .form-content {

      .user-name,
      .user-pwd {
        display: block;
        display: flex;
        margin: 0.1rem auto;
        height: 0.25rem;
        line-height:0.25rem;
        width: 100%;
        font-size:0.1rem;
        span {
          display: block;
          width: 0.5rem;
          height:0.4rem;
        }
        input {
          display: block;
          flex:1;
          padding-left:0.1rem;
        }
      }
      .user-name{
        i{
          display: block;
          width: 0.2rem;
          height:0.3rem;
          background: url("xx.png") no-repeat right;
        }
      }
      .user-pwd{
        position: relative;
        i{
          display: block;
          width:0.2rem;
          height:0.3rem;
          position: absolute;
          top:0;
          right:0.45rem;
          background: url("xx.png") no-repeat center;
        }
      }
      .user-pwd span:nth-child(2){
        display: block;
        width: 0.3rem;
        height: 0.2rem;
        background: url("./biyan.png") no-repeat center;
        -webkit-background-size:45%;
        background-size:35%;
      }
      .user-pwd span:nth-child(2).showPwd {
        background: url("./zhengyan.png") no-repeat center;
        -webkit-background-size:45%;
        background-size:45%;
      }
      .verification-code {
        margin: 0.3rem auto;
        height: 0.3rem;
        width: 100%;
        font-size: 0.14rem;
        line-height:0.3rem;
        text-align: left;
        display: block;
        div:nth-child(1) {
          height:0.3rem;
          width: 1.6rem;
          float: left;
          border:1px solid #A0A0A0;
          input {
            font-size: 0.12rem;
            padding-left: 0.1rem;
            width: 60%;
            color:#999999 ;
          }
        }
        div:nth-child(2) {
          height:0.32rem;
          width:0.84rem;
          float: left;
          margin-left: 0.1rem;
          text-align: center;
          color: #FFFFFF;
          background: deepskyblue;
          img {
            position: relative;
            display: block;
            height:0.32rem;
            width:100%;
          }
        }
      }
      .hint {
        display: none;
      }
    }
    .go{
      margin: 0.2rem auto 0.1rem;
      height: 0.3rem;
      line-height:0.3rem;
      font-size:0.1rem;
      border-radius: 0.5rem;
      text-align: center;
      width: 100%;
      color: #FFFFFF;
      background-color: deepskyblue;
      background-image: linear-gradient(to right,#00C6FF,#0072FF);
      background:-webkit-linear-gradient(to right,#00C6FF,#0072FF);
      background: -moz-linear-gradient(to right,#00C6FF,#0072FF);
      background: -o-linear-gradient(to right,#00C6FF,#0072FF);
    }
    .forgetPwd {
      padding-top: 0.04rem;
      color:#0072FF;
      overflow:hidden;
      font-size:0.09rem;
      span:nth-child(1){
        display: block;
        float: left;
      }
      span:last-child {
        display: block;
        float: right;
      }
    }
    .title-line {
      display: block;
      width: 80%;
      margin: 0 auto;
      display: flex;
      color: #888;
      padding:0.2rem 0 0.08rem;
      font-size:0.09rem;
      span {
        display: block;
        text-align: center;
        flex:1;
      }
      span:nth-child(1),
      span:nth-child(3) {
        display: block;
        /*margin-top: 0.05rem;*/
        /*border-top: 1px solid #000;*/
      }
    }
    .third-login {
      display: block;
      display: flex;
      height:0.8rem;
      overflow: hidden;
      line-height:0.8rem;
      font-size: 0.09rem;
      width: 100%;
      text-align: center;
      color: #888;
      margin-top:0.15rem;
      div {
        display: block;
        flex:1;
      }
      .weixin {
        background: url("./weix.png") no-repeat top center;
        -webkit-background-size: 0.5rem;
        background-size: 0.4rem;
      }
      .weibo {
        background: url("./lgwb.png") no-repeat top center;
        -webkit-background-size: 0.25rem;
        background-size: 0.25rem;
      }
      .qq {
        background: url("./lgqq.png") no-repeat top center;
        -webkit-background-size: 0.5rem;
        background-size: 0.4rem;
      }
    }
  }





</style>
