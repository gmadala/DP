'use strict';

/**
 * @class helper_page_objects
 * @author Derek Gibson
 * @description Helper file for all reusable functions
 * */

var fs = require('fs');
var EC = protractor.ExpectedConditions;

function Helper() {

  //Navigation functions
  this.goToLogin = function () {
    /**
     * @name goToLogin
     * @memberof helper
     * @author Derek Gibson
     * @description This function navigates to the login page
     *
     * @returns {none}
     */
    browser.get(browser.baseUrl + 'login');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'login'
  };

  this.goToHome = function () {
    /**
     * @name goToHome
     * @memberof helper
     * @author Derek Gibson
     * @description This function navigates to the home page
     *
     * @returns {none}
     */
    browser.get(browser.baseUrl + 'home');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'home';
  };

  this.goToAuction = function () {
    /**
     * @name goToAuction
     * @memberof helper
     * @author Bobby Washington
     * @description This function navigates to the auction home page
     *
     * @returns {baseUrl + act/home}
     */
    browser.get(browser.baseUrl + 'act/home');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'act/home';
  };

  this.goToForgot = function () {
    /**
     * @name goToForgot
     * @memberof helper
     * @author Bobby Washington
     * @description This function navigates to the forgot page
     *
     * @returns {baseUrl + login/recover}
     */
    browser.get(browser.baseUrl + 'login/recover');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'login/recover';
  };

  this.goToResources = function () {
    /**
     * @name goToResources
     * @memberof helper
     * @author Derek Gibson
     * @description This function navigates to the resources page
     *
     * @returns {none}
     */
    browser.get(browser.baseUrl + 'documents');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'documents';
  };

  this.goToPromos = function () {
    /**
     * @name goToPromos
     * @memberof helper
     * @author Bala Nithiya
     * @description This function navigates to the promos page
     *
     * @returns {none}
     */
    browser.get(browser.baseUrl + 'promos');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'promos';
  };

  this.goToReceipts = function () {
    /**
     * @name goToReceipts
     * @memberof helper
     * @author Bala Nithiya
     * @description This function navigates to the receipts page
     *
     * @returns {none}
     */
    browser.get(browser.baseUrl + 'receipts');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'receipts';
  };

  this.goToProfile = function () {
    /**
     * @name goToProfile
     * @memberof helper
     * @author Bobby Washington
     * @description This function navigates to the profile page
     *
     * @returns {none}
     */
    browser.get(browser.baseUrl + 'profile_settings');
    browser.sleep(browser.params.longDelay);
    return browser.baseUrl + 'profile_settings';
  };

  //Generic functions
  this.waitForVisible = function (elementId) {
    /**
     * @name waitForVisible
     * @memberof HelperObject
     * @author Bryan Noland
     * @description This helper function uses Expected Conditions and a check to make sure that
     *              the element passed in to the function is visible.  This function can be
     *              used to select 'X', Cancel or any other element, just pass in the element id.
     *
     * @param {string} elementId - Id of the element expected to be checked
     * @returns {none}
     */
    var isVisible = EC.visibilityOf(elementId);
    browser.wait(isVisible, browser.params.mediumDelay);
  };

  this.waitForClickable = function (elementId) {
    /**
     * @name waitForClickable
     * @memberof HelperObject
     * @author Bryan Noland
     * @description This helper function uses Expected Conditions and a check to make sure that
     *              the element passed in to the function is clickable.  This function can be
     *              used to select 'X', Cancel or any other element, just pass in the element id.
     *
     * @param {string} elementId - Id of the element expected to be checked
     * @returns {none}
     */
    var isClickable = EC.elementToBeClickable(elementId);
    //doing this twice makes the tests stable, protractor has issues, man
    //still better than a static sleep()
    browser.wait(isClickable, browser.params.mediumDelay);
    browser.wait(isClickable, browser.params.mediumDelay);
  };

  this.takeSnapshot = function (snapshotFileName) {
    /**
     * @name takeSnapshot
     * @memberof HelperObject
     * @author Derek Gibson
     * @description This helper function takes a snapshot of the UI at the moment it is called
     *              and saves it as a .png in client/target/protractor_screenshots with the name given
     * @param {string} snapshotFileName
     */
    browser.takeScreenshot().then(function (png) {
      var buf = new Buffer(png, 'base64');
      var stream = fs.createWriteStream('target/protractor_screenshots/' + snapshotFileName + '.png');
      stream.write(buf);
      stream.end();
    });
  };

  this.getTodaysDate = function () {
    var todaysDate;
    var month;
    var date;
    todaysDate = new Date();
    month = todaysDate.getMonth() + 1;
    date = todaysDate.getDate();
    if (month < 10) {
      month = '0' + month; //ensure leading 0
    }
    if (date < 10) {
      date = '0' + date;//ensure leading 0
    }
    //mm/dd/yyyy
    var currentDate = month + '/' + date + '/' + todaysDate.getFullYear();
    return (currentDate);
  };

  this.popOver = function () {
    /**
     * @name Popover
     * @memberof helper
     * @author Bala Nithiya
     * @description This function helps to close the popover message
     *
     * @returns {none}
     */
    this.elOkButton = browser.element(by.buttonText("OK, I got it!"));
    var elPopOver = element(by.css('button[ng-click="closeMenuTip()"]'));
    if (elPopOver) {
      browser.actions().mouseMove(element(by.css('.popover'))).perform();
      expect(elPopOver.isDisplayed()).toBe(true);
      this.elOkButton.click();
    }
  };
}

module.exports.helper = Helper;
