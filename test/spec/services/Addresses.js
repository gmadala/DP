'use strict';

describe('Service: Addresses', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  var Addresses, 
    MockAddresses = [
      {
        AddressId: '1',
        Line1: '380 NEVADA SW',
        Line2: null,
        City: 'HURON',
        State: 'SD',
        Zip: '57350',
        Phone: '0000000000',
        Fax: '0000000000',
        IsActive: false,
        IsPhysicalInventory: false,
        IsTitleReleaseAddress: false,
        IsMailingAddress: false
      },
      {
        AddressId: '2',
        Line1: 'PO Box 1274',
        Line2: null,
        City: 'Huron',
        State: 'SD',
        Zip: '57350',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: true,
        IsPhysicalInventory: false,
        IsTitleReleaseAddress: false,
        IsMailingAddress: true
      },
      {
        AddressId: '3',
        Line1: '22095 392nd Ave.',
        Line2: null,
        City: 'Alpena',
        State: 'SD',
        Zip: '57312',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: true,
        IsPhysicalInventory: true,
        IsTitleReleaseAddress: false,
        IsMailingAddress: false
      },
      {
        AddressId: '4',
        Line1: '1794 1/2 E. Hwy 14',
        Line2: null,
        City: 'Huron',
        State: 'SD',
        Zip: '57350',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: false,
        IsPhysicalInventory: true,
        IsTitleReleaseAddress: true,
        IsMailingAddress: false
      },
      {
        AddressId: '5',
        Line1: '1794 1/2 E. Hwy 14',
        Line2: null,
        City: 'Huron',
        State: 'SD',
        Zip: '57350',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: true,
        IsPhysicalInventory: true,
        IsTitleReleaseAddress: true,
        IsMailingAddress: false
      },
      {
        AddressId: '6',
        Line1: 'PO Box 1350',
        Line2: null,
        City: 'Huron',
        State: 'SD',
        Zip: '57350',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: true,
        IsPhysicalInventory: true,
        IsTitleReleaseAddress: true,
        IsMailingAddress: false
      },
      {
        AddressId: '7',
        Line1: 'P.O. Box 1350',
        Line2: null,
        City: 'Huron',
        State: 'SD',
        Zip: '57350',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: true,
        IsPhysicalInventory: true,
        IsTitleReleaseAddress: true,
        IsMailingAddress: false
      },
      {
        AddressId: '8',
        Line1: 'PO. Box #1350',
        Line2: null,
        City: 'Huron',
        State: 'SD',
        Zip: '57350',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: true,
        IsPhysicalInventory: true,
        IsTitleReleaseAddress: true,
        IsMailingAddress: false
      },
      {
        AddressId: '9',
        Line1: 'Post 0ffice Box #1350',
        Line2: null,
        City: 'Huron',
        State: 'SD',
        Zip: '57350',
        Phone: '6053521637',
        Fax: '6053524528',
        IsActive: true,
        IsPhysicalInventory: true,
        IsTitleReleaseAddress: true,
        IsMailingAddress: false
      }
    ];
  
  // instantiate service
  beforeEach(inject(function (_Addresses_) {
    Addresses = _Addresses_;
  }));

  it('should have an init function', function () {
    expect(angular.isFunction(Addresses.init)).toBe(true);
  });

  beforeEach(inject(function () {
    Addresses.init(MockAddresses);
  }));

  it('should have an initFlooredBusinessAdddresses function', function () {
    expect(angular.isFunction(Addresses.initFlooredBusinessAddresses)).toBe(true);
  });

  it('should have a getAddresses function', function () {
    expect(angular.isFunction(Addresses.getAddresses)).toBe(true);
  });

  it('getAddresses should honor the active, physical and titlRelease arguments and return the appropriate addresses', function () {
    var res = Addresses.getAddresses(true /*active*/);
    expect(res.length).toBe(7);
    expect(res[0].AddressId).toBe('2');
    expect(res[1].AddressId).toBe('3');
    expect(res[2].AddressId).toBe('5');
    expect(res[3].AddressId).toBe('6');
    expect(res[4].AddressId).toBe('7');
    expect(res[5].AddressId).toBe('8');
    expect(res[6].AddressId).toBe('9');


    res = Addresses.getAddresses(null, true /*physical*/);
    expect(res.length).toBe(7);
    expect(res[0].AddressId).toBe('3');
    expect(res[1].AddressId).toBe('4');
    expect(res[2].AddressId).toBe('5');
    expect(res[3].AddressId).toBe('6');
    expect(res[4].AddressId).toBe('7');
    expect(res[5].AddressId).toBe('8');
    expect(res[6].AddressId).toBe('9');

    res = Addresses.getAddresses(true /*active*/, true /*physical*/);
    expect(res.length).toBe(6);
    expect(res[0].AddressId).toBe('3');
    expect(res[1].AddressId).toBe('5');
    expect(res[2].AddressId).toBe('6');
    expect(res[3].AddressId).toBe('7');
    expect(res[4].AddressId).toBe('8');
    expect(res[5].AddressId).toBe('9');
  });

  it('should have a getActivePhysical function', function() {
    expect(angular.isFunction(Addresses.getActivePhysical)).toBe(true);
  });

  it('getActivePhysical should return addresses that are active AND physical', function() {
    var res = Addresses.getActivePhysical();
    expect(res.length).toBe(6);
    expect(res[0].AddressId).toBe('3');
    expect(res[1].AddressId).toBe('5');
    expect(res[2].AddressId).toBe('6');
    expect(res[3].AddressId).toBe('7');
    expect(res[4].AddressId).toBe('8');
    expect(res[5].AddressId).toBe('9');
  });

  it('should have a getTitleAddresses function', function() {
    expect(angular.isFunction(Addresses.getTitleAddresses)).toBe(true);
  });

  it('getTitleAddresses should return active and physical addresses that are not PO Box addresses', function() {
    var res = Addresses.getTitleAddresses();
    expect(res.length).toBe(2);
    expect(res[0].AddressId).toBe('3');
    expect(res[1].AddressId).toBe('5');
  });

});
