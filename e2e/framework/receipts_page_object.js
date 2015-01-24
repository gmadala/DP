'use strict';

var ReceiptPageObject = function () {

  this.url = '#/receipts';

  /** Locator of elements **/
  this.searchField = browser.element(by.model('activeCriteria.query'));
  this.searchFilterSelection = browser.element(by.model('activeCriteria.filter'));
  this.searchEndDateField = browser.element(by.model('activeCriteria.endDate'));
  this.searchStartDateField = browser.element(by.model('activeCriteria.startDate'));

  this.searchFilterOptions = browser.element.all(by.options('o.value as o.label for o in filterOptions'));

  this.searchButton = browser.element(by.css('button.btn-input'));
  this.clearSearchButton = browser.element(by.css('button.clear-search'));

  this.receipts = browser.element(by.css('table'));
  this.receiptRows = this.receipts.all(by.css('tr'));
  this.receiptsRepeater = browser.element.all(by.repeater('receipt in receipts.results'));
  this.receiptsHeader = ['Payment Date', 'Receipt No.', 'Payment Description', 'Amount', 'Export Receipt(s)'];
  this.receiptsNoticeBox = browser.element(by.cssContainingText('.notice-box', 'Sorry, no results found'));

  // view receipt links
  this.viewReceiptLinks = this.receipts.all(by.css('a'));
  // add receipt buttons
  this.addReceiptButtons = browser.element.all(by.cssContainingText('button', 'Add Receipt'));
  // remove receipt buttons
  this.removeReceiptButtons = browser.element.all(by.cssContainingText('button', 'Remove Receipt'));
  // export receipt button
  this.exportReceiptsButton = browser.element(by.cssContainingText('button', 'Export Receipt'));

  /** Setter and getter for elements **/
  var getContents = function (tableElement, headerNames) {
    var promise = protractor.promise.defer();
    // ensure that the header equals to all('th').getText()
    expect(tableElement.all(by.css('th')).getText()).toEqual(headerNames);

    var counter = 0;
    var contents = [];
    var rows = tableElement.all(by.css('tr'));
    rows.count().then(function (count) {
      rows.each(function (row) {
        var cells = row.all(by.css('td'));
        cells.each(function (cell) {
          cell.getText().then(function (cellText) {
            contents.push(cellText);
            counter++;
            // all(by.css('tr')) will include tr for header,
            // but we don't want to count it in.
            if (counter >= (count - 1) * headerNames.length) {
              promise.fulfill(contents);
            }
          });
        });
      });
    });
    return promise;
  };

  this.formattedDataFromRepeater = function (repeater, column) {
    return browser.element.all(by.repeater(repeater).column(column)).map(function (element) {
      return element.getText();
    });
  };

  this.unformattedDataFromRepeater = function (repeater, column) {
    return browser.element.all(by.repeater(repeater)).map(function (element) {
      return element.evaluate(column);
    });
  };

  this.getReceiptContent = function () {
    return getContents(this.receipts, this.receiptsHeader);
  };

  this.setSearchField = function (searchString) {
    this.searchField.sendKeys(searchString);
  };

  this.getSearchField = function () {
    return this.searchField.getAttribute('value');
  };

  this.setFilterOption = function (optionName) {
    this.searchFilterOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === optionName) {
          option.click();
        }
      });
    });
  };

  this.getFilterOption = function () {
    var promise = protractor.promise.defer();
    this.searchFilterOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          promise.fulfill(option.getText());
        }
      });
    });
    return promise;
  };

  this.clickSearchEndDate = function () {
    this.searchEndDateField.click();
  };

  this.getSearchEndDate = function () {
    return this.searchEndDateField.getAttribute('value');
  };

  this.clickSearchStartDate = function () {
    this.searchStartDateField.click();
  };

  this.getSearchStartDate = function () {
    return this.searchStartDateField.getAttribute('value');
  };

  var firstElement = function (elementList) {
    return elementList.count().then(function (count) {
      if (count > 0) {
        return elementList.first();
      }
    });
  };

  this.getActiveViewReceiptLink = function () {
    return firstElement(this.viewReceiptLinks);
  };

  this.getActiveAddReceiptButton = function () {
    return firstElement(this.addReceiptButtons);
  };
};

module.exports = ReceiptPageObject;
