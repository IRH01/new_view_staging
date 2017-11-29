<template>
    <div class="find">
      <vtitle title="发现" :isFixed="false"></vtitle>
      <slider :sImage="slideImage" urlName="pictureUrl" :payFind="true"></slider>
      <div class="cooperation-link">
        <ul>
          <li class="borderBottom-1px" v-for="item in menuList" @click="jumpUrl(item.isJump,item.jumpUrl,item.title)">
            <span><img :src="item.imgUrl" alt=""></span>
            <span class="omitted">{{item.title}}</span>
            <span></span>
          </li>
        </ul>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import Slider from '../../base/slider/slider.vue';
  import { qsort } from '../../common/js/quickSort';
  export default {
    data(){
      return {
        slideImage:[],//轮播图数据
        menuList:[]
      }
    },
    created(){
      this.$nextTick(()=>{
        this.getSlideData();
        this._menuList();
      });
    },
    components:{
      Vtitle,
      Slider
    },
    methods:{
      goService(){
        window.location.href = 'http://www.71chat.com/scsf/phone/visitor.html?cmpcd=178019';
      },
      getSlideData(){
        this.axios.get('/api/index/getIndexlbt', {
          params: {
            pictureType:7
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
      _menuList(){
        this.axios.get('/api/menu/menuList', {
          params: {
            parentMenuType:1
          }
        }).then((res)=>{
          res = res.data;
          if(res.result===0){
            this.menuList = res.data;
            this.menuList = qsort(this.menuList,'sort');
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      jumpUrl(isJump,url,title){
        if(title=='商城'){
          if(localStorage.getItem('token')){
            window.location.href = url+'?fromWYXUrl='+ this.Url+'/find'+"&token=" + localStorage.getItem('token') ;
          }else {
            window.location.href = url+'?fromWYXUrl='+ this.Url+'/find';
          }

        }else if(title=='客服'){
          window.location.href = 'http://www.71chat.com/scsf/phone/visitor.html?cmpcd=178019';
        }else if(title=='合作伙伴'){
          if(localStorage.getItem('token')){
            this.axios.get(url, {
              params: {
                token:localStorage.getItem('token')
              }
            }).then((res)=>{
              res = res.data;
              if(res.result===0){
                url = res.data;
                let notic={
                  url:url,
                  title:title
                }
                sessionStorage.setItem("gamesUrl",JSON.stringify(notic));
                this.$router.push('/games/1?find=1');
              }else {
                this.$router.push('/login');
              }
            }).catch( (response) => {
              alert('服务未启动，请稍后再试')
              console.log(response);
            });
          }else {
            this.$router.push({path:'login'});
          }
        }else if(isJump==1&&url){
            let notic={
              url:url,
              title:title
            }
            sessionStorage.setItem("gamesUrl",JSON.stringify(notic));
            this.$router.push('/games/1?find=1');
        }
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
.find {
      display: block;
      height:100%;
      width: 100%;
      background-color: #f5f7f8;
      .cooperation-link {
        padding-top: 0.1rem;
        padding-bottom: 0.55rem;
        ul {
          background: #fff;
          padding-left: 0.2rem;
          li {
            height: 0.5rem;
            line-height:0.55rem;
            font-size: 0.13rem;
            display: block;
            display: flex;
            span:nth-child(1){
              display: block;
              height:100%;
              margin:0 0.1rem 0 0;
              img {
                display: block;
                width:0.2rem;
                height:0.2rem;
                padding-top: 0.18rem;
                margin: 0 auto;
              }
            }
            span:nth-child(2){
              display: block;
              flex:1;
            }
            span:nth-child(3){
              display: block;
              height:100%;
              width: 0.4rem;
              background: url("./go.png") no-repeat center;
              -webkit-background-size:0.1rem 0.15rem;
              background-size: 0.08rem 0.15rem;;
            }
          }
          /*.mall span:nth-child(1){*/
            /*background: url("./mall.png") no-repeat center;*/
            /*-webkit-background-size:0.2rem 0.2rem;*/
            /*background-size:0.2rem 0.2rem;*/
          /*}*/
          /*.customerService span:nth-child(1){*/
            /*background: url("./customerService.png") no-repeat center;*/
            /*-webkit-background-size:0.2rem 0.2rem;*/
            /*background-size:0.2rem 0.2rem;*/
          /*}*/
          /*.partner span:nth-child(1){*/
            /*background: url("./partner.png") no-repeat center;*/
            /*-webkit-background-size:0.2rem 0.2rem;*/
            /*background-size:0.2rem 0.2rem;*/
          /*}*/
          /*.activity span:nth-child(1){*/
            /*background: url("./activity.png") no-repeat center;*/
            /*-webkit-background-size:0.2rem 0.2rem;*/
            /*background-size:0.2rem 0.2rem;*/
          /*}*/
        }
      }
    }
</style>
