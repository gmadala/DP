'use strict';
function resources() {
this.elResourcesLink = element(by.className('link_documents'));
this.elRatesAndFees = element(by.id('ratesandfees'));
this.elDealerFunding = element(by.linkText('Dealer Funding Checklist'));
this.elWelcomePacket = element(by.linkText('Welcome Packet'));
this.elTitleManagement = element(by.linkText('Title Management Frequently Asked Questions'));
this.elInstructionsBuyers = element(by.linkText('Instructions for Buyers'));
this.elWelcomeLetter = element(by.linkText('Welcome Letter'));
this.elGuidelines = element(by.linkText('Guidelines'));
this.elInformationSheets = element(by.linkText('Information Sheet'));
this.elClaimForm = element(by.linkText('Claim Form'));
this.elMyNextGearMobileIOS = element(by.linkText('Download myNextGear mobile iOS'));
this.elMyNextGearMobileAndroid = element(by.linkText('Download myNextGear mobile Android'));

  //Doers
  this.doResources = function() {
    this.elResourcesLink.click();
    browser.waitForAngular();
  };
  this.doRatesAndFees = function() {
    this.elRatesAndFees.click();
    browser.waitForAngular();
  };
  this.doWelcomePacket = function() {
    this.elWelcomePacket.click();
    browser.waitForAngular();
  };
  this.doDealerFunding = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elDealerFunding.click();
  };

  this.doTitleManagement = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elTitleManagement.click();
  };
  this.doInstructionsForBuyers = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elInstructionsBuyers.click();
  };
  this.doWelcomeLetter = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elWelcomeLetter.click();
  };
  this.doGuidelines = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elGuidelines.click();
  };
  this.doInformationSheet = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elInformationSheets.click();
  };
  this.doClaimForm = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elClaimForm.click();
  };
  this.doMobileIOS = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elMyNextGearMobileIOS.click();
  };
  this.doMobileAndroid = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elMyNextGearMobileAndroid.click();
  };
}
module.exports.resources = resources;
