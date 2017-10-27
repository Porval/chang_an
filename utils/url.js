/**
 * 根据源、路径及查询参数生成URL地址
 *
 *
 * url({
 *   origin: 'service',
 *   pathname: '/app/official/login.ashx',
 *   query: {
 *      access_token: '573501bf13573b318fdcf70ad91db13b'
 *    }
 * })
 *
 */

var extend = require('./extend');
var each = require('./each');

var ORIGIN_MAP = {
  service: 'https://app.changan.ccclubs.com',
  pre: 'https://tdrive.changan.ccclubs.com',
  dm: 'https://dm-51.data.aliyun.com'
};

var defaultOptions = {
  // 源
  origin: 'service',
  // 路径
  pathname: '',
  // 查询参数
  query: {}
};

function url(options) {
  var query = [];
  options = extend({}, defaultOptions, options);

  each(options.query, (value, key) => {
    query.push(`${key}=${encodeURIComponent(value)}`);
  });

  return ORIGIN_MAP[options.origin] + options.pathname + (query.length > 0 ? '?' : '') + query.join('&');
}

module.exports = url;