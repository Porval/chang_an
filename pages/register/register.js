// pages/register/register.js

function countdown(that) {  
  var second = that.data.second  
  if (second == 0) {  
    that.setData({  
      btnText: "获取验证码",
      btnStyle: "zan-btn--primary",
      second: 60
    });  
  return ;  
 }  

 var time = setTimeout(function() {  
    that.setData({  
      second: second - 1,
      btnText: (that.data.second -  1) + "秒后可重发",
      btnStyle: "btn-disabled"
    });  
    countdown(that);  
 }, 1000)  
}  

const app = getApp()
var service = require('../../utils/service');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: [],
    areaIndex: 0,
    areaCode: [],
    mobile: null,
    smsCode: null,
    psw: null,
    confirmPsw: null,
    isCheckedAgreement: false,
    second: 60,
    btnText: "获取验证码",
    btnStyle: "zan-btn--primary"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.service = service(this);

    this.service({
        api: '/app/official/getAllHost.ashx',
        success: (res) => {
            if(res.list) {
                var areaList = [];
                var areaCodeList = [];
                for(var index in res.list) {
                    areaList.push(res.list[index].name);
                    areaCodeList.push(res.list[index].host);
                }
                this.setData({
                    area: areaList,
                    areaCode: areaCodeList
                })
            }
            console.log("get area list " + res);
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

  phoneInput: function(e) {
      this.setData({
          mobile: e.detail.value
      });
  },

  smsCodeInput: function(e) {
      this.setData({
          smsCode: e.detail.value
      });
  },

  pswInput: function(e) {
      this.setData({
          psw: e.detail.value
      });
  },

  confirmPswInput: function(e) {
      this.setData({
          confirmPsw: e.detail.value
      });
  },

  checkboxChange: function(e) {
      this.setData({
          isCheckedAgreement: e.detail.value.length > 0 
      });
  },

  onAreaChange: function(e) {
      this.setData({
          areaIndex: e.detail.value
      })
  },

  toConnectService: function(e) {
    wx.showModal({
      title: '提示',
      content: '客服电话: 02388256088\n转9，以#号键结束',
      cancelText: '取消',
      confirmText: '拨打',
      confirmColor: '#ed6f2d',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
             phoneNumber: '02388256088'
          });
        }
      }
    })
  },

  toSendSmsCode: function() {
    if(this.data.btnStyle == "zan-btn--primary") {
      //TODO CHECK PHONE NUMBER
      this.service({
        api: '/app/official/forgetsms.ashx',
        query: {
          type: 2,
          mobile: this.data.mobile
        },
        success: (res) => {
            console.log("smsCode send success " + res);
            countdown(this);
        },
        fail: (res)=> {
            wx.showToast({
                title: "发送失败请重试"
            })
        } 
      });
    }
  },

  getAccessToken() {
    var that = this;
    this.service({
      api: '/app/official/login.ashx',
      query: {
        username: this.data.mobile,
        password: this.data.psw
      },
      success: (res) => {
          console.log("login success " + res);
          if(res.access_token) {
              app.setToken(res.access_token, that.data.mobile);
              wx.hideLoading();
              wx.redirectTo({
                url: '../identity/identity?from=register'
            })
          }
        }
    });
  },

  toNext: function () {
    wx.showLoading({
        title: "提交中..."
    });
    var that = this;
    this.service({
        api: '/app/official/register.ashx',
        query: {
          hostId: this.data.areaCode[this.data.areaIndex],
          mobile: this.data.mobile,
          validCode: this.data.smsCode,
          txtPassWord: this.data.psw,
          txtRePassWord: this.data.confirmPsw,
          from: 6
        },
        success: (res) => {
            that.getAccessToken();
        },
        fail: (res)=> {
            wx.showToast({
                title: "发送失败请重试"
            })
        } 
    });
  }
})