'use strict';

var DatepickerObject = require('../framework/datepicker_page_object.js');
var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionBulkFlooringObject = require('../framework/auction_bulk_flooring_object');

var datepicker = new DatepickerObject();
var auctionHelper = new AuctionHelperObject();
var auctionBulkFlooring = new AuctionBulkFlooringObject();

auctionHelper.describe('WMT-76', function () {
  describe('Auction Portal – Floor A Vehicle Content', function () {

    beforeEach(function () {
      auctionHelper.openPageAndWait(auctionBulkFlooring.url);
    });

    it('Should contain VIN, Color, Mileage, Title Owner, Consigner Ticket Number, and Lot Number', function () {
      // validate elements are displayed, readable and writable
      var vinValue = 'VIN 123456';
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);

      var colorValue = 'Black';
      expect(auctionBulkFlooring.colorSelection.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getColor()).not.toEqual(colorValue);
      auctionBulkFlooring.setColor(colorValue);
      expect(auctionBulkFlooring.getColor()).toEqual(colorValue);

      var mileageValue = 'Mileage 123456';
      expect(auctionBulkFlooring.mileageField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getMileage()).not.toEqual(mileageValue);
      auctionBulkFlooring.setMileage(mileageValue);
      expect(auctionBulkFlooring.getMileage()).toEqual(mileageValue);

      var titleLocation = 'I Have It';
      expect(auctionBulkFlooring.titleLocationSelection.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getTitleLocation()).not.toEqual(titleLocation);
      auctionBulkFlooring.setTitleLocation(titleLocation);
      expect(auctionBulkFlooring.getTitleLocation()).toEqual(titleLocation);

      var consignerTicketNumber = 'Consigner 123456';
      expect(auctionBulkFlooring.consignerTicketNumberField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getConsignerTicketNumber()).not.toEqual(consignerTicketNumber);
      auctionBulkFlooring.setConsignerTicketNumber(consignerTicketNumber);
      expect(auctionBulkFlooring.getConsignerTicketNumber()).toEqual(consignerTicketNumber);

      var lotNumber = 'Lot 123456';
      expect(auctionBulkFlooring.lotNumberField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getLotNumber()).not.toEqual(lotNumber);
      auctionBulkFlooring.setLotNumber(lotNumber);
      expect(auctionBulkFlooring.getLotNumber()).toEqual(lotNumber);
    });

    it('Should contains Acknowledge VIN Look-Up Failure when a VIN search fails.', function () {
      var vinValue = browser.params.invalidVin.toString();
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click().then(function () {
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
        });
      });
    });

    it('Should not contains Acknowledge VIN Look-Up Failure before, when and after entering VIN.', function () {
      var vinValue = browser.params.invalidVin.toString();
      var otherVinValue = '0';
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click().then(function () {
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
          auctionBulkFlooring.setVin(otherVinValue);
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
        });
      });
    });

    /** validations function to validate make, model, year and style **/
    var validateInputIsNotPresent = function () {
      expect(auctionBulkFlooring.inputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isPresent()).not.toBeTruthy();
    };

    var validateOutputNotPresent = function () {
      expect(auctionBulkFlooring.outputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isPresent()).not.toBeTruthy();
    };

    var validateInputIsDisplayed = function () {
      expect(auctionBulkFlooring.inputMake.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isDisplayed()).toBeTruthy();
    };

    var validateOutputIsDisplayedAndDisabled = function () {
      expect(auctionBulkFlooring.outputMake.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputMake.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isEnabled()).not.toBeTruthy();
    };

    it('Should contain unlocked Make, Model, Year, and Style after searching invalid VIN.', function () {
      var vinValue = browser.params.invalidVin.toString();
      // all the outputs should not be displayed
      validateOutputNotPresent();
      // all the inputs should not be displayed as well
      validateInputIsNotPresent();
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click().then(function () {
          // wait for the data to populate
          auctionHelper.waitForElementPresent(auctionBulkFlooring.inputMake);
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
          // when the lookup fail, then the output should not be displayed
          validateOutputNotPresent();
          // when the lookup fail, then the inputs should be displayed
          validateInputIsDisplayed();
        });
      });
    });

    it('Should contain locked Make, Model, Year, and Style after searching valid VIN.', function () {
      var otherVinValue = browser.params.validVin.toString();
      // all the outputs should not be displayed
      validateOutputNotPresent();
      // all the inputs should not be displayed as well
      validateInputIsNotPresent();
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(otherVinValue);
      auctionBulkFlooring.setVin(otherVinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(otherVinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click().then(function () {
          // wait for the data to populate
          auctionHelper.waitForElementPresent(auctionBulkFlooring.outputMake);
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
          // when lookup succeed, then output should be displayed but disabled for editing
          validateOutputIsDisplayedAndDisabled();
          // when the lookup fail, then the input should not be displayed
          validateInputIsNotPresent();
        });
      });
    });

    it('Should not contain unlocked Make, Model, Year, and Style before or when entering VIN.', function () {
      var vinValue = browser.params.invalidVin.toString();
      var otherVinValue = '1234567';
      validateInputIsNotPresent();
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click().then(function () {
          // wait for the data to populate
          auctionHelper.waitForElementPresent(auctionBulkFlooring.inputMake);
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
          validateInputIsDisplayed();
          // entering extra information in the vin should remove the input elements
          auctionBulkFlooring.setVin(otherVinValue);
          validateInputIsNotPresent();
        });
      });
    });

    it('Should not contain locked Make, Model, Year, and Style before or when entering VIN.', function () {
      var vinValue = browser.params.validVin.toString();
      var otherVinValue = '123456';
      validateOutputNotPresent();
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click().then(function () {
          // wait for the data to populate
          auctionHelper.waitForElementPresent(auctionBulkFlooring.outputMake);
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
          validateOutputIsDisplayedAndDisabled();
          // entering extra information in the vin should remove the output elements
          auctionBulkFlooring.setVin(otherVinValue);
          expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
          validateOutputNotPresent();
        });
      });
    });

    it('Should contains Buyer Search, Inventory Address, Purchase Amount, Sales Date and Bank Account.', function () {
      var buyerQuery = 'Buyer Query';
      expect(auctionBulkFlooring.buyerQueryField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getBuyerQuery()).not.toEqual(buyerQuery);
      auctionBulkFlooring.setBuyerQuery(buyerQuery);
      // this will trigger the modal based on the search buyer string
      auctionBulkFlooring.setBuyerQuery(protractor.Key.TAB);
      // we should wait and then close the modal
      // TODO: Maybe this should be a wait and select one buyer function
      auctionBulkFlooring.waitAndCloseModal();
      expect(auctionBulkFlooring.getBuyerQuery()).toEqual(buyerQuery);

      var unitPurchasePrice = '500';
      expect(auctionBulkFlooring.unitPurchasePriceField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getUnitPurchasePrice()).not.toEqual(unitPurchasePrice);
      auctionBulkFlooring.setUnitPurchasePrice(unitPurchasePrice);
      expect(auctionBulkFlooring.getUnitPurchasePrice()).toEqual(unitPurchasePrice);

      var unitPurchaseDate = '10/11/2002';
      expect(auctionBulkFlooring.unitPurchaseDateField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getUnitPurchaseDate()).not.toEqual(unitPurchaseDate);
      auctionBulkFlooring.unitPurchaseDateField.click();
      expect(datepicker.datepicker.isDisplayed()).toBeTruthy();
      datepicker.setDate(11, 'Oct', 2002);
      expect(auctionBulkFlooring.getUnitPurchaseDate()).toEqual(unitPurchaseDate);

      expect(auctionBulkFlooring.bankAccountSelection.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inventoryLocationSelection.isDisplayed()).toBeTruthy();
    });

    it('Should contain a note associated with the sales along with a tooltip describing the note.', function () {
      expect(auctionBulkFlooring.saleDescriptionText.isDisplayed()).toBeTruthy();
      browser.driver.actions().mouseMove(auctionBulkFlooring.tooltipButton).perform();
      // now we wait for the delay of the tooltip before we check if the tooltip is actually gets displayed
      browser.driver.wait(function () {
        return auctionBulkFlooring.tooltip.isPresent();
      });
      expect(auctionBulkFlooring.tooltip.isDisplayed()).toBeTruthy();
    });
  });
});
