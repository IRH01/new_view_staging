<template>
    <div class="findPassword">
      <vtitle title="找回密码" @RUrl="back" :isRUl="true" :isFixed="false">
        <router-link tag="span" to="/about" style="float: right;padding-right: 0.1rem;font-size: 0.15rem;">联系客服</router-link>
      </vtitle>
      <div class="findPassword-content">
        <ul>
          <li class="borderBottom-1px"><input type="text" placeholder="输入手机号码" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  v-model="phone" maxlength="11" ></li>
          <li class="borderBottom-1px">
            <input type="text" placeholder="输入验证号码" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  maxlength="6" v-model="vCode" >
            <span @click="_getCode" class="getCode">{{countDown}}</span>
          </li>
        </ul>
        <popUps ref="pop"></popUps>
        <div class="go-wapper">
          <div class="go" @click="_goFind">提交</div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';

  let fromGamingUrl = window.location.search;

  export default {
    data(){
      return {
        phone:'',
        vCode:'',
        isClickGetCode:false,
        countDown:'获取验证码',
        startCountDown:false,
        time:60,//倒计时时间
        timerId:null//定时器
      }
    },
    watch:{
      $route(){
        if(this.$route.path.indexOf('findPassword')!=-1){
          this.phone='';
          this.vCode='';
          this.isClickGetCode=false;
          this.countDown='获取验证码';
          this.startCountDown=false;
          this.time=60;
          clearInterval(this.timerId);
          $('.getCode').removeClass('countDown');
        }
      }
    },
    methods:{
      back(){
        this.$router.back();
      },
      _getCode(){
        this.isClickGetCode = true;
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phone))){
          this.$refs.pop.show('请输入正确的手机号码');
          return;
        }
        if(this.startCountDown){
          return;
        }

        this.axios.get('/api/register/findAccountName', {
          params: {
            account:this.phone,
            type:6
          }
        }).then((res)=>{
          res = res.data;
          if(res.result === 16){//用户名已存在
            if(!this.startCountDown){
              this.startCountDown = true;
              $('.getCode').addClass('countDown');

              this.axios.get('/api/register/sendPhoneCode', {
                params: {
                  operateType:4,
                  account:this.phone,
                  platformId:4
                }
              }).then((res)=>{}).catch( (response) => {
                console.log(response);
              });
              this.countDown = this.time + 's重发';
              this.timerId = window.setInterval(()=>{
                this.time = this.time-1;
                this.countDown = this.time + 's重发';
                if(this.time === 0){
                  clearInterval(this.timerId);
                  this.startCountDown = false;
                  this.countDown="获取验证码";
                  this.time = 60;
                  $('.getCode').removeClass('countDown');
                }
              },1000);
            }

          }else if(res.result === 0){
            this.$refs.pop.show('账户不存在');
          }else {
            this.$refs.pop.show(res.msg);
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      _goFind(){
        if(!this.phone){
          this.$refs.pop.show('请输入手机号码');
          return;
        }
        if(!this.vCode) {
          this.$refs.pop.show('请输入验证码');
          return;
        }
        if(!this.isClickGetCode){
          this.$refs.pop.show('请点击获取验证码');
          return;
        }

        this.axios.get('/api/register/valiSmsCode', {
          params: {
            operateType:4,
            account:this.phone,
            platformId:4,
            smsCode:this.vCode,
            type:5
          }
        }).then((res)=>{
          res = res.data;
          if(res.result===0){
            clearInterval(this.timerId);
            this.$router.push({path:'/setpassword'+fromGamingUrl});
            sessionStorage.setItem('sessionId',res.data.sessionId);
          }else if(res.result===6){
            this.$refs.pop.show('验证码错误');
          }else {
            this.$refs.pop.show(res.msg);
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
    },
    components:{
      Vtitle,
      popUps
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>

  .findPassword {
    height:100%;
    width: 100%;
    background: #fff;
    .findPassword-content {
      ul {
        background: #FFFFFF;
        padding-left:0.14rem;
        li {
          height:0.5rem;
          line-height:0.5rem;
          font-size: 0.11rem;
          display: block;
        }
        li:nth-child(2){
          height: 0.5rem;
          display: flex;
          overflow:hidden;
          input {
            height:0.2rem;
            padding: 0.15rem 0;
            display: block;
            flex:1;
            color: #161616;
          }
          span {
            display: block;
            height:0.11rem;
            line-height:0.11rem;
            padding:0.08rem 0.23rem;
            border: 1px solid #FF7E37;
            background: #FF7E37;
            border-radius:0.2rem;
            margin-right: 0.15rem;
            margin-top: 0.1rem;
            color: #fff;
          }
          span.countDown {
            background: #fff;
            color: #FF7E37;
          }
        }
      }
      .go-wapper {
        padding: 0.25rem 0.38rem;
        .go {
          height:0.4rem;
          line-height:0.4rem;
          background: #00A8FF;
          font-size: 0.15rem;
          color: #FFFFFF;
          border-radius: 0.23rem;
          text-align: center;
        }
      }
    }
  }

</style>
