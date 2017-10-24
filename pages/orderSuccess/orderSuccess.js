// pages/orderSuccess/orderSuccess.js
const app = getApp()
var service = require('../../utils/service');
  
function countdown(that) {  
  var second = that.data.second;
  if(that.data.notRate) {
      return;
  }
  if (second == 0) {  
    that.setData({  
       second: 5
    });

    if(!that.data.hidden) {
        that.checkUnRateOrder();
    } 
   return ;  
 }  

 var time = setTimeout(function() {
    that.setData({  
       second: second - 1,
    });
    console.log("second " + second);  
    if(!that.data.hidden) {
       countdown(that);
    }  
 },1000)  
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
     second: 5,
     hidden: true,
     notRate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.service = service(app);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     console.log("onShow ");
     if(!this.data.notRate) {
         this.setData({
            second: 0,
            hidden: false
         })
         countdown(this);
    }
  },

  onHide:function() {
     console.log("onHide ");
     this.setData({
        second: 5,
        hidden: true
     })
  },

  checkUnRateOrder: function() {
     var that = this;
     this.service({
        origin: 'pre',
        api: '/testdrive/getOrderId.ashx',
        data: {
           access_token: app.getAccessToken()
        },
        success: (res) => {
          if(!res.havreview && res.list && res.list.length > 0) {
             that.showToCommentAlert(res.list[0].orderIds);
          } else {
            this.setData({
              second: 5
            })
            countdown(this);
          }
        },
        fail: (res)=> {
          this.setData({
              second: 5
          })
          countdown(this);
        } 
    });
  },

  showToCommentAlert: function(orderId) {
    var that = this;
    wx.showModal({
      title: '您的试驾已结束，请评论',
      cancelText: '取消',
      confirmText: '去评价',
      cancelColor: '#333',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../rate/rate?orderId=' + orderId,
          })
        } else if(res.cancel) {
          that.setData({
              notRate: true
          })
        }
      }
    })
  }
})