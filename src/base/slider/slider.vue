<template>
  <div class="slide">
    <div v-if="sImage.length>0">
      <div class="swiper-container" :class="{paySlide:paySlide,payFind:payFind}">
        <ul class="swiper-wrapper">
          <li class="swiper-slide slideName" v-for="(item,index) in list" v-if="index<6" :data-index="index"
              :data-url="item.jumpUrl" :data-title="item.remarks">
            <img :src="item[urlName]">
          </li>
        </ul>
        <div class="swiper-pagination" id="indexPagination" v-if="pagination"></div>
      </div>
    </div>
    <div :class="{hide:!large}" class="show-enlarge">
      <div class="swiper-container-enlarge">
        <ul class="swiper-wrapper">
          <li class="swiper-slide large-slideName" v-for="(item,index) in list" v-if="index<6" :data-index="index">
            <img :src="item[urlName]">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import {qsort} from '../../common/js/quickSort'

  let mySwiper = null

  export default {
    props: {
      sImage: {
        type: Array,
        default: []
      },
      urlName: {
        type: String,
        default: ''
      },
      pagination: {
        type: Boolean,
        default: true
      },
      isEnlarge: {
        type: Boolean,
        default: false
      },
      paySlide: {
        type: Boolean,
        default: false
      },
      payFind: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        large: false
      }
    },
    watch: {
      'list'(){
        this.$nextTick(function(){
          this.SwiperStart()
        })
      }
    },
    computed: {
      list(){
        return qsort(this.sImage, 'pictureOrder')
      }
    },
    methods: {
      SwiperStart(){
        this.large = false
        mySwiper = new Swiper('.swiper-container', {
          loop: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplayDisableOnInteraction: false,
          autoplay: 4000,
          observer: true,
          observeParents: true
        })
        this.$nextTick(function(){
          let _this = this
          $('.slideName').on('click', function(){
            let url = $(this).attr('data-url')
            let title = $(this).attr('data-title')
            let index = $(this).attr('data-index')
            if(!_this.isEnlarge){
              if(url != `${_this.Url}` && url != ''){
                window.location.href = url
//                let notic={
//                  url:url,
//                  title:title
//                }
//                sessionStorage.setItem("gamesUrl",JSON.stringify(notic));
//                _this.$router.push('/games/1');
              }
            }else{
              _this.large = true
              mySwiper.stopAutoplay()
              setTimeout(() =>{
                _this.largeSwiperStart(index)
              }, 200)
            }
          })
        })
      },
      largeSwiperStart(index){
        this.largeSwiper = new Swiper('.swiper-container-enlarge', {
          loop: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          observeParents: true
        })
        this.largeSwiper.slideTo(Number(index) + 1)
        this.$nextTick(() =>{
          let clientH = $('.show-enlarge').height()
          let h = $('.swiper-container-enlarge').height()
          $('.swiper-container-enlarge').css({
            marginTop: (clientH / 2 - h / 2)
          })
          let _this = this
          $('.show-enlarge').on('click', function(){
            let index = $(this).find('.large-slideName').attr('data-index')
            _this.large = false
            mySwiper.startAutoplay()
          })
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .slide .swiper-container.paySlide {
    height: 1.27rem;
  }

  .slide .swiper-container.payFind {
    height: 1.27rem;
  }

  .slide .swiper-container {
    width: 100%;
    height: 1.8rem;
    position: relative;
    ul {
      height: 100%;
      li {
        width: 100%;
        height: 100%;
        float: left;
        img {
          display: block;
          display: inline-block;
          height: 100%;
          width: 100%;
        }
      }
    }
    #indexPagination > span.swiper-pagination-bullet {
      display: block;
      display: inline-block;
      width: 0.08rem;
      height: 0.08rem;
      background: #FFFFFF;
      opacity: 0.3;
    }
    #indexPagination > span.swiper-pagination-bullet-active {
      display: block;
      display: inline-block;
      opacity: 1;
      background: #fff;
    }
  }

  .slide .show-enlarge {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    z-index: 999;
  }

  .slide .swiper-container-enlarge {
    display: block;
    height: auto;
    overflow: hidden;
    position: relative;
    ul {
      height: 100%;
      li {
        height: 100%;
        margin: auto;
        width: 100%;
        position: relative;
        img {
          display: block;
          display: inline-block;
          height: auto;
          width: 100%;
        }
      }
    }
  }

  .slide .hide {
    display: none;
  }
</style>
