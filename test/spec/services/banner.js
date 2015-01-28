'use strict';

describe('Service: banner', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var banner, http, rootScope;
  beforeEach(inject(function (_banner_, $http, $rootScope) {
    banner = _banner_;
    http = $http;
    rootScope = $rootScope;
  }));


  describe('request function', function () {

    var httpBackend,
      config,
      successResponse;

    beforeEach(inject(function ($httpBackend, nxgConfig) {
      config = nxgConfig;
      httpBackend = $httpBackend;
      successResponse = {
        Success: true,
        Message: null,
        Data: [{Message: ''}]
      };
    }));

    it('should make a GET call to the specified URL', function () {
      httpBackend.expectGET('/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg?lang=1').respond(successResponse);
      banner.fetch(angular.noop);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should give an empty message', function () {
      httpBackend.expectGET('/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg?lang=1').respond(successResponse);
      banner.fetch(function(text){
        expect(text).toEqual('');
      });
      expect(httpBackend.flush).not.toThrow();
    });

    it('should give back the received message', function () {
      httpBackend.expectGET('/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg?lang=1').respond(successResponse);
      successResponse.Data[0].Message = 'message';
      banner.fetch(function(text){
        expect(text).toEqual('message');
      });
      expect(httpBackend.flush).not.toThrow();
    });

    it('should give an empty message if malformed data is received', function () {
      httpBackend.expectGET('/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg?lang=1').respond({bad: 'data'});
      banner.fetch(function(text){
        expect(text).toEqual('');
      });
      expect(httpBackend.flush).not.toThrow();
    });

    it('should give an empty message if error is returned', function () {
      httpBackend.expectGET('/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg?lang=1').respond(500);
      banner.fetch(function(text){
        expect(text).toEqual('');
      });
      expect(httpBackend.flush).not.toThrow();
    });

  });

});
