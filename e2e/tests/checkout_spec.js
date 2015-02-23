'use strict';

var HelperObject = require('../framework/helper_object.js');
var CheckoutPage = require('../framework/checkout_page_object.js');
var PaymentsPage = require('../framework/payments_page_object.js');

var helper = new HelperObject();
var checkoutPage = new CheckoutPage();
var paymentsPage = new PaymentsPage();

helper.describe('WMT-55', function () {
  describe('Dealer Portal Checkout navigation: ', function () {

    it('Clicking Payments navigates to the Payments page.', function () {
      helper.openPageAndWait(checkoutPage.url, false, false);
      expect(browser.driver.getCurrentUrl()).toContain(checkoutPage.url);
      expect(checkoutPage.paymentsPageLink.isDisplayed()).toBeTruthy();
      checkoutPage.paymentsPageLink.click().then(function () {
        expect(browser.driver.getCurrentUrl()).not.toContain(checkoutPage.url);
      });
    });

    it('Clicking Vehicle Description navigates to Vehicle Details.', function () {
      preparePayments();
      expect(checkoutPage.vehicleDetailLinks.count()).toBeGreaterThan(0);
      expect(paymentsPage.getVehicleDetailLink()).toBeDefined();
      checkoutPage.getVehicleDetailLink().then(function (vehicleDetailLink) {
        vehicleDetailLink.click();
      });
      expect(browser.driver.getCurrentUrl()).not.toContain(checkoutPage.url);
    });

    it('Clicking Payment Options & Breakdown opens Payment Options and Breakdown modal.', function () {
      preparePayments();
      var modalHeaderText = 'Payment Options & Breakdown';
      expect(checkoutPage.paymentOptionButtons.count()).toBeGreaterThan(0);
      expect(checkoutPage.getActivePaymentOptionButton()).toBeDefined();
      checkoutPage.getActivePaymentOptionButton().then(function (paymentOptionButton) {
        paymentOptionButton.click();
      });
      expect(checkoutPage.modal.isDisplayed()).toBeTruthy();
      expect(checkoutPage.getModalHeaderText()).toContain(modalHeaderText);
    });

    it('Export Summary opens payment summary for selected payments.', function () {
      // TODO: Unable to implement as I can't get the link to become active.
      // This seems to be data related as the link will be active when there's a current payment.
    });

    var preparePayments = function () {
      helper.openPageAndWait(paymentsPage.url, false, true);
      expect(browser.driver.getCurrentUrl()).toContain(paymentsPage.url);
      expect(paymentsPage.checkoutButton.isEnabled()).not.toBeTruthy();
      expect(paymentsPage.scheduleVehiclePaymentButtons.count()).toBeGreaterThan(0);
      expect(paymentsPage.getScheduleVehiclePaymentButton()).toBeDefined();
      paymentsPage.getScheduleVehiclePaymentButton().then(function (schedulePaymentButton) {
        schedulePaymentButton.click();
      });
      expect(paymentsPage.checkoutButton.isEnabled()).toBeTruthy();
      paymentsPage.checkoutButton.click();
      expect(browser.driver.getCurrentUrl()).toContain(checkoutPage.url);
    };

    afterEach(function () {
      helper.openPageAndWait(checkoutPage.url, false, false);
      checkoutPage.removePaymentButtons.each(function (removePaymentButton) {
        removePaymentButton.click();
      });
      helper.waitForElementDisplayed(checkoutPage.paymentsPageLink);
      expect(checkoutPage.paymentsPageLink.isDisplayed()).toBeTruthy();
    });

  });
});
