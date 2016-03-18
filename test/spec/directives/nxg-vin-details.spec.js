'use strict';

describe('Directive: NxgVinDetails', function () {
  beforeEach(module('nextgearWebApp'));

  // this directive is little more than template + controller, so just test the controller
  describe('VinDetailsCtrl', function () {

    var ctrl,
      scope,
      attrs,
      blackbook;

    beforeEach(inject(function ($rootScope, $controller, Blackbook) {
      scope = $rootScope.$new();

      attrs = {};
      blackbook = Blackbook;

      ctrl = $controller('VinDetailsCtrl', {
        $scope: scope,
        $attrs: attrs
      });

      scope.data = {
        $selectedVehicle: null
      }
    }));

    it('should update the vin mode on reset', inject(function($rootScope) {
      scope.settings.vinMode = 'noMatch';
      $rootScope.$broadcast('reset');
      expect(scope.settings.vinMode).toBe('none');
    }));

    describe('vinIsSyntacticallyValid', function() {
      it('should return false if there is no error object', function() {
        scope.form = {
          $valid: false,
          inputVin: 'bar',
          $error: {}
        };
        expect(scope.vinIsSyntacticallyValid()).toBe(false);
      });

      it('should return true if there are no errors', function() {
        scope.form = {
          $valid: false,
          inputVin: {
            $error: {
              minlength: false,
              maxlength: false,
              required: false
            }
          },
          $error: {}
        };
        expect(scope.vinIsSyntacticallyValid(scope.form.inputVin.$error)).toBe(true);
      });

      it('should return true false there are any errors', function() {
        scope.form = {
          $valid: false,
          inputVin: {
            $error: {
              minlength: true,
              maxlength: false,
              required: false
            }
          },
          $error: {}
        };
        expect(scope.vinIsSyntacticallyValid(scope.form.inputVin.$error)).toBe(false);
      });
    });

    describe('vinChange', function() {
      it('should clear any match state if the vin changes after lookup', function() {
        scope.settings.vinMode = 'noMatch';
        scope.data.$selectedVehicle = {};
        scope.vinChange();
        expect(scope.data.$selectedVehicle).toBe(null);
        expect(scope.errorFlag).toBe(false);
        expect(scope.settings.vinMode).toBe('none');
      });

      it('should do nothing if vinMode is \'none\'', function() {
        var vehicle = { foo: 'bar' };
        scope.data.$selectedVehicle = vehicle;
        scope.settings.vinMode = 'none';
        scope.vinChange();
        expect(scope.data.$selectedVehicle).toBe(vehicle);
      });
    });

    describe('vinExit', function() {
      beforeEach(function() {
        scope.form = {
          inputVin: {
            $error: {
              required: false,
              minlength: true,
              maxlength: false
            }
          }
        };
      });

      it('should do nothing if this vin has already been looked up', function() {
        spyOn(scope, 'lookupVin').and.returnValue({});
        scope.settings.vinMode = 'matched';
        scope.vinExit();
        expect(scope.lookupVin).not.toHaveBeenCalled();
      });

      it('should do nothing if this vin is not valid', function() {
        spyOn(scope, 'lookupVin').and.returnValue({});

        scope.vinExit();
        expect(scope.lookupVin).not.toHaveBeenCalled();
      });

      it('should call the lookup function if the VIN is valid and has not yet been looked up', function() {
        spyOn(scope, 'lookupVin').and.returnValue({});
        scope.form.inputVin.$error.minlength = false;
        scope.vinExit();
        expect(scope.lookupVin).toHaveBeenCalled();
      });
    });

    describe('lookupVin', function() {
      var results,
          shouldSucceed,
          $q,
          uibModal,
          dialogChoice,
          userHasChosen,
          errObject;

      beforeEach(inject(function(_$q_, $uibModal) {
        $q = _$q_;
        uibModal = $uibModal;
        shouldSucceed = true;
        results = [{
          foo: 'bar'
        }];
        dialogChoice = {};
        userHasChosen = true;
        errObject = {};

        scope.form = {
          inputVin: {
            $error: {
              required: false,
              minlength: false,
              maxlength: false
            }
          },
          inputMileage: {
            $valid: true
          }
        };

        spyOn(blackbook, 'lookupByVin').and.returnValue({
          then: function(success, fail) {
            if (shouldSucceed) {
              return success(results);
            }
            return fail(errObject);
          }
        });

        spyOn(uibModal, 'open').and.returnValue({
          result: {
            then: function (success) {
              if (userHasChosen) {
                return success($q.when(dialogChoice));
              } else {
                return success($q.when());
              }
            }
          }
        });
      }));

      it('should do nothing if a lookup is already pending', function() {
        scope.settings.vinLookupPending = true;
        scope.lookupVin();
        expect(blackbook.lookupByVin).not.toHaveBeenCalled();
      });

      it('should do nothing if the vin is not valid', function() {
        scope.form.inputVin.$error.minlength = true;
        scope.lookupVin();
        expect(blackbook.lookupByVin).not.toHaveBeenCalled();
      });

      it('should run the lookup and set the $selected vehicle to the result', function() {
        scope.data = {
          UnitVin: 'someVin',
          UnitMileage: 87654,
          $blackbookMileage: null,
          $selectedVehicle: null,
          UnitMake: null,
          UnitModel: null,
          UnitYear: null,
          UnitStyle: null
        };

        scope.lookupVin();
        expect(blackbook.lookupByVin).toHaveBeenCalledWith('someVin', 87654);
        expect(scope.data.$selectedVehicle).toBe(results[0]);
      });

      it('should launch the multiple vehicles dialog if there are multiple results', function() {
        results.push({ bar: 'foo'});
        scope.data = {
          UnitVin: 'someVin',
          UnitMileage: 87654,
          $blackbookMileage: null,
          $selectedVehicle: null,
          UnitMake: null,
          UnitModel: null,
          UnitYear: null,
          UnitStyle: null
        };

        scope.lookupVin();
        expect(uibModal.open.calls.mostRecent().args[0].resolve.matchList()).toBe(results);
      });

      // TODO: fix this test so it passes
      it('should set the selected vehicle properly once a choice has been made', function() {
        results.push({ bar: 'foo'});
        scope.data = {
          UnitVin: 'someVin',
          UnitMileage: 87654,
          $blackbookMileage: null,
          $selectedVehicle: null,
          UnitMake: null,
          UnitModel: null,
          UnitYear: null,
          UnitStyle: null
        };
        dialogChoice = results[1];
        scope.lookupVin();
        expect(uibModal.open.calls.mostRecent().args[0].resolve.matchList()).toBe(results);

        // expect(scope.data.$selectedVehicle).toBe(dialogChoice);
      })

      it('should handle blackbook errors', function() {
        expect(scope.settings.vinMode).toBe('none');
        shouldSucceed = false;
        scope.lookupVin();
        expect(scope.settings.vinMode).toBe('noMatch');
        expect(scope.data.VinAckLookupFailure).toBe(false);
        expect(scope.data.UnitMake).toBe('');
        expect(scope.data.UnitModel).toBe('');
        expect(scope.data.UnitYear).toBe('');
        expect(scope.data.UnitStyle).toBe('');
      });

      it('should dismiss other errors and reat all as \'no match\'', function() {
        errObject.dismiss = angular.noop;
        spyOn(errObject, 'dismiss').and.callThrough();
        expect(scope.settings.vinMode).toBe('none');
        shouldSucceed = false;
        scope.lookupVin();
        expect(errObject.dismiss).toHaveBeenCalled();
      });

      it('should act as if a search was not run if the user cancelled before selecting', function() {
        errObject = 'userCancel';

        expect(scope.settings.vinMode).toBe('none');
        shouldSucceed = false;
        scope.lookupVin();

        expect(scope.settings.vinMode).toBe('none');
      });
    });
  });
});
