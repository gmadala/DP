'use strict';

describe('Directive: nxgVinDetails', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgVinDetails/nxgVinDetails.html'));

  var element,
    outerScope;

  beforeEach(inject(function ($rootScope, $compile) {
    outerScope = $rootScope.$new();
    outerScope.theForm = {};
    outerScope.validation = {};
    outerScope.aModel = {};

    element = angular.element('<div nxg-vin-details floor-model="aModel" validity="validation" form="theForm"></div>');
    element = $compile(element)(outerScope);
    $rootScope.$digest();
  }));

  it('should expose the floor-model, validity, and form objects on the isolate scope', function () {
    var iScope = element.scope();

    expect(iScope.data).toBe(outerScope.aModel);
    expect(iScope.validity).toBe(outerScope.validation);
    expect(iScope.form).toBe(outerScope.theForm);
  });

  describe('controller', function () {

    var ctrl,
      scope,
      blackbookMock,
      vinLookupResult;

    beforeEach(inject(function ($controller, $rootScope, Blackbook, $q) {
      scope = $rootScope.$new();
      blackbookMock = {
        fetchVehicleTypeInfoForVin: function () {
          var def = $q.defer();
          def.resolve(vinLookupResult);
          return def.promise;
        },
        wasUserCancelled: Blackbook.wasUserCancelled
      };

      ctrl = $controller('VinDetailsCtrl', {
        $scope: scope,
        Blackbook: blackbookMock
      });
    }));

    it('should attach the expected default settings to the scope', function () {
      var nextYear = new Date().getFullYear() + 1;

      expect(scope.settings).toBeDefined();
      expect(scope.settings.vinLookupPending).toBe(false);
      expect(scope.settings.vinMode).toBe('none');
      expect(scope.settings.maxYear).toBe(nextYear);
    });

    it('should reset the vinMode on reset event', function () {
      scope.settings.vinMode = 'matched';
      scope.$broadcast('reset');
      expect(scope.settings.vinMode).toBe('none');
    });

    describe('vinIsSyntacticallyValid scope function', function () {

      it('should return false if validity is unknown', function () {
        expect(scope.vinIsSyntacticallyValid()).toBe(false);
      });

      it('should return false if there are any required or length errors', function () {
        var errors = {
          required: true,
          maxlength: true,
          minlength: true
        };
        expect(scope.vinIsSyntacticallyValid(errors)).toBe(false);

        errors = {
          required: true,
          maxlength: false,
          minlength: false
        };
        expect(scope.vinIsSyntacticallyValid(errors)).toBe(false);

        errors = {
          required: false,
          maxlength: false,
          minlength: true
        };
        expect(scope.vinIsSyntacticallyValid(errors)).toBe(false);
      });

      it('should return true if VIN passes required and length tests', function () {
        var errors = {
          required: false,
          maxlength: false,
          minlength: false
        };
        expect(scope.vinIsSyntacticallyValid(errors)).toBe(true);
      });
    });

    describe('vinChange scope function', function () {

      it('should clear any selected vehicle from the model & return to starting mode', function () {
        scope.data = {
          SelectedVehicle: {}
        };
        scope.settings.vinMode = 'matched';

        scope.vinChange();
        expect(scope.data.SelectedVehicle).toBe(null);
        expect(scope.settings.vinMode).toBe('none');
      });

    });

    describe('vinExit scope function', function () {

      beforeEach(function () {
        scope.form = {
          inputVin: {
            $error: {
              required: false,
              minlength: false,
              maxlength: false
            }
          }
        };
        scope.settings.vinMode = 'none';
      });

      it('should do nothing if VIN is syntactically invalid', function () {
        spyOn(scope, 'lookupVin');
        scope.form.inputVin.$error.minlength = true;
        scope.vinExit();
        expect(scope.lookupVin).not.toHaveBeenCalled();
      });

      it('should do nothing if VIN has already been looked up', function () {
        spyOn(scope, 'lookupVin');
        scope.settings.vinMode = 'noMatch';
        scope.vinExit();
        expect(scope.lookupVin).not.toHaveBeenCalled();
      });

      it('should trigger vin lookup if VIN is valid and not yet looked up', function () {
        spyOn(scope, 'lookupVin');
        scope.vinExit();
        expect(scope.lookupVin).toHaveBeenCalled();
      });

    });

    describe('lookupVin scope function', function () {

      beforeEach(function () {
        scope.form = {
          inputVin: {
            $error: {}
          }
        };
        scope.data = {
          UnitVin: '123456'
        };
      });

      it('should do nothing if a lookup is already in progress', function () {
        scope.validity = 'foo';
        spyOn(blackbookMock, 'fetchVehicleTypeInfoForVin');
        scope.settings.vinLookupPending = true;
        scope.lookupVin();
        expect(scope.validity).toBe('foo');
        expect(blackbookMock.fetchVehicleTypeInfoForVin).not.toHaveBeenCalled();
      });

      it('should reset any prior VIN validation errors', function () {
        scope.validity = {
          inputVin: {
            $error: {
              foo: 'bar'
            }
          }
        };
        scope.lookupVin();
        expect(scope.validity.inputVin.$error.foo).not.toBeDefined();
      });

      it('should halt if there are syntactic VIN errors, and expose them on the validity object', function () {
        scope.form.inputVin.$error.required = true;
        spyOn(blackbookMock, 'fetchVehicleTypeInfoForVin');
        scope.lookupVin();
        expect(blackbookMock.fetchVehicleTypeInfoForVin).not.toHaveBeenCalled();
        expect(scope.validity.inputVin.$error.required).toBe(true);
      });

      it('should call the lookup method with the VIN in the model if everything is valid', function () {
        spyOn(blackbookMock, 'fetchVehicleTypeInfoForVin').andCallThrough();
        scope.lookupVin();
        expect(blackbookMock.fetchVehicleTypeInfoForVin).toHaveBeenCalledWith('123456');
      });

      it('should attach the result to SelectedVehicle upon success, and change to matched mode', function () {
        vinLookupResult = {};

        scope.lookupVin();
        expect(scope.settings.vinLookupPending).toBe(true);

        scope.$apply(); // apply the promise resolution ($q is integrated with the angular digest cycle)
        expect(scope.data.SelectedVehicle).toBe(vinLookupResult);
        expect(scope.settings.vinMode).toBe('matched');
        expect(scope.settings.vinLookupPending).toBe(false);
      });

      it('should switch to noMatch mode if lookup fails', inject(function ($q) {
        vinLookupResult = $q.reject([]);

        scope.lookupVin();
        expect(scope.settings.vinLookupPending).toBe(true);

        scope.$apply(); // apply the promise resolution ($q is integrated with the angular digest cycle)
        expect(scope.settings.vinMode).toBe('noMatch');
        expect(scope.settings.vinLookupPending).toBe(false);
      }));

      it('should stay in starting mode if there were multiple matches and the user canceled resolution', inject(function ($q) {
        vinLookupResult = $q.reject('userCancel');

        scope.lookupVin();
        scope.$apply(); // apply the promise resolution ($q is integrated with the angular digest cycle)
        expect(scope.settings.vinLookupPending).toBe(false);
        expect(scope.settings.vinMode).toBe('none');
      }));

    });

  });
});
