<template>
    <div class="selectAccount">
      <vtitle title="选择账户" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp"></vtitle>
      <div class="selectAccount-content">
        <ul>
          <li class="borderBottom-1px" @click="go(1,'平台中心钱包')" >
            <div>
              <span>平台中心钱包</span>
              <span v-if="this.cash.indexOf('.') !=-1">{{cash}}</span>
              <span v-else="">{{cash}}.00</span>
            </div>
          </li>
          <li class="borderBottom-1px" @click="go(item.id,item.name)" v-for="(item,index) in remitGameData">
            <div>
              <span>{{item.name}}</span>
              <span v-if="otherCash[index]||otherCash[index]==0">{{otherCash[index]}}</span>
              <span v-else>*****</span>
            </div>
            <div :class="{select:otherCash[index]||otherCash[index]==0}" @click.stop="getGameCash(item.id,index)"></div>
          </li>
        </ul>
      </div>
      <popUps ref="pop"></popUps>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';
  import {mapState} from 'vuex';

  export default {
    data(){
      return {
        notApp:true,
        select:0,
        cash:0,//平台账户余额
        otherCash:[],//其余账户余额
        remitGameData:[]
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('selectAccount')!=-1){

          let Requres = new UrlSearch();
          if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
            this.notApp = false;
          }else {
            this.notApp = true;
          }

          this.select = 0;
          this.cash=sessionStorage.getItem('platecenterCash')?sessionStorage.getItem('platecenterCash'):0;//平台账户余额
          this.otherCash=[];//其余账户余额
          this.remitGameData=[];
          this.getRemitGame();
          this.cashNum();
        }
      }
    },
    created(){
      let Requres = new UrlSearch();
      if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1||Requres.osType=='app'){//判断ios内嵌中调用获取支付参数
        this.notApp = false;
      }

      this.getRemitGame();
      this.cashNum();
      this.cash=sessionStorage.getItem('platecenterCash');
    },
    methods:{
      back(){
        this.$router.back();
      },
      go(id,name){
        if(this.$route.query.type==1){
          let remitAccountIn = {
            id,
            name
          };
          sessionStorage.setItem('remitAccountIn',JSON.stringify(remitAccountIn));
          this.$router.back();
        }else if(this.$route.query.type==2){
          let remitAccountOut = {
            id,
            name
          };
          sessionStorage.setItem('remitAccountOut',JSON.stringify(remitAccountOut));
          this.$router.back();
        }
        sessionStorage.setItem('fromSelectAccount','true');
      },
      getRemitGame(){
        let drawType = this.$route.query.type;//1:划入,2:划出,3:兑换;默认为划入
        this.axios.get('/api/gameGoldsTransfer/getGameList', {
          params: {
            terminal:4,
            drawType:drawType
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
            this.otherCash.splice(index,1,res.freeBalance);
          }else {
            this.$refs.pop.show(res.msg);
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      cashNum() {
        if(this.cash){
          Number(this.cash).toFixed(2);
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

  .selectAccount {
    height:100%;
    width: 100%;
    background-color: #f5f7f8;
    font-size: 0.15rem;
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
          display: flex;
          flex:1;
          span:nth-child(1){
           display: block;
            width:1rem;
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
          background-size:0.15rem 0.07rem;
        }
        div:nth-child(2).select {
          display: block;
          height:0.5rem;
          width: 0.19rem;
          padding-right: 0.15rem;
          background: url("./zhengyan.png") no-repeat center left;
          -webkit-background-size:0.19rem 0.11rem;
          background-size:0.15rem 0.07rem;
        }
      }
    }
  }

</style>
