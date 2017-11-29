<template>
    <div class="payBankFill2">
      <vtitle title="验证银行卡信息" :isRUl="true" :isFixed="false" @RUrl="back" :isShow="notApp"></vtitle>
      <div class="payBankFill2-content">
        <div class="show-orderInfo">
          <ul>
            <li class="borderBottom-1px">
              <span>订单金额:</span>
              <span>{{money}}.00元</span>
            </li>
            <li class="borderBottom-1px" v-if="showInfo">
              <span>账户:</span>
              <span>{{uId}}</span>
            </li>
            <li class="borderBottom-1px" v-if="showInfo">
              <span>银行卡:</span>
              <span>{{bankName}}</span>
            </li>
            <li class="borderBottom-1px" v-if="showInfo">
              <span>卡号:</span>
              <span>{{banknum}}</span>
            </li>
            <li v-if="showInfo" class="borderBottom-1px">
              <span>交易时间:</span>
              <span>{{paytime|setTime}}</span>
            </li>
            <li v-if="showInfo" class="borderBottom-1px">
              <span>订单编号:</span>
              <span>{{ordernumber}}</span>
            </li>
            <div @click="showInfo=false" v-if="showInfo" class="tishi">
              <span>
                <span>收起详细</span> <span class="hideInfo"></span>
              </span>
            </div>
            <div @click="showInfo=true" v-if="!showInfo" class="tishi">
              <span>
                <span>展开详细信息</span><span class="showInfo"></span>
              </span>
            </div>
          </ul>
        </div>
        <div class="hint">提醒: <span>请输入银行卡绑定信息</span> </div>
        <div class="input-info">
          <ul>
            <li class="borderBottom-1px">
              <span>持卡人:</span>
              <input placeholder="持卡人姓名" v-model="UserName" maxlength="12" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
            </li>
            <li class="borderBottom-1px">
              <span>证件类型:</span>
              <span>身份证</span>
            </li>
            <li class="borderBottom-1px">
              <span>证件号码:</span>
              <input placeholder="持卡人证件号" maxlength="18" v-model="idCard" @keyup="_idCard">
            </li>
            <li class="borderBottom-1px" v-if="type==2">
              <span>有效期:</span>
              <span v-if="!validData" @click="seleDate=true">选择有效期</span>
              <span v-if="validData" @click="seleDate=true">{{validData}}</span>
            </li>
            <li class="borderBottom-1px" v-if="type==2">
              <span>CVN:</span>
              <input placeholder="信用卡背后三位数字" v-model="CVN" type="number"   pattern="[0-9]*" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
            </li>
            <li class="borderBottom-1px">
              <span>手机号:</span>
              <input placeholder="银行预留手机号" type="number" v-model="phone"  pattern="[0-9]*" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
            </li>
          </ul>
          <div class="agreem">
            <span :class="{'agre':agre}" @click="agre=!agre"></span>
            <span>同意</span> <a href="javascript:;" @click="servicea">《玩一下平台支付服务协议》</a>
          </div>
        </div>
        <div class="go" @click="go">验证信息</div>
        <popUps ref="pop"></popUps>
        <div class="cover" v-if="seleDate"></div>
        <div class="selDate" :class="{'dataBlack':seleDate}">
          <span></span>
          <p>
            <span @click="seleDate=false">取消</span>
            <span @click="comfirm">确定</span>
          </p>
          <div class="swiper-container-year">
            <ul class="swiper-wrapper">
              <li class="swiper-slide" :class="{'borderBottom-1px':item!=''}" v-for="(item,index) in year">{{item}}</li>
            </ul>
          </div>
          <div class="swiper-container-month">
            <ul class="swiper-wrapper">
              <li class="swiper-slide" :class="{'borderBottom-1px':item!=''}" v-for="item in month">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">

  import Vtitle from '../../base/v-title/v-title.vue';
  import popUps from '../../base/popUps/popUps.vue';

  let fromGamingUrl = window.location.search;

  let mySwiper1;
  let mySwiper2;

  export default {
    data(){
      return {
        Requres:{},
        notApp:true,
        showInfo:false,
        validData:'',
        seleDate:false,
        year:['2017','2018','2019','2020','2021','2022','2023','2024','2025','2026','2027','','','',''],
        month:['01','02','03','04','05','06','07','08','09','10','11','12','','','',''],
        money:0,
        uId:'',
        bankName:'',
        paytime:'',
        ordernumber:'',
        idCard:'',
        CVN:'',
        phone:'',
        type:1,
        UserName:'',
        agre:true
      }
    },
    watch:{
      $route(newVal){
        if(newVal.path.indexOf('payBankFill2')!=-1){
          if(sessionStorage.getItem("bankFalse")==1){
            sessionStorage.removeItem("bankFalse")
            setTimeout(()=>{
              this.$router.push({path:`/pay${fromGamingUrl}`});
            },200);
          }
          this.Requres={};
          this.notApp=true;
          this.showInfo=false;
          this.validData='';
          this.seleDate=false;
          this.showInfo=false;
          this.validData='';
          this.money=0;
          this.uId='';
          this.bankName='';
          this.paytime='';
          this.ordernumber='';
          this.idCard='';
          this.CVN='';
          this.phone='';
          this.type=1;
          this.UserName='';
          this.UserName='';
          this.agre=true;
          this.init();
        }
      }
    },
    created(){
      this.init();
    },
    mounted(){
      this.$nextTick(()=>{
        mySwiper1=new Swiper('.swiper-container-year', {
          direction : 'vertical',
          slidesPerView: 5,
          freeMode : true,
          freeModeSticky : true,
          autoplayDisableOnInteraction : false,
          observer: true,
          observeParents: true,
          autoplayStopOnLast:false,
        });
        mySwiper2=new Swiper('.swiper-container-month', {
          direction : 'vertical',
          slidesPerView: 5,
          freeMode : true,
          freeModeSticky : true,
          autoplayDisableOnInteraction : false,
          observer: true,
          autoplayStopOnLast:false,
          observeParents: true,
        });
      });
    },
    methods:{
      back(){
        this.$router.push({path:`payBankFill1${fromGamingUrl}`});
      },
      _idCard(){
        this.idCard=this.idCard.replace(/[\W]/g,'');
      },
      init(){
        this.Requres = new UrlSearch();
        var u_agent =  navigator.userAgent;
        if(u_agent.indexOf("native_iOS")>-1||u_agent.indexOf("native_Android")>-1){//判断ios内嵌中调用获取支付参数
          this.notApp = false;
        }else {
          this.notApp = true;
        }
        if(sessionStorage.getItem('bankPayData')){
          this.money = JSON.parse(sessionStorage.getItem('bankPayData')).payMomey;
          this.uId = JSON.parse(sessionStorage.getItem('bankPayData')).busyId;
          if(JSON.parse(sessionStorage.getItem('bankPayData')).type==1){
            this.type=1;
            this.bankName=JSON.parse(sessionStorage.getItem('bankPayData')).name+"储蓄卡";
          }else{
            this.type=2;
            this.bankName=JSON.parse(sessionStorage.getItem('bankPayData')).name+"信用卡";
          }
          this.banknum=JSON.parse(sessionStorage.getItem('bankPayData')).banknum;
          this.paytime = JSON.parse(sessionStorage.getItem('bankPayData')).paytime;
          this.ordernumber = JSON.parse(sessionStorage.getItem('bankPayData')).outTradeNo;
        }
      },
      comfirm(){
        let yearIndex = mySwiper1.activeIndex;
        let monthIndex = mySwiper2.activeIndex>11?11:mySwiper2.activeIndex;
        if(!this.year[yearIndex]||!this.year[yearIndex]){
          this.validData = '27/01';
          return;
        }
        this.validData = this.year[yearIndex].substr(2,this.year[yearIndex].length)+'/'+this.month[monthIndex]
        this.seleDate = false;
      },
      go(){
        this.UserName = this.UserName.replace(/\s/g, "");

          if(this.type==1){
            if(!this.UserName){
              this.$refs.pop.show('请输入用户名');
              return;
            }
            if(String(this.UserName).length<2){
              this.$refs.pop.show('姓名长度大于2');
              return;
            }
            if(/[0-9]/.test(String(this.UserName))){
              this.$refs.pop.show('姓名中不能含有阿拉伯数字');
              return;
            }
            if(!this.idCard){
              this.$refs.pop.show('请输入身份证号');
              return;
            }
            if(!this.phone){
              this.$refs.pop.show('请输入手机号');
              return;
            }
          }else if(this.type==2){
            if(!this.UserName){
              this.$refs.pop.show('请输入用户名');
              return;
            }
            if(String(this.UserName).length<2){
              this.$refs.pop.show('姓名长度大于2');
              return;
            }
            if(/[0-9]/.test(String(this.UserName))){
              this.$refs.pop.show('姓名中不能含有阿拉伯数字');
              return;
            }
            if(!this.idCard){
              this.$refs.pop.show('请输入身份证号');
              return;
            }
            if(!this.validData){
              this.$refs.pop.show('请选择有效期');
              return;
            }
            if(!this.CVN){
              this.$refs.pop.show('请输入信用卡背后三位数字');
              return;
            }
            if(!this.phone){
              this.$refs.pop.show('请输入手机号');
              return;
            }
          }
          if(!this.agre){
            this.$refs.pop.show('请勾选《玩一下平台支付服务协议》');
            return;
          }
//          if(String(this.UserName).length<2){
//            this.$refs.pop.show('姓名长度大于2');
//            return;
//          }
          if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phone))){
            this.$refs.pop.show('请输入正确的手机号码');
            return;
          }
          if(sessionStorage.getItem('bankPayData')&&JSON.parse(sessionStorage.getItem('bankPayData')).isBankJhPayWay){

            let bankPayData = JSON.parse(sessionStorage.getItem('bankPayData'));
            bankPayData.customerNm = this.UserName;
            bankPayData.certify_id = this.idCard;
            bankPayData.phone = this.phone;

            sessionStorage.setItem('bankPayData',JSON.stringify(bankPayData));

            this.axios.get('/api/jhPay/quickPayApply', {
              params: {
                country:0,
                platformTerminal:4,
                totalFee:JSON.parse(sessionStorage.getItem('bankPayData')).payMomey,
                accNo:JSON.parse(sessionStorage.getItem('bankPayData')).banknum,
                bankCode:JSON.parse(sessionStorage.getItem('bankPayData')).bankCode,
                customerNm:this.UserName,
                certifTp:'01',
                certify_id:this.idCard,
                phoneNo:this.phone,
                dcType:String(Number(JSON.parse(sessionStorage.getItem('bankPayData')).type)-1)
              }
            }).then((res)=>{
              res = res.data;
              if(res.result==0){
                bankPayData.businessNo = res.data.businessNo;
                bankPayData.transId = res.data.transId;
                sessionStorage.setItem('bankPayData',JSON.stringify(bankPayData));
                sessionStorage.setItem("bankFalse","1")//从下一个页面回退时，会导致订单重复，因此需要设下一个标识若是从后一个页面回退时，这个页面要退到最初支付页面
                this.$router.push({path:`payBankSMSfill${fromGamingUrl}`});
              }else {
                this.$refs.pop.show(res.data.errorMsg);
              }
            }).catch( (response) => {
              console.log(response);
            });
          }else {

            this.axios.get('/api/pay/quickPayApply', {
              params: {
                payWayCode:JSON.parse(sessionStorage.getItem('bankPayData')).payWayCode,
                platformId:JSON.parse(sessionStorage.getItem('bankPayData')).bankPid,
                outTradeNo:JSON.parse(sessionStorage.getItem('bankPayData')).outTradeNo,
                totalFee:JSON.parse(sessionStorage.getItem('bankPayData')).payMomey,
                accNo:JSON.parse(sessionStorage.getItem('bankPayData')).banknum,
                buyerId:JSON.parse(sessionStorage.getItem('bankPayData')).busyId,
                currencyType:'CNY',
                subject:JSON.parse(sessionStorage.getItem('bankPayData')).bankGameName+"充值",
                body:JSON.parse(sessionStorage.getItem('bankPayData')).bankGameName+"充值",
                dcType:String(Number(JSON.parse(sessionStorage.getItem('bankPayData')).type)-1),
                certifTp:'01',
                certify_id:this.idCard,
                customerNm:this.UserName,
                phoneNo:this.phone,
                expired:this.validData,
                CVV2:this.CVN,
                extendParams:JSON.parse(sessionStorage.getItem('bankPayData')).bankExtra
              }
            }).then((res)=>{
              res = res.data;
              if(res.data.respMsg.indexOf("格式")!=-1){
//              this.$refs.pop.show(res.data.respMsg);
                this.$refs.pop.show('填写信息与银行预留信息不一致');
              }else if(res.data.respCode=="0001") {
//              this.$refs.pop.show(res.data.respMsg);
                this.$refs.pop.show('填写信息与银行预留信息不一致');
              }else if(res.data.respCode=="0000") {
                sessionStorage.setItem("bankFalse","1")//从下一个页面回退时，会导致订单重复，因此需要设下一个标识若是从后一个页面回退时，这个页面要退到最初支付页面

                let bankPayData = JSON.parse(sessionStorage.getItem('bankPayData'));
                bankPayData.businessTn = res.data.tn;
                bankPayData.phone = this.phone;
                bankPayData.business = res.data.businessNo;
                sessionStorage.setItem('bankPayData',JSON.stringify(bankPayData));
                this.$router.push({path:`payBankSMSfill${fromGamingUrl}`});
              }else {
//              this.$refs.pop.show(res.data.respMsg);
                this.$refs.pop.show('填写信息与银行预留信息不一致');
              }
            }).catch( (response) => {
              console.log(response);
            });
          }
      },
      servicea() {
          this.$router.push('/serviceagreement')
      }
    },
    components:{
      Vtitle,
      popUps
    }
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>

  .payBankFill2 {
    min-height:100%;
    width: 100%;
    overflow: hidden;
    background: #f5f7f8;
    .show-orderInfo {
      ul {
        li {
          background: #FFFFFF;
          height:0.45rem;
          line-height: 0.45rem;
          padding: 0 0.15rem;
          display: block;
          display: flex;
          span {
            display: block;
            flex:1;
          }
          span:nth-child(2){
            text-align: right;
          }
        }
        .tishi {
          background: #FFFFFF;
          height:0.45rem;
          width: 100%;
          line-height: 0.45rem;
          text-align: center;
          color: #999;
          >span {
             display: block;
             display: inline-block;
             overflow: hidden;
             margin:0 auto;
            span {
              display: block;
              float: left;
             }
             span:nth-child(2) {
               height: 0.4rem;
               width:0.3rem ;
             }
             span.showInfo {
               display: block;
               float: left;
               height: 0.4rem;
               width:0.3rem ;
               background: url("./bottom.png") no-repeat right;
               -webkit-background-size:.15rem .08rem;
               background-size:.15rem .08rem;
             }
             span.hideInfo {
               display: block;
               float: left;
               height: 0.4rem;
               width:0.3rem ;
               background: url("./top.png") no-repeat right;
               -webkit-background-size:.15rem .08rem;
               background-size:.15rem .08rem;
             }
          }
        }
      }
    }
    .hint {
      padding-top: 0.15rem;
      height: .3rem;
      line-height: .3rem;
      padding-left: .15rem;
      font-size: .12rem;
      color: #e7384a;
    }
    .input-info {
      ul {
        li {
          background: #FFFFFF;
          height:0.45rem;
          line-height: 0.45rem;
          padding: 0 0.15rem;
          display: block;
          display: flex;
          span {
            display: block;
            flex:1;
          }
          span:nth-child(2){
            text-align: right;
          }
          input:nth-child(2){
            text-align: right;
          }
        }
        /*li:nth-child(2) span:nth-child(2){*/
          /*background: url("./go.png") no-repeat right;*/
          /*background-color: #fff;*/
          /*padding-right: 0.15rem;*/
          /*color: #999;*/
        /*}*/
        li:nth-child(4) span:nth-child(2){
          background: url("./go.png") no-repeat right;
          background-color: #fff;
          padding-right: 0.15rem;
          color: #999;
        }
      }
      .agreem {
        width: 70%;
        height: .4rem;
        line-height: .4rem;
        margin: 0 auto;
        font-size: .14rem;
        display: block;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        span:nth-child(1){
          display: block;
          width: .4rem;
          height: 100%;
          background-image: url(./false.png);
          background-size: .2rem .2rem;
          background-position: 50%;
          background-repeat: no-repeat;
        }
        span:nth-child(1).agre {
          background-image: url(./true.png);
        }
        a {
          margin-left: .05rem;
          color: #e7384a;
        }
      }
    }
    .go{
      margin: 0.2rem auto;
      width: 3rem;
      height: 0.4rem;
      line-height:0.4rem;
      font-size:0.18rem;
      border-radius: 0.3rem;
      text-align: center;
      color: #FFFFFF;
      background: deepskyblue;
      background-image: linear-gradient(to right,#00C6FF,#0072FF);
      background-image:-webkit-linear-gradient(to right,#00C6FF,#0072FF);
      background: -moz-linear-gradient(to right,#00C6FF,#0072FF);
      background: -o-linear-gradient(to right,#00C6FF,#0072FF);
    }
    .cover {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 12;
      height:100%;
      width: 100%;
      background: rgba(0,0,0,.4);
    }
    .dataBlack{
      bottom: 0 !important;
    }
    .selDate {
      position: fixed;
      background: #FFFFFF;
      z-index: 15;
      width: 100%;
      height:2rem;
      bottom:-2.4rem;
      left: 0;
      transition: all 1s ease;
      display:flex;
      >span{
         display: block;
         display: inline-block;
         position: absolute;
         top: 0px;
         left: 0px;
         right: 0px;
         display:block;
         height: 0.39rem;
         border: 1px solid #e7384a;
       }
      p {
        position: absolute;
        top:-0.4rem;
        background: #FFFFFF;
        height:0.4rem;
        line-height:0.4rem;
        width: 100%;
        display: block;
        display: flex;
        span {
          flex:1;
          text-align: center;
        }
      }
      .swiper-container-year {
        display: block;
        flex:1;
        overflow: hidden;
        border-right: 1px solid #f5f5f5;
        li {
          height: 0.4rem;
          line-height: 0.4rem;
          text-align: center;
          width: 100%;
        }
      }
      .swiper-container-month {
        display: block;
        flex:1;
        overflow: hidden;
        li {
          height: 0.4rem;
          line-height: 0.4rem;
          text-align: center;
          width: 100%;
        }
      }
    }
  }

</style>
