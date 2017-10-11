module.exports = function (app) {
  return {
    set(key, value, options) {
      options = options || {};
      var expire = options.expire || 14;
      try {
        wx.setStorageSync(key, {
          value,
          version: app.VERSION,
          expire: Date.now() + (expire * 24 * 3600),
        });
      } catch (e) {
        console.error(e);
      }
    },
    get(key) {
      try {
        var data = wx.getStorageSync(key);
        if (data.expire > Date.now()) {
          return data.value;
        }else {
          wx.removeStorage({key})
        }
      } catch (e) {
        console.error(e);
      }
    },
    remove(key) {
      try {
        wx.removeStorageSync(key);
      } catch (e) {
        console.error(e);
      }
    },
    clear() {
      try {
        wx.clearStorageSync();
      } catch (e) {
        console.error(e);
      }
    }
  };
};
