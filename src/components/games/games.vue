<template>
  <div class="games">
    <defaultPage v-if="notic"></defaultPage>
    <iframe  id='mainFrame' name='mainFrame'  width='100%'  frameborder='0' style="display: block"></iframe>
  </div>
</template>
<script type="text/ecmascript-6">

  import DefaultPage from '../../base/defaultPage/defaultPage.vue';

  export default{
    data(){
      return {
        urlParams:'',
        gamesSrc: '',
        notic: false//有无内容
      }
    },
    watch: {
      '$route': function () {
        if (this.$route.path.indexOf('games') != -1) {
          this.urlParams = window.location.search;
          this._games();
          this.$nextTick(function () {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            } else {
              if (/chrome\/\d+/i.test(navigator.userAgent)) {
                let num = navigator.userAgent.match(/chrome\/\d+/i)[0].replace(/chrome\//i, "");
                if (num > 56 && num < 61) {
                  $('.games').height(document.body.clientHeight);
                }
              }
            }
          });
        }
      }
    },
    created(){
      this.urlParams = window.location.search;
      this._games();
      this.$nextTick(function () {
        $(".games").height($(window).height())
        $("#mainFrame").height($(window).height() - $(".games .title").height())
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        } else {
          if (/chrome\/\d+/i.test(navigator.userAgent)) {
            let num = navigator.userAgent.match(/chrome\/\d+/i)[0].replace(/chrome\//i, "");
            if (num > 56 && num < 61) {
              $('.games').height(document.body.clientHeight);
            }
          }
        }
      });
    },
    methods: {
      _games(){
        let gameRurl = sessionStorage.getItem('gameRurl')?sessionStorage.getItem('gameRurl'):'';
        if (this.$route.params.id == 1) {
          this.$nextTick(function () {
            this.notic = false;
            if (sessionStorage.getItem("gamesUrl")) {
              let gamesurl = location.protocol=='https:'?(JSON.parse(sessionStorage.getItem("gamesUrl")).url.indexOf('https')!=0?JSON.parse(sessionStorage.getItem("gamesUrl")).url.replace('http','https'):JSON.parse(sessionStorage.getItem("gamesUrl")).url):JSON.parse(sessionStorage.getItem("gamesUrl")).url;
              let joinStr = '?';
              if(this.urlParams){
                joinStr = '&';
              }
              if (localStorage.getItem('token')) {
                if(decodeURIComponent(this.urlParams).indexOf('token')==-1){
                  $("#mainFrame").attr("src", gamesurl +this.urlParams+joinStr+"token=" + localStorage.getItem('token') + "&fromWYXUrl="+ this.Url + gameRurl +'&comeFrom=lyyyx');
                }else {
                  $("#mainFrame").attr("src", gamesurl +this.urlParams+joinStr+ "fromWYXUrl="+this.Url+ gameRurl +'&comeFrom=lyyyx');
                }
              } else {
                $("#mainFrame").attr("src", gamesurl +this.urlParams+joinStr+ "fromWYXUrl="+this.Url+ gameRurl +'&comeFrom=lyyyx');
              }
            } else {
              this.notic = true;
            }
          });
          return false;
        } else {
          this.axios.get('/api/index/getGameById', {
            params: {
              platformId: this.$route.params.id
            }
          }).then((res)=>{
            res = res.data;
            if (res.result == 0 && res.data != null) {
              var UA = navigator.userAgent;
              var forIOS = function(){
                if(!UA.match(/iPad/) && !UA.match(/iPhone/) && !UA.match(/iPod/)){return;}
                if($('#wrapper').length){return;}
                $('body').children().not('script').wrapAll('<div id="wrapper"></div>');
              }();
              this.notic = false;
              let soururl = location.protocol=='https:'?(res.data.sourUrl.indexOf('https')!=0?res.data.sourUrl.replace('http','https'):res.data.sourUrl):res.data.sourUrl;
              let joinStr = '?';
              if(this.urlParams){
                joinStr = '&';
              }
              if (localStorage.getItem('token')) {
                if(decodeURIComponent(this.urlParams).indexOf('token')==-1){
                  $("#mainFrame").attr("src", soururl +this.urlParams+joinStr+"token="+localStorage.getItem('token')+"&fromWYXUrl="+this.Url+ gameRurl +'&comeFrom=lyyyx');
                }else{
                  $("#mainFrame").attr("src", soururl +this.urlParams+joinStr+"fromWYXUrl="+this.Url+ gameRurl +'&comeFrom=lyyyx');
                }
              } else {
                $("#mainFrame").attr("src", soururl + this.urlParams+joinStr+"fromWYXUrl="+this.Url+ gameRurl +'&comeFrom=lyyyx');
              }
            } else {
              $("#mainFrame").attr("src", "")
              this.notic = true;
            }
          }).catch( (response) => {
            console.log(response);
          });
        }
      }
    },
    components: {
      DefaultPage
    }
  }
</script>

<style  rel="stylesheet/less" lang="less" scoped>
  .games{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #fff;
  }
  #wrapper{
    height:100%;
    -webkit-overflow-scrolling:touch;
    overflow:auto;
  }
</style>
