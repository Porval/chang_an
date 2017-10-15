var _data = {};
var _id = 1;

function getId() {
  return 'db_' + (_id++);
}

module.exports = {
  /**
   * 保存数据
   * @param {any} data
   * @return {string} id 这个id在获取数据的时候有用
   */
  set(data) {
    var id = getId();
    _data[id] = data;
    return id;
  },

  /**
   * 获取数据
   * @param  {string} id
   * @return {any} 保存的数据。数据在获取一次后将会被清除
   */
  get(id) {
    var data = _data[id];
    delete _data[id];
    return data;
  }
};
