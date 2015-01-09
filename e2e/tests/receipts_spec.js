'use strict';

describe('Receipts page e2e', function () {

  var ReceiptsPage = require('../framework/receipts_page_object.js');

  var receiptsPage = new ReceiptsPage();

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
