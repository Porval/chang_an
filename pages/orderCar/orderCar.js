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
    carCodeList: [],
    carList: [],
    carIndex: 0,
    firstLoad: true,
    user: null,
    adList: ['/drawable/order_page_span.png'],
    agreementChecked: true,
    isCheckedAgreement: true,
    btnStyle: 'btn-disabled',
    defaultCityId: 0,
    defaultAreaId: 0,
    defaultShopId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.service = service(app);
      this.setData({
          user: app.getUser(),
          orderMobile: app.getUser().mobile
      })
      this.loadCityList();
      this.loadAds();
      
      var location = app.storage.get('defaultLocation:');
      console.log(location);
      if(location && location.defaultCityId 
            && location.defaultCityId > 0) {
          this.setData({
                defaultCityId: location.defaultCityId,
                defaultAreaId: location.defaultAreaId,
                defaultShopId: location.defaultShopId
          })
          app.storage.set('defaultLocation:', null);
          this.setDefaultCityId();
      } else {
        var that = this;
        wx.getLocation({
        type: 'wgs84', 
        success: (res) => {
           console.log(" latitude " + res.latitude + " " + res.longitude);
           that.setData({
               latitude: res.latitude,
               longitude: res.longitude
           })
           that.getLocationInfo();
          }
        })
      }
  },

  getLocationInfo() {
      var that = this;
      this.service({
          api: '/testdrive/distance.ashx',
          origin: 'pre',
          query: {
            lon: that.data.longitude,
            lat:  that.data.latitude
          },
          success: (res) => {
             if(res.list && res.list.length > 0) {
                  that.setData({
                      defaultCityId: res.list[0].hostId,
                      defaultAreaId: res.list[0].areaId,
                      defaultShopId: res.list[0].id
                  })
                  that.setDefaultCityId();
             }
          }
      });   
  },

  setDefaultCityId: function() {
      if(this.data.cityCodeList 
        && this.data.cityCodeList.length > 0 
        && this.data.defaultCityId > 0) {
           for(var index in this.data.cityCodeList) {
               if(this.data.cityCodeList[index] == this.data.defaultCityId) {
                   console.log("set defaultCityId " + this.data.cityCodeList[index]);
                   this.setData({
                        cityIndex: index,
                        defaultCityId: 0
                   })
                   this.toCityChanged(this.data.cityCodeList[index]);
                   return true;
               }
           }
      }

      return false;
  },
  setDefaultAreaId: function() {
      if(this.data.areaCodeList 
        && this.data.areaCodeList.length > 0 
        && this.data.defaultAreaId > 0) {
           for(var index in this.data.areaCodeList) {
               if(this.data.areaCodeList[index] == this.data.defaultAreaId) {
                   console.log("set defaultAreaId " + this.data.areaCodeList[index]);
                   this.setData({
                        areaIndex: index,
                        defaultAreaId: 0
                   })
                   this.toAreaChanged(this.data.areaCodeList[index]);
                   return true;
               }
           }
      }

      return false;
  },

  setDefaultShopId: function() {
      if(this.data.shopCodeList 
        && this.data.shopCodeList.length > 0 
        && this.data.defaultShopId > 0) {
           for(var index in this.data.shopCodeList) {
               if(this.data.shopCodeList[index] == this.data.defaultShopId) {
                   console.log("set defaultShopId " + this.data.shopCodeList[index]);
                   this.setData({
                        shopIndex: index,
                        defaultShopId: 0
                   })
                   this.toShopChanged(this.data.shopCodeList[index]);
                   return true;
               }
           }
      }

      return false;
  },

  checkboxChange: function(e) {
     var checked = e.detail.value.length > 0;

     this.setData({
          isCheckedAgreement: checked
     });

     this.checkCanSubmit();

  },

  checkCanSubmit: function() {
      var checked = this.data.isCheckedAgreement;
      checked = checked && (this.data.shopList && this.data.shopList.length > 0);
      this.setData({
        btnStyle: checked ? '' : 'btn-disabled'
      });
  },

  loadAds: function() {
    var that = this;
    this.service({
        api: '/testdrive/index.ashx',
        origin: 'pre',
        query: {
          access_token: app.getAccessToken()
        },
        success: (res) => {
            if(res && res.ads) {
              var adsList = [];
              for(var index in res.ads) {
                adsList.push(res.ads[index].image);
              }
               that.setData({
                  adList: adsList
               })
            }
        }
    });   
  },

  phoneInput: function(e) {
    this.setData({
        orderMobile: e.detail.value
    })
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
                    cityCodeList.push(res.list[index].host);
                }
                that.setData({
                    cityList: cityList,
                    cityCodeList: cityCodeList,
                })

                if(!that.setDefaultCityId()) {
                    that.setData({
                        cityIndex: 0
                    })
                    that.toCityChanged(cityCodeList[0]);
                }
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
    console.log('city index ' + cityIndex);
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
                that.setData({
                    areaList: areaList,
                    areaCodeList: areaCodeList
                })
                if(!that.setDefaultAreaId()) {
                    that.setData({
                        areaIndex: 0
                    })
                    that.toAreaChanged(areaCodeList[0]);
                }
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
            if(res.list && res.list.length > 0) {
                var shopList = [];
                var shopCodeList = [];
                for(var index in res.list) {
                    shopList.push(res.list[index].storeName);
                    shopCodeList.push(res.list[index].storeId);
                }
                this.setData({
                    shopList: shopList,
                    shopCodeList: shopCodeList
                })
                if(!that.setDefaultShopId()) {
                   that.setData({
                      shopIndex: 0
                   })
                   that.toShopChanged(shopCodeList[0]);
                }
            } else {
              this.setData({
                  shopList: [],
                  shopCodeList: [],
                  shopIndex: 0,
                  carList: [],
                  carCodeList: [],
                  carIndex: 0
              })

              wx.showToast({
                title: "该区域暂无4S门店"
              })

              wx.hideLoading();
            }
        },
        fail: (res)=> {
            wx.showToast({
                title: "获取信息失败"
            })

            wx.hideLoading();

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
    this.toShopChanged(this.data.shopCodeList[shopIndex]);
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
            if(res.list && res.list.length > 0) {
                var carList = [];
                var carCodeList = [];
                for(var index in res.list) {                
                    carList[index] = res.list[index].modelName;
                    carCodeList[index] = res.list[index].modelId;
                }
                that.setData({
                    carList: carList,
                    carCodeList: carCodeList,
                    carIndex: 0
                })
                wx.hideLoading();

                that.checkCanSubmit();
                if(that.data.firstLoad) {
                    that.setData({
                      firstLoad: false
                    })
                    that.checkUnRateOrder();
                }
            } else {
              this.setData({
                  shopList: [],
                  shopCodeList: [],
                  shopIndex: 0,
                  carList: [],
                  carCodeList: [],
                  carIndex: 0
              })

              wx.showToast({
                title: "该4S店无可用车型"
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
    if(this.data.btnStyle != 'btn-disabled') {
      var that = this;
      var vOrder = {
         sex: this.data.user.sex == 1 ? 'man': 'woman',
         name: this.data.user.name,
         mobile: this.data.orderMobile,
         city: this.data.cityCodeList[this.data.cityIndex],
         area: this.data.areaCodeList[this.data.areaIndex],
         storeId: this.data.shopCodeList[this.data.shopIndex],
         modelId: this.data.carCodeList[this.data.carIndex],
         access_token: app.getAccessToken()
     };
     var dbId = app.db.set(vOrder);
     wx.navigateTo({
         url: '../agreement/agreement?toSubmit=true&&dbId=' + dbId,
      })
    }
  },

  checkUnRateOrder: function() {
     var that = this;
     this.service({
        origin: 'pre',
        api: '/testdrive/getOrderId.ashx',
        data: {
           access_token: app.getAccessToken()
        },
        success: (res) => {
          if(!res.havreview && res.list && res.list.length > 0) {
             that.showToCommentAlert(res.list[0].orderIds);
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

  showToCommentAlert: function(orderId) {
    wx.showModal({
      title: '您有试驾订单未评价',
      cancelText: '取消',
      confirmText: '去评价',
      cancelColor: '#333',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../rate/rate?orderId=' + orderId,
          })
        }
      }
    })
  }
})