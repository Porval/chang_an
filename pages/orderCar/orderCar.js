// pages/orderCar/orderCar.js
Page({
  data: {
    areaList: ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
    areaIndex: 0,
    shopList: ['重庆丰尚4s店', '杭州测试4s点'],
    shopIndex: 0,
    carList: ['CS95', 'GOGO2018'],
    carIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
  }
})