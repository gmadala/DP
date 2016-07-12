'use strict';

/**
 * @class helper_page_objects
 * @author Derek Gibson
 * @description Helper file for all reusable functions
 * */

var execSettings = require('./e2e_execSettings.js');
var fs = require('fs');

var helper = function () {
};

var EC = protractor.ExpectedConditions;
var longDelay = 5000;

helper.prototype = Object.create({}, {

  //Navigation functions
  goToLogin: {
    /**
     * @name goToLogin
     * @memberof helper
     * @author Derek Gibson
     * @description This function navigates to the login page
     *
     * @returns {none}
     */
    value: function () {
      browser.get(execSettings.loginPage());
      browser.sleep(longDelay);
    }
  },
  goToHome: {
    /**
     * @name goToHome
     * @memberof helper
     * @author Derek Gibson
     * @description This function navigates to the home page
     *
     * @returns {none}
     */
    value: function () {
      browser.get(execSettings.homePage());
      browser.sleep(longDelay);
    }
  },

  //Generic functions
  waitForVisible: {
    value: function (elementId) {
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
      browser.wait(isVisible, longDelay);
    }
  },
  waitForClickable: {
    value: function (elementId) {
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
      browser.wait(isClickable, longDelay);
      browser.wait(isClickable, longDelay);
    }
  },
  takeSnapshot: {
    value: function (snapshotFileName) {
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
    }
  },
  waitForAlert: {
    value: function () {
      try {
        browser.wait(protractor.ExpectedConditions.alertIsPresent(), 1000);
      }
      catch
        (err) {
        console.error("No Alert Detected! " + err);
      }
    }
  }

});

module.exports = helper;
