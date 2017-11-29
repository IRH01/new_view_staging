<template>
  <div class="boundphone">
    <vtitle @RUrl="back" :isRUl="true" title="绑定手机" :isShow="notApp" :isFixed="false"></vtitle>
    <div class="boundMin">
      <div class="boundsj">
        <input type="text" v-model="phone" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  placeholder="输入手机号码">
      </div>
      <div class="boundCode">
        <input type="text" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  v-model="code" placeholder="输入验证码">
        <span ref="countdown" @click="gainCode">{{countDown}}</span>
      </div>
      <button class="boundBut" @click="bound" ref="boundbut">绑&nbsp;定</button>
    </div>
    <popUps ref="pop"></popUps>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';
  let timer
  export default{
    data() {
      return {
        notApp: true,
        phone: "",   //手机号
        code: "",    //验证码
        hint: "",    //错误提示信息
        countDown: "获取验证码",
        timeNow: true
//              popUp:false
      }
    },
    watch: {
      '$route': function () {
        if (this.$route.path.indexOf('/boundphone') != -1) {
          this.notApp = true;
          this.countDown = "获取验证码";
          this.$refs.countdown.style.background = "#ff7e37"
          this.$refs.countdown.style.color = "#fff"
          this.$refs.boundbut.style.background = "#99dcff"
          this.timeNow = true;
          clearInterval(timer);
          this.phone = "";
          this.code = "";
          let Requres = new UrlSearch();
          if (Requres.osType == 'app') {
            this.notApp = false;
          }
        }
      }
    },
    created(){
      let Requres = new UrlSearch();
      if (Requres.osType == 'app') {
        this.notApp = false;
      }
    },
    methods: {
      back() {
        let Requres = new UrlSearch();
        if (Requres.url && Requres.gid) {
          window.location.href = decodeURIComponent(Requres.url);
        } else {
          this.$router.push('/set');
        }
      },
      gainCode() {
        var val = $('.boundsj input').val()
        let _this = this
        if (_this.phone.trim() == "") {
          _this.$refs.pop.show('请输入手机号码');
          return
        } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(val))) {
          _this.$refs.pop.show('请输入正确的手机号');
          return
        } else {
          if (this.timeNow) {
            this.axios.get('api/userUtil/isBand', {
              params: {
                country: 0,
                platformTerminal: 4,
                account: this.phone
              }
            }).then((res)=> {
              res = res.data;
              if (res.result == 0) {
                _this.$refs.pop.show('该手机号已被绑定');
                return
              } else if (res.result == 13) {
                this.hint = "";
                this.axios.get('api/register/sendPhoneCode', {
                  params: {
                    country: 0,
                    platformTerminal: 4,
                    operateType: 2,
                    account: this.phone,
                    platformId: 4
                  }
                }).then((res)=>{
                  res = res.data;
                  if (res.result == 0) {
//                                this.codeHint = "验证码发送成功"
                    this.countDown = 60 + 's后重发';
                    this.$refs.countdown.style.border = "1px solid #ff7e37"
                    this.$refs.countdown.style.background = "none"
                    this.$refs.countdown.style.color = "#ff7e37"
                    this.$refs.boundbut.style.background = "#00a8ff"
                    let _this = this;
                    this.timeNow = false;
                    timer = window.setInterval(function () {
                      _this.countDown = (parseInt(_this.countDown) - 1) + 's后重发';
                      if (parseInt(_this.countDown) == 0) {
                        clearInterval(timer);
                        _this.timeNow = true;
                        _this.countDown = "获取验证码";
                        _this.$refs.countdown.style.background = "#ff7e37"
                        _this.$refs.countdown.style.color = "#fff"
                        _this.$refs.boundbut.style.background = "#99dcff"
                      }
                    }, 1000);
                  } else {
                    this.code = res.result.msg
                  }
                }).catch( (response) => {
                  console.log(response);
                });
              }
            }).catch((response) => {
              console.log(response);
            });
          }
        }
      },
      bound() {
        let _this = this
        if (this.countDown == "获取验证码") {
          _this.$refs.pop.show('请获取验证码');
        } else if (this.code.trim() == "") {
          _this.$refs.pop.show('请输入验证码');
          return
        } else {

          this.axios.get('api/register/valiSmsCode', {
            params: {
              country: 0,
              platformTerminal: 4,
              account: this.phone,
              smsCode: this.code,
              type: 5,
              platformId: 4,
              operateType: 2
            }
          }).then((res)=>{
            res = res.data;
            if (res.result == 0) {

              this.axios.get('api/user/phoneBind', {
                params: {
                  country: 0,
                  platformTerminal: 4,
                  phone: this.phone,
                  userId: this.$store.state.userInfo.userId,
                  phoneCode: this.code,
                  platformId: 4
                }
              }).then((res)=>{
                res = res.data;
                if (res.result == 0) {
                  this.$store.state.userInfo.phone = this.phone;
                  let Requres = new UrlSearch();
                  if (Requres.url && Requres.gid) {
                    window.location.href = decodeURIComponent(Requres.url);
                  } else {
                    this.$router.push('/set');
                  }
                }
              }).catch( (response) => {
                console.log(response);
              });
            } else {
              this.$refs.pop.show('验证码输入错误');
              return
            }
          }).catch( (response) => {
            console.log(response);
          });
        }
      }
    },
    components: {
      Vtitle,
      popUps
    },
    computed: {
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/style/variable.less";

  .boundphone {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background: #f5f5f5;

  .boundMin {
    width: 100%;
    margin: 0 auto;

  .boundsj {
    width: 100%;
    height: 0.5rem;
    border-bottom: 1px solid #e9e9e9;
    border-radius: 0.05rem;
    background: #fff;

  input {
    width: 90%;
    padding-left: 0.2rem;
    font-size: 0.14rem;
    line-height: 0.3rem;
    margin: 0.1rem auto;
  }

  }
  .hintphone {
    text-align: center;
    color: red;
    padding-top: 0.1rem;
    background: #fff;

  }

  .boundCode {
    width: 100%;
    height: 0.5rem;
    background: #fff;

  input {
    width: 60%;
    height: 0.3rem;
    font-size: 0.14rem;
    padding-left: 0.2rem;
    border-radius: 0.05rem;
    margin: 0.1rem 0;
  }

  span {
    width: 28%;
    float: right;
    height: 0.28rem;
    background: #ff7e37;
    color: #fff;
    text-align: center;
    line-height: 0.29rem;
    border-radius: 0.5rem;
    margin: 0.11rem 0.15rem 0 0;
  }

  }
  .codeHint {
    text-align: center;
    padding-top: 0.1rem;
    color: red;
  }

  .boundBut {
    width: 86%;
    height: 0.4rem;
    background: #99dcff;
    text-align: center;
    line-height: 0.4rem;
    color: #fff;
    border-radius: 0.5rem;
    margin: 0.2rem 7% 0;
    font-size: 0.15rem;
    font-weight: 100;
  }

  }
  .popUp {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 10px;
    color: #fff;
    z-index: 20;
    height: .64rem;
    line-height: .64rem;
    width: 40%;
    font-size: .16rem;
    text-align: center;
    padding: 0 .1rem;
    background: rgba(0, 0, 0, 0.5);
  }

  }


</style>
