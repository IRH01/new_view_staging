<template>
    <div id="qiandao">
      <vtitle title="签到"  :isRUl="true" @RUrl="back"></vtitle>
      <div class="qiandaoContext">
        <h3 class="titleImg"></h3>
        <div class="qiandao-mian">
          <div class="qiandao-mian-title">
            <div>{{currentDate}}</div>
            <div class="qiandao-history">
              您累计已领取<span>{{jf}}积分</span>
            </div>
          </div>
          <div class="qiandao-calendar">
            <div class="calendar-week">
              <span>日</span>
              <span>一</span>
              <span>二</span>
              <span>三</span>
              <span>四</span>
              <span>五</span>
              <span>六</span>
            </div>
            <div class="qiandao-data-list">
              <ul>
                <div class="qiaodaoHint" v-if="!isLogin"><router-link to="/login">您还未登陆，请登录</router-link></div>
                <li v-for="item in dateList" :class="{'signIn':signList[item]==1,'notSign':signList[item]==2,'notNowDay':item<date}" v-if="isLogin">{{item}}</li>
              </ul>
            </div>
            <div class="qiandao-btn" @click="_signIn" v-if="!isSign">
              签到
            </div>
            <div class="qiandao-btn-completed" @click="_signIn" v-if="isSign">
              已签到
            </div>
            <div class="qiandao-txt">
              您已连续签到<span>{{continueDay}}</span>天
            </div>
          </div>
        </div>
        <div class="award">
          <h3>签到奖励</h3>
          <ul>
            <li>1.每日签到奖励50积分</li>
            <li>
                2.连续签到奖励: 连续3日签到奖励20积分; 连续7日签到奖励60积分; 连续15日签到奖励140积分; 连续20日签到奖励200积分; 连续30日签到奖励300积分
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { mapState } from 'vuex';
  import Vtitle from '../../base/v-title/v-title.vue';
  export default {
    data(){
      return {
        title:'签到',
        currentDate:'',//当前时间
        creatDate:'',//新创建的当前时间
        dateList:[],//当月时间数据列表
        signList:[],//当月签到情况列表，1代表签到成功状态，0代表未签到状态,2代表当天没签到状态
        continueDay:0,
        isSign:false,//签到状态
        date:0,//当天日期
        userId: this.$store.state.userInfo.userId,
        jf:this.$store.state.userInfo.jf
      }
    },
    watch:{
      '$route':function () {
        if(this.$route.path.indexOf('qiandao')!=-1){
          this.userId=this.userInfo.userId;
          this.jf=this.userInfo.jf;
          this._day();
        }
      }
    },
    created(){
      this._day();
    },
    components:{
      Vtitle
    },
    methods:{
      back(){
        history.back()
      },
      _day(){
        this.currentDate='';//当前时间
        this.creatDate='';//新创建的当前时间
        this.dateList=[];//当月时间数据列表
        this.signList=[];//当月签到情况列表，1代表签到成功状态，0代表未签到状态,2代表当天没签到状态
        this.isSign=false;//签到状态
        this.date=0;//当天日期

        this.axios.get('/api/userPoint/queryMonthSign').then((res)=>{
          res = res.data;
          if(res.result == 0){
            this.creatDate = new Date(res.systemTime);
            let year = this.creatDate.getFullYear();
            let month = this.creatDate.getMonth()+1;
            this.date = this.creatDate.getDate();
            this.currentDate = year+'年'+month+'月'+this.date+'日';
            //      定义当月的天数
            //当月份为二月时，根据闰年还是非闰年判断天数
            let days;
            if (month == 2) {
              days = year % 4 == 0 ? 29 : 28;
            } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
              //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
              days = 31;
            } else {
              //其他月份，天数为：30.
              days = 30;
            }
            this.creatDate.setDate(1);
//      当月1号星期可得
            let weekDay = this.creatDate.getDay();
            for(let i= 0,k=1;i<42;i++){
              this.signList.push(0);
              if(i>=weekDay&&i<days+weekDay){
                this.dateList.push(k);
                k++;
              }else{
                this.dateList.push('');
              }
            }
            this.continueDay = res.data.continueDay;
            let signInArr = [];
            if(res.data.day){
              signInArr = res.data.day.split(';');
            }
            for(let j=0;j<signInArr.length;j++){
              this.signList.splice(Number(signInArr[j]),1,1);
            }
            for (let k=0;k<this.signList.length;k++){
              if(this.signList[this.date]==1){
                this.isSign = true;
              }
              else{
                this.signList.splice(this.date,1,2);
              }
            }
          }else{
            this.currentDate='';//当前时间
            this.creatDate='';//新创建的当前时间
            this.dateList=[];//当月时间数据列表
            this.signList=[];//当月签到情况列表，1代表签到成功状态，0代表未签到状态,2代表当天没签到状态
            this.isSign=false;//签到状态
            this.date=0;//当天日期
          }
        }).catch( (response) => {
          console.log(response);
        });
      },
      _signIn(){
        if(!this.isLogin){
          this.$router.push({path:'/login'});
          return;
        }
        if(!this.isSign){
          this.axios.get('/api/userPoint/userSign').then((res)=>{
            res = res.data;
            this.isSign = true;
            this.signList.splice(this.date,1,1);
            this.continueDay=this.continueDay+1;
            this.getUserInfo();
            if(res.result===0){
              this.$store.state.userInfo.unreads++;
              this.$http.get('/api/user/getUserInfo').then((res)=> {
                res = res.body;
                if(res.result==0){
                  this.$store.state.userInfo.jf = res.jf;
                  this.jf = res.jf;
                }else {
                  this.jf = Number(this.jf) + 50;
                }
              });
            }else {
              this.jf = Number(this.jf) + 50;
            }
          }).catch( (response) => {
            console.log(response);
          });
        }
      }
    },
    computed:{
      ...mapState(['userInfo','isLogin'])
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  #qiandao {
    background: #0072FF;
    width: 100%;
    overflow: hidden;
  }
  .qiandaoContext {
    padding-top: 0.45rem;
  }
  #qiandao .titleImg {
    display: block;
    width: 100%;
    height: 0.47rem;
    background: url('./qiandao.png') no-repeat center;
    background-size: 76% 100%;
    margin: 0.15rem auto;
  }
  #qiandao .qiandao-mian {
    width: 92%;
    margin:0.2rem auto 0.1rem;
    background: #f5f5f5;
    border-radius: 0.1rem 0.1rem 0 0;
  }
  #qiandao .qiandao-mian-title {
    height:0.42rem;
    background-size: 100% 100%;
    line-height:0.42rem;
    border-radius: 0.1rem 0.1rem 0 0;
    div:nth-child(1){
      height:100%;
      width: 45%;
      float: left;
      text-align: center;
      color: #ffffff;
      background-color: #00B9FF;
    }
    .qiandao-history {
      width: 55%;
      height:100%;
      float: left;
      text-align: center;
      color: #fff;
      background-color: #0062DB;
      >span{
        color: #D2A947;
      }
    }

  }
  #qiandao .qiandao-calendar {
    padding: 0 0.12rem;
  }
  #qiandao .calendar-week {
    display: block;
    display: flex;
    height:0.36rem;
    line-height:0.36rem;
    span {
      display: block;
      flex:1;
      text-align: center;
      color: deepskyblue;
    }
  }
  #qiandao .qiandao-data-list {
    height:2.6rem;
    width: 100%;
    background: #fff;
    ul {
      height: 100%;
      width: 100%;
    }
    ul li {
      float: left;
      width: 14.2%;
      height: 0.43rem;
      line-height: 0.43rem;
      text-align: center;
      font-size: 0.14rem;
    }
    ul li.signIn {
      display: block;
      background: url("./qiaodaole.png") no-repeat center ;
      background-size: 74% 78%;
    }
    ul li.notSign {
      display: block;
      background: url("./qiaodao.png") no-repeat center ;
      background-size: 95% 100%;
    }
    ul li.notNowDay{
      color: #b4b4b4;
    }
  }
  #qiandao .qiandao-btn {
    height:0.50rem;
    line-height:0.50rem;
    text-align: center;
    width: 92%;
    background: #FF7E36;
    color: #fff;
    font-size: 0.16rem;
    margin:0 auto;
    border-radius: 0.4rem;
    margin-top: 0.15rem;
  }
  #qiandao .qiandao-btn-completed {
    height:0.45rem;
    line-height:0.45rem;
    text-align: center;
    width: 92%;
    background:rgb(209, 211, 214);
    color: #fff;
    font-size: 0.16rem;
    margin:0 auto;
    border-radius: 0.4rem;
    margin-top: 0.1rem;
  }
  #qiandao .qiandao-txt {
    line-height:0.31rem;
    height: 0.31rem;
    font-size: 0.13rem;
    text-align: center;
    color: #b4b4b4;
    >span{
      color: #74B6FA;
    }
  }
  #qiandao .award {
    width: 92%;
    margin:0.12rem auto 0.12rem;
    background: #00B9FF;
    padding: 0 0rem 0.15rem;
    h3 {
      line-height:0.4rem;
      font-size: 0.14rem;
      color: #fff;
      font-weight: 700;
      padding-left: 0.09rem;
    }
    ul {
      margin:0 0.09rem;
      background: #fff;
      font-size: 0.10rem;
      color: #5b5b5b;
      line-height: 0.2rem;
      padding: 0.15rem 0.12rem 0.15rem 0.10rem;
      border-radius:0.06rem ;
      li p {
        text-indent: 1rem;
      }
    }
  }
  #qiandao .qiaodaoHint{
    font-size: 0.18rem;
    text-align: center;
    height: 100%;
    line-height:2.6rem;
    a {
      color: deepskyblue;
    }
  }
</style>
