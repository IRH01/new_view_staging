<template>
    <div class="myGold">
      <vtitle title="我的金币" :isRUl="true" @RUrl="back" :isShow="notApp">
        <span @click="_link('payDetails')">充值明细</span>
      </vtitle>
      <div class="mygold-content">
        <ul>
          <li class="borderBottom-1px">
            <div>
              <span>平台中心钱包</span>
              <span>{{cash}}</span>
            </div>
          </li>
          <li class="borderBottom-1px" v-for="(item,index) in remitGameData">
            <div>
              <span>{{item.name}}</span>
              <span v-if="otherCash[index]||otherCash[index]==0">{{otherCash[index]}}</span>
              <span v-else>*****</span>
            </div>
            <div :class="{select:otherCash[index]||otherCash[index]==0}" @click.stop="getGameCash(item.id,index)"></div>
          </li>
        </ul>
        <div class="go">
          <span @click="_link('remitAccount')">划账</span>
          <span @click="_link('pay')">充值</span>
        </div>
        <popUps ref="pop"></popUps>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';

  export default {
    data(){
      return {
        notApp:true,
        cash:0,//平台账户余额
        otherCash:[],//其余账户余额
        remitGameData:[]
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('mygold')!=-1){

          let Requres = new UrlSearch();
          if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
            this.notApp = false;
          }else {
            this.notApp = true;
          }

          this.otherCash=[];//其余账户余额
          this.remitGameData=[];
          this.queryPlatformBalance();
          this.getRemitGame();
        }
      }
    },
    created(){
      let Requres = new UrlSearch();
      if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
        this.notApp = false;
      }else {
        this.notApp = true;
      }

      this.getRemitGame();
      this.queryPlatformBalance();
    },
    methods:{
      back(){
        this.$router.push('/mine')
      },
      _link(url){
        let Requres = new UrlSearch();
        if(Requres.osType=="app"){
          this.$router.push({path:`${url}?osType=app`});
        }else{
          this.$router.push({path:`${url}`});
        }
      },
      queryPlatformBalance(){
        this.axios.get('/api/user/getUserfunds').then((res)=>{
          res = res.data;
          if(res.result == 0){
            this.cash = res.data.cash.toFixed(2);
          } else {
            this.cash = 0;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      getRemitGame(){
        this.axios.get('/api/gameGoldsTransfer/getGameList', {
          params: {
            terminal:4
          }
        }).then((res)=>{
          res = res.data;
          if(res.result == 0){
            this.remitGameData = res.data;
            this.otherCash.length = this.remitGameData.length;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      getGameCash(platformId,index){
        if(this.otherCash[index]){
          return;
        }
        this.axios.get('/api/gameGoldsTransfer/getGameBalance', {
          params: {
            platformId:platformId
          }
        }).then((res)=>{
          res = res.data;
          if(res.result == 0){
            this.otherCash.splice(index,1,res.freeBalance.toFixed(2));
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
  .myGold {
    height:100%;
    width: 100%;
    background: #f5f7f8;

    .title .title-r span{
      font-size: 0.15rem;
      float: right;
      padding-right: 0.1rem;
    }

    .mygold-content {
      padding-top: 0.44rem;
      ul {
        background: #FFFFFF;
        li {
          display: block;
          display: flex;
          margin-left: 0.15rem;
          height:0.5rem;
          line-height:0.5rem;
          div:nth-child(1){
            display: block;
            height:0.5rem;
            flex:1;
            display: flex;
            span:nth-child(1){
             width: 1rem;
              font-size: 0.14rem;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            span:nth-child(2){
              padding-left: 0.15rem;
              color: #FF7E37;
            }
          }
          div:nth-child(2){
            display: block;
            height:0.5rem;
            width: 0.19rem;
            padding-right: 0.15rem;
            background: url("./biyan.png") no-repeat center left;
            -webkit-background-size:0.19rem 0.11rem;
            background-size:0.19rem 0.11rem;
          }
          div:nth-child(2).select {
            display: block;
            height:0.5rem;
            width: 0.19rem;
            padding-right: 0.15rem;
            background: url("./zhengyan.png") no-repeat center left;
            -webkit-background-size:0.19rem 0.11rem;
            background-size:0.19rem 0.11rem;
          }
        }
      }
      .go {
        padding: 0.3rem 0.3rem;
        display:block;
        display:flex;
        span {
          display: block;
          flex:1;
          font-size: 0.15rem;
          height:0.36rem;
          line-height:0.36rem;
          width: 1.31rem;
          border-radius: 1rem;
          border: 1px solid #00A8FF;
          color: #00A8FF;
          text-align: center;
          margin: 0 0.1rem;
        }
      }
    }
  }

</style>
