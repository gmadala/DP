'use strict';

function Resources() {

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
    browser.waitForAngular();
    this.elResourcesLink.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doRatesAndFees = function() {
    browser.waitForAngular();
    this.elRatesAndFees.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doDealerFunding = function() {
    browser.waitForAngular();
    this.elDealerFunding.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doWelcomePacket = function() {
    browser.waitForAngular();
    this.elWelcomePacket.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doTitleManagement = function() {
    browser.waitForAngular();
    this.elTitleManagement.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doInstructionsForBuyers = function() {
    browser.waitForAngular();
    this.elInstructionsBuyers.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doWelcomeLetter = function() {
    browser.waitForAngular();
    this.elWelcomeLetter.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doGuidelines = function() {
    browser.waitForAngular();
    this.elGuidelines.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doInformationSheet = function() {
    browser.waitForAngular();
    this.elInformationSheets.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doClaimForm = function() {
    browser.waitForAngular();
    this.elClaimForm.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doMobileIOS = function() {
    browser.waitForAngular();
    this.elMyNextGearMobileIOS.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doMobileAndroid = function() {
    browser.waitForAngular();
    this.elMyNextGearMobileAndroid.click();
    browser.sleep(browser.params.shortDelay);
  };
}
module.exports.resources = Resources;
