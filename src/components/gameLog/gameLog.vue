<template>
<div class="gameLog">
  <div class="zwtop"></div>
  <div class="content">
    <vtitle title="选择查看游戏" @RUrl="back" :isRUl="true"></vtitle>
    <ul class="gameList">
      <defaultPage v-if="!gamesList.length"></defaultPage>
      <li v-for="item in gamesList" @click="routeUrl(item.id)">
        <span class="omitted">{{item.name}}</span>
        <span></span>
      </li>
    </ul>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import DefaultPage from '../../base/defaultPage/defaultPage.vue';
  export default {
    data(){
      return {
        gamesList:[],
      }
    },
    watch:{

    },
    created(){
        this.getIndexGameByModelId()
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
      routeUrl(value){
        this.$router.push({path:'/record/'+value});
      },
      getIndexGameByModelId(){
        this.axios.get('/api/index/getIndeqbyx').then((res)=>{
          res = res.data;
          if(res.result===0){
            for(let j =0 ; j<res.data.list.length;j++){
              if(res.data.list[j].platformTerminal!=1){
                this.gamesList.push(res.data.list[j])
              }
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
    },
    components: {
      Vtitle,
      DefaultPage
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
.gameLog{
  height: 100%;
  background-color: #f5f7f8;
  .content{
    padding-top: 0.44rem;
    .gameList{
      padding-left: 0.1rem;
      background-color: #fff;
      >li{
        border-bottom: 1px solid #e9e9e9;
        display: block;
        height: 0.50rem;
        line-height: 0.50rem;
        font-size: 0.13rem;
        display: flex;

        >span:nth-of-type(1){
          display: block;
          height: 0.50rem;
          flex: 1;
          color: #161616;
        }
        >span:nth-of-type(2){
          display: block;
          height: 0.50rem;
          width: 0.50rem;
          background-image: url("./right.png");
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 0.08rem 0.15rem;
        }
      }
    }
  }
}
</style>
