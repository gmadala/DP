'use strict';

var HelperObject = require('../framework/helper_object');
var PaymentsPageObject = require('../framework/payments_page_object.js');
var CheckoutPageObject = require('../framework/checkout_page_object.js');
var DatepickerPageObject = require('../framework/datepicker_page_object.js');

var helper = new HelperObject();
var paymentsPage = new PaymentsPageObject();
var checkoutPage = new CheckoutPageObject();
var datepickerPage = new DatepickerPageObject();

helper.describe('WMT-53', function () {
  describe('Dealer Portal Payments Navigation', function () {
    beforeEach(function () {
      helper.openPageAndWait(paymentsPage.url, false, true);
    });

    xit('should open request extension modal when request extension is clicked', function () {
      expect(paymentsPage.requestExtensionLinks.count()).toBeGreaterThan(0);
      expect(paymentsPage.getActiveRequestExtensionLink()).toBeDefined();
      paymentsPage.getActiveRequestExtensionLink().then(function (requestExtensionLink) {
        requestExtensionLink.click().then(function () {
          helper.waitForElementDisplayed(helper.modal);
          var modalHeaderText = 'Request Extension';
          expect(paymentsPage.modal.isDisplayed()).toBeTruthy();
          expect(paymentsPage.getModalHeaderText()).toEqual(modalHeaderText);
          paymentsPage.closeModal.click().then(function () {
            helper.waitForElementDismissed(helper.modal);
          });
        });
      });
    });

    xit('should navigate to vehicle details when vehicle description is clicked', function () {
      expect(browser.driver.getCurrentUrl()).toContain(paymentsPage.url);
      paymentsPage.vehicleDetailLinks.count().then(function (count) {
        if (count > 0) {
          expect(paymentsPage.vehicleDetailLinks.count()).toBeGreaterThan(0);
          expect(paymentsPage.getActiveVehicleDetailLink()).toBeDefined();
          paymentsPage.getActiveVehicleDetailLink().then(function (vehicleDetailLink) {
            vehicleDetailLink.click().then(function () {
              helper.waitForUrlToContains('vehicle');
              expect(browser.driver.getCurrentUrl()).not.toContain(paymentsPage.url);
            });
          });
        }
      });
    });

    xit('should navigate to checkout when checkout is clicked', function () {
      expect(browser.driver.getCurrentUrl()).toContain(paymentsPage.url);
      expect(paymentsPage.checkoutButton.isEnabled()).not.toBeTruthy();
      paymentsPage.schedulePaymentButtons.count().then(function (count) {
        if (count > 0) {
          expect(paymentsPage.schedulePaymentButtons.count()).toBeGreaterThan(0);
          expect(paymentsPage.getActiveSchedulePaymentButton()).toBeDefined();
          paymentsPage.schedulePaymentButtons.first().click().then(function () {
            expect(paymentsPage.checkoutButton.isEnabled()).toBeTruthy();
            paymentsPage.checkoutButton.click().then(function () {
              helper.waitForUrlToContains('checkout');
              expect(browser.driver.getCurrentUrl()).toContain(checkoutPage.url);
            });
          });
        }
      });
    });

    xit('should open cancel payment modal when unschedule link is clicked', function () {
      paymentsPage.unschedulePaymentButtons.count().then(function (count) {
        if (count > 0) {
          expect(paymentsPage.getActiveUnschedulePaymentButton()).toBeDefined();
          paymentsPage.getActiveUnschedulePaymentButton().then(function (unschedulePaymentButton) {
            unschedulePaymentButton.click().then(function () {
              helper.waitForElementDisplayed(helper.modal);
              var modalHeaderText = 'Cancel';
              expect(paymentsPage.modal.isDisplayed()).toBeTruthy();
              expect(paymentsPage.getModalHeaderText()).toContain(modalHeaderText);
              paymentsPage.closeModal.click().then(function () {
                helper.waitForElementDismissed(helper.modal);
              });
            });
          });
        }
      });
    });
  });
})
;

helper.describe('WMT-106', function () {
  describe('Dealer Portal Payments Content.', function () {
    beforeEach(function () {
      helper.openPageAndWait(paymentsPage.url, false, true);
    });

    xit('should validate payments page object is accessing the correct fields.', function () {
      expect(paymentsPage.searchField.isDisplayed()).toBeTruthy();
      expect(paymentsPage.searchFilterSelection.isDisplayed()).toBeTruthy();
      expect(paymentsPage.getInventoryLocation()).toBeDefined();
      paymentsPage.getInventoryLocation().then(function (inventoryLocation) {
        expect(inventoryLocation.isDisplayed()).toBeTruthy();
      });

      expect(paymentsPage.searchButton.isDisplayed()).toBeTruthy();
      expect(paymentsPage.clearSearchButton.isDisplayed()).toBeTruthy();
    });

    xit('should validate payments page object is accessing the correct option fields.', function () {
      expect(paymentsPage.searchFilterOptions.count()).toEqual(4);
      // filter only gets displayed if the options is more than 2
      paymentsPage.getInventoryLocation().then(function (inventoryLocation) {
        inventoryLocation.isDisplayed().then(function (displayed) {
          if (displayed) {
            expect(inventoryLocation.options.length).toBeGreaterThan(1);
          }
        });
      });
    });

    xit('should validate payments page object is accessing the correct range fields.', function () {
      expect(paymentsPage.searchStartDateField.isDisplayed()).not.toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).not.toBeTruthy();
    });

    xit('should validate payments page object is accessing the correct error message.', function () {
      expect(paymentsPage.errorMessage.isDisplayed()).not.toBeTruthy();
    });

    xit('should display start date and end date when filter option selected is by date range.', function () {
      expect(paymentsPage.getFilterOption()).toEqual('View All');
      paymentsPage.setFilterOption('Date Range');
      expect(paymentsPage.getFilterOption()).toEqual('Date Range');

      expect(paymentsPage.searchStartDateField.isDisplayed()).toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).toBeTruthy();

      paymentsPage.setFilterOption('Due Today');
      expect(paymentsPage.getFilterOption()).toEqual('Due Today');

      expect(paymentsPage.searchStartDateField.isDisplayed()).not.toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).not.toBeTruthy();
    });

    xit('should allow setting start date and end date using datepicker.', function () {
      paymentsPage.setFilterOption('Date Range');

      expect(paymentsPage.searchStartDateField.isDisplayed()).toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).toBeTruthy();

      paymentsPage.clickSearchStartDate();
      expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
      datepickerPage.setDate(30, 'Dec', 2001);
      expect(paymentsPage.getSearchStartDate()).toEqual('12/30/2001');

      paymentsPage.clickSearchEndDate();
      expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
      datepickerPage.setDate(28, 'Jan', 2011);
      expect(paymentsPage.getSearchEndDate()).toEqual('01/28/2011');
    });

    xit('should verify that user is able to enter text in search field.', function () {
      var searchString = 'Example search object!';
      paymentsPage.setSearchField(searchString);
      expect(paymentsPage.getSearchField()).toEqual(searchString);
    });

    xit('should verify that search field have the correct watermark.', function () {
      var watermark = 'By Stock #, VIN, or Description';
      expect(paymentsPage.searchField.getAttribute('placeholder')).toEqual(watermark);
    });

    it('should contains account fees element', function () {
      paymentsPage.accountFeeRepeater.count().then(function (count) {
        if (count <= 0) {
          expect(paymentsPage.accountFeeSection.isDisplayed()).toBeFalsy();
        } else {
          expect(paymentsPage.accountFeeSection.isDisplayed()).toBeTruthy();
          paymentsPage.getAccountFeesContent().then(function (contents) {

          });
        }
      });
    });
  });
});
