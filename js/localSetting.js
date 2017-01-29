/**
 *
 */

var localSetting = {
  getItem: function (key) {
    var data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  },

  setItem: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  removeItem: function (key) {
    localStorage.removeItem(key);
  },

  pushItem: function (key, value) {
    var data = this.getItem(key);

    if (!data) {
      data = [];
    } else if (!Array.isArray(data)) {
      var newArray = [];
      newArray.push(data);
      data = newArray;
    }

    data.push(value);
    this.setItem(key, data);
  },

  containsItem: function (key, value) {
    var data = this.getItem(key);
    return (data && data.indexOf(value) !== -1) ? true : false;
  }
};
