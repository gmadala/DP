'use strict';
/**
 * @class login_objects
 * @author Balanithiya Krishnamoorthy
 * @description Page objects for login page elements
 * */

function LoginObjects() {

  this.elForgotUsernamePassword = browser.element(by.css('a.forgot'));
  this.elEmail = browser.element(by.id("email"));
  this.elSubmitUsername = browser.element(by.id("forgotUsernameSubmit"));
  this.elSubmitPassword = browser.element(by.id("forgotPasswordSubmit"));
  this.elSignUpLogin = browser.element(by.id("signUpLogin"));
  this.elUserName = browser.element(by.id("credUsername"));
  this.elPassWord = browser.element(by.id("credPassword"));
  this.elLogin = browser.element(by.id("loginButton"));
  this.elPasswordRecoveryModal = browser.element(by.model('passwordRecovery.username'));
  this.elFUPWUsername = browser.element(by.id("userName"));
  this.elSecQues10 = browser.element(by.id('question10'));
  this.elSecQues6 = browser.element.all(by.id('question6'));
  this.elSecQues9 = browser.element.all(by.id('question9'));
  this.elLangChooser = browser.element(by.css('div.nav-language-chooser'));
  this.elEnglish = browser.element(by.buttonText("English"));
  this.elSpanish = browser.element(by.buttonText("Español"));
  this.elFrench = browser.element(by.buttonText("Français"));
  this.elMNGLogo = browser.element(by.css('div.nxg-logo'));

  //Doers
  this.doForgotUsernamePassword = function () {
    this.elForgotUsernamePassword.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doUsernameSubmit = function () {
    this.elSubmitUsername.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doSignUpLogin = function () {
    this.elSignUpLogin.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doClearLogin = function () {
    this.elUserName.clear();
    browser.sleep(browser.params.longDelay);
    this.elPassWord.clear();
    browser.sleep(browser.params.longDelay);
  };
  this.doLogin = function () {
    this.elLogin.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doSubmitPassword = function () {
    this.elSubmitPassword.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doGoodLogin = function () {
    this.doClearLogin();
    browser.sleep(browser.params.shortDelay);
    this.setLogin(browser.params.userName, browser.params.password);
    this.doLogin();
  };
  this.doEnglish = function () {
    this.elEnglish.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doSpanish = function () {
    this.elSpanish.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doFrench = function () {
    this.elFrench.click();
    browser.sleep(browser.params.shortDelay);
  };

  //Getters
  this.getTextForgotUsernamePassword = function () {
    return this.elForgotUsernamePassword.getText();
  };
  this.getTextSignUpLogin = function () {
    return this.elSignUpLogin.getText();
  };
  this.getTextSubmitUsername = function () {
    return this.elSubmitUsername.getText();
  };
  this.getTextLogin = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elLogin.getText();
  };

  //Setters
  this.setEmail = function (param) {
    this.elEmail.sendKeys(param);
  };
  this.setLogin = function (username, password) {
    this.doClearLogin();
    this.elUserName.sendKeys(username);
    browser.sleep(browser.params.shortDelay);
    this.elPassWord.sendKeys(password);
    browser.sleep(browser.params.shortDelay);
  };
  this.setSecQuestions = function (param) {
    this.elSecQues10.clear().sendKeys(param);
    this.elSecQues10.sendKeys(protractor.Key.TAB);
    browser.sleep(browser.params.shortDelay);
    this.elSecQues6.clear().sendKeys(param);
    this.elSecQues10.sendKeys(protractor.Key.TAB);
    browser.sleep(browser.params.shortDelay);
    this.elSecQues9.clear().sendKeys(param);
    browser.sleep(browser.params.shortDelay);
  };

}
module.exports.loginObjects = LoginObjects;
