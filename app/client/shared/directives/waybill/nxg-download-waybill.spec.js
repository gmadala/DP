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

    fit("test", function () {
      var contentType = "text/plain";
      var base64String = "VGVzdFN0cmluZw==";
      var resultByteArray = [];

      var expectedByteArray = new Uint8Array([84, 101, 115, 116, 83, 116, 114, 105, 110, 103]);

      scope.base64ToBlob(base64String, contentType, 512, function (byteArray) {
        console.log(byteArray);
        resultByteArray = byteArray.slice(0);
      });

      console.log("Testing Array Lengths");
      console.log(expectedByteArray.length);
      console.log(resultByteArray.length);
      expect(expectedByteArray.length).toBe(resultByteArray[0].length);
      console.log("************************************");
      console.log("********    Expected   *************");
      console.log("************************************");
      console.log(expectedByteArray);

      console.log("************************************");
      console.log("********     Actual    *************");
      console.log("************************************");
      console.log(resultByteArray[0]);

      // expect(resultByteArray[0]).toBe(expectedByteArray);
      expect(resultByteArray[0]).toEqual(expectedByteArray);

      // angular.forEach(resultByteArray[0], function (i, o) {
      //    expect(o).toBe(expectedByteArray[i]);
      // });
    });
  });
});

