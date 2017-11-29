<template>
<div class="rule">
  <vtitle title="游戏规则" @RUrl="back" :isRUl="true"></vtitle>
  <div v-html="html" class="html" style="width: 100%;word-break:break-all;
    word-wrap:break-word;word-break: normal;"></div>
</div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  export default {
    data(){
      return {
        html:''
      }
    },
    watch:{

    },
    created(){
        this.getGameById()
    },
    computed:{
      ...mapState([
        'isLogin'
      ])
    },
    methods:{
      back(){
        history.back()
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
            this.html = res.data.rule;
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
    },
    components: {
      Vtitle
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
.rule{
  height:100%;
  width: 100%;
  overflow-x: hidden;
  padding: 0 0.1rem 0;
  .html{
    height:100%;
    padding-top: 0.5rem;
  }
}
</style>
