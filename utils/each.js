var hasFunc = function (obj, key) {
  return hasOwnProperty.call(obj, key);
};

var keysFunc = function (obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];
  for (var key in obj) if (hasFunc(obj, key)) keys.push(key);
  return keys;
};

var each = function (obj, iterator, context) {
  if (obj == null) return;
  if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      iterator.call(context, obj[i], i, obj)
    }
  } else {
    var keys = keysFunc(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      iterator.call(context, obj[keys[i]], keys[i], obj)
    }
  }
};

module.exports = each;
