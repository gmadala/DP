angular.module('nextgearWebAppDev', ['nextgearWebApp', 'ngMockE2E'])
  .run(function($httpBackend, $location) {
      var url = $location.absUrl();
      var mockParam = url.match(/\?mock/);

      if (mockParam) {
          $httpBackend.whenPOST('/Authentication/').respond({
              'Success': true,
              'AuthorizationToken': '550e8400-e29b-41d4-a716-446655440000'
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