'use strict';

angular.module('nextgearWebApp')
  .factory('Addresses', function() {

    var addresses, flooredAddresses,
      PO_BOX_REGEX = /(p\.?[\s]*o\.?[\s]*b[\s]*o[\s]*x[\s]*|\bp[o|0]st\.?\s*[o|0]ffice\s*b[o|0]x)\s*#?\d+/;

    function isNullOrUndefined(val) {
      return val === undefined || val === null;
    }

    return {
      initFlooredBusinessAddresses: function(addr) {
        flooredAddresses = addr;
      },
      getFlooredBusinessAddresses: function() {
        return flooredAddresses;
      },

      init: function(addr) {
        addresses = addr;
      },
      getAddresses: function(active, physical, titleRelease) {
        return addresses.filter(function(item) {
          return (isNullOrUndefined(physical) || item.IsPhysicalInventory === physical) &&
            (isNullOrUndefined(active) || item.IsActive === active) &&
            (isNullOrUndefined(titleRelease) || item.IsTitleReleaseAddress === titleRelease);
        });
      },
      getActivePhysical: function() {
        return this.getAddresses(true /*active*/, true /*physical*/, null);
      },
      getTitleAddresses: function() {
        return this.getActivePhysical().filter(function(item) {
          return !PO_BOX_REGEX.test(item.Line1.toLowerCase());
        });
      }
    };
  });