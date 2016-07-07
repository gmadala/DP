'use strict';

var userName = '53190md';
var password = 'ngcpass!0';
var delay = 500;
var longDelay = 2000;
var login = {

  elements: {
    //Locators
    invalidLoginError1: function () {
      return element.all(by.css('p[ng-show="showLoginError"]')).get(0);
    },
    invalidLoginError2: function () {
      return element.all(by.css('p[ng-show="showLoginError"]')).get(1);
    },
    forgotUsernamePassword: function () {
      return element(by.id("forgotUsernamePassword"));
    },
    userName: function () {
      return element(by.id("credUsername"));
    },
    signUpLogin: function () {
      return element(by.id("signUpLogin"));
    },
    password: function () {
      return element(by.id("credPassword"));
    },
    loginButton: function () {
      return element(by.id("loginButton"));
    },
    incorrectEmailFormat: function () {
      return element(by.css('p[ng-show="forgotUserNameValidity.email.$error.email"]'));
    },
    myAccount: function () {
      return element(by.id("settingsDropdown"));
    },
    signout: function () {
      return element.all(by.css('button[ng-click="user.logout()"]'));
    },
    signoutConfirm: function () {
      return element.all(by.css('button[ng-click="close(true)"]'));
    },
    signoutCancel: function () {
      return element.all(by.css('button[ng-click="close(false)"]'));
    }
  },

  //Doers
  clickLoginButton: function () {
    return this.elements.loginButton().click();
    browser.sleep(delay);
  },
  clickMyAccount: function () {
    browser.sleep(10000);
    return this.elements.myAccount().click();
    browser.sleep(delay);
  },
  clickSignoutButton: function () {
    return this.elements.signout().click();
    browser.sleep(delay);
  },
  clickSignoutConfirm: function () {
    return this.elements.signoutConfirm().click();
    browser.sleep(delay);
  },
  clickSignoutCancel: function () {
    return this.elements.signoutCancel().click();
    browser.sleep(delay);
  },

  //Getters
  getInvalidLoginText1: function () {
    browser.sleep(delay);
    return this.elements.invalidLoginError1().getText();
  },
  getInvalidLoginText2: function () {
    return this.elements.invalidLoginError2().getText();
  },

  getIncorrectEmailFormat: function () {
    return this.incorrectEmailFormat().getText();
  },

  //Setters
  enterUserName: function (test) {
    return this.elements.userName().clear().sendKeys(test);
  },
  enterPassword: function (test) {
    return this.elements.password().clear().sendKeys(test);
  },
  //Functions
  login: function () {
    this.enterUserName(userName);
    this.enterPassword(password);
    this.clickLoginButton();
  },
  login2: function (param1,param2) {
    browser.sleep(longDelay);
    this.enterUserName(param1);
    this.enterPassword(param2);
    this.clickLoginButton();
  },
  //Count
  disabledCount: function () {
    return this.disabledFields().count();
  },
  //LAST ONE
  placeholder: function (index) {
    this.elements._thumbnail(index).click();
  }
};

module.exports = login;
