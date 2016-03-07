'use strict';

angular.module('nextgearWebApp')
  .factory('dealerCustomerSupportPhone', function (User) {
    return User.getInfo().then(function (info) {
      var phone = info.CSCPhoneNumber;
      var phoneSplit = phone.match(/([\d]{3})([\d]{3})([\d]{4})/);
      return {
        value: phone,
        formatted: phoneSplit[1] + '.' + phoneSplit[2] + '.' + phoneSplit[3]
      };
    });
  })
  .directive('nxgDealerCustomerSupportPhone', function (dealerCustomerSupportPhone) {
    return {
      restrict: 'E',
      replace: false,
      link: function (scope, element) {
        dealerCustomerSupportPhone.then(function (phoneNumber) {
          element.html('<span class="nxg-phone">' + phoneNumber.formatted + '</span');
        });
      }
    };
  });
