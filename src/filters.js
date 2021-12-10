import Vue from 'vue'

Vue.filter("moneyFormat", function (value) {
  return '￥' + parseFloat(value).toFixed(2)
})
