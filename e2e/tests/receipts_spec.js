'use strict';

describe('Payments page e2e', function () {

  var receiptsPage = require('../framework/receipts_page_object.js');

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    receiptsPage.openPage();
    receiptsPage.waitForPage();
  });

  // Start of WMT-56
  it('should open receipt when clicking the receipt number link.', function () {
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(browser.getCurrentUrl()).toContain(receiptsPage.url);
    expect(receiptsPage.viewReceiptLinks.count()).toBeGreaterThan(0);
    expect(receiptsPage.getActiveViewReceiptLink()).toBeDefined();
    receiptsPage.getActiveViewReceiptLink().then(function (receiptLink) {
      receiptLink.click();
    });
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.switchTo().window(secondHandle).then(function () {
        browser.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(receiptsPage.url);
          browser.driver.close().then(function() {
            browser.switchTo().window(firstHandle);
          });
        });
      });
    });
  });

  it('should open collection of receipts when clicking the export receipts button.', function () {
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(browser.getCurrentUrl()).toContain(receiptsPage.url);
    expect(receiptsPage.addReceiptButtons.count()).toBeGreaterThan(0);
    expect(receiptsPage.getActiveAddReceiptButton()).toBeDefined();
    receiptsPage.getActiveAddReceiptButton().then(function (addReceiptButton) {
      addReceiptButton.click();
    });
    expect(receiptsPage.exportReceiptsButton.isDisplayed()).toBeTruthy();
    receiptsPage.exportReceiptsButton.click();
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.switchTo().window(secondHandle).then(function () {
        browser.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(receiptsPage.url);
          browser.driver.close().then(function() {
            browser.switchTo().window(firstHandle);
          });
        });
      });
    });
  });
  // End of WMT-56
});
