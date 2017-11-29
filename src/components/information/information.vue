<template>
  <div class="information">
    <vtitle @RUrl="agenBack" :isRUl="true" title="我的消息"></vtitle>
    <ul class="informationCon-tit borderBottom-1px">
      <li :class="{activeXx:tab1}" @click="showtab1">系统消息</li>
      <li :class="{activeXx:tab2}" @click="showtab2">活动公告</li>
    </ul>
    <div class="informationCon-wrap"  ref="informationConWrap">
      <defaultPage v-if="(!lists.length&&tab1)||(!tab1&&!noticelist.length)"></defaultPage>
      <div class="informationCon" v-if="tab1">
        <div class="borderBottom-1px informationLi" v-for="(item,index) in lists"  v-moveDel="{index:index}" :class="{'readed':item.readStatus==2}" v-if="lists.length">
          <dl @click="_infoToute(item.id,index)">
            <dt><img  src="./logo.png" alt=""> </dt>
            <dd>
              <div class="informationCondl-txt">
                <h3 :class="{'readed':item.readStatus==2}"><b>{{item.title}}</b> <span>{{item.time | setTime}}</span></h3>
                <div class="xx"><b>{{item.synopsis}}</b> <span class="inforSp" v-if="item.readStatus==1"></span></div>
              </div>
            </dd>
          </dl>
          <div class="informationLi-del" @click="_del(index)">删除</div>
        </div>
        <div class="loadPrompts" v-if="loadSuccess&&lists.length">已全部加载完毕</div>
      </div>
      <div class="informationCon" v-else>
        <div class="borderBottom-1px informationLi" v-for="(item,index) in noticelist"  v-moveDel="{index:index}" :class="{'readed':item.readStatus==2}">
          <dl @click="_infoToute(item.id,index)">
            <dt><img :src="item.image" alt=""></dt>
            <dd>
              <div class="informationCondl-txt">
                <h3 :class="{'readed':item.readStatus==2}"><b>{{item.title}}</b> <span>{{item.time | setTime}}</span></h3>
                <div class="xx"><b>{{item.synopsis}}</b> <span class="inforSp" v-if="item.readStatus==1"></span></div>
              </div>
            </dd>
          </dl>
          <div class="informationLi-del" @click="_del(index)">删除</div>
        </div>
        <div class="loadPrompts" v-if="loadSuccess1&&noticelist.length">已全部加载完毕</div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { mapState } from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  import DefaultPage from '../../base/defaultPage/defaultPage.vue';

  let informationTimer;
  export default{
    data() {
      return{
        lists:[],
        tab1:true,
        tab2:false,
        noticelist:[],
        currentPagetab1:1,
        currentPagetab2:1,
        scrollY:0,
        informationConScroll:'',
        isJieliu:true,
        userId: this.$store.state.userInfo.userId,
        pagerNo2:0,
        loadSuccess:false,
        loadSuccess1:false
      }
    },
    watch:{
      '$route':function () {
        if(this.$route.path.indexOf('information')!=-1&&this.$route.path.indexOf('informationXx')==-1){
          this.loadSuccess=false;
          this.loadSuccess1=false;
          this.userId=this.userInfo.userId;
          this.noticelist = [];
          this.lists = [];
          this.currentPagetab1 = 1;
          this.currentPagetab2 = 1;
          this.pagerNo2 = 0;
          this.tab1 = true;
          this.tab2 = false;
          this.scrollY = 0;
          this.getData1();
          this.getData2();
          this.$nextTick(function () {
            this.loadMore();
          });
        }
      }
    },
    created() {
      this.getData1();
      this.getData2();
      this.$nextTick(function () {
        this.loadMore();
      });
    },
    methods:{
      getData1(){

        this.axios.get('/api/userMsg/getMsgPage', {
          params: {
            type:1,
            pageNo:this.currentPagetab1,
            pageSize:18
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0&&Math.ceil(Number(res.data.totalRows)/Number(res.data.pageSize))>=this.currentPagetab1){
            let length = this.lists.length;
            if(this.lists&&this.currentPagetab1>1){
              this.lists = this.lists.concat(res.data.list);
            }else{
              this.lists = res.data.list;
            }
            if(length==this.lists.length&&this.currentPagetab1!=1){
              this.isJieliu = false;
            }else {
              this.isJieliu = true;
            }
          }else if((Math.ceil(Number(res.data.totalRows)/Number(res.data.pageSize))<this.currentPagetab1)&&this.lists!=[]){
            this.loadSuccess=true;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      getData2(){

        this.axios.get('/api/userMsg/getMsgPage', {
          params: {
            type:3,
            pageNo:this.currentPagetab2,
            pageSize:18
          }
        }).then((res)=>{
          res = res.data;
          this.pagerNo2 = Math.ceil(Number(res.data.totalRows)/Number(res.data.pageSize))||0;
          if((res.result==0&&this.pagerNo2>=this.currentPagetab2)){
            let length = this.noticelist.length;
            if(this.noticelist&&this.currentPagetab2>1){
              for(let i=0;i<res.data.list.length;i++){
                if(res.data.list[i].type!=1){
                  this.noticelist = this.noticelist.concat(res.data.list[i]);
                }
              }
            }else{
              this.noticelist=[];
              for(let i=0;i<res.data.list.length;i++){
                if(res.data.list[i].type!=1){
                  this.noticelist.push(res.data.list[i]);
                }
              }
            }
            if(length==this.noticelist.length&&this.currentPagetab2!=1){
              this.isJieliu = false;
            }else {
              this.isJieliu = true;
            }
          }else if((Math.ceil(Number(res.data.totalRows)/Number(res.data.pageSize))<=this.currentPagetab1)&&this.noticelist!=[]){
            this.loadSuccess1=true;
          }
          if(this.noticelist.length<res.data.pageSize){
            this.loadSuccess1=true;
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      agenBack(){
        window.history.back();
//        $(".Load").hide();
      },
      showtab1() {
//        if(this.lists.length<"1"){
//          $(".Load-icon").hide();
//          $(".Load").show();
//          $("#load-success").hide();
//          $("#load-faile").show();
//        }else{
//          $(".Load").hide();
//        }
//        $('.informationLi').css('transform','translateX(0px)');
            this.tab1 = true;
            this.tab2 = false;
            this.isJieliu = true;
            this.$nextTick(function() {
//          this.initScroll();
        });
      },
      showtab2() {
        if(this.tab2==false){
          $('.information').scrollTop(0);
        }
        this.tab1 = false;
        this.tab2 = true;
        this.isJieliu = true;
      },
      _infoToute(id,index){
        this.axios.get('/api/userMsg/updateUserMsg', {
          params: {
            country:0,
            msgId:id
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            if(null!=document.querySelectorAll('.informationLi')[index].querySelector('.inforSp')){
              var inforSp = document.querySelectorAll('.informationLi')[index].querySelector('.inforSp');
              inforSp.parentNode.removeChild(inforSp);
              if(this.$store.state.userInfo.unreads>=1){
                this.$store.state.userInfo.unreads--;
              }
            }
          }
          this.$router.push({path:'/informationXx/'+id});
        }).catch( (response) => {
          console.log(response);
        });
      },
      loadMore(){
        let _this = this;
        $('.information').scroll(function(){

          let scrollTop = $('.information').scrollTop();
          let clientHeight = $(window).height();
          let documentHeight = $('.informationCon').height();

          if((scrollTop>=documentHeight-clientHeight)&&_this.isJieliu){
            _this.isJieliu = false;
            if(_this.tab1){
              _this.currentPagetab1++;
              _this.getData1();
            }else if(_this.tab2){
              _this.currentPagetab2++;
              _this.getData2();
            }
          }
        })
      },
      _del(index){
        $('.informationLi').css('transform','translateX(0px)');
        let msgid;
        if(this.tab1){
          msgid = this.lists[index].id;
        }else {
          msgid = this.noticelist[index].id;
        }

        this.axios.get('/api//userMsg/batchDelMsgByIds', {
          params: {
            country:0,
            msgIds:msgid
          }
        }).then((res)=>{
          res = res.data;
          if(res.result==0){
            if(this.lists[index].readStatus==1&&this.$store.state.userInfo.unreads>=1){
              this.$store.state.userInfo.unreads--;
            }
            if(this.tab1){
              this.lists.splice(index,1);
              this.$nextTick(function () {
                this.loadMore();
              });
            }else if(this.tab2) {
              this.noticelist.splice(index,1);
              this.$nextTick(function () {
                this.loadMore();
              });
            }
          }
        }).catch( (response) => {
          console.log(response);
        });
      }
    },
    components:{
      Vtitle,
      DefaultPage
    },
    computed:{
      ...mapState(['userInfo','isLogin'])
    },
    directives:{
      moveDel:{
        bind: function (el,binding) {
          let _this = this;
          setTimeout(function () {
//            el.style.background = 'red';
//            console.log(binding.value.index);
            let MaxWidth = $('.informationLi-del').width();
            let startX,startY,moveX,movestartX,movestartY,endX,startTime,endTime,continueTime,isCurrent,step;
            el.addEventListener('touchstart',e => {
//              e.preventDefault();
              startX = e.changedTouches[0].pageX;
              startY = e.changedTouches[0].pageY;
              startTime = new Date().getTime();
              if($(el).hasClass('sele')){
                isCurrent = true;
              }else {
                isCurrent = false;
              }
            });
            el.addEventListener('touchmove', e =>{
//              e.preventDefault();
              movestartX = e.changedTouches[0].pageX;
              movestartY = e.changedTouches[0].pageY;
//              console.log(movestartX);
              if(Math.abs(movestartX-startX)>Math.abs(movestartY-startY)){
                e.preventDefault();
              }
              if(!isCurrent){
                endX = 0;
//                $(el).siblings().css('transform','translateX(0px)');
              }
              if(endX){
                moveX = movestartX-(startX-endX);
              }else {
                moveX = movestartX-startX;
              }
              $(el).css('transform','translateX('+moveX+'px)');
              if((Math.abs(moveX)>=MaxWidth)&&(moveX<0)){

                $(el).css('transform','translateX('+moveX+'px)');
                $(el).css('transform','translateX('+(-MaxWidth)+'px)');
                moveX = -MaxWidth;
              }else if((Math.abs(moveX)>=0)&&(moveX>0)){
                $(el).css('transform','translateX(0px)');
                moveX = 0;
              }
            });
            el.addEventListener('touchend',e => {
//              e.preventDefault();
              $(el).siblings().removeClass('sele');
              $(el).addClass('sele');
              endX = e.changedTouches[0].pageX;
              endTime = new Date().getTime();
              continueTime = endTime-startTime;
              if((Math.abs(moveX)>=MaxWidth)&&(moveX<0)&&continueTime>50){
//                binding.value.del(binding.value.index);
                endX = -MaxWidth;
                $(el).css('transform','translateX('+(-MaxWidth)+'px)');
//                $(el).css('transform','translateX(0px)');
              }else if((Math.abs(moveX)<=MaxWidth)&&(moveX<0)){
                endX = 0;
                step = (0-moveX)/20;
                let timerId = setInterval(function () {
                  moveX = moveX+step;
                  $(el).css('transform','translateX('+moveX+'px)');
                  if(moveX>=0){
                    clearInterval(timerId);
                    $(el).css('transform','translateX(0px)');
                  }
                },10);
              }else if(moveX>0){
                endX = 0;
                $(el).css('transform','translateX(0px)');
              }else {
                endX = 0;
                step = (0-moveX)/20;
                let timerId = setInterval(function () {
                  moveX = moveX+step;
                  $(el).css('transform','translateX('+moveX+'px)');
                  if(moveX>=0){
                    clearInterval(timerId);
                    $(el).css('transform','translateX(0px)');
                  }
                },10);
              }
            });
          },20);
        },
        unbind: function () {
          //
        }
      }
    }
  }
</script>
<style>
  .information{
    font-size: 0.14rem;
    width: 100%;
    overflow-y:auto;
    height: 100%;
    /*position: absolute;*/
    /*top:0;*/
    /*left:0;*/
    /*bottom: 0;*/
  }
  .information::-webkit-scrollbar {
    width: 0.5px;
    height: 0.5px;;
    width:0;
    height:0;
  }

  .information-title{
    width: 100%;
    height: 0.45rem;
    background: #E7374B;
    display: block;
    display: flex;
  }
  .information-title>span:not(:nth-child(2)){
    display: block;
    width: 0.45rem;
    height: 0.45rem;
    text-align: center;
    line-height: 0.45rem;
    color: #fff;
    font-size: 0.24rem;
  }
  .information-title>span:nth-child(2) {
    display: block;
    height:0.45rem;
    display: inline-block;
    text-align: center;
    line-height: 0.45rem;
    color: #fff;
    font-size: 0.24rem;
    flex: 1;
  }
  .informationCon-wrap{
    width:100%;
    padding-top: 0.9rem;

  }
  .informationCon-tit{
    width:100%;
    height:0.45rem;
    display: block;
    display: flex;
    margin-top:0.44rem;
    position: fixed;
    background: #fff;
    z-index: 99;
  }
  .informationCon-tit>li{
    display: block;
    flex: 1;
    text-align: center;
    font-size: 0.14rem;
    line-height: 0.45rem;
  }
  .activeXx{
    color:deepskyblue;
    border-bottom: 2px solid deepskyblue;
  }
  .informationCon{
    width: 100%;
    overflow-x: hidden;
  }
  .informationCon .readed {
    background: #f9f9f9;
    color: #bbbbbb !important;
  }

  .informationCon>.informationLi{
    position: relative;
    width: 122%;
    overflow: hidden;
  }
  .informationCon>div>.informationLi{
    display: block;
  }
  .informationCon>.informationLi>dl{
    width: 90%;
    margin: 0 auto;
    padding:0.2rem 0;
    overflow: hidden;
  }
  .informationCon>.informationLi>dl>dt{
    width: 0.45rem;
    height: 0.45rem;
    background-size: 100% 100%;
    border-radius: 50%;
    float: left;
  }
  .informationCon>.informationLi>dl>dt>img{
    display: block;
    width:100%;
    height:100%;
    border-radius:50%;
  }
  .informationCon>.informationLi>dl>dd{
    float: left;
    width: 70%;
    padding-left:0.1rem;
  }
  .informationLi-del {
    position: absolute;
    line-height:0.8rem;
    text-align: center;
    font-size: 0.14rem;
    right: 0;
    top:0;
    width: 18%;
    height: 100%;
    background: #eb5757;
    color:#fff;
    box-sizing: border-box;
  }
  .informationCondl-txt>h3{
    color: #1C1C1C;
    overflow: hidden;
    width: 100%;
  }
  .informationCondl-txt>h3>b{
    font-size: 0.14rem;
    float: left;
    padding-bottom: 0.1rem;
  }
  .informationCondl-txt>h3>span{
    display: block;
    display: inline-block;
    font-size: 0.14rem;
    float: right;
  }
  .informationCondl-txt .xx>b{
    width:88%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-top:0.12rem;
    font-size: 0.12rem;
    color: #B4B4B4;
    display: block;
    float: left;
  }
  .informationCondl-txt .xx>span{
    width:0.12rem;
    height:0.12rem;
    background: #e7374b;
    display: block;
    float: left;
    margin:0.2rem 0 0 0.15rem;
    border-radius: 50%;
    text-align: center;
    line-height: 0.18rem;
    color: #fff;
  }
  .information .loadPrompts {
    line-height:0.3rem;
    text-align: center;
    font-size: 0.12rem;
    color: #B4B4B4;
  }
</style>
