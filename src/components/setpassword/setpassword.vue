<template>
    <div class="setpassword">
      <vtitle title="找回密码" @RUrl="back" :isRUl="true" :isFixed="false"></vtitle>
      <div class="setpassword-content">
        <ul>
          <li class="borderBottom-1px"><input type="text" placeholder="输入6-18位新密码" v-model="pwd" maxlength="18"  onpaste="return false" onkeyup="value=value.replace(/[\W]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"></li>
        </ul>
        <popUps ref="pop"></popUps>
        <div class="go-wapper">
          <div class="go" @click="_goSet">提交</div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';

  let fromGamingUrl = window.location.search;

  export default {
    data(){
      return {
        pwd:''
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('setpassword')!=-1){
          this.pwd = '';
        }
      }
    },
    methods:{
      back() {
        this.$router.back();
      },
      _goSet() {
        if(!this.pwd){
          this.$refs.pop.show('请输入新的密码');
          return;
        }
        if(this.pwd.length<6){
          this.$refs.pop.show('密码长度不能低于六位');
          return;
        }
        if(this.pwd.length>18){
          this.$refs.pop.show('密码长度不能大于十八位');
          return;
        }
        if(!RegExp(/^[A-Za-z0-9]*$/g).test(this.pwd)){
          this.$refs.pop.show('密码为6-18位字母和数字');
          return;
        }
        let sessionId = sessionStorage.getItem('sessionId');
        sessionStorage.removeItem('sessionId');

        this.axios.get('/api/forgetPassword/updatePassword', {
          params: {
            sessionId:sessionId,
            newPassword:hex_md5(this.pwd).toUpperCase(),
            accountType:3
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            this.$refs.pop.show('密码修改成功');
            setTimeout(()=>{
              this.$router.push('/login'+fromGamingUrl);
              this.getUserInfo();
            },2000);
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
    },
    components:{
      popUps,
      Vtitle
    },
    computed:{
      ...mapState([
        'isLogin'
      ])
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>
  .setpassword {
    height:100%;
    width: 100%;
    background: #F5F5F5;
    .setpassword-content {
      ul {
        background: #FFFFFF;
        padding-left:0.14rem;
        li {
          height:0.5rem;
          line-height:0.5rem;
          font-size: 0.11rem;
          display: block;
        }
      }
      .go-wapper {
        padding: 0.25rem 0.38rem;
        .go {
          height:0.46rem;
          line-height:0.46rem;
          background: #00A8FF;
          font-size: 0.15rem;
          color: #FFFFFF;
          border-radius: 0.23rem;
          text-align: center;
        }
      }
    }
  }
</style>
