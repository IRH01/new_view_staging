<template>
  <div class="mine">
    <vtitle title="我的" :isRUl="false" :isFixed="true" v-if="!isLogin"></vtitle>
    <div class="mine-func" :class="{paddingTop:!isLogin}">
      <div class="notLogin" v-if="!isLogin">
        <span><img src="./avatar.png" alt=""></span>
        <span @click="go('login?mine=1')">登录</span>
        <span @click="go('register')">快速注册</span>
      </div>
      <div class="Login" v-else @click="go('personalInfo')">
        <div class="title" v-if="isLogin">我的</div>
        <span>
          <img :src="avatarUrl" alt="" v-if="avatarUrl">
          <img src="./avatar.png" alt="" v-else>
        </span>
        <span>{{nickName}}</span>
        <span></span>
      </div>
      <ul class="firstUl">
          <li class=" recharge" @click="_link(item.title,item.jumpUrl)" v-for="item in menuList1">
            <span><img :src="item.imgUrl" alt=""></span>
            <span>{{item.title}}</span>
            <span></span>
          </li>
      </ul>
      <ul>
          <li class=" recharge" @click="_link(item.title,item.jumpUrl)" v-for="item in menuList2">
            <span><img :src="item.imgUrl" alt=""></span>
            <span>{{item.title}}</span>
              <span>
                 <i class="redDot" v-if="unreads&&isLogin&&(item.title.indexOf('我的消息')!='-1'||item.title.indexOf('information')!='-1')"></i>
              </span>
          </li>
      </ul>
      <ul>
        <li class=" recharge" @click="_link(item.title,item.jumpUrl)" v-for="item in menuList3">
          <span><img :src="item.imgUrl" alt=""></span>
          <span>{{item.title}}</span>
              <span></span>
        </li>
      </ul>
      <ul>
        <li class=" recharge" @click="_link(item.title,item.jumpUrl)" v-for="item in menuList4">
          <span><img :src="item.imgUrl" alt=""></span>
          <span>{{item.title}}</span>
          <span>
               <i class="redDot" v-if="isLogin&&!unBindPhone&&(item.title.indexOf('设置')!='-1'||item.title.indexOf('set')!='-1')"></i>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';
  import { qsort } from '../../common/js/quickSort';

  export default {
    data(){
      return {
        avatarUrl:this.$store.state.userInfo.headIcon,
        nickName:this.$store.state.userInfo.nickname,
        unreads:0,//获取未读信息条数
        unBindPhone:this.$store.state.userInfo.phone,
        menuList1:[],
        menuList2:[],
        menuList3:[],
        menuList4:[]
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('mine')!=-1){
          this.menuList1=[];
          this.menuList2=[];
          this.menuList3=[];
          this.menuList4=[];
          this.getUnreads();
          this._menuList();
          this.getUserInfo();
          setTimeout(()=>{
            if(this.userInfo.headIcon!==this.avatarUrl){
              this.avatarUrl = this.userInfo.headIcon;
            }
            if(this.userInfo.nickname!==this.nickName){
              this.nickName = this.userInfo.nickname;
            }
            if(this.userInfo.phone!==this.unBindPhone){
              this.unBindPhone = this.userInfo.phone;
            }
          },20);
        }
      }
    },
    created(){
      this.getUnreads();
      this._menuList();
      setTimeout(()=>{
        if(this.userInfo.headIcon!==this.avatarUrl){
          this.avatarUrl = this.userInfo.headIcon;
        }
        if(this.userInfo.nickname!==this.nickName){
          this.nickName = this.userInfo.nickname;
        }
        if(this.userInfo.phone!==this.unBindPhone){
          this.unBindPhone = this.userInfo.phone;
        }
      },20);
    },
    methods:{
      go(url){
        this.$router.push({
          path:url
        })
      },
      _link(title,url){
        if(title.indexOf('充值')!=-1||url.indexOf('pay')!=-1){
          this.$router.push({path:'pay'});
        }else if(title.indexOf('划账')!=-1||url.indexOf('remitAccount')!=-1){
          this.$router.push({path:'remitAccount?fromMine=1'});
        }else if(title.indexOf('我的金币')!=-1||url.indexOf('mygold')!=-1){
          this.$router.push({path:'mygold?fromMine=1'});
        }else if(title.indexOf('游戏记录')!=-1||url.indexOf('gameLog')!=-1){
          this.$router.push({path:'gameLog'});
        }else if(title.indexOf('我的消息')!=-1||url.indexOf('information')!=-1){
          this.$router.push({path:'information'});
        }else if(title.indexOf('签到')!=-1||url.indexOf('qiandao')!=-1){
          this.$router.push({path:'qiandao'});
        }else if(title.indexOf('任务')!=-1||url.indexOf('integral')!=-1){
          this.$router.push({path:'integral'});
        }else if(title.indexOf('设置')!=-1||url.indexOf('set')!=-1){
          this.$router.push({path:'set'});
        }else {
          window.location.href = url;
        }
      },
      _menuList(){

        this.axios.get('/api/menu/menuList', {
          params: {
            parentMenuType:2
          }
        }).then((res)=>{
          res = res.data;
          if(res.result===0){
            for(let i=0;i<res.data.length;i++){
              if(res.data[i].childMenuType==1){
                this.menuList1 = this.menuList1.concat(res.data[i]);
              }else if(res.data[i].childMenuType==2){
                this.menuList2 = this.menuList2.concat(res.data[i]);
              }else if(res.data[i].childMenuType==3){
                this.menuList3 = this.menuList3.concat(res.data[i]);
              }else if(res.data[i].childMenuType==4){
                this.menuList4 = this.menuList4.concat(res.data[i]);
              }
            }
            this.menuList1 = qsort(this.menuList1,'sort');
            this.menuList2 = qsort(this.menuList2,'sort');
            this.menuList3 = qsort(this.menuList3,'sort');
            this.menuList4 = qsort(this.menuList4,'sort');
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      getUnreads(){
        this.axios.get('/api/userMsg/getUnreadMsg', {
          params: {
            plateformId:4
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            this.unreads = res.data.unreads;
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
    },
    components:{
      Vtitle
    },
    computed:{
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>

  .mine {
    height:100%;
    width: 100%;
    background-color:#f5f7f8;
    .paddingTop{
      padding-top:0.44rem;
    }
    .mine-func {
      padding-bottom:0.55rem;
      .notLogin {
        height:1rem;
        color: #FFFFFF;
        background:deepskyblue;
        background-image: linear-gradient(to right,#00C6FF,#0072FF);
        background:-webkit-linear-gradient(to right,#00C6FF,#0072FF);
        background: -moz-linear-gradient(to right,#00C6FF,#0072FF);
        background: -o-linear-gradient(to right,#00C6FF,#0072FF);
        overflow:hidden;
        span:nth-child(1){
          display: block;
          width:0.6rem;
          height:0.6rem;
          margin: 0.2rem;
          border-radius: 50%;
          float: left;
          img {
            display: block;
            height:100%;
            width: 100%;
          }
        }
        span:nth-child(2){
          display: block;
          font-size: 0.14rem;
          padding:0.08rem 0.25rem;
          color: #fff;
          border: 1px solid #fff;
          border-radius: 0.15rem;
          margin-top: 0.40rem;
          margin-right: 0.2rem;
          float: left;
        }
        span:nth-child(3){
          display: block;
          font-size: 0.14rem;
          padding:0.08rem 0.25rem;
          color: #fff;
          border: 1px solid #fff;
          border-radius: 0.15rem;
          margin-top: 0.40rem;
          float: left;
        }
      }
      >div.Loginheight{
        height: 1.44rem;
      }
      .Login {
        height:1.44rem;
        color: #FFFFFF;
        background:url("minebg.png") no-repeat center;
        background-size:100% 100%;
        overflow:hidden;
        >div:nth-of-type(1){
          height: 0.44rem;
          line-height: 0.44rem;
          text-align: center;
          font-size:0.18rem;
        }
        span:nth-of-type(1){
          display: block;
          width:0.6rem;
          height:0.6rem;
          margin: 0.2rem 0.2rem 0 0.25rem;
          border-radius: 50%;
          float: left;
          img {
            display: block;
            border-radius: 50%;
            height:0.6rem;
            width: 0.6rem;
            background: #ffffff;
          }
        }
        span:nth-of-type(2){
          display: block;
          font-size: 0.14rem;
          width: 2.2rem;
          line-height:1rem;
          height: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          float: left;
        }
        span:nth-of-type(3){
          display: block;
          height:1rem;
          width: 0.4rem;
          background: url("./go.png") no-repeat center;
          -webkit-background-size:0.1rem 0.15rem;
          background-size:0.08rem 0.15rem;
          float: right;
        }
      }

      ul {
        margin-bottom:0.1rem;
        padding-left: 0.2rem;
        background: #fff;
        li {
          height: 0.5rem;
          line-height:0.5rem;
          font-size: 0.13rem;
          display: block;
          display: flex;
          border-bottom: 1px solid #e9e9e9;
          span:nth-child(1){
            display: block;
            height:100%;
            margin: 0 0.1rem 0 0;
            img {
              display: block;
              width:0.2rem;
              height:0.2rem;
              padding-top: 0.15rem;
              margin: 0 auto;
            }
          }
          span:nth-child(2){
            display: block;
            flex:1;
          }
          span:nth-child(3){
            position: relative;
            display: block;
            height:100%;
            width: 0.4rem;
            background: url("./go.png") no-repeat center;
            -webkit-background-size:0.1rem 0.15rem;
            background-size:0.08rem 0.15rem;
            .redDot {
              display: block;
              position: absolute;
              height: 0.1rem;
              width: 0.1rem;
              left: -0.1rem;
              top:0.2rem;
              border-radius: 50%;
              background: red;
            }
          }
        }
        >li:nth-last-of-type(1){
          border-bottom: none;
        }
      }
      .firstUl{
        padding-top:0;
        >li:nth-child(1) {
          height: 0.49rem;
        }
      }
    }
  }

</style>
