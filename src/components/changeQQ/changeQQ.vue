<template>
    <div class="changeQQ">
      <vtitle title="QQ" :isRUl="true" :isFixed="false" @RUrl="back">
        <span @click="save">保存</span>
      </vtitle>
      <div class="changeQQ-content">
        <div class="borderBottom-1px">
          <input type="text" placeholder="请输入您的QQ号码" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"  maxLength="12" pattern="[0-9]*" v-model="QQ"/>
          <span v-show="this.QQ" @click="delqq"></span>
        </div>
        <popUps ref="pop"></popUps>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';
  import popUps from '../../base/popUps/popUps.vue';

  export default {
    data(){
      return {
        QQ:'',
        xxshows:false
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('changeQQ')!=-1){
          if((window.location.href).indexOf('?') != -1) {
            this.QQ = String(window.location.href).substr(Number((window.location.href).indexOf('?'))+1,Number((window.location.href).length));
          }else {
            this.QQ = ""
          }
        }
      }
    },
    created(){
        if((window.location.href).indexOf('?') != -1) {
          this.QQ = String(window.location.href).substr(Number((window.location.href).indexOf('?'))+1,Number((window.location.href).length));
        }else {
            this.QQ = ""
        }

    },
    components:{
      Vtitle,
      popUps
    },
    methods:{
      back(){
        this.$router.back();
      },
      save(){
        if(this.QQ.trim() == ""){
          this.$refs.pop.show('请输入您的qq号码');
        }else if(!(/^\d{5,12}$/.test(this.QQ))){
          this.$refs.pop.show('请输入正确的qq号码');
        }else{
          this.userInfo.qq = this.QQ;
          this.axios.get('/api/user/updateUserInfo', {
            params: {
              qq:this.QQ
            }
          }).then((res)=>{
            this.$router.back();
          }).catch( (response) => {
            console.log(response);
          });
        }
        this.QQ = "";
      },
      delqq() {
          this.QQ = ""
      }
    },
    computed:{
      ...mapState([
        'userInfo'
      ])
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>

  .changeQQ {
    height:100%;
    width:100%;
    overflow:hidden;
    .title .title-r span{
      font-size: 0.15rem;
      float: right;
      padding-right: 0.1rem;
    }
    .changeQQ-content div:nth-child(1){
      height:0.5rem;
      width:100%;
      input {
        height:0.2rem;
        padding-left: 0.15rem;
        padding-top:0.15rem;
        padding-bottom: 0.15rem;
        font-size: 0.14rem;
        line-height:0.2rem;
      }
      span{
        display: block;
        width:0.4rem;
        height: 0.5rem;
        background: url("xx.png") no-repeat center;
        background-size: 0.2rem 0.2rem;
        float: right;
      }
    }
    .hint {
      display: none;
      height:0.5rem;
      line-height:0.5rem;
      padding-left: 0.15rem;
    }
  }

</style>
