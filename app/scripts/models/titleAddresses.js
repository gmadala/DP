'use strict';

angular.module('nextgearWebApp')
  .factory('TitleAddresses', function($q, api) {
    var addresses;
    var defaultAddress;

    return {
      getAddresses: function() {
        if (!addresses) {
          addresses = api.request('GET', '/UserAccount/settings/').then(function(results) {
            _.each(results.Addresses, function(addr) {
              if (addr.IsTitleReleaseAddress) {
                defaultAddress = addr;
              }
            });
            return results.Addresses;
          });
        }
        return addresses;
      },
      getDefaultAddress: function() {
        if(!defaultAddress) {
          return this.getAddresses().then(function() {
            return defaultAddress;
          });
        } else {
          return $q.when(defaultAddress);
        }
      }
    };
  });
