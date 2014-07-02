'use strict';

describe('Controller: FloorCarCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarCtrl,
    scope,
    initController,
    userMock,
    floorplan,
    dialog,
    location,
    blackbook,
    mockForm;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Floorplan, $dialog, $location, Blackbook) {
    scope = $rootScope.$new();
    floorplan = Floorplan;
    dialog = $dialog;
    location = $location;
    blackbook = Blackbook;

    userMock = {
      isDealer: function() {
        return type = 'Dealer';
      },
      getStatics: function() {
        return 123; // magic number to compare against
      },
      canPayBuyer: function() {
        return true;
      },
      getPaySellerOptions: function() {
        return false;
      }
    };

    mockForm = {
      $valid: true,
      inputMileage: {}
    };

    initController = function(type) {
      FloorCarCtrl = $controller('FloorCarCtrl', {
        $scope: scope,
        User: userMock,
        Floorplan: floorplan,
        $dialog: dialog,
        $location: location,
        Blackbook: blackbook,
      });
    }
  }));

  var registerCommonTests = function() {
    it('should attach necessary objects to the scope', function () {
      expect(scope.options).not.toBeDefined();
      scope.$digest();
      expect(scope.options).toBe(userMock.getStatics());
      expect(scope.paySellerOptions).toBe(userMock.getPaySellerOptions);
      expect(scope.canPayBuyer).toBe(userMock.canPayBuyer);
      expect(scope.optionsHelper).toBeDefined();

      expect(scope.defaultData).toBeDefined();
    });

    describe('reset function', function() {
      it('should exist', function() {
        expect(typeof scope.reset).toBe('function');
      });

      it('should reset everything', function() {
        spyOn(scope.optionsHelper, 'applyDefaults');
        scope.reset();
        expect(scope.data).toEqual(scope.defaultData);
        expect(scope.optionsHelper.applyDefaults).toHaveBeenCalled();
        expect(scope.validity).not.toBeDefined();
      });
    });

    describe('submit function', function() {
      var httpBackend,
          succeed = true;

      beforeEach(inject(function($httpBackend) {
        httpBackend = $httpBackend;

        scope.form = mockForm;
        spyOn(dialog, 'dialog').andReturn({
          open: function() {
            return {
              then: function(s,f) {
                if (succeed) {
                  s(true);
                } else {
                  s(false);
                }

              }
            };
          }
        });

        httpBackend.expectPOST('/floorplan/v1_1/create')
          .respond({
            Success: true,
            Message: null,
            Data: []
          });
      }));

      it('should exist', function() {
        expect(typeof scope.submit).toBe('function');
      });

      it('should create the validity object', function() {
        expect(scope.validity).not.toBeDefined();
        scope.submit();
        expect(scope.validity).toBeDefined();
      });

      it('should do nothing if the form is invalid', function() {
        scope.form.$valid = false;
        scope.submit();
        expect(dialog.dialog).not.toHaveBeenCalled();
      });

      it('should call dialog with a valid form', function() {
        scope.form.$valid = true;
        scope.submit();
        expect(dialog.dialog.mostRecentCall.args[0].resolve.formData()).toEqual(scope.data);
        expect(dialog.dialog.mostRecentCall.args[0].resolve.isDealer()).toEqual(userMock.isDealer());
      });

      it('should call reallySubmit() if user confirms', function() {
        spyOn(scope, 'reallySubmit').andReturn();
        scope.submit();
        expect(scope.reallySubmit).toHaveBeenCalled();
      });

      it('should not call reallySubmit() if user does not confirm', function() {
        succeed = false;
        spyOn(scope, 'reallySubmit').andReturn();
        scope.submit();
        expect(scope.reallySubmit).not.toHaveBeenCalled();
      })
    });

    describe('really submit function', function() {
      var httpBackend,
          p;

      beforeEach(inject(function($httpBackend, protect) {
        httpBackend = $httpBackend;
        p = protect;

        spyOn(dialog, 'dialog').andReturn({
          open: function() {
            return {
              then: function(s,f) {
                if (succeed) {
                  s(true);
                } else {
                  s(false);
                }
              }
            };
          }
        });
      }));

      it('should exist', function() {
        expect(typeof scope.reallySubmit).toBe('function');
      });

      it('should throw an error if guard and protect are not the same', function() {
        expect(function() { scope.reallySubmit({}); }).toThrow();
      });

      it('should show a dialog if the flooring is successful', function() {
       httpBackend.whenPOST('/floorplan/v1_1/create')
        .respond(function() {
          return [200, { Success: true }];
        });

        spyOn(dialog, 'messageBox').andReturn({
          open: function() {
            return {
              then: function(s) {
                s(true);
              }
            };
          }
        });

        scope.reallySubmit(p);
        httpBackend.flush();
        expect(dialog.messageBox).toHaveBeenCalledWith(
          'Flooring Request Submitted',
          'Your flooring request has been submitted to NextGear Capital.',
          [{ label: 'OK', cssClass: 'btn btn-mini btn-primary'}]
        );
      });

      it('should do nothing if the flooring fails', function() {
        spyOn(dialog, 'messageBox').andReturn();
        httpBackend.whenPOST('/floorplan/v1_1/create')
          .respond(function() {
            return [200, { Success: false }];
        });
        expect(dialog.messageBox).not.toHaveBeenCalled();
      })
    });

    describe('cancel function', function() {
      var goHome = true,
          goReset = false,
          dialogMock,
          q,
          deferred;

      beforeEach(inject(function($q) {
        q = $q;

        dialog.messageBox = function() {
          return {
            open: function() {
              deferred = q.defer();
              deferred.resolve('home');
              return deferred.promise;
            }
          };
        };
      }));

      it('should exist', function() {
        expect(typeof scope.cancel).toBe('function');
      });

      it('should launch a messagebox box', function() {
        spyOn(dialog, 'messageBox').andCallThrough();
        scope.cancel();
        expect(dialog.messageBox).toHaveBeenCalledWith('Cancel',
        'What would you like to do?', [ {label: 'Go Home', result:'home', cssClass: 'btn-danger'}, {label: 'Start Over', result: 'reset', cssClass: 'btn-danger'},
          {label: 'Keep Editing', result: null, cssClass: 'btn-primary'} ]);
      });
    });
  };

  describe('in dealer mode', function() {
    beforeEach(function(){
      spyOn(userMock, 'isDealer').andReturn(true);
      initController();
    });

    registerCommonTests();
  });

  describe('in auction mode', function() {
    beforeEach(function() {
      spyOn(userMock, 'isDealer').andReturn(false);
      initController();
    });

    registerCommonTests();
  })
});
