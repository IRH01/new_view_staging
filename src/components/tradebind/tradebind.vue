<template>
  <div class="tradebind">
    <vtitle @RUrl="back" :isRUl="true" title="换绑手机"></vtitle>
    <div class="boundMin">
      <div class="boundphone">
        绑定手机号码：{{phonenum}}
      </div>
      <div class="boundCode">
        <input type="text" v-model="code" placeholder="输入验证码" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  @focus="codefoucs">
        <span ref="countdown" @click="hqcode">{{countDown}}</span>
      </div>
      <button ref="boundbut" class="boundBut" @click="boundsj">绑&nbsp;定</button>
    </div>
    <popUps ref="pop"></popUps>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';
  import popUps from '../../base/popUps/popUps.vue';
  let timer;
  export default{
    data() {
      return {
        phonenum: "",
        code: "",
        codehint: "",
        countDown: "获取验证码",
        timeNow: true,
//              popUp:false
      }
    },
    watch: {
      '$route': function () {
        if (this.$route.path.indexOf('/tradebind') != -1) {
          this.countDown = "获取验证码";
          this.$refs.countdown.style.background = "#ff7e37"
          this.$refs.countdown.style.color = "#fff"
          this.$refs.boundbut.style.background = "#99dcff"
          this.timeNow = true;
          setTimeout(()=> {
            this.phonenums()
          }, 200)
          clearInterval(timer);
          this.code = ""
        }
      }
    },
    created() {

    },
    mounted(){
      setTimeout(()=> {
        this.phonenums()
      }, 200)
    },
    methods: {
      back() {
        window.history.back()
      },
      phonenums() {
        this.phonenum = this.$store.state.userInfo.phone
        var phonenum = this.phonenum + ""
        var phoneNum = phonenum.substr(0, 3) + "****" + phonenum.substr(-4, 4)
        this.phonenum = phoneNum
      },
      hqcode() {
        if (this.timeNow) {
          this.axios.get('api/register/sendPhoneCode', {
            params: {
              country: 0,
              platformTerminal: 4,
              operateType: 2,
              account: this.$store.state.userInfo.phone,
              platformId: 4
            }
          }).then((res)=> {
            res = res.data;
            if (res.result == 0) {
              console.log(res)
              this.countDown = parseInt(60) + 's后重发';
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
              this.codehint = res.result.msg
            }
          }).catch((response) => {
            console.log(response);
          });
        }
      },
      boundsj() {
        let _this = this
        if (_this.countDown == "获取验证码") {
          _this.$refs.pop.show('请获取验证码');
          return
        } else if (this.code.trim() == "") {
          _this.$refs.pop.show('请输入验证码');
          return;
        } else {
          this.axios.get('api/register/valiSmsCode', {
            params: {
              account: this.$store.state.userInfo.phone,
              platformId: 4,
              smsCode: this.code,
              type: 5,
              platformId: 4,
              operateType: 2
            }
          }).then((res)=>{
            res = res.data;
            if (res.result == 0) {
              this.$router.push('/boundphone')
            } else {
              this.$refs.pop.show('验证码输入错误');
            }
          }).catch( (response) => {
            console.log(response);
          });
        }
      },
      codefoucs() {
        this.codehint = ""
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

  .tradebind {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f5f7f8;

  .boundphone {
    font-size: 0.14rem;
    color: #1c1c1c;
    border-bottom: 1px solid #e5e5e5;
    line-height: 0.5rem;
    padding: 0 0.2rem;
    background: #fff;
  }

  .boundMin {
    width: 100%;
    margin: 0.44rem auto 0;

  .boundsj {
    width: 100%;
    height: 0.42rem;
    border: 1px solid #f5f5f5;
    border-radius: 0.05rem;

  input {
    width: 90%;
    padding-left: 0.1rem;
    font-size: 0.14rem;
    line-height: 0.42rem;
  }

  }
  .hintphone {
    text-align: center;
    color: red;
    padding-top: 0.1rem;

  }

  .boundCode {
    width: 100%;
    height: 0.5rem;
    background: #fff;

  input {
    width: 60%;
    height: 100%;
    font-size: 0.14rem;
    padding-left: 0.2rem;
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
  .tradecode {
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
