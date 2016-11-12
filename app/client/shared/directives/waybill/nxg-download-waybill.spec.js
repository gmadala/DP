'use strict';

describe("Directive: nxgDownloadWaybill", function () {
  beforeEach(module('nextgearWebApp'));

  var scope, controller, userMock, responseMock;

  describe("Controller: NxgDownloadWaybillCtrl", function () {

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();

      userMock = {
        getInfo: function () {
          return $q.when(false);
        }
      };

      responseMock = {
        data: {
          waybill:'labelImage',
          trackingNumber: '1234567890'
        }
      };

      controller = $controller('NxgDownloadWaybillCtrl', {
        '$scope': scope,
        'User' : userMock
      })
    }));

    it('should download the fedex waybill', inject(function ($q, fedex) {
      spyOn(userMock, 'getInfo').and.returnValue($q.when({
        businessId:'001-002-003'
      }));
     spyOn(scope, 'getWaybill').and.callThrough();
     spyOn(fedex, 'getWaybill').and.returnValue($q.when(responseMock.data));
     scope.getWaybill();
     scope.$apply();
     expect(scope.getWaybill).toHaveBeenCalled();
     expect(userMock.getInfo).toHaveBeenCalled();
     expect(fedex.getWaybill).toHaveBeenCalled();
     expect(responseMock.data.waybill).toBe('labelImage');
     expect(responseMock.data.trackingNumber).toBe('1234567890');
    }));
  });
});

