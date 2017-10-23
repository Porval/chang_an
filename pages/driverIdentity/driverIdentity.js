

//获取应用实例
const app = getApp()
var service = require('../../utils/service');


Page({
  /**
   * 页面的初始数据
   */ 
  data: {
      uploadImageOne: '/drawable/bg_drivder_identity_1.png',
      uploadImageTwo: '/drawable/bg_drivder_identity_2.png',
      needUploadOne: false,
      needUploadTwo: false,
      canSubmit: true,
      btnStyle: 'btn-disabled',
      btnText: '提交审核',
      driverIdentityNumber: null,
      carTypeIndex:0,
      carTypeList: ['C1', 'C2', 'B2', 'B1', 'A3', 'A2', 'A1'],
      driverIdentityStartDate: '',
      driverIdentityEndDate: '',
      from: '',
      accountName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dbId = options.dbId;
    var from = options.from;
    var accountName = options.name;
    var vData = app.db.get(dbId);
    this.service = service(app);
      
    if(vData) {
       var btnStyle = '';
       console.log(vData)
       var carTypeIndex = 0;
       for(var index in this.data.carTypeList) {
          if(vData.driverType == this.data.carTypeList[index]) {
              carTypeIndex = index;
          }
       }

       if(vData.vStatus == 1 || vData.vStatus == 2 || vData.vStatus == 3) {
          this.setData({
            vStats: vData.vStatus,
            uploadImageOne: vData.urlOne,
            uploadImageTwo: vData.urlTwo,
            driverIdentityNumber: vData.driverNum,
            driverIdentityStartDate: vData.driverStartDate,
            driverIdentityEndDate: vData.driverEndDate,
            carTypeIndex: carTypeIndex,
            canSubmit: vData.vStatus == 3,
            btnStyle: 'btn-disabled',
            accountName: app.getUser().name
          })
          this.checkCansubmit();
       } else {
          this.setData({
            vStats: vData.vStatus,
            canSubmit: true,
            btnStyle: '',
            accountName: app.getUser().name,
            driverIdentityNumber: app.getUser().certifyNum
          })
       }
    }

    if(from == 'register') {
       this.setData({
          from: from,
          accountName: accountName,

       })
    }

  },

  inputDriverIdentityNumber: function(e) {
     this.setData({
         driverIdentityNumber: e.detail.value
     })
     this.checkCansubmit();
  },

  onIdentityStartDateChanged: function(e) {
    this.setData({
        driverIdentityStartDate: e.detail.value
    })
    this.checkCansubmit();
  },

  onIdentityEndDateChanged: function(e) {
    this.setData({
        driverIdentityEndDate: e.detail.value
    })
    this.checkCansubmit();
  },

  onCarTypeChange: function(e) {
    this.setData({
        carTypeIndex: e.detail.value
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
    if(this.data.canSubmit) {
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
               uploadImageOne: tempFilePaths[0],
               needUploadOne: true
            })
          } else if (type == 2) {
            that.setData({
              uploadImageTwo: tempFilePaths[0],
              needUploadTwo: true
            })
          }

          that.checkCansubmit();
        }
      })
    }
  },

  checkCansubmit:function() {
      if(this.data.driverIdentityNumber == null || this.data.driverIdentityNumber.length <= 0) {
          this.setCanSubmit(false);
          return;
      }

      if(this.data.driverIdentityStartDate == null || this.data.driverIdentityStartDate.length <= 0) {
          this.setCanSubmit(false);
          return;
      }

      if(this.data.driverIdentityEndDate == null || this.data.driverIdentityEndDate.length <= 0) {
          this.setCanSubmit(false);
          return;
      }

      if (!(this.data.uploadImageOne && this.data.uploadImageOne.indexOf('bg_drivder_identity_1') == -1)) {
          this.setCanSubmit(false);
          return;
      }

      if(!(this.data.uploadImageTwo && this.data.uploadImageTwo.indexOf('bg_drivder_identity_2') == -1)) {
          this.setCanSubmit(false);
          return;
      }

      this.setCanSubmit(true);
  },

  setCanSubmit: function(canSubmit) {
      this.setData({
          btnStyle : canSubmit ? '' : 'btn-disabled'
      })
  },

  uploadImages: function(step) {
    var that = this;

    if(step == 1) {
      if(!this.data.needUploadOne) {
         this.uploadImages(2);
         return;
      }
    } else if (step == 2) {
      if(!this.data.needUploadTwo) {
         this.submitIdentify();
         return;
      }
    }

    var filePath = '';
    if(step == 1) {
      filePath = this.data.uploadImageOne
    } else {
      filePath = this.data.uploadImageTwo
    }

    wx.showLoading({
        title: '正在上传图片...'
    })
    wx.uploadFile({
      url: "https://static.ccclubs.com/upload/up.do?app=chango",
      filePath: that.data.uploadImageOne, 
      header: { "Content-Type": "multipart/form-data" },
      name: 'file',
      success: function (res) {
        if(res.statusCode != 200 || res.data == null) {
          that.uploadError();
        } else {
          var response = JSON.parse(res.data);
          if(response == null || response.code != 200) {
            that.uploadError();
          } else {
            if(step == 1) {
               that.setData({
                  uploadImageOneUrl: response.url,
                  needUploadOne: false
               }) 
               that.uploadImages(2);
            } else {
               that.setData({
                  uploadImageTwoUrl: response.url,
                  needUploadTwo: false
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
      if(!this.checkIdentifyNumber(this.data.driverIdentityNumber)) {
          return;
      }
      
      var that = this;
      this.service({
        api: '/app/official/authDriver.ashx',
        data: {
          driverImage: this.data.uploadImageOneUrl,
          driverImageVice: this.data.uploadImageTwoUrl,
          driverType: this.data.carTypeList[this.data.carTypeIndex],
          driverNum: this.data.driverIdentityNumber.toUpperCase(),
          driverStartDate: this.data.driverIdentityStartDate,
          driverEndDate: this.data.driverIdentityEndDate,
          mobile: app.getUserMobile(),
          driverName: this.data.accountName,
        },
        method: 'POST',
        success: (res) => {
             if(that.data.from == 'register') {
                wx.redirectTo({
                  url: '../identifyResult/identifyResult'
                })
             } else {
               wx.navigateBack(1);
             }
          }
      });
  },

  checkIdentifyNumber: function(identityNumber) {
   var reg2 = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;

  if(reg2.test(identityNumber)) {
       return true;
  } else {
       wx.showToast({
          title: "请输入正确的证件号码！"
        })
       return false;
    }
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