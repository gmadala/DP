'use strict';
var HelperObject = require('../../framework/helper_object');
var ReceiptsPage = require('../../framework/receipts_page_object');
var DatepickerPageObject = require('../../framework/datepicker_page_object.js');

var helper = new HelperObject();
var receiptsPage = new ReceiptsPage();
var datepickerPage = new DatepickerPageObject();

helper.describe('WMT-56', function () {
  describe('Dealer Portal Receipts Navigation', function () {
    beforeEach(function () {
      helper.openPageAndWait(receiptsPage.url, false, true);
    });

    // Start of WMT-56
    it('should open receipt when clicking the receipt number link.', function () {
      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(1);
      });
      expect(browser.driver.getCurrentUrl()).toContain(receiptsPage.url);
      expect(receiptsPage.viewReceiptLinks.count()).toBeGreaterThan(0);
      expect(receiptsPage.getActiveViewReceiptLink()).toBeDefined();
      receiptsPage.getActiveViewReceiptLink().then(function (receiptLink) {
        receiptLink.click();
      });
      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(2);
        var firstHandle = handles[0];
        var secondHandle = handles[1];
        browser.driver.switchTo().window(secondHandle).then(function () {
          browser.driver.executeScript('return window.location.href').then(function (url) {
            expect(url).not.toContain(receiptsPage.url);
            browser.driver.close().then(function () {
              browser.driver.switchTo().window(firstHandle);
            });
          });
        });
      });
    });

    it('should open collection of receipts when clicking the export receipts button.', function () {
      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(1);
      });
      expect(browser.driver.getCurrentUrl()).toContain(receiptsPage.url);
      expect(receiptsPage.exportReceiptsButton.isEnabled()).not.toBeTruthy();
      expect(receiptsPage.addReceiptButtons.count()).toBeGreaterThan(0);
      expect(receiptsPage.getActiveAddReceiptButton()).toBeDefined();
      receiptsPage.getActiveAddReceiptButton().then(function (addReceiptButton) {
        addReceiptButton.click();
      });
      expect(receiptsPage.exportReceiptsButton.isEnabled()).toBeTruthy();
      receiptsPage.exportReceiptsButton.click();
      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(2);
        var firstHandle = handles[0];
        var secondHandle = handles[1];
        browser.driver.switchTo().window(secondHandle).then(function () {
          browser.driver.executeScript('return window.location.href').then(function (url) {
            expect(url).not.toContain(receiptsPage.url);
            browser.driver.close().then(function () {
              browser.driver.switchTo().window(firstHandle);
            });
          });
        });
      });
    });
    // End of WMT-56
  });
});

helper.describe('WMT-91', function () {
  describe('Dealer Portal – Receipts Content.', function () {
    beforeEach(function () {
      helper.openPageAndWait(receiptsPage.url, false, true);
    });

    it('receipt search contains search, filter, start date and end date.', function () {
      expect(receiptsPage.searchField.isDisplayed()).toBeTruthy();
      var searchString = 'Example search object!';
      receiptsPage.setSearchField(searchString);
      expect(receiptsPage.getSearchField()).toEqual(searchString);

      // filter section
      expect(receiptsPage.searchFilterSelection.isDisplayed()).toBeTruthy();
      expect(receiptsPage.getFilterOption()).toEqual('View All');
      receiptsPage.setFilterOption('ACH');
      expect(receiptsPage.getFilterOption()).toEqual('ACH');

      expect(receiptsPage.searchStartDateField.isDisplayed()).toBeTruthy();
      expect(receiptsPage.searchEndDateField.isDisplayed()).toBeTruthy();

      receiptsPage.setFilterOption('Check');
      expect(receiptsPage.getFilterOption()).toEqual('Check');

      // search start and end date
      receiptsPage.clickSearchStartDate();
      expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
      datepickerPage.setDate(30, 'Dec', 2001);
      expect(receiptsPage.getSearchStartDate()).toEqual('12/30/2001');

      receiptsPage.clickSearchEndDate();
      expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
      datepickerPage.setDate(28, 'Jan', 2011);
      expect(receiptsPage.getSearchEndDate()).toEqual('01/28/2011');

      // search button and clear search link
      expect(receiptsPage.searchButton.isDisplayed()).toBeTruthy();
      expect(receiptsPage.clearSearchButton.isDisplayed()).toBeTruthy();
    });

    it('should display information message when receipts table is empty.', function () {
      receiptsPage.receiptRows.count().then(function (count) {
        if (count <= 1) {
          console.log('No receipts found.');
          expect(receiptsPage.receiptsNoticeBox.isDisplayed()).toBeTruthy();
          expect(receiptsPage.receiptsNoticeBox.getText()).toContain('Sorry, no results found.');
        }
      });
    });

    it('receipts search results should contains the correct fields.', function () {
      receiptsPage.receiptRows.count().then(function (count) {
        if (count > 1) {
          receiptsPage.receiptRows.count().then(function (newCount) {
            count = newCount - 1;
          }).then(function () {
            receiptsPage.getReceiptContent().then(function (contents) {
              expect(contents.length).toEqual(count * receiptsPage.receiptsHeader.length);

              var repeater = 'receipt in receipts.results';
              var columnCount = receiptsPage.receiptsHeader.length;

              // Payment Date data contains: the payment date, and the payment status.
              var paymentDates, nsfReceipts, voidedReceipts;
              receiptsPage.formattedDataFromRepeater(repeater, 'receipt.CreateDate').then(function (rawData) {
                paymentDates = rawData;
              }).then(function () {
                receiptsPage.unformattedDataFromRepeater(repeater, 'receipt.IsVoided').then(function (rawData) {
                  voidedReceipts = rawData;
                });
              }).then(function () {
                receiptsPage.unformattedDataFromRepeater(repeater, 'receipt.IsNsf').then(function (rawData) {
                  nsfReceipts = rawData;
                });
              }).then(function () {
                expect(count).toEqual(nsfReceipts.length);
                expect(count).toEqual(paymentDates.length);
                expect(count).toEqual(voidedReceipts.length);
                for (var i = 0; i < count; i++) {
                  var nsfReceipt = nsfReceipts[i];
                  var paymentDate = paymentDates[i];
                  var voidedReceipt = voidedReceipts[i];
                  var content = contents[i * columnCount];
                  expect(content).toContain(paymentDate);
                  if (nsfReceipt) {
                    expect(content).toContain('Insufficient Funds');
                  } else if (voidedReceipt) {
                    expect(content).toContain('Voided');
                  } else {
                    expect(content).toContain('Processed');
                  }
                }
                console.log('    validating first column of the receipt grid. - pass');
              });

              // Receipt No. data contains: the receipt number.
              var transactionNumbers;
              receiptsPage.unformattedDataFromRepeater(repeater, 'receipt.TransactionNumber').then(function (rawData) {
                transactionNumbers = rawData;
              }).then(function () {
                expect(count).toEqual(transactionNumbers.length);
                for (var i = 0; i < transactionNumbers.length; i++) {
                  var transactionNumber = transactionNumbers[i];
                  var content = contents[i * columnCount + 1];
                  expect(content).toContain(transactionNumber);
                }
                console.log('    validating second column of the receipt grid. - pass');
              });

              // Payment Description data always contains: the payment method, and the payee description.
              // When the payment was made by check the Payment Description data also contains: Check Number.
              var paymentMethods, checkNumbers, payeeDescriptions;
              receiptsPage.formattedDataFromRepeater(repeater, 'receipt.PaymentMethod').then(function (rawData) {
                paymentMethods = rawData;
              }).then(function () {
                receiptsPage.unformattedDataFromRepeater(repeater, 'receipt.CheckNumber').then(function (rawData) {
                  checkNumbers = rawData;
                });
              }).then(function () {
                receiptsPage.formattedDataFromRepeater(repeater, 'receipt.PayeeDescription').then(function (rawData) {
                  payeeDescriptions = rawData;
                });
              }).then(function () {
                expect(count).toEqual(paymentMethods.length);
                expect(count).toEqual(checkNumbers.length);
                expect(count).toEqual(payeeDescriptions.length);
                for (var i = 0; i < count; i++) {
                  var paymentMethod = paymentMethods[i];
                  var checkNumber = checkNumbers[i];
                  var payeeDescription = payeeDescriptions[i];
                  var content = contents[i * columnCount + 2];
                  expect(content).toContain(paymentMethod);
                  expect(content).toContain(payeeDescription);
                  if (checkNumber) {
                    expect(content).toContain(checkNumber);
                  }
                }
                console.log('    validating third column of the receipt grid. - pass');
              });

              // Amount data contains: the Amount of the payment.
              var paymentAmounts;
              receiptsPage.formattedDataFromRepeater(repeater, 'receipt.AmountProvided').then(function (rawData) {
                paymentAmounts = rawData;
              }).then(function () {
                expect(count).toEqual(paymentAmounts.length);
                for (var i = 0; i < paymentAmounts.length; i++) {
                  var paymentAmount = paymentAmounts[i];
                  var content = contents[i * columnCount + 3];
                  expect(content).toContain(paymentAmount);
                }
                console.log('    validating fourth column of the receipt grid. - pass');
              });
            });
          });
        }
      });
    });

    it('export receipts should contains the correct fields.', function () {
    });
  });
});

