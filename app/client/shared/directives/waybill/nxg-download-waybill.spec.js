'use strict';

describe("Directive: nxgDownloadWaybill", function () {
  beforeEach(module('nextgearWebApp'));

  var scope, controller;

  describe("Controller: NxgDownloadWaybillCtrl", function () {
    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      controller = $controller('NxgDownloadWaybillCtrl', {
        '$scope': scope
      })
    }));

    it("test", function () {
      var contentType = "text/plain";
      var base64String = "VGVzdFN0cmluZw==";
      var resultByteArray = [];

      var expectedByteArray = new Uint8Array([84, 101, 115, 116, 83, 116, 114, 105, 110, 103]);

      scope.base64ToBlob(base64String, contentType, 512, function (byteArray) {
        console.log(byteArray);
        resultByteArray = byteArray.slice(0);
      });

      expect(resultByteArray[0]).toEqual(expectedByteArray);
    });
  });
});

