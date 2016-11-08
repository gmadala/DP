'use strict';

/**
 * @class exec_settings
 * @author Bala Nithiya
 * @description Settings file for execution variables
 *              JIRA:   MNGNF-252 - Build E2e Framework
 * */

var displayMode = 'Desktop';
var baseUrl = 'https://test.nextgearcapital.com/test/#/';

console.log('\n');

exports.mode = function () {
  return displayMode;
};

exports.hostUrl = function () {
  return baseUrl;
};

exports.loginPage = function () {
  return baseUrl + 'login';
};

exports.homePage = function () {
  return baseUrl + 'home';
};

exports.auctionHomePage = function () {
  return baseUrl + 'act/home';
};

exports.forgotPage = function () {
  return baseUrl + 'login/recover';
};

exports.resourcesPage = function () {
  return baseUrl + 'documents';
};

exports.promosPage = function () {
  return baseUrl + 'promos';
};

exports.accountManagement = function () {
  return baseUrl + 'account_management';
};

exports.receiptsPage = function () {
  return baseUrl + 'receipts';
};
exports.profileSettingsPage = function () {
  return baseUrl + 'profile_settings';
};
