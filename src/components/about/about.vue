<template>
  <div class="about">
    <vtitle @RUrl="back" :isRUl="true" title="关于"></vtitle>
    <div class="aboutMin">
        <dl class="aboutLogo">
            <dt></dt>
            <dd>
              <p>玩一下1.2.0</p>
            </dd>
        </dl>
      <ul>
        <li>客&nbsp;服Q&nbsp;Q：3541361517&nbsp;&nbsp;</li>
        <li>客服热线：<a href="tel:023-86553188">023-86553188</a></li>
        <li>客服热线：<a href="tel:023-86553588">023-86553588</a></li>
      </ul>
      <div class="corp">
          <p>深圳市乐盈互娱科技有限公司</p>
          <p>Copyright @ 2016 All Rights Reserverd</p>
      </div>
    </div>
  </div>
</template>
<script>
  import Vtitle from '../../base/v-title/v-title.vue';
    export default{
        methods:{
            back() {
                window.history.back()
            }
        },
      components:{
        Vtitle
      },
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/style/variable.less";
  .about{
    width:100%;
    height: 100%;
    right: 0;
    left:0;
    top:0;
    bottom: 0;
    position: absolute;
    .aboutMin{
      width:100%;
      margin-top: 1.1rem;
      .aboutLogo{
        dt{
          width:1.1rem;
          height:0.7rem;
          background: url("logo.png") no-repeat center;
          background-size: 100% 100%;
          margin:0 auto;
        }
        dd{
          text-align: center;
          padding-top:0.15rem;
          p{
            line-height: 0.2rem;
            font-size: 0.22rem;
            color: #161616;
          }

        }

      }
      ul{
        margin-top:0.5rem;
        li{
          text-align: center;
          line-height: 0.35rem;
          font-size: 0.14rem;
          color: #161616;
          a{
            color: #007aff;
          }
        }
      }
      .corp{
        width: 100%;
        position: absolute;
        bottom: 0.2rem;
        p{
          text-align: center;
          display: block;
          font-size: 0.14rem;
          color: #161616;
        }
        p:nth-child(1){
          font-size: 0.16rem;
        }
        p:nth-child(2){
          font-size: 0.12rem;
          padding-top:0.1rem;
        }
      }
    }
  }

</style>
