//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasLoggedIn: false,
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
  }
})
