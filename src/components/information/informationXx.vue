<template>
  <div class="informationXx">
    <vtitle @RUrl="agenBack" :isRUl="true" title="消息详情"></vtitle>
    <div class="informationXxcon">
      <h3>{{titles}}</h3>
      <span>{{times | getTime}}</span>
      <div class="txt" v-html="details">
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { mapState } from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  export default{
    data() {
      return{
        details : "",
        times:"",
        titles:"",
        userId: this.$store.state.userInfo.userId
      }
    },
    watch:{
      '$route':function () {
        if(this.$route.path.indexOf('informationXx')!=-1){
          this.userId=this.userInfo.userId;
          this.detail()
        }
      },
      userId: function () {
        if(this.$route.path.indexOf('informationXx')!=-1){
          this.detail();
        }
      }
    },
    created() {
      this.detail()
    },
    methods:{
      agenBack() {
        window.history.back();
      },
      detail() {
        this.axios.get('/api/userMsg/getMsgInfo', {
          params: {
            msgId:this.$route.params.id
          }
        }).then((res)=>{
          res = res.data;
          if(res.result == 0){
            this.details = res.data.content?res.data.content:res.data.synopsis;
            this.times = res.data.time;
            this.titles = res.data.title;
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
      ...mapState(['userInfo','isLogin'])
    }
  }
</script>
<style scoped>
  .informationXx{
    width:100%;
    background: #fff;
    position: absolute;
    top:0;
    bottom: 0;
    z-index: 9;
  }
  .informationXx-title{
    width:100%;
    height:0.45rem;
    background: #e7374b;
    display: flex;
    position:fixed ;
    z-index: 5;

  }
  .informationXx-title>span{
    display: block;
    display: inline-block;
    text-align: center;
    line-height: 0.45rem;
    color: #fff;
    font-size: 0.24rem;
  }
  .informationXx-title>span:not(:nth-child(2)){
    display: block;
    display: inline-block;
    width:0.45rem;
    height:0.45rem;
  }
  .informationXx-title>span:nth-child(2){
    display: block;
    flex:1;
  }
  .informationXxcon{
    width:90%;
    margin:0 auto;
    position: relative;
    top: 0.45rem;
  }
  .informationXxcon>h3{
    width:100%;
    font-size:0.18rem;
    color: #1c1c1c;
    padding:0.2rem 0.1rem 0.1rem 0rem;
    font-weight: 900;
  }
  .informationXxcon>span{
    display: block;
    display: inline-block;
    font-size: 0.14rem;
    color: #b4b4b4;
    padding-bottom: 0.1rem;
    display: block;
  }
  .txt{
    font-size:0.16rem;
    line-height: 0.2rem;
    overflow: hidden;
    width: 100%;
    word-wrap: break-word
  }
</style>
