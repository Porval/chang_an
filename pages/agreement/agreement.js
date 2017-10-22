// pages/agreement/agreement.js
var service = require('../../utils/service');
const app = getApp()

function countdown(that) {  
  var second = that.data.second  
  if (second == 0) {  
    that.setData({  
      btnText: "我同意",
      btnStyle: ""
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
    btnDisplay: 'none',
    toSubmit: false,
    second: 5,
    content: '',
    contentHeight: 500
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var toSubmit = options.toSubmit;
    this.service = service(app);


    wx.getSystemInfo({
      success: function(res) {
        var pageHeight = res.windowHeight;
        var contentHeight = pageHeight;
        if(toSubmit) {
            contentHeight = pageHeight - 50;
        }

        that.setData({
            contentHeight: contentHeight
        })
      }
    })


    if(toSubmit) {
       var dbId = options.dbId;
       var vOrder = app.db.get(dbId);
       this.setData({
          toSubmit: toSubmit,
          btnDisplay: 'block',
          vOrder: vOrder
       })
    }

    wx.showLoading({
        title: "加载中..."
    })
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
         if(that.data.toSubmit) {
             countdown(this);
         }
      } 
    });

  },

  toAgree: function() {
    //if(this.data.btnStyle != 'btn-disabled') {
     // app.storage.set('agreement:', {
       //     checked: true
      //})
    //}
    //wx.navigateBack();
    this.toOrder();
  },

  toOrder: function() {
    if(this.data.btnStyle != 'btn-disabled') {
      var that = this;
      var vOrder = this.data.vOrder;
      wx.showLoading({
        title: "提交中..."
      });
      this.service({
          origin: 'pre',
          api: '/testdrive/subApplication.ashx',
          method: 'POST',
          data: vOrder,
          success: (res) => {
            wx.redirecTo({
               url: '../orderSuccess/orderSuccess',
            })
            wx.hideLoading();
          },
          fail: (res)=> {
              wx.showToast({
                  title: "获取信息失败"
              })

              wx.reLaunch({
                url: "./index/index"
              })
          } 
      });
    }
  }

})