//app.js
import Wux from 'components/wux'
var storage = require('./utils/storage');	

App({
  onLaunch: function () {
  	 this.storage = storage(this);
  	 this.loadToken();	
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
            accessToken: access_token,
            mobile: mobile
          });
  	}
  },

  Wux: Wux, 
  globalData: {
  	userInfo: null,
    hasToken: false,
    token: null,
  }
})