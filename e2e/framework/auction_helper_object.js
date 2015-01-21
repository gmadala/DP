'use strict';

var fs = require('fs');
var AuctionHelperObject = function () {

  this.loginUrl = '#/login';

  this.openLogin = function () {
    browser.get(this.loginUrl);
  };

  /** Locator for elements needed for the login and logout process **/
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
  this.loading = browser.element(by.css('.loading'));
  this.infiniteLoading = browser.element(by.css('.nxg-infinite-scroll-indicator'));

  /** Common wait function to ensure that page is fully loaded **/
  this.waitForElementDisplayed = function (element) {
    browser.driver.wait(function () {
      return element.isDisplayed().then(function (displayed) {
        return displayed;
      });
    });
  };

  this.waitForElementPresent = function (element) {
    browser.driver.wait(function () {
      return element.isPresent().then(function (displayed) {
        return displayed;
      });
    });
  };

  this.waitForElementHidden = function (element) {
    browser.driver.wait(function () {
      return element.isDisplayed().then(function (displayed) {
        return !displayed;
      });
    });
  };

  this.waitForElementDismissed = function (element) {
    browser.driver.wait(function () {
      return element.isPresent().then(function (present) {
        return !present;
      });
    });
  };

  this.waitForUrlToContains = function (expectedRelativeUrl) {
    var currentUrl;
    return browser.driver.getCurrentUrl().then(function (url) {
      currentUrl = url;
    }).then(function () {
      return browser.driver.wait(function () {
        return browser.driver.getCurrentUrl().then(function (url) {
          return url.indexOf(expectedRelativeUrl) > -1;
        });
      }, 3000);
    });
  };

  this.expectingLoading = function () {
    if (browser.params.env !== 'dev') {
      this.waitForElementDisplayed(this.loading);
      this.waitForElementHidden(this.loading);
    }
  };

  this.expectingInfiniteLoading = function () {
    if (browser.params.env !== 'dev') {
      this.waitForElementDisplayed(this.infiniteLoading);
      this.waitForElementHidden(this.infiniteLoading);
    }
  };

  /** Common login and logout function **/
  this.login = function () {
    var instance = this;
    // to run against mockApi locally:
    // $ grunt protractor  --suite=auction --params.user "auction" --params.password "test"
    var username = browser.params.user;
    var password = browser.params.password;

    this.username.sendKeys(username);
    expect(this.username.getAttribute('value')).toEqual(username.toString());
    this.password.sendKeys(password);
    expect(this.password.getAttribute('value')).toEqual(password.toString());

    this.loginButton.click().then(function () {
      instance.waitForUrlToContains('act/home');
    });
  };

  this.logout = function () {
    var instance = this;
    var modalHeader = 'Logout';
    expect(this.hasClass(this.userInfoDropDown, 'expanded')).toBeFalsy();
    this.userInfoLink.click().then(function () {
      expect(instance.hasClass(instance.userInfoDropDown, 'expanded')).toBeTruthy();

      // wait for the dropdown to scroll after clicking the user info link.
      instance.waitForElementDisplayed(instance.logoutButton);
      // now the logout is displayed, click it display the logout modal.
      instance.logoutButton.click().then(function () {
        // now we wait for the modal to be displayed.
        instance.waitForElementDisplayed(instance.modal);

        expect(instance.modal.isDisplayed()).toBeTruthy();
        expect(instance.modalHeader.getText()).toEqual(modalHeader);

        instance.yesButton.click().then(function () {
          instance.waitForUrlToContains('login');
        });
      });
    });
  };

  /** Promises to retrieve active buttons that will be difficult to access using just css locator **/
    // get only the active settings button (or displayed settings button).
  this.getActiveSettingsButton = function () {
    var promise = protractor.promise.defer();
    this.settingsButtons.each(function (settingsButton) {
      settingsButton.isDisplayed().then(function (displayed) {
        if (displayed) {
          promise.fulfill(settingsButton);
        }
      });
    });
    return promise;
  };

  // get only the active feedback button (or displayed feedback button).
  this.getActiveFeedbackButton = function () {
    var promise = protractor.promise.defer();
    this.feedbackButtons.each(function (feedbackButton) {
      feedbackButton.isDisplayed().then(function (displayed) {
        if (displayed) {
          promise.fulfill(feedbackButton);
        }
      });
    });
    return promise;
  };

  /** Common has class function to test whether an element will have certain class or not **/
    // Return true when the element have cssClass in them.
  this.hasClass = function (element, cssClass) {
    return element.getAttribute('class').then(function (classes) {
      return classes.indexOf(cssClass) > -1;
    });
  };

  /** Common function to write screenshot of a page. By default the output is the /tmp directory **/
  var screenShotDirectory = '/tmp/screenshot';
  var writeScreenShot = function (data, filename) {
    var stream = fs.createWriteStream(screenShotDirectory + filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  };

  /** Common function to open a page and then wait for it to be fully loaded **/
  this.openPageAndWait = function (page, expectingLoading, expectingInfiniteLoading) {
    browser.get(page);
    this.waitForUrlToContains(page);
    if (expectingLoading) {
      this.expectingLoading();
    }
    if (expectingInfiniteLoading) {
      this.expectingInfiniteLoading();
    }
  };

  /** Commond describe function which should be used to define a new set of tests based on a JIRA ticket **/
  this.describe = function (jiraIssue, describeFn) {
    var instance = this;

    // pulling the login screen sometimes automatically trigger the logout modal.
    // this wouldn't be needed if each e2e test perform login and logout on pre and post test.
    // but some of the test against localhost pull some pages directly as there's no auth process.
    var waitForLogoutGuard = function () {
      browser.driver.wait(function () {
        var promise = protractor.promise.defer();
        instance.modal.isPresent().then(function (present) {
          if (present) {
            // if we have the modal displayed, then click the yes and then fulfill the promise.
            instance.yesButton.click().then(function () {
              promise.fulfill(true);
            });
          } else {
            // if we don't have the modal displayed, then just fulfill the promise.
            promise.fulfill(true);
          }
        });
        return promise;
      }, 3000);
    };

    describe('E2E Testing Suite for Jira Issue ' + jiraIssue + '.', function () {
      beforeEach(function () {
        browser.ignoreSynchronization = true;
        instance.openLogin();
        waitForLogoutGuard();
        instance.login();
      });

      describeFn();

      afterEach(function () {
        var currentSpec = jasmine.getEnv().currentSpec;
        var passed = currentSpec.results().passed();

        browser.driver.takeScreenshot().then(function (png) {
          if (!passed) {
            var filename = '_' + currentSpec.description.replace(/\W+/g, '_') + '.png';
            writeScreenShot(png, filename);
          }
        });
        instance.logout();
      });
    });
  };

};

module.exports = AuctionHelperObject;
