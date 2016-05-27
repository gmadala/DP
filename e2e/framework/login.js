'use strict';

var userName = '53190md';
var password = 'ngcpass!0';
var delay = 200;
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

    }


  }, //Locator End

  //Clicking
  clickLoginButton: function () {

    return this.elements.loginButton().click();

  },
  clickForgotUsernamePassword: function () {

    this.elements.forgotUsernamePassword().click();
    browser.sleep(delay);

  },
  clickSignUpLogin: function () {

    this.elements.signUpLogin().click();
    //put the waits in the page objects when actions are taken so that it is ready for the test to do what you need it to. It creates cleaner tests too
    browser.sleep(delay);
  },

  //Getting
  getInvalidLoginText1: function () {
    browser.sleep(delay);

    return this.elements.invalidLoginError1().getText();

  },
  getInvalidLoginText2: function () {


    return this.elements.invalidLoginError2().getText();

  },
  getLoginButtonText: function () {


    return this.elements.loginButton().getText();

  },
  textSignUpLogin: function () {


    return this.elements.signUpLogin().getText();

  },
  textForgotUsernamePassword: function () {

    return this.elements.forgotUsernamePassword().getText();

  },

  //Sending
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

  //LAST ONE
  placeholder: function (index) {

    this.elements._thumbnail(index).click();

  }
};

module.exports = login;
