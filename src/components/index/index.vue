<template>
  <div class="index">
    <slider :sImage="slideImage" urlName="pictureUrl"></slider>
    <bulletin :bulletinData="bulletinData"></bulletin>
    <div class="samlltitle titleBorderTop" v-if="gamesList.length>=1">
      <span></span>
    </div>
    <games :gamesList="gamesList" :paddingTopNone="true"></games>
    <div class="samlltitle titleBorderbot">
      <span></span>
    </div>
    <ul class="hotActivity">
      <li v-for="(item,index) in activity" @click="_activity(item.redirectUrl,item.title)" v-if="index<3">
        <div :class="{paddingTopNone:index==0}"><img :src="item.imageUrl"></div>
        <div>{{item.title}}</div>
      </li>
    </ul>
    <div class="complete">
      已全部加载
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import Slider from '../../base/slider/slider.vue';
  import Bulletin from '../bulletin/bulletin.vue';
  import Games from '../../base/games/games.vue';
  export default {
    created(){
      this.getSlideData();
      this.getBulletin();
      this.getIndexGameByModelId();
      this.statisticsPageTraffic('1',this.userInfo.userId?this.userInfo.userId:'',window.location.href);
    },
    watch:{
      '$route':function () {
          if(this.$route.path.indexOf('index')!=-1){
            this.getIndexGameByModelId();
            this.statisticsPageTraffic('1',this.userInfo.userId?this.userInfo.userId:'',window.location.href);
          }
      }
    },
    data(){
      return {
        slideImage:[],//轮播图数据
        bulletinData:[],//公告栏数据
        deadline:'',//公告过期时间
        gamesList:[],//独家推荐游戏列表
        activity:[],//热门活动列表
        isJieliu:true,//下拉刷新控制
        pageNo:1,//下拉刷新页码
      }
    },
    computed:{
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    },
    methods:{
      _activity(url,title){
        if(url!=this.Url && url!=''){
          window.location.href = url
//          let notic={
//            url:url,
//            title:title
//          }
//          sessionStorage.setItem("gamesUrl",JSON.stringify(notic));
//          this.$router.push('/games/1');
        }
      },
      getSlideData(){
        this.axios.get('/api/index/getIndexlbt', {
          params: {
            terminal:4
          }
        }).then((res)=>{
          res = res.data;
          if(res.result===0){
            this.slideImage = res.data.list;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      getBulletin(){
        this.axios.get('/api/activity/getActivityInfo', {
          params: {
            terminal:4,
            type:3
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            this.bulletinData = res.data.list;
            this.deadline=res.systemTime;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      getIndexGameByModelId(){
        this.gamesList = [];

        this.axios.get('/api/pageActivity/getIndexActivityByModelId', {
          params: {
            modelId:9,
            terminal:4
          }
        }).then((res)=>{
          res = res.data;
          this.activity=res.data.list
        }).catch( (response) => {
          console.log(response);
        });

        this.axios.get('/api/index/getIndexGameByModelId', {
          params: {
            terminal:4
          }
        }).then((res)=>{
          res = res.data;
          if(res.result===0){
            for(let j =0 ; j<res.data.list.length;j++){
              if(res.data.list[j].platformTerminal!=1&&this.platformTerminal!=res.data.list[j].platformTerminal&&res.data.list[j].modeId==5){
                this.gamesList.push(res.data.list[j])
              }
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      loadMore(){
        let _this = this;
        $(window).scroll(function(){
          if(($(this).scrollTop()>=$('.index').height()-$(window).height())&&_this.isJieliu&&$('.index').height()!=0){
            _this.isJieliu = false;
            _this.pageNo++;
            _this.getIndexGameByModelId();
          }
        })
      }
    },
    components: {
      Vtitle,
      Slider,
      Bulletin,
      Games
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  .index {
    font-size: 0.16rem;
    padding: 0rem 0 0.54rem 0;
    background-color: #f5f7f8;
    .samlltitle{
      background-color: #fff;
      height: 0.44rem;
      display: block;
      display: flex;
      justify-content: center;
      >span:nth-of-type(1){
        height: 0.44rem;
        width: 1rem;
        display: block;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 1rem 0.15rem;
      }
    }
    .titleBorderbot{
      >span{
        background-image: url("./indexbot.png");
      }
    }
    .titleBorderTop{
      >span{
        background-image: url("./indextop.png");
      }
    }
    .hotActivity{
      background-color: #f5f7f8;
      >li{
        /*padding-bottom: 0.1rem;*/
         padding: 0.11rem 0.05rem 0rem;
        >div:nth-of-type(1){
          height: 1.81rem;
          width: 3.65rem;
          background-color: #fff;
          >img{
            width: 100%;
            height: 100%;
          }
        }
        >div.paddingTopNone{
          padding-top: 0;
        }
        >div:nth-of-type(2){
          height: 0.51rem;
          line-height: 0.51rem;
          background-color: #FFFFFF;
          padding: 0 0.1rem;
          font-size: 0.13rem;
          color: #161616;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      >li:nth-last-of-type(1){
        padding-bottom: 0rem;
      }
    }
    .complete{
      height: 0.35rem;
      line-height: 0.35rem;
      text-align: center;
      font-size: 0.12rem;
      background-color: #f5f7f8;
      color: #666;
    }
  }
</style>
