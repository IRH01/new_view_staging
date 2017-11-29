<template>
    <div class="changeName">
      <vtitle title="修改昵称" :isRUl="true" :isFixed="false" @RUrl="back">
        <span @click="save">保存</span>
      </vtitle>
      <div class="changeName-content">
        <div class="borderBottom-1px">
          <input type="text" placeholder="请输入您的昵称"  v-model="name" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" >
          <span v-show="this.name" @click="delName"></span>
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
        name:'',
        xxshow:false
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('changeName')!=-1){
          if((window.location.href).indexOf('?')!=-1){
            this.name = decodeURIComponent(String(window.location.href).substr(Number((window.location.href).indexOf('?'))+1,Number((window.location.href).length)));
          }else {
            this.name = ""
          }
        }
      }
    },
    created() {
        if((window.location.href).indexOf('?')!=-1){
          this.name = decodeURIComponent(String(window.location.href).substr(Number((window.location.href).indexOf('?'))+1,Number((window.location.href).length)));
        }else {
            this.name = ""
        }
    },
    methods:{
      back(){
        this.$router.back();
      },
      save(){
        if(this.name.trim() == ""){
          this.$refs.pop.show('请输入您的昵称');
        }else if(this.name.length>15) {
          this.$refs.pop.show('昵称长度限15字内');
        }else{
          let name = this.name;

          this.axios.get('/api/userUtil/keyWordFilter', {
            params: {
              nickname:name
            }
          }).then((res)=>{
            res = res.data;
            if(res.result==0){
              this.userInfo.nickname = name;
              this.axios.get('/api/user/updateUserInfo', {
                params: {
                  nickname:name
                }
              }).then((res)=>{
                this.$router.back();
              }).catch( (response) => {
                console.log(response);
              });
            }else{
              this.$refs.pop.show(res.msg);
            }
          }).catch( (response) => {
            console.log(response);
          });
          this.name = "";
        }
      },
      delName() {
          this.name = ""
      }
    },
    components:{
      Vtitle,
      popUps
    },
    computed:{
      ...mapState([
        'userInfo'
      ])
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>

  .changeName {
    height:100%;
    width:100%;
    overflow:hidden;
    .title .title-r span{
      font-size: 0.15rem;
      float: right;
      padding-right: 0.1rem;
    }
    .changeName-content div:nth-child(1){
      height:0.5rem;
      width:100%;
      input {
        height:0.2rem;
        padding-left: 0.15rem;
        padding-top:0.15rem;
        padding-bottom: 0.15rem;
        font-size: 0.14rem;
        line-height:0.2rem;
        width:80%;
      }
      span{
        display: block;
        width:0.2rem;
        height: 0.2rem;
        background: url("xx.png") no-repeat center;
        background-size: 100% 100%;
        float: right;
        margin: 0.14rem 0.1rem;
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
