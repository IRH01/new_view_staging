<template>
  <div class="changeAddress">
    <vtitle title="详细地址" :isRUl="true" :isFixed="false" @RUrl="back">
      <span @click="save">保存</span>
    </vtitle>
    <div class="changeAddress-content">
      <div class="borderBottom-1px"  id="demo1">
        <input type="text" id="value1" placeholder="请输入您的详细地址" v-model="location" readonly="readonly"/>
      </div>
      <popUps ref="pop"></popUps>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import {mapState} from 'vuex';
  import {are} from '../../common/js/Area';
  import popUps from '../../base/popUps/popUps.vue';

  export default {
    data(){
      return {
        location:this.$store.state.userInfo.location
      }
    },
    watch:{
      $route(){
        if(this.userInfo.location!==this.location){
          this.location = this.userInfo.location;
        }
      }
    },
    created(){
      this.$nextTick(()=>{
        this.init();
      });
    },
    components:{
      Vtitle,
      popUps
    },
    methods:{
      back(){
        this.$router.back();
      },
      init(){
        let ar= are().LArea;
        ar.init({
          'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
          'valueTo': '#value1', //选择完毕后id属性输出到该位置
          'keys': {
            id: 'name',
            name: 'name'
          }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
          'type': 1, //数据源类型
          'data': are().Data //数据源
        });
        ar.value=[1,13,3];//控制初始位置，注意：该方法并不会影响到input的value
      },
      save(){
        if(String(this.location).trim() == ""){
          this.$refs.pop.show('请选择所在地区');
        }else{
          this.userInfo.location = $('#value1').val();
          this.location = $('#value1').val();
          this.axios.get('/api/user/updateUserInfo', {
            params: {
              location:this.location
            }
          }).then((res)=>{
            this.$router.back();
          }).catch( (response) => {
            console.log(response);
          });
        }
        this.location = "";
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

  @import "../../common/style/dizhi.css";

  .changeAddress {
    height:100%;
    width:100%;
    background-color: #f5f7f8;
    overflow:hidden;
    .title .title-r span{
      font-size: 0.15rem;
      float: right;
      padding-right: 0.1rem;
    }
    .changeAddress-content div:nth-child(1){
      width:100%;
      input {
        display: block;
        height: 0.3rem;
        line-height:0.3rem;
        padding: 0.1rem 5%;
        width: 90%;
        font-size: 0.16rem;
        border: none;
        outline: none;
        resize: none;
        overflow-y: hidden;
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
