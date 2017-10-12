// pages/identifyResult/identifyResult.js
const app = getApp()
var service = require('../../utils/service');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    identifyStatus: '等待审核',
    driveIndentifyStatus: '等待审核'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.service = service(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.service({
        api: '/app/official/getMemberInfo.ashx',
        query: {
          access_token: app.getAccessToken()
        },
        success: (res) => {
            console.log("get user info " + res);
            this.setData({
                user: res.map
            })
            this.refreshStatus();
            this.checkVertifyResult();
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
  },
  refreshStatus() {
    if(this.data.user) {
      var vreal = this.data.user.vreal;
      var vdrive = this.data.user.vdrive;
      var vrealStatus = '未认证';
      var vdriveStatus = '未认证';
      if(vreal == 1) {
          vrealStatus = '认证成功'
      } else if (vreal == 2) {
          vrealStatus = '等待认证'
      } else if (vreal == 3) {
          vrealStatus = '认证失败'
      }

      if(vdrive == 1) {
          vdriveStatus = '认证成功'
      } else if (vdrive == 2) {
          vdriveStatus = '等待认证'
      } else if (vdrive == 3) {
          vdriveStatus = '认证失败'
      }

      this.setData({
          identifyStatus: vrealStatus,
          driveIndentifyStatus: vdriveStatus
      })
    }
  },
  checkVertifyResult() {
    if(this.data.user 
        && this.data.user.vreal == 1
        && this.data.user.vdrive == 3) {
      wx.navigateTo({
        url: '../orderCar/orderCar'
      })
    }
  },
  onClickVreal() {
    wx.navigateTo({
      url:'../identity/identity'
    })
  },
  onClickVdriver() {
    wx.navigateTo({
      url:'../driverIdentity/driverIdentity'
    })
  }
})
