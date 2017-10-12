//app.js
import Wux from 'components/wux'
var storage = require('./utils/storage');	

App({
  onLaunch: function () {
  	 this.storage = storage(this);
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
  		this.globalData.hasToken = true;
  		this.globalData.token = token;
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