angular.module('nextgearWebAppDev', ['nextgearWebApp', 'ngMockE2E'])
  .run(function($httpBackend, $location) {
      var url = $location.absUrl();
      var mockParam = url.match(/\?mock/);

      if (mockParam) {
          $httpBackend.whenPOST('/UserAccount/Authenticate/').respond({
              "Success":true,
              "Message":null,
              "Data":"ZTIwNzZjNzktNmE1MS00MmMxLTkxOTctMjQ2MjM2NjI4YjBj"
          });
          // all non-API calls should go through as normal
          $httpBackend.whenGET(/^(?!.*\/api\/).*$/).passThrough();
          $httpBackend.whenPOST(/^(?!.*\/api\/).*$/).passThrough();
      }
      else {
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/.*/).passThrough();
      }
  });