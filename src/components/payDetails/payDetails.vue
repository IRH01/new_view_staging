<template>
    <div class="payDetails">
      <vtitle title="充值明细" :isRUl="true" :isFixed="true" @RUrl="back"></vtitle>
      <div class="payDetails-content">
        <div class="payDetails-title-wrapper">
          <span>充值时间</span>
          <span>充值金额</span>
          <span>获得金币</span>
        </div>
        <div class="payDetails-content-lists">
          <ul class="recharge">
            <li v-for="item in rechargeLists" class="borderBottom-1px" v-if="rechargeLists.length">
                <div class="time">{{item.applyTime|Time}}</div>
                <div class="gameTitle">{{item.applyAmount}}</div>
                <div class="val">{{item.gold}}</div>
            </li>
            <div class="loadPrompts" v-if="loadSuccess&&rechargeLists.length">已全部加载完毕</div>
            <default-page v-if="!rechargeLists.length"></default-page>
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
        rechargeCurrentPageNo:1,//当前充值明细加载页数
        rechargeLists:[],//充值明细数据
        isJieliu:false,//懒加载所需要的节流阀
        loadSuccess:false
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('payDetails')!=-1){
          this.rechargeCurrentPageNo=1;
          this.rechargeLists=[];
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
        this.axios.get('/api/rechargeRecord/list', {
          params: {
            status:1,
            pageNo:this.rechargeCurrentPageNo,
            pageSize:15
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0) {
            let length = this.rechargeLists.length;
            this.rechargeLists = this.rechargeLists.concat(res.data.list);

            if(this.rechargeLists.length&&this.rechargeLists.length>length){
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
        $('.payDetails').scroll(()=>{
          let scrollTop = $('.payDetails').scrollTop();
          let clientHeight = $(window).height();
          let documentHeight = $('.payDetails-content-lists').height();

          if(documentHeight-clientHeight<=scrollTop&&!this.isJieliu){
              this.rechargeCurrentPageNo++;
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



  .payDetails {
    overflow-y:auto;
    height: 100%;
    width: 100%;
    background: #f5f5f5;
    .payDetails-content {
      padding-top: 0.9rem;
    }
    .payDetails-title-wrapper {
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
    .payDetails-content-lists {
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
  .payDetails::-webkit-scrollbar {
    width: 0.5px;
    height: 0.5px;;
    width:0;
    height:0;
  }
  .payDetails .loadPrompts {
    line-height:0.3rem;
    text-align: center;
    font-size: 0.14rem;
    color: #B4B4B4;
  }
</style>
