'use strict';

var LoginPageObject = require('../framework/login_page_object.js');
var HomePageObject = require('../framework/home_page_object.js');
var CredentialsObject = require('../framework/credentials_page_object.js');
var RecoverPageObject = require('../framework/recover_page_object.js');
var UtilObject = require('../framework/util_object.js');

var loginPage = new LoginPageObject();
var homePage = new HomePageObject();
var credPage = new CredentialsObject();
var recoverPage = new RecoverPageObject();
var util = new UtilObject();


//Login Page
describe('Login e2e test', function () {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(loginPage.loginUrl);
  });

  //when Username and Password are Blank
  it('should not log you in if username and password are blank', function () {
    browser.get(loginPage.loginUrl);
    loginPage.doLogin('', '');
    loginPage.goToLogin();
    expect(browser.driver.getCurrentUrl()).toContain('/login');
    expect(browser.element(by.cssContainingText('p', 'Please enter a username.')).isDisplayed()).toBeTruthy();
    expect(browser.element(by.cssContainingText('p', 'Please enter a password.')).isDisplayed()).toBeTruthy();
  });

  //when Username is Blank
  it('should not log you in if username is blank', function () {
    loginPage.doLogin('', credPage.loginPassword);
    loginPage.goToLogin();
    expect(browser.driver.getCurrentUrl()).toContain('/login');
    expect(browser.element(by.cssContainingText('p', 'Please enter a username.')).isDisplayed()).toBeTruthy();
  });

  //when Password is Blank
  it('should not log you in if password is blank', function () {
    loginPage.doLogin(credPage.loginUsername, '');
    loginPage.goToLogin();
    expect(browser.driver.getCurrentUrl()).toContain('/login');
    expect(browser.element(by.cssContainingText('p', 'Please enter a password.')).isDisplayed()).toBeTruthy();
  });

  it('should check for remember username', function () {
    loginPage.doLogin(credPage.loginUsername, credPage.loginPassword);
    loginPage.doRememberUsername();
    loginPage.goToLogin();
    browser.get(homePage.homeUrl);
    homePage.goToMenuDropdown();
    homePage.goToSignOut();
    util.goToLogoutYesButton();
    expect(loginPage.username.getAttribute('value')).toBe(credPage.loginUsername);
    loginPage.doRememberUsername();
    loginPage.username.clear();
    loginPage.doLogin(credPage.loginUsername, credPage.loginPassword);
    loginPage.goToLogin();
    browser.get(homePage.homeUrl);
    homePage.goToMenuDropdown();
    homePage.goToSignOut();
    util.goToLogoutYesButton();
    expect(loginPage.username.getAttribute('value')).not.toBe(credPage.loginUsername);
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
  var usernameError = browser.element(by.cssContainingText('p', 'Please enter your username.'));
  var emailAddressError = browser.element(by.cssContainingText('p', 'Please enter your email address.'));

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(recoverPage.recoverUrl);
  });

  //Forgot your Username
  it('should not allow without username on recovery page', function () {
    recoverPage.doEmailAddress('');
    expect(emailAddressError.isDisplayed()).toBeTruthy();
  });

  //Forgot your Username with No Thanks
  it('should allow without username with No Thanks on recovery page', function () {
    recoverPage.doEmailAddress(credPage.recoveryEmailAddress);
    expect(emailAddressError.isDisplayed()).toBeFalsy();
    util.goToOKButton();
    util.goToLogoutNoThanksButton();
  });

  //Forgot your Password with Security Question
  it('should provide password with security question on recovery page with Logout NoThanks', function () {
    recoveryPasswordWithUsername();
    util.goToLogoutNoThanksButton();
  });

  //Forgot your Username with OK
  it('should allow with username with OK on recovery page', function () {
    recoverPage.doEmailAddress(credPage.recoveryEmailAddress);
    expect(emailAddressError.isDisplayed()).toBeFalsy();
    util.goToOKButton();
    util.goToLogoutYesButton();
  });

  //Forgot your Password with Security Question
  it('should provide password with security question on recovery page with Logout Yes', function () {
    browser.get(recoverPage.recoverUrl);
    recoveryPasswordWithUsername();
    util.goToLogoutYesButton();
  });

  var recoveryPasswordWithUsername = function () {
    recoverPage.doUsername('');
    expect(usernameError.isDisplayed()).toBeTruthy();
    recoverPage.goToRecoveryPassword();
    recoverPage.doUsername(credPage.recoveryUsername);
    recoverPage.goToRecoveryPassword();
    recoverPage.doSecurityQuestions('', '');
    var securityQuestions = browser.element.all(by.cssContainingText('p', 'Please answer this question.'));
    expect(securityQuestions.isDisplayed()).toEqual([true, true]);
    recoverPage.doSecurityQuestions('', credPage.recoveryQuestionOne);
    expect(securityQuestions.isDisplayed()).toEqual([true, false]);
    recoverPage.doSecurityQuestions(credPage.recoveryQuestionZero, '');
    expect(securityQuestions.isDisplayed()).toEqual([false, false]);
    util.goToOKButton();
  };
});



