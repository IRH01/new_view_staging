<template>
    <div class="payBankSMSfill">
      <vtitle title="手机短信验证" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp"></vtitle>
      <div class="payBankSMSfill-content" v-if="!payLoading">
        <ul>
          <li class="borderBottom-1px">
            请输入
            <span>{{phone}}</span>
            收到的短信验证码
          </li>
          <li>
            <input type="text" placeholder="输入验证号码" maxlength="8" v-model="vCode" onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" >
            <span @click="_getCode" class="getCode">{{countDown}}</span>
          </li>
        </ul>
        <popUps ref="pop"></popUps>
        <div class="go-wapper">
          <div class="go" @click="_go">确认支付</div>
        </div>
      </div>
      <div class="pay-loading" v-if="payLoading">
        <div>
          {{paytime}}秒
          <span></span>
        </div>
        <div>正在充值...等待结果返回</div>
        <div>温馨提示:结果返回前，请不要操作本页面</div>
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
        Requres:{},
        notApp:true,
        vCode:'',
        phone:'',
        isClickGetCode:false,
        countDown:'获取验证码',
        startCountDown:false,
        time:60,//倒计时时间
        timerId:null,//定时器
        paytimer:null,
        payLoading:false,
        paytime:10,
        i:0//聚合支付第一次不需要调接口
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('payBankSMSfill')!=-1){
          clearInterval(this.timerId);
          clearInterval(this.paytimer);
          this.Requres={};
          this.notApp=true;
          this.vCode='';
          this.countDown='获取验证码';
          this.startCountDown=false;
          this.time=60;//倒计时时间
          this.timerId=null;//定时器
          this.paytimer=null;//定时器
          this.payLoading=false;
          this.paytime=10;
          this.i=0;
          $('.getCode').removeClass('countDown');
          this.init();
          this._getCode();
        }
      }
    },
    created(){
//      debugger
      this.init();
      if(sessionStorage.getItem('bankPayData')&&JSON.parse(sessionStorage.getItem('bankPayData')).isBankJhPayWay&&this.i<1) {
        this._getCode();
      }

    },
    methods:{
      back(){
        this.$router.back();
      },
      init(){
//        console.log(JSON.parse(sessionStorage.getItem('bankPayData')))
        this.Requres = new UrlSearch();
        var u_agent =  navigator.userAgent;
        if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
          this.notApp = false;
        }else {
          this.notApp = true;
        }

        this.phone=(String(JSON.parse(sessionStorage.getItem('bankPayData')).phone)).substring(0,3)+"****"+(String(JSON.parse(sessionStorage.getItem('bankPayData')).phone)).substring(7,11);
      },
      _getCode(){
        this.isClickGetCode = true;
        if(this.startCountDown){
          return;
        }
        if(!this.startCountDown){
          this.startCountDown = true;
          $('.getCode').addClass('countDown');

          if(sessionStorage.getItem('bankPayData')&&JSON.parse(sessionStorage.getItem('bankPayData')).isBankJhPayWay&&this.i>0){
            let bankPayData = JSON.parse(sessionStorage.getItem('bankPayData'));
            bankPayData.businessNo = this.businessNo;
            bankPayData.transId = this.transId;
            sessionStorage.setItem('bankPayData',JSON.stringify(bankPayData));

            this.axios.get('/api/jhPay/quickPayApply', {
              params: {
                country:0,
                platformTerminal:4,
                totalFee:JSON.parse(sessionStorage.getItem('bankPayData')).payMomey,
                accNo:JSON.parse(sessionStorage.getItem('bankPayData')).banknum,
                bankCode:JSON.parse(sessionStorage.getItem('bankPayData')).bankCode,
                customerNm:JSON.parse(sessionStorage.getItem('bankPayData')).customerNm,
                certifTp:'01',
                certify_id:JSON.parse(sessionStorage.getItem('bankPayData')).certify_id,
                phoneNo:JSON.parse(sessionStorage.getItem('bankPayData')).phone,
                dcType:String(Number(JSON.parse(sessionStorage.getItem('bankPayData')).type)-1)
              }
            }).then((res)=>{
              res = res.data;
              if(res.result==0){
                let bankPayData = JSON.parse(sessionStorage.getItem('bankPayData'));
                bankPayData.businessNo = res.data.businessNo;
                bankPayData.transId = res.data.transId;
                sessionStorage.setItem('bankPayData',JSON.stringify(bankPayData));
              }
            }).catch( (response) => {
              console.log(response);
            });
          }else{

            this.axios.get('/api/pay/getQuickPaySendMsg', {
              params: {
                platformId:JSON.parse(sessionStorage.getItem('bankPayData')).bankPid,
                tn:JSON.parse(sessionStorage.getItem('bankPayData')).businessTn
              }
            }).then((res)=>{
              res = res.data;
            }).catch( (response) => {
              console.log(response);
            });
          }
          this.i++;
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
      },
      _go(){
        let self = this;
        if(!this.vCode) {
          this.$refs.pop.show('请输入验证码');
          return;
        }
        if(!this.isClickGetCode){
          this.$refs.pop.show('请点击获取验证码');
          return;
        }
        this.payLoading = true;
        this.paytimer = setInterval(()=>{
          this.paytime--;
          if(this.paytime<=0){
            clearInterval(this.paytimer);
            this.payLoading = false;
            let payresult = {
              status:1,//当倒计时10秒结束时，向结果页面传一个失败的状态，1即失败,0成功
              msg:'支付超时,请去充值明细查看是否已支付成功'
            }
            sessionStorage.setItem('payresult',JSON.stringify(payresult));
            this.$router.push({path:`/payresult${fromGamingUrl}`});
          }
        },1000);

        if(sessionStorage.getItem('bankPayData')&&JSON.parse(sessionStorage.getItem('bankPayData')).isBankJhPayWay&&i>0){

          this.axios.get('/api/jhPay/quickPayConfirm', {
            params: {
              country:0,
              platformTerminal:4,
              totalFee:JSON.parse(sessionStorage.getItem('bankPayData')).payMomey,
              accNo:JSON.parse(sessionStorage.getItem('bankPayData')).banknum,
              bankCode:JSON.parse(sessionStorage.getItem('bankPayData')).bankCode,
              customerNm:JSON.parse(sessionStorage.getItem('bankPayData')).customerNm,
              certifTp:'01',
              certify_id:JSON.parse(sessionStorage.getItem('bankPayData')).certify_id,
              phoneNo:JSON.parse(sessionStorage.getItem('bankPayData')).phone,
              smsCode:this.vCode,
              transId:JSON.parse(sessionStorage.getItem('bankPayData')).transId,
              businessNo:JSON.parse(sessionStorage.getItem('bankPayData')).businessNo,
              dcType:String(Number(JSON.parse(sessionStorage.getItem('bankPayData')).type)-1)
            }
          }).then((res)=>{
            res = res.data;
            clearInterval(this.timerId);
            clearInterval(this.paytimer);
            if(res.result==0){
              self.payLoading=false;
              self.title="手机短信验证";
              let payresult = {
                status:0//当倒计时10秒结束时，向结果页面传一个失败的状态，1即失败,0成功
              }
              sessionStorage.setItem('payresult',JSON.stringify(payresult));
              this.$router.push({path:`/payresult${fromGamingUrl}`})
            }else{
              let payresult = {
                status:1,//当倒计时10秒结束时，向结果页面传一个失败的状态，1即失败,0成功
                msg:res.data.errorMsg
              }
              sessionStorage.setItem('payresult',JSON.stringify(payresult));
              setTimeout(()=>{
                this.$router.push({path:`/payresult${fromGamingUrl}`});
                this.payLoading=false;
              },1000);
            }
          }).catch( (response) => {
            console.log(response);
          });
        }else{
          this.axios.get('/api/pay/quickPayConfirm', {
            params: {
              platformId:JSON.parse(sessionStorage.getItem('bankPayData')).bankPid,
              tn:JSON.parse(sessionStorage.getItem('bankPayData')).businessTn,
              smsCode:this.vCode,
              outTradeNo:JSON.parse(sessionStorage.getItem('bankPayData')).outTradeNo,
              extendParams:JSON.parse(sessionStorage.getItem('bankPayData')).bankExtra,
              totalFee:JSON.parse(sessionStorage.getItem('bankPayData')).payMomey,
              businessNo:JSON.parse(sessionStorage.getItem('bankPayData')).business
            }
          }).then((res)=>{
            res = res.data;
            clearInterval(this.timerId);
            clearInterval(this.paytimer);
            if(res.respMsg.indexOf("交易成功")!=-1){
              self.payLoading=false;
              self.title="手机短信验证";
              let payresult = {
                status:0//当倒计时10秒结束时，向结果页面传一个失败的状态，1即失败,0成功
              }
              sessionStorage.setItem('payresult',JSON.stringify(payresult));
              this.$router.push({path:`/payresult${fromGamingUrl}`})
            }else{
              let payresult = {
                status:1,//当倒计时10秒结束时，向结果页面传一个失败的状态，1即失败,0成功
                msg:res.respMsg
              }
              sessionStorage.setItem('payresult',JSON.stringify(payresult));
              setTimeout(()=>{
                this.$router.push({path:`/payresult${fromGamingUrl}`});
                this.payLoading=false;
              },1000);
            }
          }).catch( (response) => {
            console.log(response);
          });
        }
      }
    },
    components:{
      Vtitle,
      popUps
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>

  .payBankSMSfill {
    height:100%;
    width: 100%;
    background: #F5F5F5;
    .payBankSMSfill-content {
      ul {
        background: #FFFFFF;
        padding-left:0.14rem;
      li {
        height:0.5rem;
        line-height:0.5rem;
        font-size: 0.11rem;
        display: block;
      }
        li:nth-child(1) {
          text-align: center;
          font-size: 0.13rem;
        }
        li:nth-child(2){
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
            border-radius:0.13rem;
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
          height:0.46rem;
          line-height:0.46rem;
          background: deepskyblue;
          background-image: linear-gradient(to right,#00C6FF,#0072FF);
          background-image:-webkit-linear-gradient(to right,#00C6FF,#0072FF);
          background: -moz-linear-gradient(to right,#00C6FF,#0072FF);
          background: -o-linear-gradient(to right,#00C6FF,#0072FF);
          font-size: 0.15rem;
          color: #FFFFFF;
          border-radius: 0.23rem;
          text-align: center;
        }
      }
    }
    .pay-loading{
      width: 100%;
      background-color: #fff;
      height: 2rem;
      >div:nth-of-type(1){
         margin: auto;
         font-size: 0.15rem;
         color: #05d30f;
         height: 1.5rem;
         width: 1.5rem;
         text-align: center;
         background-size:1.3rem 1.3rem ;
         background-image: url("./payL.png");
         background-repeat: no-repeat;
         background-position: center;
         line-height: 1.5rem;
        >span:nth-of-type(1){
           display: block;
           width: 1.5rem;
           height: 1.5rem;
           position: fixed;
           top: 0.45rem;
         }
        >span:nth-of-type(1):before {
           display: block;
           content:"";
           width: 1.5rem;
           height: 1.5rem;
           background-position: center;
           background-size:1.3rem 1.3rem ;
           background-image: url("./payZ.png");
           background-repeat: no-repeat;
           animation:loading .8s linear infinite;
           -webkit-animation:loading .8s linear infinite;
         }
        >span:nth-of-type(1):after {
           display: block;
           display: inline-block;
           content:"";
           transform:translate(-44%,-50%);
           -ms-transform:translate(-44%,-50%);
           -webkit-transform:translate(-44%,-50%);
           -moz-transform:translate(-44%,-50%);
           -o-transform:translate(-44%,-50%);
           color:#1581cc;
           font-size:14px
         }
        @keyframes loading {
          0% {
            transform:rotate(0);
            -webkit-transform:rotate(0)
          }
          100% {
            transform:rotate(360deg);
            -webkit-transform:rotate(360deg)
          }
        }
        @-webkit-keyframes loading {
           0% {
             transform: rotate(0);
             -webkit-transform: rotate(0)
           }
           100% {
             transform: rotate(360deg);
             -webkit-transform: rotate(360deg)
           }
         }
        >span:nth-of-type(2){
           display: block;
           display: inline-block;
           height: 1.5rem;
           width: 1.5rem;
         }
      }
      >div:nth-of-type(2){
         text-align: center;
         height: 0.2rem;
         line-height: 0.2rem;
         font-size: 0.14rem;
         color: #999;
       }
      >div:nth-of-type(3){
         height: 0.2rem;
         line-height: 0.2rem;
         font-size: 0.11rem;
         color: #ff0000;
         text-align: center;
       }
    }
  }

</style>
