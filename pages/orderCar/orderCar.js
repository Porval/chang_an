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
                that.toCityChanged(cityCodeList[0]);
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

  onCityChanged: function(e) {
    var cityIndex = e.detail.value;
    this.setData({
        cityIndex: cityIndex
    });
    this.toCityChanged(this.data.cityCodeList[cityIndex]);
  },

  toCityChanged: function(cityCode) {
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
                that.toAreaChanged(areaCodeList[0]);
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

  onAreaChanged: function(e) {
    var areaIndex = e.detail.value;
    this.setData({
        areaIndex: areaIndex
    });
    this.toAreaChanged(this.data.areaCodeList[areaIndex]);
  },

  toAreaChanged: function(areaCode) {
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
                    shopList.push(res.list[index].storeName);
                    shopCodeList.push(res.list[index].storeId);
                }
                this.setData({
                    shopList: shopList,
                    shopCodeList: shopCodeList,
                    shopIndex: 0
                })
                that.toShopChanged(shopCodeList[0]);
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

  onShopChanged: function(e) {
    var shopIndex = e.detail.value;
    this.setData({
        shopIndex: shopIndex
    });
    this.toShopChanged(this.data.shopList[shopIndex]);
  },

  toShopChanged: function(storeId) {
    var that = this;
    wx.showLoading({
      title: "加载中..."
    });
    this.service({
        origin: 'pre',
        api: '/testdrive/getCtCar.ashx',
        query: {
           storeId: storeId
        },
        success: (res) => {
            if(res.list) {
                var carList = [];
                var carCodeList = [];
                for(var index in res.list) {                
                    carList[index] = res.list[index].modelName;
                    carCodeList[index] = res.list[index].modelId;
                }
                this.setData({
                    carList: carList,
                    carCodeList: carCodeList,
                    carIndex: 0
                })
                wx.hideLoading();
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

  onCarChanged: function(e) {
    console.log(e.detail.value);
    this.setData({
        carIndex: e.detail.value
    })
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