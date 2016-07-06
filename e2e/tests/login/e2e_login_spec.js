'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var username = '53190md';
var password = 'ngcpass!0';

var loginObjects = new loginObjects.loginObjects();

describe("Login as Dealer\n ", function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.driver.manage().window().maximize();
    browser.get(execSettings.loginPage());
    browser.ignoreSynchronization = true;
  });
  afterEach(function () {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  it("1. Login - Null Username and Password", function () {
    loginObjects.setLogin('', '');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl() === execSettings.loginPage());
  });

  it("2. Login - Incorrect Username and Password", function () {
    loginObjects.setLogin('test', 'test');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl() === execSettings.loginPage());
  });

  it("3. Login - Null Password", function () {
    loginObjects.setLogin(username, '');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl() === execSettings.loginPage());
  });

  it("4. Login - Null Username", function () {
    loginObjects.setLogin('', password);
    loginObjects.doLogin();
    expect(browser.getCurrentUrl() === execSettings.loginPage());
  });

  it("5. Login - Good Dealer Login", function () {
    loginObjects.doGoodLogin();
    expect(browser.getCurrentUrl() === execSettings.homePage());
  });

  it("6. Login - Logout Dealer Confirm", function () {
    loginObjects.doMyAccount();
    login.clickSignoutButton();
    login.clickSignoutConfirm();
    expect(browser.getCurrentUrl() === execSettings.loginPage());
  });

  it("7. Login - Good Auction Login", function () {
    loginObjects.doGoodLogin();
    expect(browser.getCurrentUrl() === execSettings.homePage());
  });

  it("8. Login - Logout Auction Cancel", function () {
    loginObjects.doMyAccount();
    login.clickSignoutButton();
    login.clickSignoutCancel();
    expect(browser.getCurrentUrl() === execSettings.homePage());
  });

  it("8. Login - Logout Auction Confirm", function () {
    loginObjects.doMyAccount();
    login.clickSignoutButton();
    login.clickSignoutConfirm();
    expect(browser.getCurrentUrl() === execSettings.loginPage());
  });

});
