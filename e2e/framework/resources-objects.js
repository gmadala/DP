'use strict';

var resourcesLink = element(by.className('link_documents'));
var ratesAndFees = element(by.id('ratesandfees'));
var dealerFunding = element(by.linkText('Dealer Funding Checklist'));
var welcomePacket = element(by.linkText('Welcome Packet'));
var titleManagement = element(by.linkText('Title Management Frequently Asked Questions'));
var instructionsBuyers = element(by.linkText('Instructions for Buyers'));
var welcomeLetter = element(by.linkText('Welcome Letter'));
var guidelines = element(by.linkText('Guidelines'));
var informationSheets = element(by.linkText('Information Sheet'));
var claimForm = element(by.linkText('Claim Form'));
var myNextGearMobileIOS = element(by.linkText('Download myNextGear mobile iOS'));
var myNextGearMobileAndroid = element(by.linkText('Download myNextGear mobile Android'));
var resources = {

  clickResources: function() {
    resourcesLink.click();
    browser.waitForAngular();
  },
  clickRatesAndFees: function() {
    ratesAndFees.click();
    browser.waitForAngular();
  },
  clickDealerFundingChecklist: function() {
    browser.sleep(500);
    browser.waitForAngular();
    dealerFunding.click();
  },
  clickWelcomePacket: function() {
    browser.sleep(500);
    browser.waitForAngular();
    welcomePacket.click();
  },
  clickTitleManagement: function() {
    browser.sleep(500);
    browser.waitForAngular();
    titleManagement.click();
  },
  clickInstructionsForBuyers: function() {
    browser.sleep(500);
    browser.waitForAngular();
    instructionsBuyers.click();
  },
  clickWelcomeLetter: function() {
    browser.sleep(500);
    browser.waitForAngular();
    welcomeLetter.click();
  },
  clickGuidelines: function() {
    browser.sleep(500);
    browser.waitForAngular();
    guidelines.click();
  },
  clickInformationSheet: function() {
    browser.sleep(500);
    browser.waitForAngular();
    informationSheets.click();
  },
  clickClaimForm: function() {
    browser.sleep(500);
    browser.waitForAngular();
    claimForm.click();
  },
  clickMobileIOS: function() {
    browser.sleep(500);
    browser.waitForAngular();
    myNextGearMobileIOS.click();
  },
  clickMobileAndroid: function() {
    browser.sleep(500);
    browser.waitForAngular();
    myNextGearMobileAndroid.click();
  }
};
module.exports = resources;
