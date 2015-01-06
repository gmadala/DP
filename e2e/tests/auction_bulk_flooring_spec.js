'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionBulkFlooringObject = require('../framework/auction_bulk_flooring_object');

var auctionHelper = new AuctionHelperObject();
var auctionBulkFlooring = new AuctionBulkFlooringObject();

auctionHelper.describe('WMT-76', function () {
  describe('Auction Portal – Floor A Vehicle Content', function () {

    beforeEach(function () {
      auctionBulkFlooring.openPage();
      auctionBulkFlooring.waitForPage();
    });

    xit('Should contain VIN, Color, Mileage, Title Owner, Consigner Ticket Number, and Lot Number', function () {
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

    xit('Should contains Acknowledge VIN Look-Up Failure when a VIN search fails.', function () {
      var vinValue = '123456';
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function(vinSearchButton) {
        vinSearchButton.click();
      });
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
    });

    xit('Should not contains Acknowledge VIN Look-Up Failure before, when and after entering VIN.', function () {
      var vinValue = '123456';
      var otherVinValue = '0';
      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function(vinSearchButton) {
        vinSearchButton.click();
      });
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
      auctionBulkFlooring.setVin(otherVinValue);
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    });

    xit('Should contain unlocked Make, Model, Year, and Style after searching invalid VIN.', function () {
      var vinValue = '123456';
      // all the outputs should not be displayed
      expect(auctionBulkFlooring.outputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isPresent()).not.toBeTruthy();
      // all the inputs should not be displayed as well
      expect(auctionBulkFlooring.inputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isPresent()).not.toBeTruthy();

      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click();
      });

      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
      // when the lookup fail, then the output should not be displayed
      expect(auctionBulkFlooring.outputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isPresent()).not.toBeTruthy();
      // when the lookup fail, then the inputs should be displayed
      expect(auctionBulkFlooring.inputMake.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isDisplayed()).toBeTruthy();
    });

    xit('Should contain locked Make, Model, Year, and Style after searching valid VIN.', function () {
      var otherVinValue = '1234567';
      // all the outputs should not be displayed
      expect(auctionBulkFlooring.outputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isPresent()).not.toBeTruthy();
      // all the inputs should not be displayed as well
      expect(auctionBulkFlooring.inputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isPresent()).not.toBeTruthy();

      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(otherVinValue);
      auctionBulkFlooring.setVin(otherVinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(otherVinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click();
      });
      // when lookup succeed, then output should be displayed but disabled for editing
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputMake.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputMake.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isEnabled()).not.toBeTruthy();
      // when the lookup fail, then the input should not be displayed
      expect(auctionBulkFlooring.inputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isPresent()).not.toBeTruthy();
    });

    xit('Should not contain unlocked Make, Model, Year, and Style before or when entering VIN.', function () {
      var vinValue = '123456';
      var otherVinValue = '1234567';
      expect(auctionBulkFlooring.inputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isPresent()).not.toBeTruthy();

      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click();
      });

      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputMake.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isDisplayed()).toBeTruthy();

      // entering extra information in the vin should remove the input elements
      auctionBulkFlooring.setVin(otherVinValue);
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.inputStyle.isPresent()).not.toBeTruthy();
    });

    xit('Should not contain locked Make, Model, Year, and Style before or when entering VIN.', function () {
      var vinValue = '1234567';
      var otherVinValue = '123456';
      expect(auctionBulkFlooring.outputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isPresent()).not.toBeTruthy();

      expect(auctionBulkFlooring.vinSearchField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.getVin()).not.toEqual(vinValue);
      auctionBulkFlooring.setVin(vinValue);
      expect(auctionBulkFlooring.getVin()).toEqual(vinValue);
      auctionBulkFlooring.getVinSearchButton().then(function (vinSearchButton) {
        vinSearchButton.click();
      });

      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputMake.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.outputMake.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isEnabled()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isEnabled()).not.toBeTruthy();

      // entering extra information in the vin should remove the output elements
      auctionBulkFlooring.setVin(otherVinValue);
      expect(auctionBulkFlooring.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputMake.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputModel.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputYear.isPresent()).not.toBeTruthy();
      expect(auctionBulkFlooring.outputStyle.isPresent()).not.toBeTruthy();
    });

    it('Should contains Buyer Search, Inventory Address, Purchase Amount, Sales Date and Bank Account.', function () {
      var buyerQuery = 'Buyer Query';
      expect(auctionBulkFlooring.buyerQueryField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getBuyerQuery()).not.toEqual(buyerQuery);
      auctionBulkFlooring.setBuyerQuery(buyerQuery);
      expect(auctionBulkFlooring.getBuyerQuery()).toEqual(buyerQuery);
      auctionBulkFlooring.waitAndCloseModal();

      var unitPurchasePrice = '500';
      expect(auctionBulkFlooring.unitPurchasePriceField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getUnitPurchasePrice()).not.toEqual(unitPurchasePrice);
      auctionBulkFlooring.setUnitPurchasePrice(unitPurchasePrice);
      expect(auctionBulkFlooring.getUnitPurchasePrice()).toEqual(unitPurchasePrice);
      auctionBulkFlooring.waitAndCloseModal();

      var unitPurchaseDate = '11/11/2014';
      expect(auctionBulkFlooring.unitPurchaseDateField.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.getUnitPurchaseDate()).not.toEqual(unitPurchaseDate);
      auctionBulkFlooring.setUnitPurchaseDate(unitPurchaseDate);
      expect(auctionBulkFlooring.getUnitPurchaseDate()).toEqual(unitPurchaseDate);
      auctionBulkFlooring.waitAndCloseModal();

      expect(auctionBulkFlooring.bankAccountSelection.isDisplayed()).toBeTruthy();
      expect(auctionBulkFlooring.inventoryLocationSelection.isDisplayed()).toBeTruthy();
    });

    it('Should contain a note associated with the sales along with a tooltip describing the note.', function () {
      expect(auctionBulkFlooring.saleDescriptionText.isDisplayed()).toBeTruthy();
      browser.driver.actions().mouseMove(auctionBulkFlooring.tooltipButton).perform();
      // now we wait for the delay of the tooltip before we check if the tooltip is actually gets displayed
      browser.driver.wait(function() {
        return auctionBulkFlooring.tooltip.isPresent();
      }, 3000);
      expect(auctionBulkFlooring.tooltip.isDisplayed()).toBeTruthy();
    });
  });
});
