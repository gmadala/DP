'use strict';

describe('Service: Blackbook', function () {

  var dialogMock,
    dialogResult;

  // load the service's module
  // mock $dialog service (stand-in for actual business search modal)
  // that will call dialogMock.dialog for instantiation, and resolve
  // the open() promise immediately with dialogResult
  beforeEach(function () {
    module('nextgearWebApp', function($provide) {
      $provide.decorator('$dialog', function($delegate, $q) {
        dialogMock = {
          dialog: function () {
            return {
              open: function () {
                var def = $q.defer();
                def.resolve(dialogResult);
                return def.promise;
              }
            };
          }
        };

        return dialogMock;
      });
    });
  });

  // instantiate service
  var Blackbook;
  beforeEach(inject(function (_Blackbook_) {
    Blackbook = _Blackbook_;
  }));

  describe('wasUserCancelled function', function () {

    it('should return true if the provided value matches USER_CANCEL', function () {
      expect(Blackbook.wasUserCancelled('userCancel')).toBe(true);
    });

    it('should return false otherwise', function () {
      expect(Blackbook.wasUserCancelled('foo')).toBe(false);
    });

  });

  describe('fetchVehicleTypeInfoForVin function', function () {

    var httpBackend,
      failure,
      success,
      resultSkeleton = {
        Success: true,
        Message: null,
        Data: []
      };

    beforeEach(inject(function ($httpBackend) {
      failure = jasmine.createSpy('failure');
      success = jasmine.createSpy('success');
      httpBackend = $httpBackend;
    }));

    it('should throw an error if the VIN is missing', function () {
      expect(function () {
        Blackbook.fetchVehicleTypeInfoForVin();
      }).toThrow();
    });

    it('should make the expected http request without mileage', function () {
      httpBackend.expectGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(resultSkeleton);
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123');
      httpBackend.flush();
    });

    it('should make the expected http request with mileage', function () {
      httpBackend.expectGET('/analytics/v1_2/blackbook/SOMEVIN123/123456').respond(resultSkeleton);
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', '123456');
      httpBackend.flush();
    });

    it('should reject its promise if there are no results', function () {
      var result = angular.extend({}, resultSkeleton);
      result.Data = null;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123').then(success, failure);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });

    it('should reject its promise if the result list is empty', function () {
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(resultSkeleton);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123').then(success, failure);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });

    it('should resolve a single result without user interaction, at any multiplesResolution setting', function () {
      var myItem = {};
      var result = angular.extend({}, resultSkeleton);
      result.Data = [myItem];
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog');

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItem);

      success = jasmine.createSpy('success');
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, false).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItem);

      success = jasmine.createSpy('success');
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, {}).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItem);

      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should pass through multiple results with multiplesResolution === false', function () {
      var myItems = [{}, {}];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog');

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, false).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItems);
      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should invoke the expected dialog on multiple results with multiplesResolution === true', function () {
      var myItems = [{}, {}];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog').andCallThrough();

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(dialogMock.dialog).toHaveBeenCalled();
      expect(dialogMock.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/multipleVehicles.html');
      expect(dialogMock.dialog.mostRecentCall.args[0].controller).toBe('MultipleVehiclesCtrl');
      expect(dialogMock.dialog.mostRecentCall.args[0].resolve.matchList()).toBe(myItems);
    });

    it('when doing interactive selection, should resolve its promise to the value from the dialog', function () {
      var uno = {},
        dos = {};
      dialogResult = dos;
      var myItems = [uno, dos];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(dos);
    });

    it('when doing interactive selection, should reject its promise if the dialog is closed w/o a choice', function () {
      dialogResult = undefined;
      var myItems = [{}, {}];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(failure).toHaveBeenCalledWith('userCancel');
    });

    it('should automatically resolve multiples with a hint if provided', function () {
      var one = {
          Make: 'm1',
          Model: 'mm1',
          Year: 'y1',
          Style: 's1'
        },
        two = {
          Make: 'm2',
          Model: 'mm2',
          Year: 'y2',
          Style: 's2'
        },
        hint = angular.extend({}, two);
      var myItems = [one, two];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog');

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, hint).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(two);
      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should fall back to manual resolution if the hint does not match anything', function () {
      var one = {
          Make: 'm1',
          Model: 'mm1',
          Year: 'y1',
          Style: 's1'
        },
        two = {
          Make: 'm2',
          Model: 'mm2',
          Year: 'y2',
          Style: 's2'
        },
        hint = {
          Make: 'm6',
          Model: 'mm2',
          Year: 'y2',
          Style: 's2'
        };
      var myItems = [one, two];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog').andCallThrough();

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, hint).then(success, failure);
      httpBackend.flush();
      expect(dialogMock.dialog).toHaveBeenCalled();
    });

  });

});
