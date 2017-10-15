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
      showSubmitButton: true,
      btnStyle: 'btn-disabled',
      btnText: '提交申请'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dbId = options.dbId;
    var vData = app.db.get(dbId);
    if(vData) {
       this.setData({
          vStats: vData.vStatus
       })
    }
  },

  onShow: function() {

  },

  onClickAddInditityImageTwo: function() {
    this.onClickAddInditityImage(2);
  },

  onClickAddInditityImageOne: function() {
    this.onClickAddInditityImage(1)
  },

  onClickAddInditityImage: function(type) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log('type ' + type)
        var canSubmit = false;
        if(type == 1) {
          that.setData({
             uploadImageOne: tempFilePaths
          })
          if(that.uploadImageTwo && that.uploadImageTwo.indexOf('bg_identity_2') == -1) {
             canSubmit = true;
          }
        } else if (type == 2) {
          that.setData({
            uploadImageTwo: tempFilePaths
          })
          if(that.data.uploadImageOne && that.data.uploadImageOne.indexOf('bg_identity_1') == -1) {
             canSubmit = true;
          }
        }

        that.setData({
            btnStyle : canSubmit ? '' : 'btn-disabled'
        })
      
        console.log(tempFilePaths);
      }
    })
  },

  uploadImages: function() {
    console.log(this.data.uploadImage1[0]);
    wx.uploadFile({
      url: "https://static.ccclubs.com/upload/up.do?app=chango",
      filePath: this.data.uploadImage1[0], 
      header: { "Content-Type": "multipart/form-data" },
      name: 'file',
      formData: {
          'fileFileName': 'test'
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode != 200) { 
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
            return;
        }
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  },
  toNext:function() {
    this.uploadImages();
  }
})