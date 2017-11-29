<template>
  <div class="integralDetails">
    <vtitle @RUrl="back" :isRUl="true" title="积分明细"></vtitle>
    <div class="detailConent">
      <ul class="detailConent-tit">
        <li @click="active=true" :class="{activeDetail:active==true}">积分收入</li>
        <li @click="active=false" :class="{activeDetail:active==false}">积分消耗</li>
      </ul>
      <div class="detail-wrap" ref="detailWrap">
        <div class="details">
          <ul class="detailsr" v-if="active">
            <li class="borderBottom-1px" v-for="item in detailList">
              <div class="detailsr-left">
                <p>{{item.remark}}</p>
                <span>{{item.recordTime | setTime}}</span>
              </div>
              <div class="detailsr-right">
                +{{item.point}}
              </div>
            </li>
            <div class="loadPrompts" v-if="loadSuccess&&detailList.length">已全部加载完毕</div>
            <default-page v-if="!detailList.length"></default-page>
          </ul>
          <ul class="detailsr detailxh" v-else>
            <li class="borderBottom-1px" v-for="item in detailListConsum">
              <div class="detailsr-left">
                <p>{{item.remark}}</p>
                <span>{{item.recordTime | setTime}}</span>
              </div>
              <div class="detailsr-right">
                -{{item.point}}
              </div>
            </li>
            <div class="loadPrompts" v-if="loadSuccess&&detailListConsum.length">已全部加载完毕</div>
            <default-page v-if="!detailListConsum.length"></default-page>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import DefaultPage from '../../base/defaultPage/defaultPage.vue';

  export default{
    data() {
      return{
        active:true,
        detailList: [],
        detailListConsum:[],
        currentPage:1,
        loadSuccess:false
      }
    },
    watch:{
      '$route'(newVal) {
        if(newVal.path.indexOf('integralDetails')!=-1){
          this.active=true;
          this.detailList= [];
          this.detailListConsum=[];
          this.currentPage=1;
          this.loadSuccess=false;
          this._detail();
        }
      }
    },
    created(){
      this._detail();
    },
    methods:{
      back() {
        window.history.back();
      },
      _detail(){

        this.axios.get('/api/user/getAccountDetail', {
          params: {
            type:3,
            pageNo:this.currentPage,
            pageSize:25
          }
        }).then((res)=>{
          res = res.data;
          this.pagerNo=Math.ceil(Number(res.data.totalRows)/Number(res.data.pageSize))||0;
          if(res.result==0){
            let length= Number(this.detailListConsum.length) + Number(this.detailList.length);
            for(var i=0;i<res.data.list.length;i++){
              if(res.data.list[i].changeType == 1) {
                this.detailListConsum = this.detailListConsum.concat(res.data.list[i]);
              }else if(res.data.list[i].changeType == 0){
                this.detailList = this.detailList.concat(res.data.list[i]);
              }
            }
            let length2 = Number(this.detailListConsum.length) + Number(this.detailList.length);
            if(length2&&length2>length){
              this.loadMore();
              this.isJieliu = false;
            }else {
              this.loadSuccess=true;
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      loadMore(){
        $('.integralDetails').scroll(()=>{
          let scrollTop = $('.integralDetails').scrollTop();
          let clientHeight = $(window).height();
          let documentHeight = $('.details').height();

          if(documentHeight-clientHeight<=scrollTop+50&&!this.isJieliu){
            this.currentPage++;
            this._detail();
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
<style scoped  rel="stylesheet/less" lang="less">
  .integralDetails{
    width: 100%;
    overflow-y:auto;
    height: 100%;
    background: #fff;
    font-size: 0.14rem;
  }
  .integralDetails::-webkit-scrollbar {
    width: 0.5px;
    height: 0.5px;;
    width:0;
    height:0;
  }
  .detail-title{
    width: 100%;
    height: 0.45rem;
    background: #e7374b;
    display: block;
    display: flex;
    position: fixed;
    top:0;left:0;
    z-index:99;
  }
  .detail-title>span:not(:nth-child(2)){
    display: block;
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    text-align: center;
    line-height: 0.45rem;
    font-size: 0.24rem;
    color: #fff;
  }
  .detail-title>span:nth-child(2){
    display: block;
    flex: 1;
    text-align: center;
    color: #fff;
    font-size: 0.24rem;
    color: #fff;
    line-height: 0.45rem;
  }
  .detailConent{
    background: #fff;
  }
  .detailConent-tit{
    position: fixed;
    top:0.44rem;
    left: 0;
    width: 100%;
    height: 0.46rem;
    display: block;
    display: flex;
    z-index: 10;
    background: #FFFFFF;
    border-bottom: 1px solid #e5e5e5;
  }
  .detailConent-tit>li{
    display: block;
    flex: 1;
    text-align: center;
    height:0.46rem;
    line-height: 0.46rem;
    color: #1C1C1C;
    font-size: 0.16rem;
  }
  .detailConent-tit>.activeDetail{
    color: #00C6FF;
    height:0.46rem;
    border-bottom: 1px solid #00C6FF;
  }
  .detail-wrap{
    padding-top:0.91rem;
    width:100%;
    background: #fff;
  }
  .detailsr{
    width: 100%;
    overflow: hidden;
  }
  .detailsr>li{
    width: 100%;
    overflow: hidden;
    padding: 0.15rem 0;
  }
  .detailsr-left{
    float: left;
    padding-left:0.2rem
  }
  .detailsr-left>p{
    padding-bottom: 0.05rem;
  }
  .detailsr-left>span{
    display: block;
    display: inline-block;
    color: #666;
    font-size: 0.12rem;
  }
  .detailsr-right{
    float: right;
    padding-right: 0.2rem;
    font-size: 0.16rem;
    color: #00C6FF;
    font-weight: 900;
    padding-top:0.08rem;
  }
  .details{
    width:100%;

  }
  .integralDetails .loadPrompts {
    line-height:0.3rem;
    text-align: center;
    font-size: 0.14rem;
    color: #B4B4B4;
  }
</style>
