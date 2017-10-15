//app.js
import Wux from 'components/wux'
var storage = require('./utils/storage');	
var db = require('./utils/db');

App({
  onLaunch: function () {
  	 this.storage = storage(this);
     this.db = db;
  	 this.loadToken();	
     this.loadUser();
  },
  loadUser: function() {
     var user = this.storage.get('app:user');
     if(user) {
        this.globalData.user = user;
     }
  },
  loadToken: function() {
  	var token = this.storage.get('app:token');
  	if (token) {
  		this.globalData.hasToken = true;
  		this.globalData.token = token;
  	}
  },
  setToken: function(token, mobile) {
  	if(token) {
      console.log("setToken " + token);
  		this.globalData.hasToken = true;
  		this.globalData.token = {
          accessToken: token,
          mobile: mobile
      };
  		this.storage.set('app:token', {
            accessToken: token,
            mobile: mobile
          });
  	}
  },
  getAccessToken: function() {
    return this.globalData.token.accessToken;
  },
  setUser: function(freshUser) {
    if(freshUser) {
      this.globalData.user = freshUser;
      this.storage.set('app: user', {
          user: freshUser
      })
    }
  },
  getUser: function() {
    return this.globalData.user.user;
  },

  Wux: Wux, 
  globalData: {
  	user: null,
    hasToken: false,
    token: null,
  }
})