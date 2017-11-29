<template>
  <div class="set">
      <vtitle @RUrl="back" :isRUl="true" title="设置"></vtitle>
      <div class="setMin">
        <ul>
            <li @click="boundphone">
                <b>绑定手机</b><span class="boundPhone" ref="phonenum">{{bind}}</span><i></i>
            </li>
            <li @click="alterPass">
                 <b>修改密码</b><i></i>
            </li>
        </ul>
        <ul>
          <li @click="suggest">
            <b>意见反馈</b><span></span><i></i>
          </li>
          <li @click="about">
            <b>关于</b><span></span><i></i>
          </li>
          <li><b>版本</b><span></span>1.2.0</li>
        </ul>
        <button class="setBut" @click="showexit()" v-if="isLogin">退出登录</button>
      </div>
    <div class="m-loginexit"  v-show="showTc">
      <div class="loginexitCon">
        <div class="loginexitCon-pic"></div>
        <div class="loginexitCon-txt">是否确认退出当前登录帐号？</div>
        <div class="loginexitBut">
          <span @click="hideexit">取消</span>
          <span  @click="exit" v-if="isLogin">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';
    export default{
        data() {
            return{
                bind:"",
              showTc:false
            }
        },
      components:{
          Vtitle
      },
      watch:{
        $route(newVal){
          if(newVal.path.indexOf('set')!=-1){
            this.bind='';
            this.band();
          }
        }
      },
      created() {
        this.$nextTick(function () {
          setTimeout(()=>{
            this.band();
        },200);
        })
      },
      methods:{
        back(){
            this.$router.push({path:'mine'});
        },
        exit(){
          this.exitLogin();
          this.$router.push({path:'mine'});
          this.showTc=false
        },
        boundphone() {
              if(this.$store.state.userInfo.phone){
                this.$router.push('/tradebind')
              }else{
                this.$router.push('/boundphone')
              }

        },
        alterPass() {
              this.$router.push('/alterPass')
        },
        suggest() {
          this.$router.push('/suggest')
        },
        about() {
          this.$router.push('/about')
        },
        band() {
            if(this.$store.state.userInfo.phone) {
              let _this = this
              _this.bind = "已绑定"
              _this.$refs.phonenum.style.color = "#999"
//                this.bind = this.$store.state.userInfo.phone
//                if(this.bind.length>=11) {
//                    var bind = this.bind + ""
//                    var phoneNum = bind.substr(0, 3) + "****" + bind.substr(-4, 4)
//                    this.bind = phoneNum
//                }
            }else {
              this.bind = "未绑定"
              this.$refs.phonenum.style.color = "red"
            }
        },
        showexit() {
          this.showTc = true
        },
        hideexit() {
          this.showTc = false
        },
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
  .set{
    width:100%;
    position: absolute;
    right:0;
    left:0;
    top:0;
    bottom:0;
    background: #f5f7f8;
    .setMin{
      width: 100%;
      margin-top:0.44rem;
      ul{
        margin-top:0.15rem;
        background: #FFFFFF;
        li{
          height: 0.49rem;
          display: block;
          display: flex;
          border-bottom: 1px solid #f5f5f5;
          line-height: 0.49rem;
          padding:0 0.2rem;
            b{
              font-size: 0.13rem;
              color: #1c1c1c;
              display: block;
              flex: 1;
              height:0.49rem;
            }
            span{
              display: block;
              width: 1rem;
              height: 0.49rem;
              text-align: right;
              padding-right:0.1rem;
            }
            .boundPhone{
              color: red;
            }
            i{
              display: block;
              width:0.08rem;
              height: 0.15rem;
              background: url("go.png") no-repeat center;
              background-size: 100% 100%;
              margin-top:0.17rem;
            }
        }
      }
      .setBut{
        width:100%;
        height: 0.44rem;
        background: #fff;
        text-align: center;
        line-height: 0.44rem;
        color: #1c1c1c;
        font-size: 0.15rem;
        margin-top:0.1rem;
      }
    }
  }
  .m-loginexit{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    z-index: 999;
    top:0;
    left:0;
  }
  .loginexitCon{
    width: 3rem;
    height:1.59rem;
    background: #fff;
    position: absolute;
    top:50%;
    margin-top:-0.8rem;
    left:50%;
    margin-left:-1.5rem;
    border-radius: 5px;
    box-shadow: 2px 2px 5px #888;
  }
  .loginexitCon-pic{
    width:0.7rem;
    height:0.7rem;
    background: url("tcgth.png") no-repeat center;
    background-size: 100% 100%;
    margin:0 auto;
    margin-top:-0.35rem;
    border-radius: 50%;
  }
  .loginexitCon-txt{
    text-align: center;
    font-size:0.16rem;
    color: #666;
    padding:0.3rem 0 0.3rem 0;
  }
  .loginexitBut{
    height:0.47rem;
    border-top:1px solid #f5f5f5;
  }
  .loginexitBut>span{
    display: block;
    display: inline-block;
    width:1.49rem;
    text-align: center;
    line-height: 0.47rem;
    font-size:0.16rem;
    color: #666;
    float: left;
  }
  .loginexitBut>span:nth-child(1){
    display: block;
    display: inline-block;
    border-right: 1px solid #f5f5f5;
  }
</style>















