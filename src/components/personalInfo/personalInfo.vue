<template>
    <div class="personalInfo">
      <vtitle title="个人资料" :isRUl="true" :isFixed="false" @RUrl="back"></vtitle>
      <div class="personalInfo-func">
        <div class="Login">
          <span>头像</span>
          <span>
            <img :src="avatarUrl" alt="" v-if="avatarUrl">
            <img src="./loginAvatar.png" alt="" v-else>
          </span>
          <span></span>
          <form id="uploadForm" class="file">
            <input type="file" id="upImg" name="imageFile" @change="upImage">
          </form>
        </div>
        <ul class="borderTop-1px">
          <li class="borderBottom-1px account">
            <span>账号</span>
            <span class="infozh">{{userInfo.userId}}</span>
          </li>
          <li class="borderBottom-1px nickname" @click="_link('changeName',nickName)">
            <span>昵称</span>
            <span class="infoxx">{{nickName}}</span>
          </li>
          <li class="borderBottom-1px sex" @click="changeSex">
            <span>性别</span>
            <span class="infoxx">{{sex[userInfo.sex]}}</span>
          </li>
          <li class="borderBottom-1px qqhao" @click="_link('changeQQ',QQ)">
            <span>QQ</span>
            <span class="infoxx">{{QQ}}</span>
          </li>
          <li class="borderBottom-1px location" @click="_link('changeAddress')">
            <span>地区</span>
            <span class="infoxx infodq">{{location}}</span>
          </li>
        </ul>
      </div>
      <div class="sex-select" v-if="isCover" >
        <ul :class="{RiseHigh:transition}">
          <li class="borderBottom-1px infoxx" v-for="(item,index) in sex" v-if="index>0" @click="sexSelect(index)">{{sex[index]}}</li>
        </ul>
      </div>
      <div class="Cover" v-if="isCover"></div>
      <div class="loading" v-if="loading"></div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';

  export default {
    data(){
      return {
        imgLoad:true,
        isCover:false,
        transition:false,
        sex:['','男','女','保密','取消'],
        avatarUrl:this.$store.state.userInfo.headIcon,
        nickName:this.$store.state.userInfo.nickname,
        QQ:this.$store.state.userInfo.qq,
        location:this.$store.state.userInfo.location,
        loading:false
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('personalInfo')!=-1){
          this.loading=false;
          setTimeout(() => {
            if(this.userInfo.headIcon!==this.avatarUrl){
              this.avatarUrl = this.userInfo.headIcon;
            }
            if(this.userInfo.nickname!==this.nickName){
              this.nickName = this.userInfo.nickname;
            }
            if(this.userInfo.qq!==this.QQ){
              this.QQ = this.userInfo.qq;
            }
            if(this.userInfo.location!==this.location){
              this.location = this.userInfo.location;
            }
          },20);
        }
      }
    },
    created(){
      setTimeout(()=>{
        if(this.userInfo.headIcon!==this.avatarUrl){
          this.avatarUrl = this.userInfo.headIcon;
        }
        if(this.userInfo.nickname!==this.nickName){
          this.nickName = this.userInfo.nickname;
        }
        if(this.userInfo.qq!==this.QQ){
          this.QQ = this.userInfo.qq;
        }
        if(this.userInfo.location!==this.location){
          this.location = this.userInfo.location;
        }
      },20);
    },
    methods:{
      back(){
        this.$router.back();
      },
      _link(url,txt){
          if(txt){
            this.$router.push({
              path:`${url}?${txt}`
            });
            return;
          }
        this.$router.push({
          path:`${url}`
        })
      },
      changeSex(){
        this.isCover = !this.isCover;
        setTimeout(() => {
          this.transition=!self.transition
        },50)
      },
      sexSelect(num){
        //性别 1男 2女 3保密 4取消
        if(num == 4|| this.userInfo.sex == num){
          this.transition = false;
          this.isCover = false;
          return;
        }

        this.axios.get('/api/user/updateUserInfo', {
          params: {
            sex:num
          }
        }).then((res)=>{
          res = res.data;
          this.isCover = false;
          this.transition = false;
          if(res.result==0){
            this.userInfo.sex = num;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      upImage(){
        if(this.imgLoad){
          this.imgLoad = false;
          this.loading=true;
          let formData = new FormData($('#uploadForm')[0]);
//          alert(Number($('#upImg')[0].files[0].size)/1024+'KB');
          let self = this;
          $.ajax({
            url: self.prefile ,
            type: 'POST',
            data: formData,
            dataType:'JSON',
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {

              self.axios.get('/api/user/updateUserInfo', {
                params: {
                  headIcon:JSON.parse(result).url
                }
              }).then((res)=>{
                res = res.data;
                self.$store.state.userInfo.headIcon=JSON.parse(result).url;
                self.avatarUrl=JSON.parse(result).url;
                self.imgLoad = true;
                self.loading=false;
              }).catch( (response) => {
                console.log(response);
              });

            },
            error: function (returndata) {
              console.log(returndata);
            }
          });
        }
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
  .Cover {
    height:100%;
    width: 100%;
    position: fixed;
    top:0;
    left:0;
    background:rgba(0,0,0,0.5);
    z-index: 10;
  }
  #upImg {
    display: block;
    height: 0.8rem;
    width: 100%;
    background: #fff;
    overflow: hidden;
    opacity: 0;
    position: absolute;
    top:0.44rem;
    left:0;
    z-index: 999;
  }
  .personalInfo {
    height:100%;
    width: 100%;
    background-color: #f5f7f8;
    .personalInfo-func {
      .Login {
        height:0.8rem;
        width: 100%;
        background:#fff;
        span:nth-child(2){
          display: block;
          width: 2.2rem;
          height:0.4rem;
          margin: 0.15rem 0 0 0;
          border-radius: 50%;
          float: left;
          img {
            display: block;
            float: right;
            height:0.5rem;
            width: 0.5rem;
            border-radius: 50%;
          }
        }
        span:nth-child(1){
          display: block;
          padding-left: 0.15rem;
          font-size: 0.14rem;
          width: 1rem;
          height:0.8rem;
          line-height:0.8rem;
          float: left;
        }
        span:nth-child(3){
          display: block;
          height:0.8rem;
          width: 0.4rem;
          background: url("./go.png") no-repeat center;
           -webkit-background-size:0.1rem 0.15rem;
          background-size:0.08rem 0.15rem;
          float: right;
        }
      }
      ul {
        padding-top:0.05rem;
        background: #fff;

        li {
          background: #fff;
          min-height: 0.5rem;
          line-height:0.5rem;
          font-size: 0.13rem;
          display: block;
          display: flex;
          span:nth-child(1){
            display: block;
            height: 0.5rem;
            line-height:0.5rem;
            width: 0.5rem;
            padding-left: 0.2rem;
          }
          .infoxx{
            display: block;
            flex:1;
            word-break: break-all;
            line-height:0.5rem;
            margin-right: 0.15rem;
            text-align: right;
            background: url("./go.png") no-repeat center right;
             -webkit-background-size:0.1rem 0.15rem;
            background-size:0.08rem 0.15rem;
            padding-right: 0.2rem;
          }
          .infodq{
            line-height: 0.25rem;
            padding: 0.12rem 0.2rem 0.08rem 0;
          }
          .infozh{
            display: block;
            flex:1;
            word-break: break-all;
            line-height:0.5rem;
            margin-right: 0.35rem;
            text-align: right;
            -webkit-background-size:0.1rem 0.15rem;
            background-size:0.08rem 0.15rem;
          }
        }
        /*li:nth-child(1) span{*/
          /*padding-right: 0;*/
          /*background: #fff;*/
        /*}*/
      }
    }

    .sex-select {
      position: fixed;
      z-index: 11;
      width: 100%;
      left:0;
      bottom:0;
      ul.RiseHigh{
        height:1.6rem ;
      }
      ul {
        transition:height 1s ease;
        height: 0;
        overflow: hidden;
        li {
          height:0.4rem;
          width: 100%;
          line-height:0.4rem;
          text-align: center;
          font-size: 0.15rem;
          background: #FFFFFF;
        }
      }
    }
  }
  .loading{
    top:0;
    left:0;
    z-index:1000002;
    background-color:rgba(255,255,255,.6);
    width:100%;
    height:100%;
    position:fixed;
    overflow:hidden
  }
  .loading:before {
    content:"";
    background:url('./loading.acd260c1.png') center center no-repeat;
    height:.4rem;
    width:.4rem;
    top:50%;
    left:50%;
    position:fixed;
    margin:-0.2rem 0 0 -0.2rem;
    animation:loading .8s linear infinite;
    -webkit-animation:loading .8s linear infinite;
    background-size:100% 100%
  }
  .loading:after {
    content:"正在上传...";
    top:56%;
    left:50%;
    transform:translate(-44%,-50%);
    -ms-transform:translate(-44%,-50%);
    -webkit-transform:translate(-44%,-50%);
    -moz-transform:translate(-44%,-50%);
    -o-transform:translate(-44%,-50%);
    position:fixed;
    color:#1581cc;
    font-size:0.14rem;
  }
  @keyframes loading {
    0% {
      transform:rotate(0);
      -webkit-transform:rotate(0)
    }
    100% {
      transform:rotate(360deg);
      -webkit-transform:rotate(360deg)
    }
  }@-webkit-keyframes loading {
     0% {
       transform: rotate(0);
       -webkit-transform: rotate(0)
     }
     100% {
       transform: rotate(360deg);
       -webkit-transform: rotate(360deg)
     }
   }
</style>
