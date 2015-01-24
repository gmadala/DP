'use strict';
var HelperObject = require('../framework/helper_object');
var ReceiptsPage = require('../framework/receipts_page_object');
var DatepickerPageObject = require('../framework/datepicker_page_object.js');

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

    it('receipts search results should contains the correct fields.', function () {
      console.log('Validating receipts ...');
      receiptsPage.receiptsRepeater.count().then(function (count) {
        if (count <= 0) {
          console.log('No receipts found.');
          expect(receiptsPage.receiptsNoticeBox.isDisplayed()).toBeTruthy();
          expect(receiptsPage.receiptsNoticeBox.getText()).toContain('Sorry, no results found.');
        } else {
          // try filling search term to remove search results
          console.log('Multiple receipts found. Trying to validate empty receipts result.');
          receiptsPage.setSearchField('ZZ');
          receiptsPage.searchButton.click().then(function () {
            receiptsPage.receiptsRepeater.count().then(function (count) {
              if (count <= 0) {
                console.log('Receipt table is empty now.');
                helper.waitForElementPresent(receiptsPage.receiptsNoticeBox);
                expect(receiptsPage.receiptsNoticeBox.isDisplayed()).toBeTruthy();
                expect(receiptsPage.receiptsNoticeBox.getText()).toContain('Sorry, no results found.');
                receiptsPage.searchField.clear();
                receiptsPage.setSearchField('A');
                receiptsPage.searchButton.click().then(function () {
                  helper.expectingInfiniteLoading();
                });
              }
            });
          });
        }
      });
    });

    it('export receipts should contains the correct fields.', function () {
    });
  });
});

