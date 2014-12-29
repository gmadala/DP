'use strict';

var LoginPage = function () {
};

LoginPage.prototype = Object.create({}, {


  //Locators
  loginUrl: {
    value: 'http://localhost:9000/#/login'
  },

  loginButton: {
    get: function () {
      return browser.element(by.buttonText('Log In'));
    }
  },

  remember: {
    get: function () {
      return browser.element(by.model('credentials.remember'));
    }
  },

  rememberUsername: {
    get: function () {
      return browser.element(by.id('rememberUsername'));
    }
  },

  rememberUsernameCheckbox: {
    get: function () {
      return browser.element(by.css('.checkbox-img'));
    }
  },

  username: {
    get: function () {
      return browser.element(by.model('credentials.username'));
    }
  },

  password: {
    get: function () {
      return browser.element(by.model('credentials.password'));
    }
  },

  lnkForgotUsernamePassword: {
    get: function () {
      return browser.element(by.linkText('Forgot your username or password?'));
    }
  },

  //Setters
  setUsername: {
    value: function (username) {
      this.username.sendKeys(username);
      browser.waitForAngular();
    }
  },

  setPassword: {
    value: function (password) {
      this.password.sendKeys(password);
      browser.waitForAngular();
    }
  },

  setLogin: {
    value: function (username, password) {
      this.username.sendKeys(username);
      this.password.sendKeys(password);
      browser.waitForAngular();
    }
  },


  //Doers
  doLogin: {
    value: function (username, password) {
      this.setLogin(username, password);
      browser.waitForAngular();
    }
  },

  doRememberUsername: {
    value: function () {
      this.rememberUsernameCheckbox.click();
      browser.waitForAngular();
    }
  },

  doRecover: {
    value: function () {
      this.goRecover();
      browser.waitForAngular();
    }
  },

  doLoginWithError: {
    value: function () {
      this.doLogin('AtlantaEastDealer1', 'demouser@1');
    }
  },

  //Getters
  getUsername: {
    value: function () {
      this.username.getAttribute('value');
    }
  },

  //Navigation
  goToLogin: {
    value: function () {
      this.loginButton.click();
    }
  }

});
module.exports = LoginPage;
