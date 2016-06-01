'use strict';

function newLogin() {
  var username = '53190md';
  var password = 'ngcpass!0';
  var delay = 200;
  var longDelay = 2000;

  this.elForgotUsernamePassword = browser.element(by.id("forgotUsernamePassword"));
  this.elEmail = browser.element(by.id("email"));
  this.elSubmitUsername = browser.element(by.id("forgotUsernameSubmit"));
  this.elSignUpLogin = browser.element(by.id("signUpLogin"));
  this.elUserName = browser.element(by.id("credUsername"));
  this.elPassWord = browser.element(by.id("credPassword"));
  this.elLogin = browser.element(by.id("loginButton"));

  //Doers
  this.doForgotUsernamePassword = function () {
    return this.elForgotUsernamePassword.click();
    browser.sleep(delay);
  };

  this.doUsernameSubmit = function () {
    return this.elSubmitUsername.click();
    browser.sleep(delay);
  };
  this.doSignUpLogin = function () {
    return this.elSignUpLogin.click();
    browser.sleep(delay);
  };

  this.doClearLogin = function (){
    return this.elUserName.clear();
    return this.elPassWord.clear();
    browser.sleep(delay);
  };
  this.doLogin = function (){
    return this.elLogin.click();

  };
  //Getters
  this.getTextForgotUsernamePassword = function () {
    return this.elForgotUsernamePassword.getText();
  };

  this.getTextSignUpLogin = function () {
    // return this.elGetTextSignUpLogin.getText();
    return this.elSignUpLogin.getText();
  };

  this.getTextSubmitBtn = function () {
        return this.elSubmitUsername().getText();
  };


  //Setters
  this.setEmail = function (param) {
    browser.sleep(browser.params.shortDelay);
    this.elEmail.sendKeys(param);
  };

  this.setLogin = function (username, password) {
    this.doClearLogin();
    this.elUserName.sendKeys(username);
    this.elPassWord.sendKeys(password);
    this.doLogin();
  };
}

module.exports.newLogin = newLogin;
