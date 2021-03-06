//index.js
//获取应用实例
const app = getApp()
var service = require('../../utils/service');

Page({
  data: {
    hasLoggedIn: false,
    userPhone: "",
    userPsw: ""
  },
  toLogin: function() {
    wx.showLoading({
        title: "登录中..."
    })
    this.service({
      api: '/app/official/login.ashx',
      query: {
        username: this.data.userPhone,
        password: this.data.userPsw
      },
      success: (res) => {
          console.log("login success " + res);
          if(res.access_token) {
              app.setToken(res.access_token, this.data.userPhone);
              wx.redirectTo({
                url: '../identifyResult/identifyResult'
              })
          }
          wx.hideLoading();
        }
      });
    console.log("usePhone " + this.data.userPhone);
  },
  phoneInput: function(e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  pswInput: function(e) {
    this.setData({
      userPsw: e.detail.value
    })
  },
  //事件处理函数
  toRegister: function() {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  onLoad: function (options) {
    console.log('options ' + JSON.stringify(options));
    //options.scene = encodeURI("city=12&area=15&store=122");
    if(options.scene) {
       var query = decodeURIComponent(options.scene);
       var map = this.parseQuery(query);
       var location = {
          defaultCityId: map["city"],
          defaultAreaId: map["area"],
          defaultShopId: map["store"]
       };
      app.storage.set('defaultLocation:', location);
      console.log('location query ' + JSON.stringify(location));
    }
    
    if (app.globalData.hasToken) {
       wx.redirectTo({
          url: '../identifyResult/identifyResult'
       }) 
    }

    this.service = service(app);
  },
  
  parseQuery: function(query) {
      var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
      var obj = {};
      while(reg.exec(query)){
          obj[RegExp.$1] = RegExp.$2;
      }
      return obj;
  }
})
