'use strict';

function newLogin() {
  var username = '53190md';
  var password = 'ngcpass!0';
  var delay = 200;
  var longDelay = 2000;
  var modal = require('/modal-objects.js');

  this.elForgotUsernamePassword = browser.element(by.id("forgotUsernamePassword"));
  this.elEmail = browser.element(by.id("email"));
  this.elSubmitUsername = browser.element(by.id("forgotUsernameSubmit"));
  this.elSubmitPassword = browser.element(by.id("forgotPasswordSubmit"));
  this.elSignUpLogin = browser.element(by.id("signUpLogin"));
  this.elUserName = browser.element(by.id("credUsername"));
  this.elPassWord = browser.element(by.id("credPassword"));
  this.elLogin = browser.element(by.id("loginButton"));
  this.elMyAccount = browser.element(by.css("div.dropdown"));
  this.elLoginError1 = browser.element.all(by.css('p[ng-show="showLoginError"]')).get(0);
  this.elLoginError2 = browser.element.all(by.css('p[ng-show="showLoginError"]')).get(1);
  this.elDisabledFields = browser.element.all(by.css('input[disabled="disabled"]'));
  this.elPasswordRecoveryModal = browser.element(by.model('passwordRecovery.username'));
  this.elFUPWUsername = browser.element(by.id("userName"));
  this.elSecQues10 = browser.element(by.id('question10'));
  this.elSecQues6 = browser.element.all(by.id('question6'));
  this.elSecQues9 = browser.element.all(by.id('question9'));

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
    return this.elLogin.click();
    browser.waitForAngular();
    browser.sleep(500);

  };
  this.doDisabledCount = function () {
    return this.disabledFields().count();
  };

  this.doMyAccount = function (){
    return this.elMyAccount.click();
  };
  this.doSubmitUsername = function () {
    return this.elSubmitUsername.click();
  };
  this.doSubmitPassword = function () {
    return this.elSubmitPassword.click();
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
   //browser.sleep(delay);
    return this.element.elLoginError1().getText();

  };
  this.getTextLoginError2 = function () {
    browser.sleep(delay);
    return this.elLoginError2().getText();
  };

  this.getTextSubmitUsername = function (){
    browser.sleep(delay);
    return this.elSubmitUsername.getText();
  };
  this.getTextSecuQues10 = function (){
    browser.sleep(delay);
    return this.elSecQues10.getText();
  };

  this.getTextSecuQues6 = function (){
    browser.sleep(delay);
    return this.elSecQues6.getText();
  };
  this.getTextSecuQues9 = function (){
    browser.sleep(delay);
    return this.elSecQues9.getText();
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

  };
  this.setSecQuestions = function (param) {
    this.elSecQues10.clear().sendKeys(param);
    this.elSecQues10.sendKeys(protractor.Key.TAB);
    this.elSecQues6.clear().sendKeys(param);
    this.elSecQues10.sendKeys(protractor.Key.TAB);
    this.elSecQues9.clear().sendKeys(param);
  };
  this.successModalWindow = function (){
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
  }
}

module.exports.newLogin = newLogin;
