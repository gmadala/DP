'use strict';

angular.module('nextgearWebApp')
  .factory('Addresses', function() {

    var addresses,
      PO_BOX_REGEX = /(p\.?[\s]*o\.?[\s]*b[\s]*o[\s]*x[\s]*|\bp[o|0]st\.?\s*[o|0]ffice\s*b[o|0]x)\s*#?\d+/;

    function isNullOrUndefined(val) {
      return val === undefined || val === null;
    }

    return {
      init: function(addr) {
        addresses = addr;
      },
      getAddresses: function(active, physical, titleRelease, flooredAgainst) {
        // returns addresses filtered by any or all of these possible params.
        return addresses.filter(function(item) {
          return (isNullOrUndefined(physical) || item.IsPhysicalInventory === physical) &&
            (isNullOrUndefined(active) || item.IsActive === active) &&
            (isNullOrUndefined(titleRelease) || item.IsTitleReleaseAddress === titleRelease) && (isNullOrUndefined(flooredAgainst) || item.HasFloorplanFlooredAgainst === flooredAgainst);
        });
      },
      getActivePhysical: function() {
        // returns addresses that are active and physical
        return this.getAddresses(true /*active*/, true /*physical*/, null);
      },
      getTitleAddresses: function() {
        // returns addresses that are active, but filters out PO boxes
        return this.getAddresses(true, null, null).filter(function(item) {
          return !PO_BOX_REGEX.test(item.Line1.toLowerCase());
        });
      },
      getDefaultTitleAddress: function() {
        // returns the default title release address (there is only ever 1 address with IsTitleReleaseAddress == true)
        return this.getTitleAddresses().filter(function(item) {
          return item.IsTitleReleaseAddress;
        })[0];
      },
      getFlooredBusinessAddresses: function() {
        // returns addresses that have been floored against
        return this.getAddresses(null, null, null, true /*flooredAgainst*/);
      },
      getApprovedFlooredBusinessAddresses: function() {
        // returns addresses that have been floored against and are approved
        return this.getFlooredBusinessAddresses().filter(function(item) {
          return item.HasApprovedFloorplanFlooredAgainst;
        });
      },
      getAddressObjectFromId: function(addrId) {
        // since only a single address will ever have a
        // given id, we can safely select the first item from the array
        return addresses.filter(function(item) {
          return item.AddressId === addrId;
        })[0] ;
      }
    };
  });
