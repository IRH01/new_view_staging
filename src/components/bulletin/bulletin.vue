<template>
    <div class="bulletin">
      <div class="borad">
        <span class="horn">资讯</span>
        <div class="swiper-container-borad">
          <div class="swiper-wrapper">
            <div class="swiper-slide boradnews omitted" v-for="item in bulletinData">{{item.title}}</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props:{
        bulletinData:{
          type:Array,
          default:[]
        }
      },
      watch:{
        bulletinData(){
          this.$nextTick(function () {
            this.bulletinSwiper();
          });
        }
      },
      methods:{
        bulletinSwiper(){
          let bulletinSwiper = new Swiper('.swiper-container-borad', {
            autoplayDisableOnInteraction : false,
            autoplay: 4000,
            direction : 'vertical',
            loop : true,
//            observer: true,
//            observeParents: true
          });
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less">

  .bulletin .borad {
      margin-bottom: 0.1rem;
      height:0.42rem;
      line-height:0.42rem;
      background: #fff;
      color: #000;
      font-size: 0.13rem;
      position: relative;
      overflow: hidden;
      .swiper-container-borad {
        height:100%;
        width: 100%;
        .swiper-wrapper {
          width: 90%;
          margin-left: 0.8rem;
          .swiper-slide {
            width: 85%;
              font-size: 0.12rem;
              height: 0.42rem;
          }
        }
      }
  }
  .bulletin .horn {
    position: absolute;
    text-align: center;
    margin-left: 0.15rem;
    margin-top: 0.1rem;
    height: 0.2rem;
    line-height:0.2rem;
    width: 0.35rem;
    color: #ff6c00;
    font-size: 0.12rem;
    border: 1px solid #ff6c00;
  }

</style>
