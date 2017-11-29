<template>
  <div class="record">
    <vtitle title="游戏记录" @RUrl="back" :isRUl="true" :isFixed="true"></vtitle>
    <div class="content">
      <div class="twoTitle">
        <span>下单时间</span>
        <span>下单金币</span>
        <span>结果</span>
      </div>
      <ul class="list">
        <li v-for="item in list">
          <span>{{item.createTime|getTime1}}</span>
          <span>{{item.gold}}</span>
          <span v-if='item.consumeType==1'> + {{item.lastGold}} </span>
          <span v-else='item.consumeType==2'> - {{item.lastGold}} </span>
        </li>
        <div class="loadPrompts" v-if="loadSuccess&&list.length">已全部加载完毕</div>
        <default-page v-if="list.length<1"></default-page>
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
          id:this.$route.params.id,
          listPageNo:1,
          isJieliu:false,//懒加载所需要的节流阀
          loadSuccess:false,
          list:[]
      }
    },
      watch:{
          '$route':function () {
              if(this.$route.path.indexOf('record')!=-1){
                this.list=[];
                  this.id=this.$route.params.id;
                this.listPageNo=1;
                this.isJieliu=false;
                this.loadSuccess=false;
                this._http();
              }
          }
      },
    created(){
        this._http();
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
//      down(url){
//        location.href=url;
//      },
//      routeUrl(value){
//        this.$router.push({path:'/'+value});
//      },
//      joinGame(id){
//        this.$router.push({path:'/games/'+id});
//      },
      _http(){

        this.axios.get('/api/platformGoldConsumeRecord/list', {
          params: {
            platformId:this.id,
            pageNo:this.listPageNo,
            pageSize:15
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0&&res.data&&res.data.list){
            let length = this.list.length;
            this.list = this.list.concat(res.data.list);
            if(this.list.length&&this.list.length>length){
              this.recordloadMore();
              this.isJieliu = false;
            }else {
              this.loadSuccess = true;
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      recordloadMore(){
        $('.record').scroll(()=>{
          let scrollTop = $('.record').scrollTop();
          let clientHeight = $(window).height();
          let documentHeight = $('.list').height();

          if(documentHeight-clientHeight<=scrollTop&&!this.isJieliu){
            this.listPageNo++;
            this._http();
            this.isJieliu = true;
          }
        });
      }
    },
    components: {
      Vtitle,
      DefaultPage
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
.record{
  overflow-y:auto;
  height: 100%;
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  .content{
    flex: 1;
    background-color: #e9e9e9;
    .twoTitle{
      position: fixed;
      top: 0.44rem;
      display: block;
      width: 100%;
      height: 0.50rem;
      line-height: 0.50rem;
      display: flex;
      background-color: #fff;
      color: deepskyblue;
      border-bottom: 1px solid #f5f5f5;
      >span{
        display: block;
        height: 0.50rem;
        flex: 1;
        text-align: center;
        font-size: 0.14rem;
      }
    }
    .list{
      padding-top: 0.88rem;
      >li{
        height: 0.50rem;
        line-height: 0.50rem;
        display: block;
        display: flex;
        background-color: #fff;
        border-bottom: 1px solid #e9e9e9;
        >span{
          flex: 1;
          display: block;
          height: 0.50rem;
          text-align: center;
          font-size: 0.11rem;
        }
      }
    }
  }
}
.record::-webkit-scrollbar {
  width: 0.5px;
  height: 0.5px;;
  width:0;
  height:0;
}
.record .loadPrompts {
  line-height:0.3rem;
  text-align: center;
  font-size: 0.14rem;
  color: #B4B4B4;
}
</style>
