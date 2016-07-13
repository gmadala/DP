'use strict';
/**
 * @class login_objects
 * @author Balanithiya Krishnamoorthy
 * @description Page objects for login page elements
 * */

function LoginObjects() {
  var username = '53190md';
  var password = 'ngcpass!0';
  var delay = 1000;
  //var longDelay = 2000;

  this.elForgotUsernamePassword = browser.element(by.id("forgotUsernamePassword"));
  this.elEmail = browser.element(by.id("email"));
  this.elSubmitUsername = browser.element(by.id("forgotUsernameSubmit"));
  this.elSubmitPassword = browser.element(by.id("forgotPasswordSubmit"));
  this.elSignUpLogin = browser.element(by.id("signUpLogin"));
  this.elUserName = browser.element(by.id("credUsername"));
  this.elPassWord = browser.element(by.id("credPassword"));
  this.elLogin = browser.element(by.id("loginButton"));
  this.elMyAccount = browser.element(by.id("settingsDropdown"));
  this.elPasswordRecoveryModal = browser.element(by.model('passwordRecovery.username'));
  this.elFUPWUsername = browser.element(by.id("userName"));
  this.elSecQues10 = browser.element(by.id('question10'));
  this.elSecQues6 = browser.element.all(by.id('question6'));
  this.elSecQues9 = browser.element.all(by.id('question9'));
  this.elSignOut = browser.element(by.css('a'));
  this.elLangChooser = browser.element(by.css('div.nav-language-chooser'));
  this.elEnglish = browser.element(by.buttonText("English"));
  this.elSpanish = browser.element(by.buttonText("Español"));
  this.elFrench = browser.element(by.buttonText("Français"));
  this.elMNGLogo = browser.element(by.css('div.nxg-logo'));

  //Doers
  this.doForgotUsernamePassword = function() {
    return this.elForgotUsernamePassword.click();
    //browser.sleep(delay);
  };
  this.doUsernameSubmit = function() {
    return this.elSubmitUsername.click();
    //browser.sleep(delay);
  };
  this.doSignUpLogin = function() {
    return this.elSignUpLogin.click();
    //browser.sleep(longDelay);
  };
  this.doClearLogin = function() {
    this.elUserName.clear();
    this.elPassWord.clear();
    browser.sleep(delay);
  };
  this.doLogin = function() {
    return this.elLogin.click();
    //browser.sleep(delay);
  };
  this.doMyAccount = function() {
    return this.elMyAccount.click();
  };
  this.doSubmitUsername = function() {
    return this.elSubmitUsername.click();
  };
  this.doSubmitPassword = function() {
    return this.elSubmitPassword.click();
    //browser.sleep(longDelay);
  };
  this.doGoodLogin = function() {
    this.doClearLogin();
    this.setUserName(username);
    this.setPassWord(password);
    this.doLogin();
    browser.sleep(delay);
  };
  this.doSignOut = function() {
    this.doMyAccount();
    return this.elSignOut.click();
  };
  this.doEnglish = function () {
    this.elEnglish.click();
    browser.sleep(delay);
  };
  this.doSpanish = function () {
    this.elSpanish.click();
    browser.sleep(delay);
  };
  this.doFrench = function () {
    this.elFrench.click();
    browser.sleep(delay);
  };
  
  //Getters
  this.getTextForgotUsernamePassword = function() {
    return this.elForgotUsernamePassword.getText();
  };
  this.getTextSignUpLogin = function() {
    return this.elSignUpLogin.getText();
  };
  this.getTextSubmitUsername = function() {
    browser.sleep(delay);
    return this.elSubmitUsername.getText();
  };
  this.getTextLogin = function (){
    browser.sleep(delay);
    return this.elLogin.getText();
  };

  //Setters
  this.setEmail = function(param) {
    browser.sleep(browser.params.shortDelay);
    this.elEmail.sendKeys(param);
  };

  this.setUserName = function(username) {
    this.elUserName.sendKeys(username);
  };
  this.setPassWord = function(password) {
    this.elPassWord.sendKeys(password);
  };
  this.setLogin = function(username, password) {
    this.doClearLogin();
    this.elUserName.sendKeys(username);
    browser.sleep(delay);
    this.elPassWord.sendKeys(password);
    browser.sleep(delay);
  };
  this.setSecQuestions = function(param) {
    browser.sleep(delay);
    this.elSecQues10.clear().sendKeys(param);
    this.elSecQues10.sendKeys(protractor.Key.TAB);
    browser.sleep(delay);
    this.elSecQues6.clear().sendKeys(param);
    this.elSecQues10.sendKeys(protractor.Key.TAB);
    browser.sleep(delay);
    this.elSecQues9.clear().sendKeys(param);
  };

}
module.exports.loginObjects = LoginObjects;
