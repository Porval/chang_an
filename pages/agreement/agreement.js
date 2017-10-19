// pages/agreement/agreement.js
var service = require('../../utils/service');
const app = getApp()

function countdown(that) {  
  var second = that.data.second  
  if (second == 0) {  
    that.setData({  
      btnText: "我同意",
      btnStyle: "button-primary"
    });  
  return ;  
 }  

 var time = setTimeout(function() {  
    that.setData({  
      second: second - 1,
      btnText: "我同意 (" + (that.data.second -  1) + "s)",
      btnStyle: "btn-disabled"
    });  
    countdown(that);  
 },1000)  
}  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnText: "我同意 (5s)",
    btnStyle: "btn-disabled",
    btnDisabled: false,
    second: 5,
    content: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.service = service(app);
    wx.showLoading({
        title: "加载中..."
    })
    https://catest.app.ccclubs.com/app/official/getWeixinConfig.ashx?access_token=
    this.service({
      api: '/app/official/getWeixinConfig.ashx',
      query: {
        access_token: app.getAccessToken()
      },
      success: (res) => {
         console.log(res)
         that.setData({
             content: res.testdriveRule.content
         })
         wx.hideLoading();
         countdown(this);
      } 
    }); 
  },

  toAgree: function() {
    app.storage.set('agreement:', {
          checked: true
    })
    wx.navigateBack();
  }
})