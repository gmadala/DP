'use strict';

var helper = require('../framework/e2e_helper_functions.js');
var helper = new helper.helper();
var dashboard = require('../framework/e2e_dashboard_objects.js');
var dashboard = new dashboard.dashboardObjects();
var loginObjects = require('../framework/e2e_login_objects.js');
var loginObjects = new loginObjects.loginObjects();
var payments = require('../framework/e2e_payment_objects.js');
var payments = new payments.paymentObjects();

//********THIS HAS TO BE CHANGED TO SOMETHING THAT WORKS IN PRODUCTION********//
var userName = '57694AC';
var password = 'ringoffire@1';

describe('Build Verification', function () {

    beforeEach(function () {
        browser.sleep(browser.params.longDelay);
        browser.ignoreSynchronization = true;
    });

    it("1. Login as a US dealer", function () {
        helper.goToLogin();
        //Validate the NGC Logo and language pickers are visible
        expect(loginObjects.elMNGLogo.isDisplayed()).toBe(true);
        expect(loginObjects.elLangChooser.isDisplayed()).toBe(true);
        expect(loginObjects.elEnglish.isDisplayed()).toBe(true);
        expect(loginObjects.elSpanish.isDisplayed()).toBe(true);
        expect(loginObjects.elFrench.isDisplayed()).toBe(true);

        //Validating languages
        expect(loginObjects.getTextLogin()).toBe("Login");
        loginObjects.doSpanish();
        expect(loginObjects.getTextLogin()).toBe("Inicio de sesión");
        loginObjects.doFrench();
        expect(loginObjects.getTextLogin()).toBe("Ouverture de session");
        loginObjects.doEnglish();

        //Validating login & success
        expect(loginObjects.getTextLogin()).toBe("Login");
        loginObjects.setLogin(userName, password);
        loginObjects.doLogin();
        expect(browser.getCurrentUrl()).toEqual(helper.homePage());
    });

    it("2. Verify dashboard stuff", function () {
        expect(dashboard.elShowHidePaymentDetailsLink.isDisplayed()).toBe(true);
        expect(dashboard.elViewAllPaymentsLink.isDisplayed()).toBe(true);
        expect(dashboard.elRequestCreditIncrease.isDisplayed()).toBe(true);
        expect(dashboard.elFloorPlansLink.isDisplayed()).toBe(true);
    });

    it("3. Make a Payment", function () {
        dashboard.doPayments();
        if (payments.checkPayoffsExist()) {
            payments.doClickFirstPayoff();
        } else {
            console.log("Skipping Make Payment test because there are no payoffs")
        }
        //payments.doCheckout();
        //expect(browser.getCurrentUrl()).toEqual(helper.homePage())
    });

    // Fill out form and verify amounts
    xit("4. ", function () {

    });

    // Click Export Summary and verify
    xit("5. ", function () {

    });

    // Remove payment (DO NOT SUBMIT)
    xit("6. ", function () {

    });

    // Sign off
    xit("7. ", function () {

    });
});