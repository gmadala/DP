'use strict';

/**
 * @class helper_page_objects
 * @author Derek Gibson
 * @description Helper file for all reusable functions
 * */

var execSettings = require('./e2e_execSettings.js');
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
    browser.get(execSettings.loginPage());
    browser.sleep(browser.params.longDelay);
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
    browser.get(execSettings.homePage());
    browser.sleep(browser.params.longDelay);
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
    browser.get(execSettings.resourcesPage());
    browser.sleep(browser.params.longDelay);
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
    browser.get(execSettings.promosPage());
    browser.sleep(browser.params.longDelay);
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
    browser.get(execSettings.receiptsPage());
    browser.sleep(browser.params.longDelay);
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

}

module.exports.helper = Helper;
