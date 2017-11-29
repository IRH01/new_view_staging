<template>
    <div class="popUps" v-if="showR">
      <div></div>
    </div>
</template>

<script type="text/ecmascript-6">

  export default {
    methods:{
      show(hint){
        if(!hint){
          return;
        }
        clearTimeout(timer);
        this.showR=true;
        this.$nextTick(function () {
          $('.popUps div').html(hint);
        })
        let self=this;
        let timer = setTimeout(()=>{
          self.showR=false;
          $('.popUps div').html('');
        },2000);
      }
    },
    data(){
      return {
        showR:false
      }
    },
  }

</script>

<style rel="stylesheet/less" lang="less" scoped>

  .popUps {
    position: fixed;
    top:0;
    left:0;
    height:100%;
    width: 100%;
    background: transparent;
    font-size: 0.15rem;
    display: block;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      display: block;
      padding: 0.2rem 0.4rem;
      max-width: 1.6rem;
      word-wrap:break-word;
      word-break:break-all;
      border-radius: 0.05rem;
      min-height: 0.3rem;
      line-height: 0.3rem;
      text-align: center;
      background: rgba(1,1,1,.5);
      color: #FFFFFF;
      text-align: center;
    }
  }

</style>
