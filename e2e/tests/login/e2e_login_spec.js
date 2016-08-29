'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var helper = require('../../framework/e2e_helper_functions.js');

var loginObjects = new loginObjects.loginObjects();
var helper = new helper.helper();

describe('\n Login Page - Dealer', function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Dealer Login - No Username and Password", function () {
    helper.goToLogin();
    loginObjects.setLogin('', '');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

  it("2. Dealer Login - Incorrect Username and Password", function () {
    loginObjects.setLogin('test', 'test');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

  it("3. Dealer Login - Good Dealer Login (62434AM)", function () {
    loginObjects.doGoodLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.homePage());
  });

  it("4. Dealer Login - Logout Dealer Confirm", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});

describe('\n Login Page - Auction', function () {

  it("5. Auction Login - Good Auction Login (10298KB)", function () {
    helper.goToLogin();
    loginObjects.setLogin(browser.params.userNameAuction, browser.params.password);
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.auctionHomePage());
  });

  it("6. Auction Login - Logout Auction Cancel", function () {
    login.clickMyAccount();
    login.clickSignoutButton();
    login.clickSignoutCancel();
    expect(browser.getCurrentUrl()).toEqual(execSettings.auctionHomePage());
  });

  it("7. Auction Login - Logout Auction Confirm", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});
