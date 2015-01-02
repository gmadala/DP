'use strict';

var AuctionHelperObject = function() {

  this.loginUrl = '#/login';

  this.openLogin = function() {
    browser.get(this.loginUrl);
  };

  this.username = browser.element(by.model('credentials.username'));
  this.password = browser.element(by.model('credentials.password'));
  this.loginButton = browser.element(by.buttonText('Log In'));

  // link to activate the user info drop down
  this.userInfoLink = browser.element(by.css('.user-info'));
  // the drop down element activated by clicking the above element
  this.userInfoDropDown = browser.element(by.css('.nxg-dropdown'));
  this.logoutButton = browser.element(by.cssContainingText('a', 'Sign Out'));
  // This locator returning two elements, one for the dealer and one for auction.
  // Both element will be in the DOM but only one will be displayed at a time.
  this.settingsButtons = browser.element.all(by.cssContainingText('a', 'Settings'));

  this.privacyStatement = browser.element(by.cssContainingText('a', 'Privacy Statement'));
  this.contactUs = browser.element(by.cssContainingText('a', 'Contact Us'));

  // dialog for logout.
  this.modal = browser.element(by.css('.modal'));
  this.modalHeader = browser.element(by.css('.modal-header'));
  // buttons in the modal.
  this.noButton = this.modal.element(by.cssContainingText('button', 'No'));
  this.yesButton = this.modal.element(by.cssContainingText('button', 'Yes'));

  // this is very strange as the user voice plugin seems to be adding two elements with the same id
  this.feedbackButtons = browser.element.all(by.id('uvTabLabel'));
  this.closeFeedbackButton = browser.element(by.cssContainingText('button', 'Close Dialog'));

  // next gear logo on the top of each page.
  this.webLogo = browser.element(by.css('.header > a'));

  this.loginAsAuction = function(username, password) {
    this.username.sendKeys(username);
    expect(this.username.getAttribute('value')).toEqual(username);
    this.password.sendKeys(password);
    expect(this.password.getAttribute('value')).toEqual(password);
    this.loginButton.click();
  };

  this.logoutAsAuction = function() {
    var logoutButton = this.logoutButton;
    expect(this.hasClass(this.userInfoDropDown, 'expanded')).toBeFalsy();
    this.userInfoLink.click();
    expect(this.hasClass(this.userInfoDropDown, 'expanded')).toBeTruthy();
    browser.driver.wait(function(){
      return logoutButton.isDisplayed();
    }, 3000);
    logoutButton.click();

    var logoutModalHeader = 'Logout';
    expect(this.modal.isDisplayed()).toBeTruthy();
    expect(this.modalHeader.getText()).toEqual(logoutModalHeader);
    this.yesButton.click();
    expect(browser.driver.getCurrentUrl()).toContain(this.loginUrl);
  };

  // get only the active settings button (or displayed settings button).
  this.getActiveSettingsButton = function(navTitle) {
    var promise = protractor.promise.defer();
    this.settingsButtons.each(function(settingsButton) {
      settingsButton.isDisplayed().then(function(displayed) {
        promise.fulfill(settingsButton);
      });
    });
    return promise;
  };

  // get only the active feedback button (or displayed feedback button).
  this.getActiveFeedbackButton = function() {
    var promise = protractor.promise.defer();
    this.feedbackButtons.each(function(feedbackButton) {
      feedbackButton.isDisplayed().then(function(displayed) {
        if (displayed) {
          promise.fulfill(feedbackButton);
        }
      });
    });
    return promise;
  };

  // Return true when the element have cssClass in them.
  this.hasClass = function (element, cssClass) {
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
