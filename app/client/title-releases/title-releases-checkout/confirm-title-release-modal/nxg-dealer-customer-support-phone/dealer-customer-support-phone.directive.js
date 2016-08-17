(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('dealerCustomerSupportPhone', dealerCustomerSupportPhone);

  dealerCustomerSupportPhone.$inject = ['User'];

  function dealerCustomerSupportPhone(User) {

    return User.getInfo().then(function (info) {
      if (info) {
        var phone = info.CSCPhoneNumber;
        var phoneSplit = phone.match(/([\d]{3})([\d]{3})([\d]{4})/);
        return {
          value: phone,
          formatted: phoneSplit[1] + '.' + phoneSplit[2] + '.' + phoneSplit[3]
        };
      } else {
        return {
          value: '',
          formatted: ''
        };
      }
    });

  }
})();
