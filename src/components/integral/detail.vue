<template>
  <div class="detail">
    <vtitle @RUrl="agenBack" :isRUl="true" title="积分明细"></vtitle>
    <div class="detailConent">
      <ul class="detailConent-tit borderBottom-1px">
        <li @click="showatab" :class="{activeDetail:active1}">积分收入</li>
        <li @click="hidetab" :class="{activeDetail:active2}">积分消耗</li>
      </ul>
      <div class="detail-wrap" ref="detailWrap">
        <div class="details">
          <ul class="detailsr" v-if="active1">
            <li class="borderBottom-1px" v-for="item in detailList">
              <div class="detailsr-left">
                <p>{{item.remark}}</p>
                <span>{{item.recordTime | setTime}}</span>
              </div>
              <div class="detailsr-right">
                +{{item.point}}
              </div>
            </li>
            <div class="loadPrompts" v-if="loadSuccess">已全部加载完毕</div>
          </ul>
          <ul class="detailsr detailxh" v-else>
            <li class="borderBottom-1px" v-for="item in detailListTwo">
              <div class="detailsr-left">
                <p>{{item.remark}}</p>
                <span>{{item.recordTime | setTime}}</span>
              </div>
              <div class="detailsr-right">
                -{{item.point}}
              </div>
            </li>
            <div class="loadPrompts" v-if="loadSuccess">已全部加载完毕</div>
          </ul>
        </div>
      </div>
    </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import { mapState } from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  export default{
    data() {
      return{
        active1:true,
        active2:false,
        detailList: [],
        detailListTwo:[],
        userId: this.$store.state.userInfo.userId,
        currentPage:1,
        detailScroll:'',
        pagerNo:0,
        loadSuccess:false
      }
    },
    watch:{
      '$route':function () {
        if(this.$route.path.indexOf('detail')!=-1){
          this.loadSuccess=false;
          this.loadSuccess1=false;
          this.loadSuccess = false;
          this.active1=true;
          this.active2=false;
          this.detailList=[];
          this.detailListTwo=[];
          this.isJieliu=true;
          this.currentPage=0;
          this.detailScroll='';
          this.pagerNo=0;
          this.userId=this.userInfo.userId;
          this._detail();
        }
      },
      userId:function () {
        if(this.$route.path.indexOf('detail')!=-1){
//          this.detailList=[];
//          this.detailListTwo=[];
//          this._detail()
        }
      }
    },
    created(){
      this._detail();

    },
    methods:{
      _detail(){

        this.axios.get('/api/user/getAccountDetail', {
          params: {
            country:0,
            type:3,
            pageNo:this.currentPage,
            pageSize:25
          }
        }).then((res)=>{
          res = res.data;
          this.pagerNo=Math.ceil(Number(res.data.totalRows)/Number(res.data.pageSize))||0;
          if(res.result==0&&this.pagerNo>=this.currentPage){
            let length=this.detailListTwo.length;
            for(var i=0;i<res.data.list.length;i++){
              if(res.data.list[i].changeType == 1) {
                this.detailListTwo.push(res.data.list[i]);
              }else if(res.data.list[i].changeType == 0){
                this.detailList.push(res.data.list[i]);
              }
            }
          }else if(res.result==0&&this.pagerNo<this.currentPage){
            this.loadSuccess=true;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      agenBack() {
        window.history.back();
      },
      showatab(){

        this.active1 = true;
        this.active2 = false;
      },
      hidetab() {
        this.active1 = false;
        this.active2 = true;

      }
    },
    computed:{
      ...mapState(['userInfo','isLogin'])
    },
    components:{
      Vtitle
    }
  }
</script>
<style>
  .detail{
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 9;
    position: absolute;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 0.14rem;
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
    margin-top:0.45rem;
    background: #fff;
  }
  .detailConent-tit{
    width: 100%;
    height: 0.46rem;
    display: block;
    display: flex;
  }
  .detailConent-tit>li{
    display: block;
    flex: 1;
    text-align: center;
    line-height: 0.46rem;
    color: #1C1C1C;
    font-size: 0.16rem;
  }
  .detailConent-tit .activeDetail{
    color: #E7374B;
    border-bottom: 1px solid #E7374B;
    z-index: 999;
  }
  .detail-wrap{
    position: absolute;
    top:0.91rem;
    bottom:0;
    width:100%;
    overflow: hidden;
    background: #fff;
    z-index: 9
  }
  .detailsr{
    width: 100%;
    overflow: hidden;
  }
  .detailsr>li{
    width: 100%;
    overflow: hidden;
    padding: 0.2rem 0;
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
    color: #E7374B;
    font-weight: 900;
    padding-top:0.08rem;
  }
  .details{
    width:100%;

  }
  .detail .loadPrompts {
    line-height:0.3rem;
    text-align: center;
    font-size: 0.14rem;
    color: #B4B4B4;
  }
</style>
