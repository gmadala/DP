'use strict';

var EC = protractor.ExpectedConditions;

function PaymentObjects() {
    //Locators
    this.elCheckoutButton = browser.element(by.css("button.btn-cta.cta-primary.cta-full"));

    //Doers
    this.checkPayoffsExist = function () {
        browser.sleep(browser.params.shortDelay);
        return browser.isElementPresent(by.id('paymentsSearchTable'));
    };
    this.doClickFirstPayoff = function () {
        browser.sleep(browser.params.longDelay);
        var allPayoffs = element.all(by.repeater('payment in payments.results'));
        this.elPaymentTablePayoff = allPayoffs.get(0).element(by.id('togglePayoff'));
        this.elPaymentTablePayoff.click();
        browser.sleep(browser.params.longDelay);
    };
    this.doCheckout = function () {
        browser.sleep(browser.params.longDelay);
        this.elCheckoutButton.click();
        browser.sleep(browser.params.longDelay);
    };

}
module.exports.paymentObjects = PaymentObjects;
