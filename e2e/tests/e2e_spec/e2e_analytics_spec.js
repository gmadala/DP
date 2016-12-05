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
        helper.popOver();
    });

    // it("2. Analytics - Title validations ", function () {
    //
    //     expect(analytics.getAverageTurnContainer()).toEqual('Average Turn');
    //     expect(analytics.getStaleAgingVehiclesContainer()).toEqual('Stale and Aging Vehicles');
    //     expect(analytics.getBestWorstMoversContainer()).toEqual('Best and Worst Movers by Zipcode');
    //     expect(analytics.getYourTop10AuctionsContainer()).toEqual('Your Top 10 Auctions');
    // });
    it("2. Analytics - Business Summary Section Title Validations", function () {
        expect(analytics.getBusinessSummaryContainer()).toEqual('Business Summary');
        expect(analytics.getApprovedFloorPlans()).toContain('Approved Floor Plans');
        expect(analytics.getPendingFloorPlans()).toContain('Pending Floor Plans');
        expect(analytics.getCreditAndPayments()).toContain('Credit and Payments');
    });

    it("3. Analytics - Average Turn Container Validations ", function () {
        expect(analytics.getAverageTurnContainer()).toEqual('Average Turn');
        expect(analytics.elAverageTurnGraph.isDisplayed()).toBe(true);
    });

    it("4. Analytics - Stale and Aging Vehicles Container Validations ", function () {
        expect(analytics.getStaleAgingVehiclesContainer()).toEqual('Stale and Aging Vehicles');
    });

    it("5. Analytics - Best and Worst Movers by Zipcode Container Validations ", function () {
        expect(analytics.getBestWorstMoversContainer()).toEqual('Best and Worst Movers by Zipcode');
    });

    it("6. Analytics - Your Top 10 Auctions Container Validations ", function () {
        expect(analytics.getYourTop10AuctionsContainer()).toEqual('Your Top 10 Auctions');
    });

    it("7. Analytics - Logout", function () {
        browser.sleep(browser.params.shortDelay);
        login.logout();
        expect(browser.getCurrentUrl()).toEqual(helper.loginPage());
    });
});
