// pages/rate/rate.js
const App = getApp()
var service = require('../../utils/service');

Page({

  /**
   * 页面的初始数据
   */
  data: {
     btnStyle: 'btn-disabled',
     rateIdList: ['rzoom', 'rpower', 'roperation', 'rconsumption', 'rcomfortation', 'rappearance', 'rservice'],
     commentInput: null,
     orderId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId;
    var that = this;
    this.service = service(this);

    this.setData({
        orderId: orderId
    })

    this.$wuxRater = App.Wux().$wuxRater
    for(var index in this.data.rateIdList) {
        this.$wuxRater.init(this.data.rateIdList[index], {
          value: 0,
          callback: function(e) {
            that.checkAllReady();
          }
        })
    }
  },

  checkAllReady: function() {
    var canSubmit = this.data.commentInput && this.data.commentInput.length > 0;
    if(canSubmit) {
      for(var index in this.data.rateIdList) {
         var value = this.data.$wux.rater[this.data.rateIdList[index]].value;
         if(value <= 0) {
            canSubmit = false;
            break;
         }
      }
    }

    this.setData({
      btnStyle: canSubmit ? '' : 'btn-disabled'
    });

    console.log("checkAllReady");
  },

  onCommentChanged: function(e) {
     var commentInput = e.detail.value;
     this.setData({
         commentInput: commentInput
     });
     
     if(commentInput && commentInput.length > 0) {
        this.checkAllReady();
     }
  },

  toSubmit:function() {
    wx.showLoading('提交中...');
    var level = [];
    for(var index in this.data.rateIdList) {
        var value = this.data.$wux.rater[this.data.rateIdList[index]].value;
        level[index] = value;
    }

    this.service({
        origin: 'pre',
        api: '/testdrive/submitReviews.ashx',
        method: 'POST',
        data: {
           orderId: this.data.orderId,
           level: level,
           content: this.data.commentInput,
           access_token: App.getAccessToken()
        },
        success: (res) => {
          wx.hideLoading();
          wx.navigateBack();
          wx.showToast({
              title: "提交成功"
          })
        },
        fail: (res)=> {
            wx.hideLoading();
            wx.showToast({
                title: "提交失败请重新提交"
            })
        }
    });  
  }
})