'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');

var loginObjects = new loginObjects.loginObjects();

describe("Login as Dealer\n ", function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Login - No Username and Password", function () {
    browser.get(execSettings.loginPage());
    loginObjects.setLogin('', '');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

  it("2. Login - Incorrect Username and Password", function () {
    loginObjects.setLogin('test', 'test');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

  it("3. Login - Good Dealer Login", function () {
    loginObjects.doGoodLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.homePage());
  });

  it("4. Login - Logout Dealer Confirm", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});

describe("Login as Auction\n ", function () {

  it("5. Login - Good Auction Login", function () {
    loginObjects.setLogin(browser.params.userNameAuction, browser.params.password);
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.auctionHomePage());
  });

  it("6. Login - Logout Auction Cancel", function () {
    loginObjects.doMyAccount();
    browser.sleep(browser.params.mediumDelay);
    login.clickSignoutButton();
    browser.sleep(browser.params.mediumDelay);
    login.clickSignoutCancel();
    browser.sleep(browser.params.mediumDelay);
    expect(browser.getCurrentUrl()).toEqual(execSettings.auctionHomePage());
  });

  it("7. Login - Logout Auction Confirm", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});
