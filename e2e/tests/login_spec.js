'use strict';

var LoginPageObject = require('../framework/login_page_object.js');
var CredentialsObject = require('../framework/credentials_page_object.js');
var RecoverPageObject = require('../framework/recover_page_object.js');
var HomePageObject = require('../framework/home_page_object.js');
var UtilObject = require('../framework/util_object.js');

var loginPage = new LoginPageObject();
var credPage = new CredentialsObject();
var recoverPage = new RecoverPageObject();
var homePage = new HomePageObject();
var util = new UtilObject();

//Login Page
describe('Login e2e test', function () {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(loginPage.loginUrl);
  });
  //when Username and Password are Blank
  it('should not log you in if username and password are blank', function () {
    loginPage.doLogin('', '');
    loginPage.goToLogin();
    expect($(('[ng-show="validity.credUsername.$error.required"]') && ('[ng-show="validity.credPassword.$error.required"]')).
      isDisplayed()).toBeTruthy();

  });
  //when Username is Blank
  it('should not log you in if username is blank', function () {
    loginPage.doLogin('', credPage.loginPassword);
    loginPage.goToLogin();
    expect($('[ng-show="validity.credUsername.$error.required"]').isDisplayed()).toBeTruthy();
  });
  //when Password is Blank
  it('should not log you in if password is blank', function () {
    loginPage.doLogin(credPage.loginUsername, '');
    loginPage.goToLogin();
    expect($('[ng-show="validity.credPassword.$error.required"]').isDisplayed()).toBeTruthy();
  });

  it('should check for remember username', function () {

    loginPage.doLogin(credPage.loginUsername, credPage.loginPassword);
    loginPage.doRememberUsername();
    loginPage.goToLogin();
    browser.get(homePage.homeURL);
    homePage.goToMenuDropdown();
    browser.sleep(1000);
    homePage.goToSignOut();
    util.goToLogoutYesButton();
    browser.sleep(1000);
    expect(loginPage.username.getAttribute('value')).toBe(credPage.loginUsername);
  });

  xit('should show error messages when credentials is incorrect.', function () {
    // need to figure out a way to test this agains localhost as the mock api will always log user into the system.
    loginPage.doLoginWithError();
    expect(browser.element(by.binding('errorMsg')).isPresent()).toBeTruthy();
  });

  it('should transition from login screen with correct credentials.', function () {
    loginPage.doLogin(credPage.loginUsername, credPage.loginPassword);
    expect(browser.getLocationAbsUrl()).not.toBe('#/login');
  });

});

//Forgot Username and Password
describe('Username, password recovery e2e test', function () {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(recoverPage.recoverUrl);
    recoverPage.goToRecoveryUser();
  });
  //Forgot your Username
  it('should not allow without username on recovery page', function () {
    recoverPage.doEmailAddress('');
    expect($('[ng-show="forgotUserNameValidity.email.$error.required"]').isDisplayed()).toBeTruthy();
  });
  //Forgot your Username with OK
  it('"should allow with username with OK on recovery page', function () {
    recoverPage.doEmailAddress(credPage.recoveryEmailAddress);
    expect($('[ng-show="forgotUserNameValidity.email.$error.required"]').isDisplayed()).toBeFalsy();
    recoverPage.goToOKButton();
    util.goToLogoutYesButton();
  });
  //Forgot your Username with No Thanks
  it('should allow without username with No Thanks on recovery page', function () {
    recoverPage.doEmailAddress(credPage.recoveryEmailAddress);
    expect($('[ng-show="forgotUserNameValidity.email.$error.required"]').isDisplayed()).toBeFalsy();
    recoverPage.goToOKButton();
    util.goToLogoutNoThanksButton();
  });

  //Forgot your Password with Security Question
  it('should provide password with security question on recovery page with Logout Yes', function () {
    recoveryPasswordWithUsername();
    util.goToLogoutYesButton();
  });

  //Forgot your Password with Security Question
  it('should provide password with security question on recovery page with Logout Yes', function () {
    recoveryPasswordWithUsername();
    util.goToLogoutYesButton();
  });

  var recoveryPasswordWithUsername = function () {
    recoverPage.doUsername('');
    expect($('[ng-show="forgotPasswordValidity.userName.$error.required"]').isDisplayed()).toBeTruthy();
    recoverPage.goToRecoveryPassword();
    recoverPage.doUsername(credPage.recoveryUsername);
    recoverPage.goToRecoveryPassword();
    recoverPage.doSecurityQuestions('', '');
    expect($('[ng-show="question.$invalid"]').isDisplayed()).toBeTruthy();
    recoverPage.doSecurityQuestions('', credPage.recoveryQuestionOne);
    expect($('[ng-show="question.$invalid"]').isDisplayed()).toBeTruthy();
    recoverPage.doSecurityQuestions(credPage.recoveryQuestionZero, '');
    expect($('[ng-show="question.$invalid"]').isDisplayed()).toBeFalsy();
    recoverPage.goToOKButton();
  };
});

