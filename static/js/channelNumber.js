/**
 head标签内增加渠道统计代码
 通过渠道推广访问一个页面后，再访问其他页面都要加上渠道参数
 代码安装好后 测试访问地址 http://ck.13322win.com
 */
//   var str = parent.document.getElementById("game_iframe");

function UrlSearch() {
  var str = window.location.href;
  var num = str.indexOf("?");
  str = str.substr(num + 1);
  if(str.indexOf("?") == -1) {} else {
    num = str.indexOf("?");
    str = str.substr(num + 1);
  }
  var arr = str.split("&")
  for(i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if(num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}
function UrlSearchIframeSrc(){
  var str = '';
  if(document.getElementById('mainFrame')){
    str = document.getElementById('mainFrame').src;
  }
  var num = str.indexOf("?");
  str = str.substr(num + 1);
  if(str.indexOf("?") == -1) {} else {
    num = str.indexOf("?");
    str = str.substr(num + 1);
  }
  var arr = str.split("&")
  for(i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if(num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}
(function () {
  var Requres = new UrlSearch();
  var RequresIframe = new UrlSearchIframeSrc();
  var cid;
  if (window.location.href.indexOf("gamelist")!=-1&&Requres.cid) {
    var userid =  window.location.href.split("?")[0].split("/")[4];
    sessionStorage.setItem("gameId",userid);
    sessionStorage.setItem("gameCid",Requres.cid);
    sessionStorage.setItem("gameUrl",window.location.href);
  }else if (Requres.type&&Requres.cid) {
    sessionStorage.setItem("gameId","");
    sessionStorage.setItem("gameCid",Requres.cid);
    sessionStorage.setItem("gameUrl",window.location.href);
  } else if(!/^[A-z]+$/.test(window.location.href.split(".com/")[1].split("?")[0])&&window.location.href.split(".com/")[1].indexOf("/")==-1&&window.location.href.split(".com/")[1]!=""){

    sessionStorage.setItem("gameId","");
    sessionStorage.setItem("gameCid",decodeURIComponent(window.location.href.split(".com/")[1]).split("?")[0]);
    sessionStorage.setItem("gameUrl",window.location.href);
  }
  sessionStorage.removeItem("registerCid");
  if(Requres.cid){
    cid=Requres.cid;
    sessionStorage.setItem("registerCid",cid)
  }else if(RequresIframe.cid){
    cid=RequresIframe.cid;
    sessionStorage.setItem("registerCid",cid)
  }else{
    cid='vnp56ams';
  }

})();
