'use strict';
function resources() {
  resources.this.elResourcesLink = element(by.className('link_documents'));
  resources.this.elRatesAndFees = element(by.id('ratesandfees'));
  resources.this.elDealerFunding = element(by.linkText('Dealer Funding Checklist'));
  resources.this.elWelcomePacket = element(by.linkText('Welcome Packet'));
  resources.this.elTitleManagement = element(by.linkText('Title Management Frequently Asked Questions'));
  resources.this.elInstructionsBuyers = element(by.linkText('Instructions for Buyers'));
  resources.this.elWelcomeLetter = element(by.linkText('Welcome Letter'));
  resources.this.elGuidelines = element(by.linkText('Guidelines'));
  resources.this.elInformationSheets = element(by.linkText('Information Sheet'));
  resources.this.elClaimForm = element(by.linkText('Claim Form'));
  resources.this.elMyNextGearMobileIOS = element(by.linkText('Download myNextGear mobile iOS'));
  resources.this.elMyNextGearMobileAndroid = element(by.linkText('Download myNextGear mobile Android'));

  //Doers
  this.doResources = function() {
    this.elResourcesLink.click();
    browser.waitForAngular();
  };
  this.doRatesAndFees = function() {
    this.elRatesAndFees.click();
    browser.waitForAngular();
  };
  this.doDealerFunding = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elDealerFunding.click();
  };
  this.doWelcomePacket = function() {
    browser.sleep(500);
    browser.waitForAngular();
    this.elWelcomePacket.click();
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
