'use strict';

let helper = require('../framework/e2e_helper_functions.js');
    helper = new helper.helper();

let loginObjs = require('../framework/e2e_login_objects.js');
    loginObjs = new loginObjs.loginObjects();

let dashboardObjs = require('../framework/e2e_auction_dashboard_objects.js');
    dashboardObjs = new dashboardObjs();

let dealerSearchObj = require('../framework/e2e_dealer_search_objects.js');
    dealerSearchObj = new dealerSearchObj();

let floorVehicleObj = require('../framework/e2e_auction_floor_vehicle_objects.js');
    floorVehicleObj = new floorVehicleObj();

const login = require('../framework/e2e_login.js');

const username = '10298KB'; // Needs to be updated
const password = 'ringoffire@1'; // Needs to be updated

describe('Build Verification for Auction User', () => {

    beforeEach(() => {
        browser.sleep(browser.params.longDelay);
        browser.ignoreSynchronization = true;
    });

    it('1. Login as US auction', () => {
        helper.goToLogin();

        loginObjs.setLogin(username, password);
        loginObjs.doLogin();

        expect(browser.getCurrentUrl()).toBe(helper.auctionHomePage());
    });

    it('2. Verify dashboard data populated', () => {
        expect(dashboardObjs.elAuctionDashboardPage.isDisplayed()).toBe(true);
        expect(dashboardObjs.elFloorPlanChart.isDisplayed()).toBe(true);
    });

    it('3. Click most recent receipt (disbursement detail) and validate', () => {
        dashboardObjs.clickFirstDisbursement();

        browser.getAllWindowHandles().then((handles) => {
            browser.switchTo().window(handles[1]).then(() => {
                expect(browser.getCurrentUrl()).toContain('/MobileService/api/report/disbursement');
                browser.close();
                browser.switchTo().window(handles[0]);
            });
        });
    });

    it('4. Navigate to Dealer Search via menu', () => {
        dashboardObjs.clickMenuDealerSearch();

        expect(browser.getCurrentUrl()).toBe(helper.dealerSearchPage());
    });

    it('5. Perform search and verify result plus modal', () => {
        const dealerNumber = '70264'; // Needs to be updated

        dealerSearchObj.setSearchValue(dealerNumber);
        dealerSearchObj.doSearch();

        browser.sleep(browser.params.longDelay);

        expect(dealerSearchObj.elDealerSearchFirstResult.isDisplayed()).toBe(true);
    });

    it('6. Nav to Floor Vehicle apge via menu', () => {
        dealerSearchObj.clickMenuFloorVehicle();

        expect(browser.getCurrentUrl()).toBe(helper.auctionFloorVehiclePage());
    });

    it('7. Verify at least one bank account populates', () => {
        browser.sleep(browser.params.longDelay);

        expect(floorVehicleObj.elBankAccounts.count()).toBeGreaterThan(1);
    });

    it('8. Logout', () => {
        login.logout();

        expect(browser.getCurrentUrl()).toEqual(helper.loginPage());
    });

});
