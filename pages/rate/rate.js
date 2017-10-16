// pages/rate/rate.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
     btnStyle: 'btn-disabled',
     rateIdList: ['rzoom', 'rpower', 'roperation', 'rconsumption', 'rcomfortation', 'rappearance', 'rservice'],
     commentInput: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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

  checkAllReady() {
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

  onCommentChanged(e) {
     var commentInput = e.detail.value;
     this.setData({
         commentInput: commentInput
     });
     
     if(commentInput && commentInput.length > 0) {
        this.checkAllReady();
     }
  } 
})