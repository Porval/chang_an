// pages/agreement/agreement.js
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
    second: 5
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    countdown(this); 
  },

  toAgree: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})