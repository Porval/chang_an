// pages/identity/identity.js

//获取应用实例
const app = getApp()
var service = require('../../utils/service');


Page({
  /**
   * 页面的初始数据
   */ 
  data: {
      uploadImageOne: '/drawable/bg_identity_1.png',
      uploadImageTwo: '/drawable/bg_identity_2.png',
      needUploadOne: false,
      needUploadTwo: false,
      canEdit: true,
      btnStyle: 'btn-disabled',
      btnText: '提交审核',
      accountName: null,
      identityNumber: null,
      gerenal: ['请选择性别','男', '女'],
      gerenalIndex: 0,
      from: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dbId = options.dbId;
    var vData = app.db.get(dbId);
    var from = options.from;
    this.service = service(app);
    
    if(vData) {
       var btnStyle = '';
       console.log(vData)
       if(vData != null && (vData.vStatus == 1 || vData.vStatus == 2 || vData.vStatus == 3)) {
          this.setData({
            vStats: vData.vStatus,
            canEdit: vData.vStatus == 3,
            btnStyle: 'btn-disabled',
            uploadImageOne: this.formatImageUrl(vData.urlTwo),
            uploadImageTwo: this.formatImageUrl(vData.urlOne),
            accountName: vData.accountName,
            identityNumber: vData.certifyNum,
            gerenalIndex: vData.sex == 1 ? 1 : 2
          })
          this.checkCanSubmbit();
       } else {
          this.setData({
            vStats: vData.vStatus,
            canEdit: true,
          })
       }
    }

    if(from == 'register') {
        this.setData({
            btnText: '下一步',
            from: from
        })
    }

  },

  onGerenalChange: function(e) {
     this.setData({
        gerenalIndex: e.detail.value
     })
     this.checkCanSubmbit();
  },

  inputIdentifyNumber: function(e) {
      this.setData({
        identityNumber: e.detail.value
      })
      this.checkCanSubmbit();
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
               uploadImageOne: tempFilePaths[0],
               needUploadOne: true
            })
          } else if (type == 2) {
            that.setData({
              uploadImageTwo: tempFilePaths[0],
              needUploadTwo: true
            })
          }

          that.checkCanSubmbit();
        }
      })
    }
  },

  onLoadImageFinish: function() {
     console.log("onLoadImageFinish " + this.data.uploadImageOne);
     this.setData({
        uploadImageOne: this.data.uploadImageOne
     })
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

    console.log("checkCanSubmbit " + canSubmit);

    this.setData({
        btnStyle : canSubmit ? '' : 'btn-disabled'
    })  
  }, 

  uploadImages: function(step) {
    var that = this;
    var filePath = '';

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
      filePath: step == 1 ? that.data.uploadImageOne : that.data.uploadImageTwo,
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
                  uploadImageOne: response.url,
                  needUploadOne: false
               }) 
               that.uploadImages(2);
            } else {
               that.setData({
                  uploadImageTwo: response.url,
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
      }
    })
  },

  submitIdentify: function() {
      if(!this.checkIdentifyNumber(this.data.identityNumber)) {
          return;
      }

      var sex = '1';
      if(this.data.gerenalIndex == 0) {
        wx.showToast({
            title: '请选择性别！'
        })

        return;
      } else if(this.data.gerenalIndex == 1) {
        sex = 1;
      } else {
        sex = 0;
      }
        
      wx.showLoading({
        title: '正在提交...'
      })

      var that = this;
      this.service({
        api: '/app/official/authIdentity.ashx',
        data: {
          sex:  sex,
          realName: this.data.accountName,
          certifyNum: this.data.identityNumber.toUpperCase(),
          certifyImgPositive: this.data.uploadImageTwo,
          certifyImg: this.data.uploadImageOne,
          certifyType: '1',
          mobile: app.getUserMobile()
        },
        method: 'POST',
        success: (res) => {
          that.sumbitSuccess();
          wx.hideLoading();
        }
      });
 },
 
 toAliCheck: function() {
    var that = this;
    var inputs = [];
    var imageOne = {
       image : {
          dataType: 50,
          dataValue: "111"
       },
       configure: {
          dataType: 50,
          dataValue: "{\"side\":\"face\"}" 
       }
    }

    var imageTwo = {
       image : {
          dataType: 50,
          dataValue: "111"
       },
       configure: {
          dataType: 50,
          dataValue: "{\"side\":\"face\"}" 
       }
    }

    inputs[0] = imageOne;
    inputs[1] = imageTwo;
 
    this.service({
        origin: 'dm',
        api: '/rest/160601/ocr/ocr_idcard.json',
        data: {
          inputs: inputs
        },
        method: 'POST',
        success: (res) => {
             that.sumbitSuccess();
        }
    });
 },

 formatImageUrl: function(url) {
    if(url && !url.startsWith("https") && url.startsWith("http")) {
        return url.replace("http", "https");
    }
    return url;
 },

 sumbitSuccess: function() {
    if(this.data.from == 'register') {
        wx.redirectTo({
          url: '../driverIdentity/driverIdentity?from=register&name=' + this.data.accountName
        })
    } else {
        wx.navigateBack(1);
    } 
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