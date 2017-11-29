<template>
    <div class="remitAccountDetails">
      <vtitle title="划账明细" :isRUl="true" :isFixed="true" @RUrl="back"></vtitle>
      <div class="remitAccountDetails-content">
        <div class="remitAccountDetails-title-wrapper">
          <span>划账时间</span>
          <span>划出账户</span>
          <span>划入账户</span>
          <span>划入金币</span>
        </div>
        <div class="remitAccountDetails-content-lists">
          <ul class="recharge">
            <li v-for="item in accountLists" class="borderBottom-1px" v-if="accountLists.length">
              <div class="time">{{item.createTime|Time}}</div>
              <div class="gameTitle omitted">{{item.fPlatformName}}</div>
              <div class="val omitted">{{item.tPlatformName}}</div>
              <div class="val">{{item.tGamegolds}}</div>
            </li>
            <div class="loadPrompts" v-if="loadSuccess&&accountLists.length">已全部加载完毕</div>
            <default-page v-if="!accountLists.length"></default-page>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import DefaultPage from '../../base/defaultPage/defaultPage.vue';

  export default {
    data(){
      return {
        accountCurrentPageNo:1,//当前充值明细加载页数
        accountLists:[],//充值明细数据
        isJieliu:false,//懒加载所需要的节流阀
        loadSuccess:false
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('remitAccountDetails')!=-1){
          this.accountCurrentPageNo=1;
          this.accountLists=[];
          this.isJieliu=false;
          this.loadSuccess=false;
          this.getRechargeData();
        }
      }
    },
    created(){
      this.getRechargeData();
    },
    methods:{
      back(){
        this.$router.back();
      },
      getRechargeData(){

        this.axios.get('/api/gameGoldsTransfer/list', {
          params: {
            pageNo:this.accountCurrentPageNo,
            pageSize:20
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0) {
            let length = this.accountLists.length;
            this.accountLists = this.accountLists.concat(res.data.list);

            if(this.accountLists.length&&this.accountLists.length>length){
              this.loadMore();
              this.isJieliu = false;
            }else {
              this.loadSuccess = true;
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      loadMore(){
        $('.remitAccountDetails').scroll(()=>{
          let scrollTop = $('.remitAccountDetails').scrollTop();
          let clientHeight = $(window).height();
          let documentHeight = $('.remitAccountDetails-content-lists').height();

          if(documentHeight-clientHeight<=scrollTop&&!this.isJieliu){
            this.accountCurrentPageNo++;
            this.getRechargeData();
            this.isJieliu = true;
          }
        });
      }
    },
    components:{
      Vtitle,
      DefaultPage
    }
  }


</script>

<style rel="stylesheet/less" lang="less" scoped>
  .remitAccountDetails {
    overflow-y:auto;
    height:100%;
    width: 100%;
    background: #f5f5f5;
    .remitAccountDetails-content {
      padding-top: 0.9rem;
    }
    .remitAccountDetails-title-wrapper {
      display: block;
      display: flex;
      position: fixed;
      top:0.44rem;
      left:0;
      z-index: 1;
      width: 100%;
      background-color: #fff;
      color: #0072FF;
      font-size: 0.14rem;
      height: 0.45rem;
      line-height:0.45rem;
      span {
        display: block;
        height: 0.45rem;
        line-height:0.45rem;
        text-align: center;
        flex: 1;
      }
    }
    .remitAccountDetails-content-lists {
      ul {
        li {
          height:0.5rem;
          line-height: 0.5rem;
          background: #FFFFFF;
          display: block;
          display: flex;
          div {
            display: block;
            text-align: center;
            flex:1;
          }
        }
      }
    }
  }
  .remitAccountDetails::-webkit-scrollbar {
    width: 0.5px;
    height: 0.5px;;
    width:0;
    height:0;
  }
  .remitAccountDetails .loadPrompts {
    line-height:0.3rem;
    text-align: center;
    font-size: 0.14rem;
    color: #B4B4B4;
  }
</style>
