'use strict';

/**
 * @class helper_page_objects
 * @author Derek Gibson
 * @description Helper file for all reusable functions
 * */

var fs = require('fs');
var EC = protractor.ExpectedConditions;

function Helper() {

    this.loginPage = function () {
        return browser.baseUrl + 'login';
    };

    this.homePage = function () {
        return browser.baseUrl + 'home';
    };

    this.checkoutPage = function () {
        return browser.baseUrl + 'checkout';
    };

    this.auctionHomePage = function () {
        return browser.baseUrl + 'act/home';
    };

    this.forgotPage = function () {
        return browser.baseUrl + 'login/recover';
    };

    this.resourcesPage = function () {
        return browser.baseUrl + 'documents';
    };

    this.promosPage = function () {
        return browser.baseUrl + 'promos';
    };

    this.paymentsPage = function () {
        return browser.baseUrl + 'payments';
    };

    this.receiptsPage = function () {
        return browser.baseUrl + 'receipts';
    };

    this.profileSettingsPage = function () {
        return browser.baseUrl + 'profile_settings';
    };

    this.accountManagementPage = function () {
        return browser.baseUrl + 'account_management';
    };

    this.analyticsPage = function () {
        return browser.baseUrl + 'analytics';
    };

    this.openAuditsPage = function () {
        return browser.baseUrl + 'audits';
    };

    this.dealerSearchPage = function () {
        return browser.baseUrl + 'act/dealersearch';
    };

    this.exportSummaryPage = function () {
        return 'MobileService/api/report/payment/summary/paymentsSummary?AuthToken=';
    };

    this.auctionFloorVehiclePage = function () {
        return browser.baseUrl + 'act/bulkflooring';
    };

    //Navigation functions
    this.goToLogin = function () {
        /**
         * @name goToLogin
         * @memberof helper
         * @author Derek Gibson
         * @description This function navigates to the login page
         *
         * @returns {promise}
         */
        return browser.get(this.loginPage())
            .then(browser.sleep(browser.params.longDelay));
        browser.driver.manage().deleteAllCookies();

    };

    this.goToHome = function () {
        /**
         * @name goToHome
         * @memberof helper
         * @author Derek Gibson
         * @description This function navigates to the home page
         *
         * @returns {promise}
         */
        return browser.get(this.homePage())
            .then(browser.sleep(browser.params.longDelay));
    };

    this.goToAuction = function () {
        /**
         * @name goToAuction
         * @memberof helper
         * @author Bobby Washington
         * @description This function navigates to the auction home page
         *
         * @returns {promise}
         */
        browser.get(this.auctionHomePage())
            .then(browser.sleep(browser.params.longDelay));
    };

    this.goToForgot = function () {
        /**
         * @name goToForgot
         * @memberof helper
         * @author Bobby Washington
         * @description This function navigates to the forgot page
         *
         * @returns {promise}
         */
        browser.get(this.forgotPage())
            .then(browser.sleep(browser.params.longDelay));
    };

    this.goToResources = function () {
        /**
         * @name goToResources
         * @memberof helper
         * @author Derek Gibson
         * @description This function navigates to the resources page
         *
         * @returns {promise}
         */
        browser.get(this.resourcesPage())
            .then(browser.sleep(browser.params.longDelay));
    };

    this.goToPromos = function () {
        /**
         * @name goToPromos
         * @memberof helper
         * @author Bala Nithiya
         * @description This function navigates to the promos page
         *
         * @returns {promise}
         */
        browser.get(this.promosPage())
            .then(browser.sleep(browser.params.longDelay));
    };

    this.goToReceipts = function () {
        /**
         * @name goToReceipts
         * @memberof helper
         * @author Bala Nithiya
         * @description This function navigates to the receipts page
         *
         * @returns {promise}
         */
        browser.get(this.receiptsPage())
            .then(browser.sleep(browser.params.longDelay));
    };

    this.goToProfile = function () {
        /**
         * @name goToProfile
         * @memberof helper
         * @author Bobby Washington
         * @description This function navigates to the profile page
         *
         * @returns {promise}
         */
        browser.get(this.profileSettingsPage())
            .then(browser.sleep(browser.params.longDelay));
    };

    this.goToAccountManagement = function () {
        /**
         * @name goToAccountManagement
         * @memberof helper
         * @author Javier Calderon
         * @description This function navigates to the AccountManagement
         *
         * @returns {none}
         */
        browser.get(this.accountManagementPage());
        browser.sleep(browser.params.longerDelay);
    };

    this.goToAnalytics = function () {
        /**
         * @name goToAnalytics
         * @memberof helper
         * @author Bala Nithiya
         * @description This function navigates to the Analytics
         *
         * @returns {none}
         */
        browser.get(this.analyticsPage());
        browser.sleep(browser.params.longerDelay);
    };

    this.goToOpenAudits = function () {
        /**
         * @name goToOpenAudits
         * @memberof helper
         * @author Bala Nithiya
         * @description This function navigates to the Open Audits
         *
         * @returns {none}
         */
        browser.get(this.openAuditsPage);
        browser.sleep(browser.params.longerDelay);
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
        var elPopOverBtn = browser.element(by.buttonText('OK, I got it!'));
        elPopOverBtn.isPresent()
            .then(function (bool) {
                if (bool) {
                    elPopOverBtn.click()
                }
            });
    };


    this.doClick = function (elementToClick, elementToWaitFor) {
        /**
         * @name doClick
         * @memberof helper
         * @author Bryan Noland
         * @description This function waits for an element to be clickable, then clicks the element
         *
         * @param elementToClick = element to be clicked
         * @param elementToWaitFor = optional - element to wait to be visible after the click
         * @returns {promise}
         */

        browser.wait(EC.elementToBeClickable((elementToClick)), 10000);
        return elementToClick.click()
            .then(function validateAndWait() {
                if (elementToWaitFor) {
                    return browser.wait(EC.elementToBeClickable((elementToWaitFor)), 10000);
                }
                else {
                    return true;
                }
            });
    };

    this.doDropdownSelect = function (element, optionNum) {
        if (optionNum) {
            var options = element.findElements(by.tagName('option'))
                .then(function (options) {
                    options[optionNum].click();
                });
        }
    };
}

module.exports.helper = Helper;
