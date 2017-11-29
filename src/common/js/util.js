import Vue from 'vue';

Vue.filter('setTime', function (value) {
  value = Number(value);
  var dates = new Date(value);
  var years = dates.getFullYear();
  var mounths = dates.getMonth() + 1;
  var days = dates.getDate();
  mounths = mounths > 9 ? mounths + '' : "0" + mounths;
  days = days > 9 ? days + '' : "0" + days;
  return years + '-' + mounths + "-" + days;
});
Vue.filter('setTimes', function (value) {
  value = Number(value);
  var dates = new Date(value);
  var mounths = dates.getMonth() + 1;
  var days = dates.getDate();
  mounths = mounths > 9 ? mounths + '' : "0" + mounths;
  days = days > 9 ? days + '' : "0" + days;
  return  mounths + "-" + days;
});
Vue.filter('limitWord', function(value,number){
  if (value){
    if(value.length>number){
      return value.substring(0,number)+"..."
    }else{
      return value
    }
  }
})
Vue.filter('getTime',function (value){
  value = Number(value);
  var dates = new Date(value);
  var years = dates.getFullYear();
  var mounths = dates.getMonth() + 1;
  var days = dates.getDate();
  var hours = dates.getHours();
  var minutes = dates.getMinutes();
  var seconds = dates.getSeconds();
  mounths = mounths > 9 ? mounths + '' : "0" + mounths;
  days = days > 9 ? days + '' : "0" + days;
  hours = hours > 9 ? hours + '' : "0" + hours;
  minutes = minutes > 9 ? minutes + '' : "0" + minutes;
  seconds = seconds > 9 ? seconds + '' : "0" + seconds;
  if(value){
    return years + '-' + mounths + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
  }
});
Vue.filter('getTime1',function (value){
  value = Number(value);
    var dates = new Date(value);
    var years = dates.getFullYear();
    var mounths = dates.getMonth() + 1;
    var days = dates.getDate();
    var hours = dates.getHours();
    var minutes = dates.getMinutes();
    var seconds = dates.getSeconds();
    mounths = mounths > 9 ? mounths + '' : "0" + mounths;
    days = days > 9 ? days + '' : "0" + days;
    hours = hours > 9 ? hours + '' : "0" + hours;
    minutes = minutes > 9 ? minutes + '' : "0" + minutes;
    seconds = seconds > 9 ? seconds + '' : "0" + seconds;
    if(value){
        return mounths + "-" + days + "  " + hours + ":" + minutes;
    }
});
Vue.filter('Time',function (value){
  value = Number(value);
  var dates = new Date(value);
  var mounths = dates.getMonth() + 1;
  var days = dates.getDate();
  var hours = dates.getHours();
  var minutes = dates.getMinutes();
  mounths = mounths > 9 ? mounths + '' : "0" + mounths;
  days = days > 9 ? days + '' : "0" + days;
  hours = hours > 9 ? hours + '' : "0" + hours;
  minutes = minutes > 9 ? minutes + '' : "0" + minutes;
  if(value){
    return mounths + "-" + days + " " + hours + ":" + minutes;
  }
});
