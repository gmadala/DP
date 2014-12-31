'use strict';

var AuctionHelperObject = function() {

  this.loginUrl = '#/login';

  this.openLogin = function() {
    browser.get(this.loginUrl);
  };

  this.username = browser.element(by.model('credentials.username'));
  this.password = browser.element(by.model('credentials.password'));
  this.loginButton = browser.element(by.buttonText('Log In'));

  this.userInfoLink = browser.element(by.css('.user-info'));
  this.userInfoDropDown = browser.element(by.css('.nxg-dropdown'));
  this.logoutButton = browser.element(by.cssContainingText('a', 'Sign Out'));
  this.settingsButton = browser.element(by.cssContainingText('a', 'Settings'));

  this.privacyStatement = browser.element(by.cssContainingText('a', 'Privacy Statement'));
  this.contactUs = browser.element(by.cssContainingText('a', 'Contact Us'));

  this.modal = browser.element(by.css('.modal'));
  this.modalHeader = browser.element(by.css('.modal-header'));

  this.yesButton = this.modal.element(by.cssContainingText('button', 'Yes'));

  this.loginAsAuction = function(username, password) {
    this.username.sendKeys(username);
    expect(this.username.getAttribute('value')).toEqual(username);
    this.password.sendKeys(password);
    expect(this.password.getAttribute('value')).toEqual(password);
    this.loginButton.click();
  };

  this.logoutAsAuction = function() {
    expect(hasClass(this.userInfoDropDown, 'expanded')).toBeFalsy();
    this.userInfoLink.click();
    expect(hasClass(this.userInfoDropDown, 'expanded')).toBeTruthy();
    this.logoutButton.click();

    var logoutModalHeader = 'Logout';
    expect(this.modal.isDisplayed()).toBeTruthy();
    expect(this.modalHeader.getText()).toEqual(logoutModalHeader);
    this.yesButton.click();
    expect(browser.driver.getCurrentUrl()).toContain(this.loginUrl);
  };

  var hasClass = function (element, cssClass) {
    return element.getAttribute('class').then(function (classes) {
      return classes.indexOf(cssClass) !== -1;
    });
  };

  this.describe = function(jiraIssue, describeFn) {
    var helper = this;
    describe('E2E Testing Suite for Jira Issue ' + jiraIssue + '.', function() {
      beforeEach(function() {
        browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
        helper.openLogin();
        helper.loginAsAuction('auction', 'test');
      });

      describeFn();

      afterEach(function() {
        helper.logoutAsAuction();
      });
    });
  };

};

module.exports = AuctionHelperObject;
