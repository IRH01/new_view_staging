<template>
  <div class="games">
    <ul>
      <li v-for="(item,index) in gamesList" :class="{paddingBottom:paddingBottom}">
        <div :class="{paddingTopNone:index==0&&paddingTopNone}">
          <img v-if="item.gameId" :src="item.imageUrl||item.tittleimgUrl" @click="joinGameList(item.gameId)">
          <img v-if="item.id" :src="item.imageUrl||item.tittleimgUrl" @click="joinGameList(item.id)">
        </div>
        <div>
          <span>{{item.name}}</span>
          <span>{{item.title}}</span>
          <button v-if="item.gameId" @click="location(item.gameId,item.startGameUrl,item.name)">开始游戏</button>
          <button v-if="item.id" @click="location(item.id,item.startGameUrl,item.name)">开始游戏</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  export default {
    props:{
      gamesList:{
        type:Array,
        default:[]
      },
      paddingBottom:{
        type:Boolean,
        default:false
      },
      paddingTopNone:{
          type:Boolean,
          default:false
      }
    },
    watch:{

    },
    created() {
        console.log(this.$route.path)
    },
    methods:{
      joinGameList(id){
        this.$router.push({path:'/gamelist/'+id});
      },
      location(id,url,title){
        this.gameStatisticsClick(this.userInfo.userId?this.userInfo.userId:'',window.location.href,title?title:'',id);
        sessionStorage.setItem('gameRurl',this.$route.path);//游戏返回路径
        if(id){
            setTimeout(()=>{
              this.$router.push({path:`/games/${id}`});
             },200);
        }else {
            if(url){
              let notic={
                url:url,
                title:title
              }
              sessionStorage.setItem("gamesUrl",JSON.stringify(notic));
              setTimeout(()=>{
                this.$router.push('/games/1');
              },200);
            }
        }
      }
    },
    computed:{
      ...mapState([
        'isLogin',
        'userInfo'
      ])
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
.games{
  ul{
    background-color: #f5f7f8;
    li{
      padding-bottom: 0.1rem;
      >div:nth-of-type(1){
        background-color: #fff;
        height: 1.81rem;
        padding: 0.11rem 0.05rem 0rem;
        >img{
           display: block;
          height: 100%;
          width: 100%;
        }
      }
      >div.paddingTopNone{
        padding-top: 0;
      }
      >div:nth-of-type(2){
        height: 0.61rem;
        line-height: 0.61rem;
        background-color: #FFFFFF;
        display: block;
        display: flex;
        >span:nth-of-type(1){
          display: block;
          height: 0.61rem;
          max-width: 1rem;
          margin-left: 0.1rem;
          font-size: 0.15rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #001616;
        }
        >span:nth-of-type(2){
          display: block;
          height: 0.61rem;
          line-height: 0.66rem;
          margin-left: 0.1rem;
          color: #666;
          flex: 1;
          font-size: 0.12rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #666;
        }
        >button{
          display: block;
          height: 0.3rem;
          width: 0.85rem;
          min-width: 0.85rem;
          font-size: 0.13rem;
          line-height: 0.25rem;
          border: 1px solid #00a8ff;
          border-radius: 0.5rem;
          margin: 0.16rem 0.14rem 0.16rem 0;
          color: #00a8ff;
          background-color: #fff;
        }
      }
    }
    li.paddingBottom:nth-last-of-type(1){
      padding-bottom: 0;
    }
  }

}
</style>
