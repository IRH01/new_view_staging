<template>
    <div class="payBankFill1">
      <vtitle title="银行卡支付" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp"></vtitle>
      <div class="payBankFill1-content">
        <ul>
          <li class="borderBottom-1px" >
            <span>订单金额:</span>
            <span>{{money}}.00元</span>
          </li>
          <li class="borderBottom-1px" >
            <span>账户:</span>
            <span>{{uId}}</span>
          </li>
          <li class="borderBottom-1px" >
            <span>付款银行:</span>
            <span @click="goBankList">{{bankName}}</span>
            <!--<router-link to="'bankCard'+fromGamingUrl" tag="span">{{bankName}}</router-link>-->
          </li>
          <li>
            <span>卡号:</span>
            <input type="text" placeholder="请输入卡号" maxlength="19" v-model="bankCard" pattern="[0-9]*" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
          </li>
        </ul>
        <p>银行卡号应为12~19位数字</p>
        <div class="go" @click="go">下一步</div>
        <popUps ref="pop"></popUps>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';

  let fromGamingUrl = window.location.search;

  export default {
    data(){
      return {
        bankName:'请选择支持银行',
        Requres:{},
        bankCard:'',
        notApp:true,//不内嵌在app中
        uId:'',
        money:0
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('payBankFill1')!=-1){

          if(sessionStorage.getItem("bankFalse")==1){//防止存在影响订单重复事件
            sessionStorage.removeItem("bankFalse")
          }

          this.bankName='请选择支持银行';
          this.bankCard='';
          this.notApp=true;//不内嵌在app中
          this.uId='';
          this.money=0;

          this.Requres = new UrlSearch();
          var u_agent =  navigator.userAgent;
          if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
            this.notApp = false;
          }
          if(sessionStorage.getItem('bankPayData')){
            this.uId = JSON.parse(sessionStorage.getItem('bankPayData')).busyId||this.$store.state.userInfo.userId;
            this.money = JSON.parse(sessionStorage.getItem('bankPayData')).payMomey;
          }
          if(sessionStorage.getItem('selBank')){
            this.bankName = JSON.parse(sessionStorage.getItem('selBank')).name;
          }else {
            this.bankName = '请选择支持银行';
          }
        }
      }
    },
    created(){
      this.Requres = new UrlSearch();
      var u_agent =  navigator.userAgent;
      if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
        this.notApp = false;
      }
      if(sessionStorage.getItem('bankPayData')){
        this.uId = JSON.parse(sessionStorage.getItem('bankPayData')).busyId||this.$store.state.userInfo.userId;
        this.money = JSON.parse(sessionStorage.getItem('bankPayData')).payMomey;
      }
      if(sessionStorage.getItem('selBank')){
        this.bankName = JSON.parse(sessionStorage.getItem('selBank')).name;
      }
    },
    methods:{
      back(){
        this.$router.push({path:`payType${fromGamingUrl}`});
      },
      goBankList(){
        this.$router.push({path:`bankCard${fromGamingUrl}`})
      },
      go(){
        if(!JSON.parse(sessionStorage.getItem('selBank'))){
          this.$refs.pop.show('请选择银行卡');
          return;
        }
        this.bankCard = this.bankCard.replace(/\s/g, "");
        if(!this.bankCard) {
          this.$refs.pop.show('请输入银行卡号');
          return;
        }
        if(String(this.bankCard).length<12){
          this.$refs.pop.show('请输入正确的银行卡号');
          return;
        }

        this.axios.get('/api/pay/getOrderInfo', {
          params: {
            bankName:JSON.parse(sessionStorage.getItem('selBank')).name,
            bankCardNo:this.bankCard
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            let bankPayData = JSON.parse(sessionStorage.getItem('bankPayData'));
            bankPayData.outTradeNo = res.data.outTradeNo;
            bankPayData.banknum = this.bankCard;
            bankPayData.name = JSON.parse(sessionStorage.getItem('selBank')).name;
            bankPayData.type = JSON.parse(sessionStorage.getItem('selBank')).type;
            bankPayData.paytime = (new Date()).getTime().toString();
            sessionStorage.setItem("bankPayData",JSON.stringify(bankPayData));
            console.log(bankPayData);
            setTimeout(()=>{
              this.$router.push({path: `/payBankFill2${fromGamingUrl}`});
            },200)
          }else{
            this.$refs.pop.show(res.msg);
            return;
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
    },
    components:{
      Vtitle,
      popUps
    },
    computed:{
      ...mapState([
        'userInfo'
      ])
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .payBankFill1 {
    height:100%;
    width: 100%;
    background: #f5f7f8;
    .payBankFill1-content {
      ul {
        li {
          padding:0 0.15rem;
          background: #FFFFFF;
          height: 0.5rem;
          line-height:0.5rem;
          font-size: 0.13rem;
          display: block;
          display: flex;
          span {
            display: block;
            flex:1;
          }
          span:nth-child(2){
            text-align: right;
          }
          input {
            display: block;
            height: 0.2rem;
            padding: 0.15rem 0;
            flex:1;
            text-align: right;
          }
        }
        li:nth-child(2) {
          margin-bottom: 0.5rem;
        }
        li:nth-child(3) span:nth-child(2) {
          background: url('./right.png') no-repeat center right;
          -webkit-background-size:0.1rem 0.15rem;
          background-size:0.1rem 0.15rem;
          padding-right: 0.2rem;
          color: #999;
        }
      }
      p {
        line-height:0.3rem;
        padding-left: 0.15rem;
        color: #b4b4b4;
      }
    }
    .go{
      margin: 0.3rem auto;
      width: 3rem;
      height: 0.4rem;
      line-height:0.4rem;
      font-size:0.18rem;
      border-radius: 0.3rem;
      text-align: center;
      color: #FFFFFF;
      background: deepskyblue;
      background-image: linear-gradient(to right,#00C6FF,#0072FF);
      background-image:-webkit-linear-gradient(to right,#00C6FF,#0072FF);
      background: -moz-linear-gradient(to right,#00C6FF,#0072FF);
      background: -o-linear-gradient(to right,#00C6FF,#0072FF);
    }
  }
</style>
