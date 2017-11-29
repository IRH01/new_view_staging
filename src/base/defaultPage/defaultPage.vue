<template>
    <div class="defaultPage">
      <div></div>
      <p>当前暂无内容~</p>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    created(){
      setTimeout(()=>{
        $('.defaultPage').css('display','block');
      },100)
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .defaultPage {
    display: none;
    position: fixed;
    height:100%;
    width: 100%;
    background: #F5F5F5;
    font-size: 0.13rem;
    color: #ACACAC;
    text-align:center;
    z-index: 9999;
    div {
      margin: 0 auto;
      overflow: hidden;
      padding-top: 1.5rem;
      margin-bottom: 0.2rem;
      width: 0.8rem;
      height:0.8rem;
      background: url("./defaultPage.png") no-repeat  center bottom;
      -webkit-background-size:100%;
      background-size:100%;
    }
  }
</style>
