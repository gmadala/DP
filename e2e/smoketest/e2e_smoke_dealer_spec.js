'use strict';

var helper = require('../framework/e2e_helper_functions.js');
var helper = new helper.helper();
var dashboard = require('../framework/e2e_dashboard_objects.js');
var dashboard = new dashboard.dashboardObjects();
var loginObjects = require('../framework/e2e_login_objects.js');
var loginObjects = new loginObjects.loginObjects();
var payments = require('../framework/e2e_payment_objects.js');
var payments = new payments.paymentObjects();
var login = require('../framework/e2e_login.js');

//********THIS HAS TO BE CHANGED TO SOMETHING THAT WORKS IN PRODUCTION********//
var userName = '57694AC';
var password = 'ringoffire@1';
var subtotal = '';

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

    it("3. Nav to make a payment and add one", function () {
        dashboard.doPayments();
        expect(browser.getCurrentUrl()).toEqual(helper.paymentsPage());
        if (payments.checkPayoffsExist()) {
            payments.doClickFirstPayoff();
        } else {
            console.log("Skipping payment tests because there are no payoffs.")
        }
        browser.sleep(browser.params.longDelay);
        subtotal = payments.getSubtotal();
        payments.doCheckoutButton();
        browser.sleep(browser.params.longDelay);
        expect(browser.getCurrentUrl()).toEqual(helper.checkoutPage());
    });

    it("4. Select bank account and validate amount", function () {
        if (payments.checkBankAccountsExist()) {
            payments.doBankAccountSelect();
        } else {
            console.log("Only one bank account, proceed to export summary.")
        }
        expect(subtotal).toEqual(payments.getTotal());
    });

    it("5. Export Summary, validate, and remove payment", function () {
        payments.doExportSummary();
        browser.getAllWindowHandles().then(function (handles) {
            var newWindowHandle = handles[1];
            browser.switchTo().window(newWindowHandle).then(function () {
                expect(browser.getCurrentUrl()).toContain(helper.exportSummaryPage());
                browser.close();
                browser.switchTo().window(handles[0]);
            });
        });
        payments.doRemovePayment();
        payments.getNoPaymentsText();
        expect(browser.getCurrentUrl()).toEqual(helper.checkoutPage());
    });

    it("6. Logout", function () {
        login.logout();
        expect(browser.getCurrentUrl()).toEqual(helper.loginPage());
    });
});