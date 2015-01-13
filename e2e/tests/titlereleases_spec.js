'use strict';

describe('Title releases page e2e', function () {

  var TitleReleasesPage = require('../framework/titlereleases_page_object.js');
  var CredentialsObject = require('../framework/credentials_page_object.js');
  var titleReleasesPage = new TitleReleasesPage();
  var credPage = new CredentialsObject();

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    titleReleasesPage.openPage();
    titleReleasesPage.waitForPage();
  });
  it('should navigate to vehicle details when vehicle description is clicked.', function () {
    expect(browser.driver.getCurrentUrl()).toContain(titleReleasesPage.url);
    expect(titleReleasesPage.vehicleDescriptionLinks.count()).toBeGreaterThan(0);
    expect(titleReleasesPage.getActiveVehicleDescriptionLink()).toBeDefined();
    titleReleasesPage.getActiveVehicleDescriptionLink().then(function (vehicleDescriptionLink) {
      vehicleDescriptionLink.click();
    });
    expect(browser.driver.getCurrentUrl()).not.toContain(titleReleasesPage.url);
  });

  it('should navigate to title release checkout when confirm requests is clicked', function () {
    expect(browser.driver.getCurrentUrl()).toContain(titleReleasesPage.url);
    expect(titleReleasesPage.confirmRequestsButton.isEnabled()).not.toBeTruthy();
    expect(titleReleasesPage.requestTitleButtons.count()).toBeGreaterThan(0);
    expect(titleReleasesPage.getActiveRequestTitleButton()).toBeDefined();
    titleReleasesPage.getActiveRequestTitleButton().then(function (requestTitleButton) {
      requestTitleButton.click();
    });
    expect(titleReleasesPage.confirmRequestsButton.isEnabled()).toBeTruthy();
    titleReleasesPage.confirmRequestsButton.click();
    expect(browser.driver.getCurrentUrl()).not.toContain(titleReleasesPage.url);
  });

  it('should open title release unavailable modal when title release unavailable link is clicked', function () {
    expect(titleReleasesPage.requestTitleUnavailableLinks.count()).toBeGreaterThan(0);
    expect(titleReleasesPage.getActiveRequestTitleUnavailableLink()).toBeDefined();
    titleReleasesPage.getActiveRequestTitleUnavailableLink().then(function (requestTitleUnavailableLink) {
      requestTitleUnavailableLink.click();
    });
    var modalHeaderText = 'Title Release Unavailable';
    expect(titleReleasesPage.modal.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.getModalHeaderText()).toContain(modalHeaderText);
  });

  //WMT-99 - Protractor test creation: Dealer Portal – Title Releases content.
  it('should for the content on Title Releases', function () {
    expect(titleReleasesPage.informationOne.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.informationTwo.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.informationThree.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.findAFloorPlan.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.filterByStatus.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.startDate.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.endDate.isDisplayed()).toBeTruthy();

    titleReleasesPage.filterByStatusOption.count().then(function (count) {
      if (count > 0) {
        expect(titleReleasesPage.filterByStatusOption.isDisplayed()).toBeTruthy();
      }
    });
  });
  it('should check for the search on the Floor Plan', function () {
    titleReleasesPage.doSearchFloorPlan(credPage.findFloorPlanVIN);
    titleReleasesPage.goToSearchButton();
    expect(titleReleasesPage.titleRelease.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.floored.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.floorDescription.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.purchased.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.releaseStatus.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.floorActions.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.filterStatusDropdown.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.startDateDropdown.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.endDateDropdown.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.searchButton.isDisplayed()).toBeTruthy();
    // check the columns
    expect(titleReleasesPage.titleReleaseReqData).toBeDefined();
    titleReleasesPage.titleReleaseReqData.count().then(function (count) {
      // if the Title Release Request have element, then it should contain the Floored, Description, Purchased, Release Status, and Actions.
      if (count > 0) { // Correct VIN number
        expect(titleReleasesPage.titleReleaseDate).toBeDefined();
        expect(titleReleasesPage.titleFlooredDays).toBeDefined();
        expect(titleReleasesPage.titleReleaseDescription).toBeDefined();
        expect(titleReleasesPage.titleReleasePurchased).toBeDefined();
        expect(titleReleasesPage.titleReleaseStatus).toBeDefined();
        expect(titleReleasesPage.titleReleaseActions).toBeDefined();
        expect(titleReleasesPage.requestTitle).toBeDefined();
      }
      else { // when the count is less than zero - incorrect VIN number
        expect(titleReleasesPage.noResultsMessage.isDisplayed()).toBeTruthy();
      }
    });
  });

  it('should check for the Request Title', function () {
    titleReleasesPage.doSearchFloorPlan(credPage.findFloorPlanVIN);
    titleReleasesPage.goToSearchButton();
    expect(titleReleasesPage.titleReleaseActions).toBeDefined();
    titleReleasesPage.goToRequestTitle();
    expect(titleReleasesPage.requestSummary.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.requestSummaryTitle.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.remainingRelease.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.totalRemainingRelease.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.titleRequest.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.vehicleDescription.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.vin.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.vinNumber.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.confirmRequest.isDisplayed()).toBeTruthy();
    expect(titleReleasesPage.cancelIcon.isDisplayed()).toBeTruthy();
    titleReleasesPage.goToCancelIcon();
  });

});
