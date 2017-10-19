
var extend = require('./extend');
var url = require('./url');

function noop() {}

var defaultOptions = {
  method: 'GET',
  header: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  success: noop,
  fail: noop,
  complete: noop
};

module.exports = function (app) {
  /**
   * 卡门接口
   * @param  {options} options
   * @param {options.api} 卡门API名字。比如'weapp.wsc.tag.items/1.0.0/get'
   * @param {options.query}
   * @param {options.method}
   * @param {options.data}
   * @param {options.success}
   * @param {options.fail}
   * @param {options.complete}
   */
  return function service(options) {
    options = extend({}, defaultOptions, options);

    var then = () => {
      var success = (response) => {
        console.info('[service:success]', options.api, response);
        options.success(response);
      };

      var fail = (response) => {
        console.error('[service:fail]', options.api, response);
        options.fail(response);
      };

      var requestOptions = {
        url: url({
          origin: options.origin == null ? 'service' : options.origin,
          pathname: options.api,
          query: extend({
            
          }, options.query)
        }),
        method: options.method,
        data: options.data,
        header: options.header,
        success: (res) => {
          if (res.data.success == true) {
            success(res.data.data);
          } else {
            try {
              if(res.data.code == "100") {
                 console.log("clean storage");
                 app.globalData.user = null
                 app.globalData.hasToken = false
                 app.globalData.token = null
                 app.logout()
                 wx.reLaunch({
                      url: '../index/index'
                 })
              }
              if(res.data.text) {
                wx.showToast({
                    title: res.data.text
                })
              }
            } catch (e) {
              console.log(e)
              fail({
                type: 'chang_an:service',
                msg: '服务器错误',
                code: -99999
              });
            }
          }
        },
        fail: (res) => {
          fail({
            type: 'wx:request',
            msg: res.errMsg,
            code: -1
          });
        },
        complete: () => {
          options.complete();
        }
      };

      console.info('[service:request]', options.api);
      wx.request(requestOptions);
    };


    then(); 
  };
};
