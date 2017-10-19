// pages/userAgreement/userAgreemtn.js
const app = getApp()
var service = require('../../utils/service');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.service = service(this);
    this.service({
      api: '/app/official/getAppConfig.ashx',
      success: (res) => {
         console.log(res)
      } 
    }); 

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})