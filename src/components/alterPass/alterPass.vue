<template>
  <div class="alterPass">
    <vtitle @RUrl="agenBack" :isRUl="true" title="修改密码"></vtitle>
    <div class="alterCon">
      <ul class="alterConUl">
        <li class="yuanPwd"><b>原密码</b><input type="password" placeholder="请输入原密码" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))" v-model="yPass" @focus="ypass"/>
          <span :class="{'showPwd':showPwd1}" @click="togglePwdShow(1)"></span>
        </li>
        <li class="xinPwd">
          <b>新密码</b>
          <input type="password" placeholder="6-18个字符，区分大小写" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))" v-model="nPass" @focus="npass"/>
          <span :class="{'showPwd':showPwd2}" @click="togglePwdShow(2)"></span>
        </li>
      </ul>
      <div class="passTxt" v-if="isHint">{{rhint}}</div>
      <div class="passBtn" @click="passBtn">完&nbsp;成</div>
    </div>
    <popUps ref="pop"></popUps>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';
  import {mapState} from 'vuex';
  export default{
    data() {
      return{
        yPass:"",
        nPass:"",
        rhint:"",
        isHint:false,
        isYpwdShow:false,
        isXpwdShow:false,
        showPwd1:false,
        showPwd2:false,
      }
    },
    watch:{
      "$route": function () {
        if(this.$route.path.indexOf('alterPass')!=-1){
          this.yPass="";
          this.nPass="";
          this.isYpwdShow=false;
          this.isXpwdShow=false;
          this.showPwd1 = false;
          this.showPwd2 = false;
          $('.xinPwd input').attr('type','text');
          $('.xinPwd input').attr('type','password');
          $('.yuanPwd input').attr('type','text');
          $('.yuanPwd input').attr('type','password');

        }

      }
    },
    methods:{
      agenBack() {
        window.history.back();
      },
      passBtn() {
        if(this.yPass&&this.nPass){
          if(this.nPass.length>=6){
              if(this.nPass.length>18){
                this.$refs.pop.show('您输入的密码长度大于18位,请重新输入');
                return
              }
            if(RegExp(/^[A-Za-z0-9]*$/g).test(this.yPass)){
              this.axios.get('/api/user/resetPwd', {
                params: {
                  country:0,
                  oldPassword:hex_md5(this.yPass).toUpperCase(),
                  password:hex_md5(this.nPass).toUpperCase()
                }
              }).then((res)=>{
                res = res.data;
                if(res.result==0){
                  this.$refs.pop.show('修改成功，为保证账号安全，请重新登录');
                  let _this = this;
                  setTimeout(function () {
                    _this.exitLogin();
                    _this.$router.push('/login?alterPass=1');
                  },2000);
                }else {
                  this.$refs.pop.show(res.msg);
                  return
                }
              }).catch( (response) => {
                console.log(response);
              });
            }else{
              this.$refs.pop.show('密码仅能为数字,字母');
              return
            }
          }else{
            this.$refs.pop.show('您输入的密码长度不足6位,请重新输入');
            return
          }
        }else {
//          this.$refs.pop.show('请输入密码');
//          return
          if(!this.yPass && !this.nPass){
            this.$refs.pop.show('请输入原密码');
            return
          }else if(!this.yPass){
            this.$refs.pop.show('请输入原密码');
            return
          }else {
            this.$refs.pop.show('请输入新密码');
          }
        }
      },
      ypass() {
        this.isHint = false;
        this.rhint = '';
      },
      npass() {
        this.isHint = false;
        this.rhint = '';
      },
      togglePwdShow(num){
        if(num==1){
          if(!this.showPwd1){
            $('.yuanPwd input').attr('type','text');
          }else{
            $('.yuanPwd input').attr('type','password');
          }
          this.showPwd1 = !this.showPwd1;
        }else{
          if(!this.showPwd2){
            $('.xinPwd input').attr('type','text');
          }else{
            $('.xinPwd input').attr('type','password');
          }
          this.showPwd2 = !this.showPwd2;
        }
      }
    },
    components:{
      Vtitle,
      popUps
    },
    computed:{
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/style/variable.less";
  .alterPass{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background: #f5f7f8;
  }
  .alterPass-tit{
    width: 100%;
    height: 0.45rem;
    background: #E7374B;
    display: block;
    display: flex;
  }
  .alterPass-tit>span{
    display: block;
    display: inline-block;
    font-size: 0.24rem;
    text-align: center;
    line-height: 0.45rem;
    color: #fff;
  }
  .alterPass-tit>span:not(:nth-child(2)){
    display: block;
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
  }
  .alterPass-tit>span:nth-child(2){
    display: block;
    flex: 1;
  }
  .alterCon{
    margin-top:0.44rem;
  }
  .alterConUl>li{
    margin-top:0.1rem;
    padding:0.15rem 0;
    background: #fff;
    font-size: 0.14rem;
    display: block;
    display: flex;
  }
  .alterConUl>li>b{
    padding:0rem 0.15rem;
    width: 0.5rem;
    height: 0.3rem;
    display: block;
    line-height: 0.3rem;
  }
  .alterConUl>li>span{
    display: block;
    width: 0.3rem;
    height: 0.3rem;
    margin-right: 0.15rem;
    background:url('biyan.png') no-repeat center;
    background-size: 60%;
    text-align: center;
    font-size: 0.2rem;
    color: #666;
  }
  .alterConUl>li>input{
    display: block;
    flex: 1;
  }
  .passTxt{
    width: 100%;
    padding-top:0.1rem;
    color: red;
    text-align: center;
    font-size: 0.16rem;
  }
  .yuanPwd .showPwd , .xinPwd .showPwd{
    background:url("./zhengyan.png") no-repeat center;
    -webkit-background-size:50%;
    background-size:50%;
  }


  .passBtn{
    width: 3rem;
    height: 0.4rem;
    border-radius: 0.5rem;
    background: deepskyblue;
    text-align: center;
    line-height: 0.4rem;
    color: #fff;
    font-size: 0.15rem;
    margin:0.3rem auto;
  }
</style>
