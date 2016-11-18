'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var analytics = require('../../framework/e2e_analytics_objects.js');
var login = require('../../framework/e2e_login.js');
var helper = require('../../framework/e2e_helper_functions.js');

var loginObjects = new loginObjects.loginObjects();
var analytics = new analytics.analytics();
var helper = new helper.helper();

describe('\n Analytics Page', function () {

    beforeEach(function () {
        browser.sleep(browser.params.shortDelay);
    });

    it("1. Analytics - Login as 62434AM", function () {
        helper.goToLogin();
        loginObjects.doGoodLogin();
        helper.goToAnalytics();
        expect(browser.getCurrentUrl()).toEqual(helper.analyticsPage());
    });

    it("1. Analytics - Title validations ", function () {

        expect(analytics.getAnalyticsContainer()).toEqual('Business Summary', 'Average Turn', 'Stale and Aging Vehicles', 'Best and Worst Movers by Zipcode', 'Your Top 10 Auctions');
    });

    it("13. Analytics - Logout", function () {
        browser.sleep(browser.params.shortDelay);
        login.logout();
        expect(browser.getCurrentUrl()).toEqual(helper.loginPage());
    });
});
