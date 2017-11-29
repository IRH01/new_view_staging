<template>
    <div class="title" :isRUl="isRUl"  :isFixed="false" :class="{'toFixed':isFixed,'none':!isShow ,ishorizen:ishorizen}">
      <div class="back" @click="emitRUL" :class="{'backImg':isRUl}"></div>
      <div class="titleText omitted">{{title}}</div>
      <div class="title-r">
        <slot></slot>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props:{
      isRUl:{
        type:Boolean,
        default:false
      },
      isFixed:{
        type:Boolean,
        default:true
      },
      title:{
        type:String,
        default:''
      },
      isShow:{
        type:Boolean,
        default:true
      },
      ishorizen:{
        type:Boolean,
        default:false
      }

    },
    methods:{
      emitRUL(){
        this.$emit('RUrl');
      }
    },
    watch:{
      'isShow': function (newVal) {
        if(newVal){
          $('.title').css({
            'display':'none'
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .title.ishorizen{
    width: 100%;
    display: block;
    display: flex;
    height: .24rem;
    line-height: .24rem;
    >div:nth-child(2){
      font-size: 0.11rem;
    }
    .back {
      background-size: 0.13rem;
      width:0.8rem;
      height: 0.24rem;
    }
}
  .title {
    display: block;
    display: flex;
    height: .44rem;
    line-height: .44rem;
    width: 100%;
    background-color: deepskyblue;
    background-image: linear-gradient(to right,#00C6FF,#0072FF);
    background:-webkit-linear-gradient(to right,#00C6FF,#0072FF);
    background: -moz-linear-gradient(to right,#00C6FF,#0072FF);
    background: -o-linear-gradient(to right,#00C6FF,#0072FF);
    color: #fff;
    .back{
      height: .44rem;
      width: 0.8rem;
      -webkit-background-size:0.25rem;
      background-size:0.25rem;
    }
    .titleText {
      display: block;
      font-size: .17rem;
      height: .44rem;
      text-align: center;
      flex: 1;
    }
    div:nth-child(3){
      height: .44rem;
      width: 0.8rem;
    }
  }
  .backImg {
    background: url("./back.png") no-repeat 0.1rem center;
  }
  .toFixed {
    z-index: 999;
    position: fixed;
    top:0;
    left:0;
  }
  .none {
    display: none;
  }
</style>
