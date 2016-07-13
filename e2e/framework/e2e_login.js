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
    signOut: function () {
      return element(by.id("signOut"));
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
    this.elements.loginButton().click();
    browser.sleep(longDelay);
  },
  clickMyAccount: function () {
    this.elements.myAccount().click();
    browser.sleep(longDelay);
  },
  clickSignoutButton: function () {
    this.elements.signOut().click();
    browser.sleep(longDelay);
  },
  clickSignoutConfirm: function () {
    this.elements.signoutConfirm().click();
    browser.sleep(longDelay);
  },
  clickSignoutCancel: function () {
    this.elements.signoutCancel().click();
    browser.sleep(longDelay);
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
  enterUserName: function (name) {
    this.elements.userName().clear().sendKeys(name);
  },
  enterPassword: function (pass) {
    this.elements.password().clear().sendKeys(pass);
  },

  //Functions
  login: function () {
    this.enterUserName(userName);
    browser.sleep(longDelay);
    this.enterPassword(password);
    browser.sleep(longDelay);
    this.clickLoginButton();
  },
  login2: function (param1,param2) {
    this.enterUserName(param1);
    browser.sleep(longDelay);
    this.enterPassword(param2);
    browser.sleep(longDelay);
    this.clickLoginButton();
  },

  //Count
  disabledCount: function () {
    return this.disabledFields().count();
  },

  //LAST ONE
  placeholder: function (index) {
    this.elements._thumbnail(index).click();
    browser.sleep(longDelay);
  }
};

module.exports = login;
