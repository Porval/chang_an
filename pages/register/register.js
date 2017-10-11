// pages/register/register.js

function countdown(that) {  
  var second = that.data.second  
  if (second == 0) {  
    that.setData({  
      btnText: "获取验证码",
      btnStyle: "zan-btn--primary",
      second: 5
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
    areaIndex: 0,
    mobile: null,
    smsCode: null,
    psw: null,
    confirmPsw: null,
    isCheckedAgreement: false,
    second: 5,
    btnText: "获取验证码",
    btnStyle: "zan-btn--primary"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    console.log(e);
      this.setData({
          isCheckedAgreement: e.detail.value.length > 0 
      });
  },

  onAreaChange: function(e) {
      this.setData({
          areaIndex: e.detail.value
      })
  },

  toSendSmsCode: function() {
    if(this.data.btnStyle == "zan-btn--primary") {
      countdown(this); 
    }
  },

  toNext: function () {
      
  }
})