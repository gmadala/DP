'use strict';

var LoginPageObject = require('../framework/login_page_object.js');
var CredentialsObject = require('../framework/credentials_page_object.js');
var HomePageObject = require('../framework/home_page_object.js');
var UtilObject = require('../framework/util_object.js');
var paymentsPage = require('../framework/payments_page_object.js');

var loginPage = new LoginPageObject();
var credPage = new CredentialsObject();
var homePage = new HomePageObject();
var util = new UtilObject();

// TODO recommend high level nxgDescribe where we put in Jira ticket and description and that
// will also use beforeEach and afterEach common to all tests such as checking for console output/errors
// probably should manage login at the high level as well
describe('WMT-51 - Dealer Portal High-level navigation options', function () {

  // TODO will have to manage logout first
  xdescribe('Login page', function () {
    beforeEach(function () {
      browser.ignoreSynchronization = true;
    });

    it('Successful login navigates to Dashboard', function () {

      browser.get(loginPage.loginUrl);
      loginPage.doLogin(credPage.loginUsername, credPage.loginPassword);
      loginPage.goToLogin();

      // check for correct url
      expect(browser.getLocationAbsUrl()).toContain('#/home');
      // check that the correct view is active
      expect(element(by.cssContainingText('.active', 'Dashboard')).isPresent()).toBeTruthy();
    });
  });

  describe('High-level navigation options from home page', function () {

    function runNavLinkTest(text, href) {

      // check for link
      var link = element(by.cssContainingText('a', text));
      expect(link.isDisplayed()).toBeTruthy();
      expect(link.isEnabled()).toBeTruthy();

      // navigate
      link.click();

      // check for correct url
      expect(browser.getLocationAbsUrl()).toContain('#/' + href);

      // check that the correct view is active
      expect(element(by.cssContainingText('.active', text)).isPresent()).toBeTruthy();

    }

    beforeEach(function () {
      browser.ignoreSynchronization = true;
      browser.get(homePage.homeUrl);
    });

    // simple navigation tests for primary/secondary nav
    var navs = [
      ['Dashboard', 'home'],
      ['Payments', 'payments'],
      ['Floor Plan', 'floorplan'],
      ['Title Releases', 'titlereleases'],
      ['Receipts', 'receipts'],
      ['Reports', 'reports'],
      ['Analytics', 'analytics'],
      ['Floor a Vehicle', 'floorcar'],
      ['Value Lookup', 'valueLookup'],
      ['Resources', 'documents']
    ];

    // create a spec for each nav
    navs.forEach(function (nav) {
      it('High-level Navigation test: ' + nav[0] + ' navigates to ' + nav[1], function () {
        runNavLinkTest(nav[0], nav[1]);
      });
    });

    it('Title Release navigation option displays if business is eligible for title release program (Mock API)',
      function () {
        expect(true).toBeTruthy();
        // TODO implement in a separate suite for a live server and reference that here
      });

    it('Title Release navigation option is hidden if business is not eligible for title release program (Mock API)',
      function () {
        expect(true).toBeTruthy();
        // TODO implement in a separate suite for a live server and reference that here
      });


  });


  describe('Cart', function () {
    var cart;

    beforeEach(function () {
      browser.ignoreSynchronization = true;
      paymentsPage.openPage();
      paymentsPage.waitForPage();
      cart = element(by.css('.cart-btn'));
      expect(cart.isDisplayed()).toBeTruthy();
    });

    it('Cart navigation option is disabled if nothing is in cart', function () {

      // initially cart should be empty
      expect(cart.isEnabled()).toBeFalsy();
    });


    function fillCart() {
      paymentsPage.schedulePaymentButtons.first().click();
    }

    it('Cart navigation is enabled if cart has an item', function () {
      fillCart();
      expect(cart.isEnabled()).toBeTruthy();
    });

    it('Cart navigation option navigates to Cart', function () {
      fillCart();
      expect(cart.isEnabled()).toBeTruthy();
      cart.click();
      browser.debugger();
      expect(browser.getLocationAbsUrl()).toContain('#/checkout');
    });

  });

  describe('User dropdown', function () {

    function runUserInfoLinkTest(text, href) {

      // check for link
      var link = element(by.cssContainingText('a', text));
      expect(link.isDisplayed()).toBeTruthy();
      expect(link.isEnabled()).toBeTruthy();

      // navigate
      link.click();

      // check for correct url
      expect(browser.getLocationAbsUrl()).toContain('#/' + href);
    }

    var dropdown;

    beforeEach(function () {
      browser.ignoreSynchronization = true;

      browser.get(homePage.homeUrl);
      dropdown = element(by.css('.user-info'));
      expect(dropdown.isDisplayed()).toBeTruthy();
      expect(dropdown.isEnabled()).toBeTruthy();

      // open dropdown
      dropdown.click();

      // sometimes we may end up with the last click collapsing the menu
      // in that case try to cli
    });

    // simple navigation tests for primary/secondary nav
    var links = [
      ['Profile Settings', 'profile_settings'],
      ['Account Management', 'account_management']
    ];

    // create a spec for each nav
    links.forEach(function (link) {
      it('User dropdown link spec: ' + link[0] + ' navigates to ' + link[1], function () {
        browser.debugger();
        runUserInfoLinkTest(link[0], link[1]);
      });
    });


    function clickSignOut() {
      var link = element(by.cssContainingText('a', 'Sign Out'));//'[ng-click="user.logout()"]'));
      expect(link.isEnabled()).toBeTruthy();

      // navigate
      link.click();

      // check still on home page
      expect(browser.getLocationAbsUrl()).toContain('#/home');

    }

    it('Sign Out navigation option navigates to Sign Out confirmation modal', function () {
      // tested by the Sign Out cancel test since modal can only be dismissed that way.
      dropdown.click(); // collapse dropdown
    });

    it('Sign Out confirmation modal selection of “No, Thanks” closes modal', function () {
      clickSignOut();

      // dismiss
      util.goToLogoutNoThanksButton();

      // reset dropdown
      dropdown.click();
    });

    it('Sign Out confirmation modal selection of “Yes” signs user out of the application', function () {
      clickSignOut();

      // dismiss
      util.goToLogoutYesButton();
    });
  });

  describe('External links open in new window with no errors', function () {

    function clickExternal(link, validatorFn) {
      var appWindow = browser.getWindowHandle();
      // http://www.newyyz.com/blog/2014/04/17/angularjs-protractor-and-external-link/
      link.click().then(function () {
        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];
          browser.switchTo().window(newWindowHandle).then(function () {

            // custom validator for the spec
            validatorFn();

            // clean up
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
      });
    }

    function runExternalLinkTest(linkText, pageTitle) {

      // validator function that fails if there are logs in the console
      // TODO should move this into an afterEach block for all the tests to test for console errors
      // but can't do this yet because there are some errors that are due to bugs (moment/min/es.js 404)
      //function failOnConsoleOutput() {
      //  browser.driver.manage().logs().get('browser').then(function (browserLog) {
      //    browser.debugger();
      //    expect(browserLog.length).toEqual(0);
      //    // Uncomment to actually see the log.
      //    // console.log('log: ' + require('util').inspect(browserLog));
      //  });
      //}

      function failOnWrongTitle() {
        browser.driver.getTitle().then(function (title) {
          expect(title).toEqual(pageTitle);
        });
      }

      // check for link
      var link = element(by.cssContainingText('a', linkText));
      expect(link.isDisplayed()).toBeTruthy();
      expect(link.isEnabled()).toBeTruthy();

      // check to make sure it will open in different window with the target='_blank' attribute
      expect(link.getAttribute('target')).toEqual('_blank');

      // navigate
      clickExternal(link, failOnWrongTitle);
    }


    beforeEach(function () {
      browser.ignoreSynchronization = true;
      browser.get(homePage.homeUrl);

    });

    // external links - [link text, new page title]
    var links = [
      ['Chat', 'Patron Facing Chat'],
      ['Privacy Statement', 'Privacy statement | NextGear Capital'], // this test fails because the href is wrong
      ['Contact Us', 'Contact Us | NextGear Capital'] // this test fails because the href is wrong
    ];

    // create a spec for each external link
    links.forEach(function (link) {
      it('External Link test: ' + link[0] + ' should open ' + link[1], function () {
        runExternalLinkTest(link[0], link[1]);
      });
    });
  });

  describe('Other high level navigation', function () {

    beforeEach(function () {
      browser.ignoreSynchronization = true;
      // browser.get(homePage.homeUrl);
    });

    it('Feedback & Support opens Feedback & Support modal', function () {
      browser.get(homePage.homeUrl);
      // Verifying that we can click open and click close

      // click on a id="uvTabLabel"
      element(by.id('uvTabLabel')).click();

      // close it by clicking using div id="uvw-dialog-close-uv-1"
      element(by.id('uvw-dialog-close-uv-1')).click();
    });

    it('The NextGear Logo activation navigates to the DashBoard', function () {

      var href = 'home';
      var text = 'Dashboard';

      // start on login page (or other non-home page)
      paymentsPage.openPage();
      paymentsPage.waitForPage();

      // check for link
      var link = element(by.css('div .nxg-logo'));
      expect(link.isDisplayed()).toBeTruthy();
      expect(link.isEnabled()).toBeTruthy();

      // navigate
      link.click();

      // check for correct url
      expect(browser.getLocationAbsUrl()).toContain('#/' + href);

      // check that the correct view is active
      expect(element(by.cssContainingText('.active', text)).isPresent()).toBeTruthy();
    });
  });
});

xdescribe('Test Debugger', function () {
  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(homePage.homeUrl);
  });

  it('Debug this test', function () {
    browser.debugger();
    element(by.id('uvTabLabel')).click();
  });
});
