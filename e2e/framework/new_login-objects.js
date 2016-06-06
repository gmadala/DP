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
  this.elMyAccount = browser.element(by.css("div.dropdown"));
  this.elLoginError1 = browser.element.all(by.css('p[ng-show="showLoginError"]')).get(0);
  this.elLoginError2 = browser.element.all(by.css('p[ng-show="showLoginError"]')).get(1);
  this.elUserName_FUNPW =
//FUNPW = Forgot username password page

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
  this.doLogin = function (value1, value2){
    // this.doClearLogin();
    // this.setUserName(value1);
    // this.setPassWord(value2);
    // // this.setUserName('53190md');
    // // this.setPassWord('ngcpass!0');
    return this.elLogin.click();
  };
  this.doMyAccount = function (){
    return this.elMyAccount.click();
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
  this.getTextLoginError1 = function () {
    browser.sleep(delay);
    return this.element.elLoginError1().getText();

  };
  this.getTextLoginError2 = function () {
    browser.sleep(delay);
    return this.elLoginError2().getText();
  };


  //Setters
  this.setEmail = function (param) {
    browser.sleep(browser.params.shortDelay);
    this.elEmail.sendKeys(param);
  };

  this.setUserName = function (username) {
    this.elUserName.sendKeys(username);
  };

  this.setPassWord = function (password) {
    this.elPassWord.sendKeys(password);
  };

  this.setLogin = function (username, password) {
    this.elUserName.sendKeys(username);
    this.elPassWord.sendKeys(password);

  }
}

module.exports.newLogin = newLogin;
