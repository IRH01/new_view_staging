<template>
    <div class="bankCard">
      <vtitle title="支付银行卡" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp"></vtitle>
      <div class="bankCard-title">
        <span :class="{sel:sel==1}" @click="sel=1">储蓄卡</span>
        <span :class="{sel:sel==2}" @click="sel=2">信用卡</span>
      </div>
      <div class="bankCard-list">
        <ul>
          <li v-for="item in bankCardList" class="borderBottom-1px" v-if="item.isDepositCard==1&&sel==1" @click="selCard(item.id,item.bankName,item.briefCode)">
            <span><img :src="item.mobileBankImgUrl" alt=""></span>
            <div>
              <p>{{item.bankName}}</p>
              <p>{{item.limitation}}</p>
            </div>
          </li>
          <li v-for="item in bankCardList" class="borderBottom-1px" v-if="item.isCreditCard==1&&sel==2" @click="selCard(item.id,item.bankName,item.briefCode)">
            <span><img :src="item.mobileBankImgUrl" alt=""></span>
            <div>
              <p>{{item.bankName}}</p>
              <p>{{item.limitation}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';

  let fromGamingUrl = window.location.search;

  export default {
    data(){
      return {
        Requres:{},
        sel:1,//1储蓄卡,2信用卡
        notApp:true,//不内嵌在app中
        bankCardList:[]
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('bankCard')!=-1){
          sessionStorage.removeItem('selBank');
          this.sel=1;
          this.Requres = new UrlSearch();
          if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
            this.notApp = false;
          }else {
            this.notApp=true;
          }
          this.getBankCardList();
        }
      }
    },
    created(){
      this.Requres = new UrlSearch();
      if(navigator.userAgent.indexOf("native_iOS")>-1||navigator.userAgent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
        this.notApp = false;
      }
      this.getBankCardList();
    },
    methods:{
      back(){
        this.$router.back();
      },
      getBankCardList(){

        this.axios.get('/api/payBankInfo/queryPayBankInfo').then((res)=>{
          res = res.data;
          this.bankCardList=res;
        }).catch( (response) => {
          console.log(response);
        });
      },
      selCard(id,name,bankCode){
        let type = this.sel==1?1:2;
        const selBank = {
          id,
          name,
          type
        }
        sessionStorage.setItem('selBank',JSON.stringify(selBank));

        let bankPayData = JSON.parse(sessionStorage.getItem('bankPayData'));
        bankPayData.bankCode = bankCode;
        sessionStorage.setItem('bankPayData',JSON.stringify(bankPayData));

        setTimeout(()=>{
          this.$router.push({path: `/payBankFill1${fromGamingUrl}`})
        },200)
      }
    },
    components:{
      Vtitle
    }
  }

</script>

<style lang="less" rel="stylesheet/less" scoped>

  .bankCard {
    height:100%;
    width:100%;
    background:  #f5f7f8;
    .bankCard-title {
      height:0.45rem;
      line-height:0.45rem;
      background: #FFFFFF;
      width: 100%;
      display: block;
      display: flex;
      span {
        display: block;
        height:0.45rem;
        line-height:0.45rem;
        flex:1;
        text-align: center;
      }
      span.sel {
        height:0.44rem;
        border-bottom: 1px solid red;
      }
    }
    .bankCard-list {
      ul {
        li {
          display: block;
          display: flex;
          background: #fff;
          height:0.6rem;
          span:nth-child(1){
            display: block;
            height:0.6rem;
            line-height:0.6rem;
            width:0.8rem;
            padding:0 0.15rem;
            img {
              display: block;
              margin: 0.02rem 0;
              height: 0.6rem;
              width:0.8rem;
            }
          }
          div {
            display: block;
            height:0.4rem;
            padding-top: 0.1rem;
            flex:1;
            p:nth-child(1) {
              font-size: 0.14rem;
            }
            p:nth-child(2){
              padding-top: .06rem;
              color: #b4b4b4;
              overflow:hidden;
              text-overflow: ellipsis;
              display:-webkit-box;
              -webkit-line-clamp:2;
              -webkit-box-orient:vertical;
            }
          }
        }
      }

    }
  }

</style>
