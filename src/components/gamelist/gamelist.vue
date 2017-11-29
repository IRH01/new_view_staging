<template>
  <div class="gamelist">
    <div class="zwtop"></div>
    <div class="content">
      <vtitle :title="gameInfo.name" @RUrl="back" :isRUl="true"></vtitle>
      <slider :sImage="gamesImgaes" urlName="pictureUrl" :isEnlarge="true"></slider>
      <div class="desc">
        <p><span></span>游戏简介</p>
        <div>{{gameInfo.summary|limitWord(151)}}</div>
      </div>
      <ul class="list">
        <li @click="_record">
          <span>游戏记录</span>
          <span></span>
        </li>
        <li @click="routeUrl('rule')">
          <span>游戏规则</span>
          <span></span>
        </li>
      </ul>
      <div class="button">
        <div>
          <button @click="joinGame(gameInfo.id,gameInfo.name)">开始游戏</button>
        </div>
        <!--暂时隐藏-->
        <!--<div v-if="(packageName.android&&platformTerminal==3)||(packageName.ios&&platformTerminal==2)">-->
          <!--<button @click="down">打开app玩</button>-->
        <!--</div>-->
      </div>
    </div>
    <div class="zwbuttom"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import Slider from '../../base/slider/slider.vue';
  export default {
    data(){
      return {
        gameInfo:'',//游戏资料
        gamesImgaes:[],//游戏轮播图
        id:this.$route.params.id,
        packageName:{},//包名
        androidAppUrl:'',//安卓下载地址
        iosAppUrl:'',//ios下载地址
      }
    },
    watch:{
      '$route':function () {
        if(this.$route.path.indexOf('gamelist')!=-1){
          this.id=this.$route.params.id;
          this.gameInfo='';//游戏资料
          this.gamesImgaes=[];//游戏轮播图
          this.packageName={};//包名
          this.androidAppUrl='';//安卓下载地址
          this.iosAppUrl='';//ios下载地址
          this.getGameById();
          this.gamePictureInfo();
        }
      }
    },
    created(){
      this.getGameById();
      this.gamePictureInfo();
    },
    computed:{
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    },
    methods:{
      back(){
        history.back()
      },
      down(){
        var url = {
          iosOpen: this.packageName.ios,
          androidOpen: this.packageName.android,
          down: ''
        };
        if(navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)){
          url.down=this.iosAppUrl;
        }else if(navigator.userAgent.match(/android/i)){
          url.down=this.androidAppUrl;
        }
        var iframe = document.createElement('iframe');
        var body = document.body;
        iframe.style.cssText = 'display:none;width=0;height=0';
        var timer, state = true;

        // 微信浏览器
        if (/MicroMessenger/gi.test(navigator.userAgent)) {
//          state = false;
//          location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zcopain';
        } else {
          if(this.packageName.ios||this.packageName.android){
            // ios
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
              if(localStorage.getItem('token')&&localStorage.getItem('token')!='undefined'){
                location.href = url.iosOpen+'LYGametoken='+localStorage.getItem('token');
              }else {
                location.href = url.iosOpen;
              }
              // andriod
            } else if (navigator.userAgent.match(/android/i)) {
              if(localStorage.getItem('token')&&localStorage.getItem('token')!='undefined'){
                var tk = localStorage.getItem('token');
                iframe.src = url.androidOpen+'w1x?lygametoken='+tk;
              }else {
                iframe.src = url.androidOpen;
              }

              document.body.appendChild(iframe);
            }
          }
        }
        document.addEventListener('visibilitychange', function () {
          state = false;
        }, false)

        timer = setTimeout(function () {
          if (state) {
            location.href = url.down;
          }
        }, 1000);
      },
      routeUrl(value){
        this.$router.push({path:'/'+value+"/"+this.$route.params.id});
      },
      joinGame(id,name){
        this.gameStatisticsClick(this.userInfo.userId?this.userInfo.userId:'',window.location.href,name?name:'',id);
        this.$router.push({path:'/games/'+id});
      },
      _record(){
        if(!this.isLogin){
          this.$router.push({path:'/login'});
        }else {
          this.$router.push({path:'/record/'+this.$route.params.id});
        }
      },
      getGameById(){

        this.axios.get('/api/index/getGameById', {
            params: {
              terminal:4,
              platformId:this.$route.params.id
            }
          }).then((res)=>{
            res = res.data;
            if(res.result===0&&res.data!=null){
              this.gameInfo = res.data;

              this.androidAppUrl=res.data.androidAppUrl;
              this.iosAppUrl=res.data.iosAppUrl;
              if(res.data.packageName){
                let packageNameArr=res.data.packageName.split("|");
                for(let i=0;i<packageNameArr.length;i++){
                  let packageNameArr2=packageNameArr[i].split(":");
                  if(packageNameArr2[2]){
                    this.packageName[packageNameArr2[0]]=packageNameArr2[1]+':'+packageNameArr2[2];
                  }else {
                    this.packageName[packageNameArr2[0]]=packageNameArr2[1];
                  }
                }
              }
            }else{
              this.gameInfo=''
            }
          }).catch( (response) => {
            console.log(response);
          });
      },
      gamePictureInfo(){
        this.axios.get('/api/index/getIndexlbt', {
          params: {
            relevanceId:this.$route.params.id,
            pictureType:4
          }
        }).then((res)=>{
          res = res.data;
         if(res.result===0){
             this.gamesImgaes = res.data.list;
             console.log(JSON.stringify(res.data.list));
         }
        }).catch( (response) => {
          console.log(response);
        });
      }
    },
    components: {
      Vtitle,
      Slider
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .gamelist {
    font-size: 0.16rem;
    background-color: #f5f7f8;
    height: 100%;
    display: block;
    display: flex;
    flex-direction: column;
    .zwtop{
      height: 0.44rem;
      width: 100%;
    }
    .zwbuttom{
      height: 0.5rem;
      width: 100%;
    }
    .content{
      flex: 1;
      .desc{
        padding: 0.1rem 0.2rem 0.15rem 0.2rem;
        min-height: 1.5rem;
        background-color: #fff;
        padding-bottom:0.2rem;
        >p{
          color:deepskyblue;
          font-size: 0.15rem;
          margin-bottom: 0.1rem;
          padding-top:0.2rem;
          span{
            display: block;
            width: 0.04rem;
            height: 0.15rem;
            background: #FF8D4C;
            float: left;
            margin-right: 0.08rem;
          }
        }
        >div{
          font-size: 0.12rem;
          word-wrap: break-word;
          word-break: break-all;
          line-height: 0.15rem;
          color: #666;
          text-indent: 0.2rem;
        }
      }
      .list{
        margin-top: 0.1rem;
        background-color: #fff;
        padding-left: 0.2rem;
        margin-bottom: 0.5rem;
        >li{
          height: 0.45rem;
          line-height: 0.45rem;
          padding-right: 0.2rem;
          display: block;
          display: flex;
          >span:nth-of-type(1){
            display: block;
            height: 0.45rem;
            flex: 1;
            font-size: 0.14rem;
          }
          >span:nth-of-type(2){
            display: block;
            height: 0.45rem;
            width: 0.45rem;
            background-image: url("./right.png");
            background-size: 0.08rem 0.15rem;
            background-position: center right;
            background-repeat: no-repeat;
          }
        }
        >li:nth-of-type(1){
          border-bottom: 1px solid #e9e9e9;
        }
      }
      .button{
        position: fixed;
        bottom: 0;
        left: 0;
        height: 0.5rem;
        width: 100%;
        background-color: #fff;
        display: block;
        display: flex;
        >div {
           display: block;
           flex:1;
           height:0.5rem;
           padding-top:0.07rem;
           button{
             display: block;
             border: 1px solid deepskyblue;
             background-color: deepskyblue;
             color: #fff;
             font-size: 0.15rem;
             height: 0.36rem;
             width: 90%;
             margin: 0 auto;
             border-radius: 0.5rem;
           }
         }
      }
    }

  }
</style>
