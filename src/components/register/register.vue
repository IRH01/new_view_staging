<template>
  <div class="register">
    <vtitle title="注册" @RUrl="back" :isRUl="true" :isFixed="false">
      <span @click="goLogin">登录</span>
    </vtitle>
    <div class="content">
      <div class="form-content">
        <div class="user-name borderBottom-1px">
          <input type="text" autofocus="autofocus" @keydown="but" v-model="user.name" placeholder="请输入账号，6-18位字母和数字"
                 onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" maxlength="25">
          <i @click="delxx" v-show="this.user.name"></i>
        </div>
        <div class="user-pwd borderBottom-1px">
          <input @keydown="but" type="password" maxlength="25" placeholder="请输入密码，6-18位字符" v-model="user.pwd"
                 onpaste="return false" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')">
          <span :class="{'showPwd':showPwd1}" @click="togglePwdShow(1)"></span>
        </div>
        <div class="user-pwd-comfirm borderBottom-1px">
          <input @keydown="but" type="password" maxlength="25" placeholder="请确认密码" v-model="user.pwdVCom"
                 onpaste="return false" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')">
          <span :class="{'showPwd':showPwd2}" @click="togglePwdShow(2)"></span>
        </div>
        <popUps ref="pop"></popUps>
        <div class="goRegister" ref="goReg" @click="goRegister">注&nbsp;册</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';

  let fromGamingUrl = window.location.search;

  export default {
    data() {
      return {
        user: {name: '', pwd: '', pwdVCom: ''},
        showPwd1: false,
        showPwd2: false,
        platformId: 4,
        xxshow: false
      }
    },
    watch: {
      $route(newVal) {
        this.showPwd1 = false;
        this.showPwd2 = false;
        if (newVal.path.indexOf('register') != -1) {
          this.statisticsPageTraffic('2', this.userInfo.userId ? this.userInfo.userId : '', window.location.href);
          this.user = {name: '', pwd: '', pwdVCom: ''};
          this.showPwd1 = false;
          this.showPwd2 = false;
          $('.user-pwd-comfirm input').attr('type', 'password');
          $('.user-pwd input').attr('type', 'password');
          this.platformId = 4;
          let Requres = new UrlSearch();
          if (Requres.gid) {
            this.platformId = Requres.gid;
          }
//          if(sessionStorage.getItem("registerGid")){
//            this.platformId=sessionStorage.getItem("registerGid");
//          }
        }
      }
    },
    created() {
      this.statisticsPageTraffic('2', this.userInfo.userId ? this.userInfo.userId : '', window.location.href);
      this.$nextTick(function () {
        let Requres = new UrlSearch();

        if (Requres.cid) {
          sessionStorage.setItem("registerCid", Requres.cid);
        }
        this.platformId = 4;
        if (Requres.gid) {
          this.platformId = Requres.gid;
        }
//        if(Requres.gid){
//          sessionStorage.setItem("registerGid",Requres.gid);
//        }else {
//          sessionStorage.removeItem("registerGid");
//        }
      });
    },
    methods: {
      back() {
        let Requres = new UrlSearch();
        if (Requres.url) {
          window.location.href = decodeURIComponent(Requres.url);
        } else {
          window.history.back();
        }
      },
      goLogin() {
        this.$router.push({path: `login${fromGamingUrl}`});
      },
      togglePwdShow(num) {
        if (num == 1) {
          if (!this.showPwd1) {
            $('.user-pwd input').attr('type', 'text');

          } else {
            $('.user-pwd input').attr('type', 'password');
          }
          this.showPwd1 = !this.showPwd1;
        } else {
          if (!this.showPwd2) {
            $('.user-pwd-comfirm input').attr('type', 'text');
          } else {
            $('.user-pwd-comfirm input').attr('type', 'password');
          }
          this.showPwd2 = !this.showPwd2;
        }
      },
      but() {
        let _this = this;
        if (!this.user.name || !this.user.pwd || !this.user.pwdVCom) {
          _this.$refs.goReg.style.background = '#99dcff'
        } else {
          _this.$refs.goReg.style.background = "deepskyblue";
          _this.$refs.goReg.style.background = "linear-gradient(to right,#00C6FF,#0072FF)";
        }
      },
      goRegister() {
        if (!this.user.name && !this.user.pwd && !this.user.pwdVCom) {
          this.$refs.pop.show('');
          return;
        }
        if (!this.user.name) {
          this.$refs.pop.show('请输入账号');
          return;
        }
        if (!this.user.pwd) {
          this.$refs.pop.show('请输入密码');
          return;
        }
        if (!this.user.pwdVCom) {
          this.$refs.pop.show('请再次输入密码');
          return;
        }
        //帐号限制为：6-18位的数字和字母组合
        if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(String(this.user.name)))) {
          this.$refs.pop.show('帐号不符合要求，请重新输入');
          return;
        }
        if (!(/^[a-zA-Z0-9]{6,18}$/.test(String(this.user.pwd)))) {
          this.$refs.pop.show('密码不符合要求，请重新输入');
          return;
        }
        if (this.user.pwd !== this.user.pwdVCom) {
          this.$refs.pop.show('确认密码错误，请重新输入');
          return;
        }

        this.axios.get('/api/register/doRegister', {
          params: {
            account: this.user.name,
            password: hex_md5(this.user.pwd).toUpperCase(),
            platformId: this.platformId, type: 1,
            channelId: (sessionStorage.getItem("gameCid") ? sessionStorage.getItem("gameCid") : this.platformId) ? sessionStorage.getItem("gameCid") ? sessionStorage.getItem("gameCid") : this.platformId : ''
          }
        }).then((res) => {
          res = res.data;
          if (res.result == 0) {
            setTimeout(() => {

              this.axios.get('/api/login/doLogin/V2', {
                params: {
                  platformId: '31111',
                  account: this.user.name,
                  password: hex_md5(this.user.pwd).toUpperCase(),
                  autologin: true,
                  channelId: (sessionStorage.getItem("gameCid") ? sessionStorage.getItem("gameCid") : sessionStorage.getItem("registerCid")) ? sessionStorage.getItem("gameCid") ? sessionStorage.getItem("gameCid") : sessionStorage.getItem("registerCid") : ''
                }
              }).then((response) => {
                response = response.data;
                if (response.result == 0) {
                  localStorage.setItem('token', response.token);
                  this.getUserInfo();
                  let Requres = new UrlSearch();
                  if (Requres.url) {
                    if (decodeURIComponent(Requres.url).indexOf("?") != -1) {
                      top.location.href = decodeURIComponent(Requres.url) + "&token=" + response.token;
                    } else {
                      top.location.href = decodeURIComponent(Requres.url) + "?token=" + response.token;
                    }
                  } else if (sessionStorage.getItem("GamingIdUrl")) {
                    if (decodeURIComponent(sessionStorage.getItem("GamingIdUrl")).indexOf("?") != -1) {
                      top.location.href = decodeURIComponent(sessionStorage.getItem("GamingIdUrl")) + "&token=" + response.token;
                    } else {
                      top.location.href = decodeURIComponent(sessionStorage.getItem("GamingIdUrl")) + "?token=" + response.token;
                    }
                    setTimeout(() => {
                      sessionStorage.removeItem("GamingIdUrl")
                    }, 200)
                  } else if (!Requres.cid && Requres.gid) {
                    window.location.href = this.Url + '/games/' + Requres.gid + "?token=" + response.token;
                  } else if (Requres.cid && Requres.gid) {
                    window.location.href = this.Url + '/games/' + Requres.gid + "?token=" + response.token + '&cid=' + Requres.cid;
                  } else {
                    top.location.href = this.Url + '\\mine';
                  }
                }
              }).catch((response) => {
                console.log(response);
              });
            }, 200);
          } else {
            this.$refs.pop.show(res.msg);
          }
        }).catch((response) => {
          console.log(response);
        });
      },
      delxx() {
        this.user.name = ""
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    components: {
      Vtitle,
      popUps
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>
  .register {
    height: 100%;
    background-color: #FFFFFF;
    .title .title-r span {
      font-size: 0.15rem;
      float: right;
      padding-right: 0.1rem;
    }
    .content {
      padding: 0 0.25rem;
    }
    .form-content {
      .user-name,
      .user-pwd,
      .user-pwd-comfirm {
        display: block;
        display: flex;
        margin: 0.3rem auto;
        height: 0.4rem;
        line-height: 0.4rem;
        width: 100%;
        font-size: 0.14rem;
        input {
          background-color: #FFFFFF;
          display: block;
          flex: 1;
          padding-left: 0.15rem;
        }
        span {
          display: block;
          height: 0.4rem;
          width: 0.4rem;
          background: url("./biyan.png") no-repeat center;
          -webkit-background-size: 40%;
          background-size: 40%;
        }
        i {
          display: block;
          width: 0.3rem;
          height: 0.4rem;
          background: url("./xx.png") no-repeat right;
        }
      }
      .user-pwd span.showPwd,
      .user-pwd-comfirm span.showPwd {
        background: url("./zhengyan.png") no-repeat center;
        -webkit-background-size: 40%;
        background-size: 40%;
      }
      .hint {
        display: none;
      }
    }
    .goRegister {
      margin: 0.3rem auto;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.15rem;
      border-radius: 0.3rem;
      text-align: center;
      width: 100%;
      color: #FFFFFF;
      background-color: deepskyblue;
      background-image: linear-gradient(to right, #00C6FF, #0072FF);
      background: -webkit-linear-gradient(to right, #00C6FF, #0072FF);
      background: -moz-linear-gradient(to right, #00C6FF, #0072FF);
      background: -o-linear-gradient(to right, #00C6FF, #0072FF);
    }
  }
</style>
