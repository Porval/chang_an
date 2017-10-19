// pages/userAgreement/userAgreemtn.js
const app = getApp()
var service = require('../../utils/service');

Page({

  /**
   * 页面的初始数据
   */
  data: {
     content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.service = service(app);
    var that = this;
    wx.showLoading({
        title: "加载中..."
    })
    this.service({
      api: '/app/official/getWeixinProtocol.ashx',
      query: {
        type: 2
      },
      success: (res) => {
         console.log(res)
         that.setData({
             content: res.licenagmt.content
         })
         wx.hideLoading();
      } 
    }); 

  },
})