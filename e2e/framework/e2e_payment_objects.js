'use strict';

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
        var allPayoffs = element.all(by.repeater('payment in payments.results')).get(0);
        console.log(allPayoffs + ' **END** ');
        console.log(allPayoffs(0));
        allPayoffs.element(by.id('togglePayoff')).click();
        browser.sleep(browser.params.longDelay);
    };
    this.doCheckout = function () {
        browser.sleep(browser.params.longDelay);
        this.elCheckoutButton.click();
        browser.sleep(browser.params.longDelay);
    };

}
module.exports.paymentObjects = PaymentObjects;
