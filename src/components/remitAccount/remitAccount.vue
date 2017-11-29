<template>
    <div class="remitAccount">
      <vtitle title="划账" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp">
        <span @click="_link('remitAccountDetails')">划账明细</span>
      </vtitle>
      <div class="remitAccount-content">
        <div class="draw-out-wrapper">
          <h3>划出</h3>
          <div class="draw-out">
            <div class="draw-out-account borderBottom-1px">
              <span>划出账户</span>
              <span @click="selectAccount('type=2')" class="omitted">{{remitAccountOut.name}}</span>
            </div>
            <div class="draw-out-gold">
              <span>可划出金币数量</span>
              <span>{{cash}}.00</span>
            </div>
          </div>
        </div>
        <div class="draw-in-wrapper">
            <h3>划入</h3>
          <div class="draw-in">
            <div class="draw-in-account borderBottom-1px">
              <span>划入账户</span>
              <span @click="selectAccount('type=1')" class="omitted">{{remitAccountIn.name}}</span>
            </div>
            <div class="draw-in-gold">
              <input type="number" placeholder="请输入划账金额" v-model="val" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
            </div>
          </div>
        </div>
        <div class="go" @click="go">确定划账</div>
        <popUps ref="pop"></popUps>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';
  import popUps from '../../base/popUps/popUps.vue';

  let fromGamingUrl = window.location.search;
  export default {
    data(){
      return {
        notApp:true,
        cash:0,
        val:'',//划入金额
        remitAccountOut:{id:1,name:'平台中心钱包'},
        remitAccountIn:{id:null,name:'请选择账户'},
        currentShowAccount:'out'//判断当前要展示账户，避免划出划入账户重复依据
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('remitAccount')!=-1){
          let Requres = new UrlSearch();

          if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1||Requres.osType=='app'){//判断ios内嵌中调用获取支付参数
            this.notApp = false;
          }else {
            this.notApp = true;
          }
          if(sessionStorage.getItem('fromSelectAccount')){
            sessionStorage.removeItem('fromSelectAccount');
            if(this.currentShowAccount=='out'){
              this.remitAccountOut = JSON.parse(sessionStorage.getItem('remitAccountOut'));
              if(this.remitAccountOut.id&&this.remitAccountOut.id!=1){
                setTimeout(()=>{
                  this.getGameCash(this.remitAccountOut.id);//查询其他游戏平台钱包
                },200)
              }else if(this.remitAccountOut.id&&this.remitAccountOut.id==1){
                setTimeout(()=>{
                  this.queryPlatformBalance();//查询平台中心钱包
                },200)
              }
            }else if(this.currentShowAccount=='in'){
              this.remitAccountIn = JSON.parse(sessionStorage.getItem('remitAccountIn'));
            }
            this.avoidRepeat();
          }else {
            sessionStorage.removeItem('remitAccountIn');
            sessionStorage.removeItem('remitAccountOut');
            this.remitAccountIn = {id:null,name:'请选择账户'};
            this.remitAccountOut = {id:1,name:'平台中心钱包'};
            this.currentShowAccount = 'out';
            this.val='';
            this.queryPlatformBalance();//查询平台中心钱包
          }
        }
      }
    },
    created(){
      let Requres = new UrlSearch();
      if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1||Requres.osType=='app'){//判断ios内嵌中调用获取支付参数
        this.notApp = false;
      }
      if(Requres.token){

        this.axios.get('/api/login/tokenLogin', {
          params: {
            token: decodeURIComponent(Requres.token)
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            this.getUserInfo();
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
//      this.getGameIdSystemConfig();
      this.remitAccountIn = JSON.parse(sessionStorage.getItem('remitAccountIn'))||{id:null,name:'请选择账户'};
      this.remitAccountOut = JSON.parse(sessionStorage.getItem('remitAccountOut'))||{id:1,name:'平台中心钱包'};
      this.avoidRepeat();
      if(this.remitAccountOut.id&&this.remitAccountOut.id!=1){
        setTimeout(()=>{
          this.getGameCash(this.remitAccountOut.id);//查询其他游戏平台钱包
        },200);
      }else if(this.remitAccountOut.id==1){
        setTimeout(()=>{
          this.queryPlatformBalance();//查询平台中心钱包
        })
      }


    },
    methods:{
      back(){
        if(this.$route.query.fromMine == 1){
          this.$router.push({path:'mine'});
        }else {
          window.history.back();
        }
      },
      _link(url){

        this.$router.push({path:`${url}${fromGamingUrl}`});

      },
      avoidRepeat(){
        if(this.remitAccountOut.id==this.remitAccountIn.id){//避免划出划入账户重复
          if(this.currentShowAccount=='out'){
            this.remitAccountIn = {name:'请选择账户',id:null};
            sessionStorage.removeItem('remitAccountIn');
          }else if(this.currentShowAccount=='in'){
            this.cash = 0;
            this.remitAccountOut = {name:'请选择账户',id:null};
            sessionStorage.removeItem('remitAccountOut');
          }
        }
      },
      selectAccount(type){
        if(type.indexOf('type=2')!=-1){
          this.currentShowAccount = 'out';
        }else if(type.indexOf('type=1')!=-1){
          this.currentShowAccount = 'in';
        }
        let Requres = new UrlSearch();
        if(fromGamingUrl.indexOf('?')>-1){
          this.$router.push({
            path:`selectAccount${fromGamingUrl}&${type}`
          });
        }else {
          this.$router.push({
            path:`selectAccount?${type}`
          });
        }
      },
      queryPlatformBalance(){

        this.axios.get('/api/user/getUserfunds').then((res)=>{
          res = res.data;
          if(res.result == 0){
            this.cash = res.data.cash?res.data.cash:0;
            sessionStorage.setItem('platecenterCash',this.cash);
          } else {
            this.cash = 0;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      getGameCash(platformId){
        this.cash = 0;
        this.axios.get('/api/gameGoldsTransfer/getGameBalance', {
          params:{
            platformId:platformId
          }
        }).then((res)=>{
          res = res.data;
          if(res.result == 0){
            this.cash = res.freeBalance;
          }else {
            this.cash = 0;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      go(){
        if(this.remitAccountIn.name=='请选择账户'){
          this.$refs.pop.show('请选择划入账户');
          return;
        }else if(this.remitAccountOut.name=='请选择账户'){
          this.$refs.pop.show('请选择划出账户');
          return;
        }

        if(!this.val){
          this.$refs.pop.show('请输入划账金额');
          return;
        }
        if(this.val>this.cash){
          this.$refs.pop.show('您的金币数量不足');
          return;
        }
        if(this.val>100000){
          this.$refs.pop.show('最高划出金额为100000');
          return;
        }

        this.axios.get('/api/gameGoldsTransfer/remit', {
          params: {
            terminal:4,
            fPlatformId:this.remitAccountOut.id,
            tPlatformId:this.remitAccountIn.id,
            fGameGolds:this.val,menuType:4
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            let Requres = new UrlSearch();

            this.$refs.pop.show('划账成功');
            setTimeout(()=>{
              this.$router.push({path:`mygold${fromGamingUrl}`});
            },2001)
          }else if(res.result==274){
            this.$refs.pop.show(res.msg);
          }else if(res.result==251) {
            this.$refs.pop.show('划账数额不能为0');
          } else{
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
    },
    computed:{
      ...mapState([
        'accountingOut'
      ])
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>

  .remitAccount {
    height:100%;
    width: 100%;
    background-color: #f5f7f8;
    font-size: 0.15rem;
    .title .title-r span{
      font-size: 0.15rem;
      float: right;
      padding-right: 0.1rem;
    }
    h3 {
      padding-left: 0.15rem;
      line-height:0.4rem;
      color: #000;
      font-weight: 800;
      font-size: 0.13rem;
    }
    .draw-out {
      background: #FFFFFF;
      .draw-out-account,
      .draw-out-gold {
        margin-left: 0.15rem;
        height:0.49rem;
        line-height:0.49rem;
        display: block;
        display: flex;
        font-size: 0.13rem;
        span:nth-child(2){
          display: block;
          flex:1;
          text-align: right;
          padding-right: 0.15rem;
          color: #FF7E37;
        }
      }
      .draw-out-account span:nth-child(2){
        background: url("./go.png") no-repeat right;
        background-size: 0.08rem 0.15rem;
        margin-right: 0.15rem;
        color: #999999;
      }
    }
    .draw-in {
      background: #FFFFFF;
      .draw-in-account,
      .draw-in-gold {
        margin-left: 0.15rem;
        height:0.49rem;
        line-height:0.49rem;
        display: block;
        display: flex;
        font-size: 0.13rem;
        span:nth-child(2){
          display: block;
          flex:1;
          text-align: right;
          padding-right: 0.15rem;
        }
        input {
          color: #999999;
        }
      }
      .draw-in-account span:nth-child(2){
        background: url("./go.png") no-repeat right;
        background-size: 0.08rem 0.15rem;
        margin-right: 0.15rem;
        color: #999999;
      }
    }
    .go {
      margin: 0.3rem auto 0.1rem;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.15rem;
      border-radius: 0.3rem;
      text-align: center;
      width: 3rem;
      color: #FFFFFF;
      background-color: #00a8ff;
    }
  }

</style>
