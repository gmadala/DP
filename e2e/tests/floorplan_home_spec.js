/**
 * Created by gayathrimadala on 12/29/14.
 */
'use strict';

var FloorPlanObject = require('../framework/floorplan_page_object.js');
var CredentialsObject = require('../framework/credentials_page_object.js');

var floorPlanPage = new FloorPlanObject();
var credPage = new CredentialsObject();

//Floor Plan Page
describe('Dealer Portal Floor Plan Page', function () {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(floorPlanPage.floorPlanUrl);
    floorPlanPage.waitForPage;
  });

  it('should find a floor plan - search on VIN', function () {
    floorPlanPage.doSearchFloorPlan(credPage.findFloorPlanVIN);
    floorPlanPage.goToFloorPlanSearch();
  });
  it('should find a floor plan - search i/p fields', function () {
    expect(browser.getCurrentUrl()).toContain(floorPlanPage.floorPlanUrl);
    expect(floorPlanPage.floorPlanLinks.count()).toBeGreaterThan(0);
    floorPlanPage.goToFlooringStatus();
    floorPlanPage.doStartDate(credPage.floorPlanStartDate);
    floorPlanPage.doEndDate(credPage.floorPlanEndDate);
    //floorPlanPage.goToInvLocSelect();
  });
  it('should validate Floor Plan page object is accessing the correct fields.', function () {
    expect(floorPlanPage.searchFloorPlan.isDisplayed()).toBeTruthy();
    expect(floorPlanPage.getInventoryLocation()).toBeDefined();
    expect(floorPlanPage.invLocationsOptions.count()).toBeGreaterThan(2);
    floorPlanPage.getInventoryLocation().then(function (inventoryLocation) {
      expect(inventoryLocation.isDisplayed()).toBeTruthy();
    });
    expect(floorPlanPage.searchButton.isDisplayed()).toBeTruthy();
    expect(floorPlanPage.clearSearchButton.isDisplayed()).toBeTruthy();
  });
  it('should check for the Floor Plan Links', function () {
    expect(browser.getCurrentUrl()).toContain(floorPlanPage.floorPlanUrl);
    expect(floorPlanPage.floorPlanLinks.count()).toBeGreaterThan(0);
    expect(floorPlanPage.goToFloorPlanLinks()).toBeDefined();
    floorPlanPage.goToFloorPlanLinks().then(function (floorPlanLink) {
      floorPlanLink.click();
    });
  });

});
