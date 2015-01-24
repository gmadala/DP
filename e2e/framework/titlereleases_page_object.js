'use strict';

var PaymentPageObject = function () {

  this.url = '#/titlereleases';

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var searchField = this.searchField;
    browser.driver.wait(function () {
      return searchField.isPresent();
    }, 3000);
  };

  /** Locator of elements **/
  this.searchField = browser.element(by.model('activeCriteria.query'));
  // vehicle description links
  this.vehicleDescriptionLinks = browser.element.all(by.css('a.lockup-major'));
  // request title buttons
  this.requestTitleButtons = browser.element.all(by.css('.actions .btn-title-request'));
  // request title unavailable links
  this.requestTitleUnavailableLinks = browser.element.all(by.css('.actions a'));
  // export receipt button
  this.confirmRequestsButton = browser.element(by.css('.btn-cta'));

  /* WMT-99 - Content */

  this.informationOne = browser.element(by.cssContainingText('span','Titles released here are required to be returned within seven days. If you are requesting a title for state work, please '));
  this.informationTwo = browser.element(by.cssContainingText('a','chat with us'));
  this.informationThree = browser.element(by.cssContainingText('span',' or contact customer service for further assistance.'));

  this.findAFloorPlan = browser.element(by.css('.span5.form-block'));
  this.filterByStatus = browser.element(by.cssContainingText('label','Filter by Status'));
  this.startDate = browser.element(by.css('.range-start'));
  this.endDate = browser.element(by.css('.range-end'));
  this.filterByStatusOption= browser.element.all(by.options('o.value as o.label for o in filterOptions'));

  this.titleRelease = browser.element(by.cssContainingText('span','Title Release Requests'));
  this.floored = browser.element(by.cssContainingText('span','Floored'));
  this.floorDescription = browser.element(by.cssContainingText('span','Description'));
  this.purchased = browser.element(by.cssContainingText('span','Purchased'));
  this.releaseStatus = browser.element(by.cssContainingText('span','Release Status'));
  this.floorActions = browser.element(by.cssContainingText('span','Actions'));


  this.filterStatusDropdown = browser.element(by.model('activeCriteria.filter'));
  this.startDateDropdown = browser.element(by.model('activeCriteria.startDate'));
  this.endDateDropdown = browser.element(by.model('activeCriteria.endDate'));
  this.searchButton = browser.element(by.id('floorPlanSearch'));

  this.titleReleaseReqData = browser.element.all(by.repeater('item in data.results'));
  this.titleReleaseDate = browser.element.all(by.repeater('item in data.results').column('item.FlooringDate'));
  this.titleFlooredDays = browser.element.all(by.repeater('item in data.results').column('item.DaysFloored'));
  //this.titleReleaseDescription =browser.element.all(by.repeater('item in data.results').column('item.StockNumber'));
  this.titleReleaseDescription =browser.element.all(by.css('.description'));
  this.titleReleasePurchased = browser.element.all(by.repeater('item in data.results').column('item.UnitPurchaseDate'));
  this.titleReleaseStatus = browser.element.all(by.repeater('item in data.results').column('item.TitleReleaseProgramStatus'));
  this.titleReleaseActions = browser.element.all(by.repeater('item in data.results').column('item.TitleReleaseProgramStatus'));

  this.requestTitle =  browser.element.all(by.css('tr .actions button')).first();
  this.titleRequest = browser.element.all(by.css('.queue-list li p')).first();

  this.requestSummary = browser.element(by.cssContainingText('span','Requests Summary'));
  //this.requestSummaryTitle = browser.element(by.cssContainingText('span','Title Release Limits:'));
  this.requestSummaryTitle = browser.element(by.css('.well-item'));
  this.remainingRelease = browser.element(by.exactBinding('eligibility.RemainingReleasesAvailable'));
  this.totalRemainingRelease = browser.element(by.exactBinding('eligibility.TotalReleasesAllowed'));

  this.vehicleDescription = browser.element(by.css('.truncate'));
  //this.vin = browser.element(by.cssContainingText('span','VIN'));
  this.vin = browser.element.all(by.css('.queue-list li p span')).first();
  this.vinNumber = browser.element(by.exactBinding('item.UnitVIN'));

  //this.confirmRequest = browser.element(by.cssContainingText('span','Confirm Requests'));
  this.confirmRequest = browser.element(by.css('.well-footer .paired-body'));
  this.cancelIcon=  browser.element(by.css('.icon-cancel'));
  this.noResultsMessage = browser.element(by.cssContainingText('span','Sorry, no results found. Please '));

  // modal and the modal header
  this.modal = browser.element(by.css('.modal'));
  this.modalHeader = browser.element(by.css('.modal-header'));
  this.closeModal = this.modal.element(by.cssContainingText('button', 'Close'));

  /** Setter and getter for elements **/

  this.setSearchFloorPlan = function (searchVIN) {
    this.searchField.sendKeys(searchVIN);
    browser.waitForAngular();
  },

    //Doers
  this.doSearchFloorPlan = function (searchVIN) {
      this.setSearchFloorPlan(searchVIN);
      browser.waitForAngular();
    },

    //Getters
  this.getActiveVehicleDescriptionLink = function () {
      var promise = protractor.promise.defer();
      this.vehicleDescriptionLinks.each(function (vehicleDescriptionLink) {
        promise.fulfill(vehicleDescriptionLink);
      });
      return promise;
    };

  this.getActiveRequestTitleUnavailableLink = function () {
    var promise = protractor.promise.defer();
    this.requestTitleUnavailableLinks.each(function (requestTitleUnavailableLink) {
      promise.fulfill(requestTitleUnavailableLink);
    });
    return promise;
  };

  this.getActiveRequestTitleButton = function () {
    var promise = protractor.promise.defer();
    this.requestTitleButtons.each(function (requestTitleButton) {
      promise.fulfill(requestTitleButton);
    });
    return promise;
  };

  this.getModalHeaderText = function () {
    return this.modalHeader.getText();
  };

  this.goToSearchButton = function(){
    this.searchButton.click();
  };

  this.goToRequestTitle = function(){
    this.requestTitle.click();

  };
  this.goToCancelIcon= function(){
    this.cancelIcon.click();
  };

};

module.exports = PaymentPageObject;
