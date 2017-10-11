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
    this.service({
      api: '/app/official/login.ashx',
      query: {
        username: this.data.userPhone,
        password: this.data.userPsw
      },
      success: (res) => {
          console.log("success " + res);
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
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        hasLoggedIn: true
      })
    }

    this.service = service(this);
  }
})
