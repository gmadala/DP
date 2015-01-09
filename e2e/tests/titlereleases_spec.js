'use strict';

describe('Title releases page e2e', function () {

  var TitleReleasesPage = require('../framework/titlereleases_page_object.js');
  var titleReleasesPage = new TitleReleasesPage();

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
});
