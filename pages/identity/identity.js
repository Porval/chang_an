// pages/identity/identity.js

//获取应用实例
const app = getApp()
var service = require('../../utils/service');


Page({
  /**
   * 页面的初始数据
   */ 
  data: {
      uploadImageOne: '/drawable/bg_identity_1.jpeg',
      uploadImageTwo: '/drawable/bg_identity_2.jpeg',
      canEdit: true,
      btnStyle: 'btn-disabled',
      btnText: '提交申请',
      uploadImageOneUrl: '',
      uploadImageTwoUrl: '',
      accountName: null,
      identityNumber: null,
      gerenal: ['男', '女'],
      gerenalIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dbId = options.dbId;
    var vData = app.db.get(dbId);
    this.service = service(this);
    
    if(vData) {
       var btnStyle = '';
       console.log(vData)
       if(vData != null && (vData.vStatus == 1 || vData.vStatus == 2 || vData.vStatus == 3)) {
          this.setData({
            vStats: vData.vStatus,
            canEdit: vData.vStatus == 3,
            btnStyle: 'btn-disabled',
            uploadImageOne: vData.urlOne,
            uploadImageTwo: vData.urlTwo,
            accountName: vData.accountName,
            identityNumber: vData.certifyNum,
            gerenalIndex: vData.sex == 1 ? 0 : 1
          })
          this.checkCanSubmbit();
       } else {
          this.setData({
            vStats: vData.vStatus,
            canEdit: true,
          })
       }
    }
  },

  onGerenalChange: function(e) {
     this.setData({
        gerenalIndex: e.detail.value
     })
  },

  inputIdentifyNumber: function(e) {
      this.setData({
        identityNumber: e.detail.value
      })
  },

  inputName: function(e) {
    this.setData({
        accountName: e.detail.value
    })
    this.checkCanSubmbit();
  },

  onClickAddInditityImageTwo: function() {
    this.onClickAddInditityImage(2);
  },

  onClickAddInditityImageOne: function() {
    this.onClickAddInditityImage(1)
  },

  onClickAddInditityImage: function(type) {
    if(this.data.canEdit) {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          if(type == 1) {
            that.setData({
               uploadImageOne: tempFilePaths[0]
            })
          } else if (type == 2) {
            that.setData({
              uploadImageTwo: tempFilePaths[0]
            })
          }

          that.checkCanSubmbit();
        }
      })
    }
  },

  checkCanSubmbit: function() {
    var canSubmit = true;

    if(this.data.identityNumber == null || this.data.identityNumber.length <= 0) {
        canSubmit = false;
    }

    if(this.data.accountName == null || this.data.accountName.length <= 0) {
        canSubmit = false;
    }

    if (!(this.data.uploadImageOne && this.data.uploadImageOne.indexOf('bg_identity_1') == -1)) {
        canSubmit = false
    }

    if(!(this.data.uploadImageTwo && this.data.uploadImageTwo.indexOf('bg_identity_2') == -1)) {
        canSubmit = false;
    }

    this.setData({
        btnStyle : canSubmit ? '' : 'btn-disabled'
    })  
  }, 

  uploadImages: function(step) {
    var that = this;
    wx.showLoading({
        title: '正在上传图片...'
    })
    wx.uploadFile({
      url: "https://static.ccclubs.com/upload/up.do?app=chango",
      filePath: that.data.uploadImageOne, 
      header: { "Content-Type": "multipart/form-data" },
      name: 'file',
      success: function (res) {
        console.log("uploadImages " + res.data);
        if(res.statusCode != 200 || res.data == null) {
          that.uploadError();
        } else {
          var response = JSON.parse(res.data);
          if(response == null || response.code != 200) {
            that.uploadError();
          } else {
            if(step == 1) {
               that.setData({
                  uploadImageOne: response.url
               }) 
               that.uploadImages(2);
            } else {
               that.setData({
                  uploadImageTwo: response.url
               }) 
               that.submitIdentify();
            }
          }
        }
      },
      fail: function (e) {
        console.log(e);
        that.uploadError();
      },
      complete: function () {
        wx.hideLoading();  //隐藏Toast
      }
    })
  },

  submitIdentify: function() {
      this.service({
        api: '/app/official/authIdentity.ashx',
        data: {
          aRealName: this.data.accountName,
          aSex: this.data.gerenalIndex == 0  ? '1' : '0',
          aCertifyNum: this.data.identityNumber,
          sex:  this.data.gerenalIndex == 0  ? '1' : '0',
          realName: this.data.accountName,
          certifyNum: this.data.certifyNum,
          certifyImgPositive: this.data.uploadImageOne,
          certifyImg: this.data.uploadImageTwo,
          certifyType: '1',
          mobile: app.getUserMobile()
        },
        method: 'POST',
        success: (res) => {
            console.log("post to submitIdentify " + JSON.parse(res));
            if(res.code == 200) {
                wx.navgateBack();
            }
          }
      });
  },

  uploadError: function() {
    wx.showModal({
        title: '提示',
        content: '上传失败',
        showCancel: false
    })
    return;
  },

  toNext:function() {
    this.uploadImages(1);
  }
})