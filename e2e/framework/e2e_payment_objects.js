'use strict';

var helper = require('../framework/e2e_helper_functions.js');
var helper = new helper.helper();

function PaymentObjects() {
    //Locators
    this.elCheckoutButton = browser.element(by.css("button.btn-cta.cta-primary.cta-full"));
    this.elRemovePayment = browser.element(by.css("button.btn-unstyle.btn-link.right"));
    this.elNoPaymentsText = browser.element(by.css("p.info-block-text"));
    this.elBankAccount = browser.element(by.id('bankAccount'));
    this.elExportSummary = browser.element(by.css('span.icon-small.svg-icon.icon-document'));
    this.elSubtotal = browser.element(by.css('h3.numeric'));

    //Getters
    this.getSubtotal = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elSubtotal.getText();
    };
    this.getTotal = function () {
        browser.sleep(browser.params.shortDelay);
        var allElementsOfSelector = element.all(by.css("h3.lockup-major"));
        var total = allElementsOfSelector.filter(function (elem) {
            return elem.isDisplayed().then(function (displayedElement) {
                return displayedElement;
            });
        }).first();
        return total.getText();
    };
    this.getNoPaymentsText = function () {
        browser.sleep(browser.params.short);
        return this.elNoPaymentsText.getText();
    };

    //Doers
    this.checkPayoffsExist = function () {
        browser.sleep(browser.params.shortDelay);
        return browser.isElementPresent(by.id('paymentsSearchTable'));
    };
    this.checkBankAccountsExist = function () {
        browser.sleep(browser.params.shortDelay);
        return browser.isElementPresent(by.id('bankAccount'));
    };
    this.doClickFirstPayoff = function (selector) {
        browser.sleep(browser.params.longDelay);
        var allElementsOfSelector = element.all(by.id('togglePayoff'));
        return allElementsOfSelector.filter(function (elem) {
            return elem.isDisplayed().then(function (displayedElement) {
                return displayedElement;
            });
        }).first().click();
    };
    this.doCheckoutButton = function () {
        browser.sleep(browser.params.longDelay);
        this.elCheckoutButton.click();
    };
    this.doBankAccountSelect = function () {
        browser.sleep(browser.params.longDelay);
        helper.doDropdownSelect(this.elBankAccount, 0);
    };
    this.doExportSummary = function () {
        browser.sleep(browser.params.shortDelay);
        this.elExportSummary.click();
    };
    this.doRemovePayment = function () {
        browser.sleep(browser.params.longDelay);
        this.elRemovePayment.click();
    }

}
module.exports.paymentObjects = PaymentObjects;