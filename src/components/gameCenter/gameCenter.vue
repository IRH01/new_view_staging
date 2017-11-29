<template>
    <div class="gameCenter">
        <vtitle title="游戏中心"  :isRUl="false"></vtitle>
        <div class="content">
            <games :gamesList="gameCenterList" :paddingBottom="true"></games>
            <defaultPage v-if="gameCenterList.length<1"></defaultPage>
            <div class="complete" v-if="complete">
                已全部加载
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import Games from '../../base/games/games.vue';
  import DefaultPage from '../../base/defaultPage/defaultPage.vue';

  export default {
    created(){
      this.getIndexGameByModelId();
    },
    mounted(){
      this.loadMore();
    },
    data(){
      return {
        gameCenterList:[],//独家推荐游戏列表
        complete:false,
        pageNo:1,
        isJieliu:false
      }
    },
    computed:{
      ...mapState([
        'isLogin'
      ])
    },
    methods:{
      getIndexGameByModelId(){
        this.axios.get('/api/index/getIndeqbyx', {
          params: {
            pageSize:3,
            pageNo:this.pageNo
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0) {
            let length = this.gameCenterList.length;
            for(let j =0 ; j<res.data.list.length;j++){
              if(res.data.list[j].platformTerminal!=1){
                this.gameCenterList = this.gameCenterList.concat(res.data.list[j]);
              }
            }
            if(this.gameCenterList.length&&this.gameCenterList.length>length){
              this.loadMore();
              this.isJieliu = false;
            }else {
              this.complete = true;
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      loadMore(){
        let _this = this;
        $(".gameCenter").scroll(function(){
          let scrollTop = $('.gameCenter').scrollTop();
          let clientHeight = $(window).height();
          let documentHeight = $('.games').height();

          if((scrollTop>=documentHeight-clientHeight)&&!_this.isJieliu){
              _this.isJieliu = true;
              _this.pageNo++;
              _this.getIndexGameByModelId();
          }
        })
      },
    },
    components: {
      Vtitle,
      Games,
      DefaultPage
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
.gameCenter{
    height: 100%;
    width: 100%;
    overflow-y:auto;
    background-color: #f5f7f8;
  .content{
      padding: 0.44rem 0 0.54rem;
      width: 100%;
      .complete{
          height: 0.35rem;
          line-height: 0.35rem;
          text-align: center;
          font-size: 0.16rem;
          background-color: #e9e9e9;
          color: #666;
      }
  }
}
.gameCenter::-webkit-scrollbar {
  width: 0.5px;
  height: 0.5px;;
  width:0;
  height:0;
}
</style>
