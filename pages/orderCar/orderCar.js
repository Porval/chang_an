const app = getApp()
var service = require('../../utils/service');

// pages/orderCar/orderCar.js
Page({
  data: {
    cityList: [],
    cityCodeList: [],
    cityIndex: 0,
    areaList: [],
    areaCodeList: [],
    areaIndex: 0,
    shopCodeList: [],
    shopList: [],
    shopIndex: 0,
    cartCodeList: [],
    carList: [],
    carIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.service = service(this);
      this.loadCityList();
  },

  loadCityList: function() {
    wx.showLoading({
      title: "加载中..."
    });
    var that = this;
    this.service({
        api: '/app/official/getAllHost.ashx',
        success: (res) => {
            if(res.list) {
                var cityList = [];
                var cityCodeList = [];
                for(var index in res.list) {
                    cityList.push(res.list[index].name);
                    cityCodeList.push(res.list[index].code);
                }
                this.setData({
                    cityList: cityList,
                    cityCodeList: cityCodeList,
                    cityIndex: 0
                })
                that.onCityChanged(cityCodeList[0]);
            }
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  onCityChanged: function(cityCode) {
    var that = this;
    wx.showLoading({
      title: "加载中..."
    });
    this.service({
        api: '/app/official/getAreasUnitDept.ashx',
        query: {
           hostId: cityCode
        },
        success: (res) => {
            if(res.list) {
                var areaList = [];
                var areaCodeList = [];
                for(var index in res.list) {
                    areaList.push(res.list[index].areaName);
                    areaCodeList.push(res.list[index].areaId);
                }
                this.setData({
                    areaList: areaList,
                    areaCodeList: areaCodeList,
                    areaIndex: 0
                })
                that.onAreaChanged(areaCodeList[0]);
            }
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

  onAreaChanged: function(areaCode) {
    var that = this;
    wx.showLoading({
      title: "加载中..."
    });
    this.service({
        origin: 'pre',
        api: '/testdrive/getStore.ashx',
        query: {
           areaId: areaCode
        },
        success: (res) => {
            if(res.list) {
                var shopList = [];
                var shopCodeList = [];
                for(var index in res.list) {
                    shopList.push(res.list[index].name);
                    shopCodeList.push(res.list[index].code);
                }
                this.setData({
                    shopList: shopList,
                    shopCodeList: shopCodeList,
                    shopIndex: 0
                })
                that.onShopChanged();
            }
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

  onShopChanged: function() {

  },

  onCarChanged: function() {

  },

  onClickAgreement: function() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },
  
  toOrder: function() {
    wx.navigateTo({
      url: '../orderSuccess/orderSuccess',
    }) 
  },

  showToCommentAlert: function() {
    wx.showModal({
      title: '您有试驾订单未评价',
      cancelText: '取消',
      confirmText: '去评价',
      cancelColor: '#333',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../rate/rate',
          })
        }
      }
    })
  }
})