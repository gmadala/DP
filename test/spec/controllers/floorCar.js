'use strict';

function createPromiseMock(setting) {
  return {
    then: function(success, fail) {
      if (setting.error !== null) {
        fail(setting.error);
      } else if (setting.resolution !== null) {
        success(setting.resolution);
      }
    }
  };
}

describe('Controller: FloorCarCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarCtrl,
    scope,
    protect,
    dialogMock,
    floorplanMock,
    confirmSetting = {error: null, resolution: null},
    createSetting = {error: null, resolution: null};

  // Initialize the controller and mocks
  beforeEach(inject(function ($controller, $rootScope, _protect_) {
    scope = $rootScope.$new();
    protect = _protect_;
    dialogMock = {
      dialog: function () {
        return createPromiseMock(confirmSetting);
      },
      messageBox: function () {
        return {
          open: angular.noop
        };
      }
    };
    floorplanMock = {
      create: function () {
        return createPromiseMock(createSetting);
      }
    };

    FloorCarCtrl = $controller('FloorCarCtrl', {
      $scope: scope,
      User: {
        foo: 'bar'
      },
      $dialog: dialogMock,
      Floorplan: floorplanMock
    });
  }));

  it('should attach user object to the scope', function () {
    expect(scope.user.foo).toBe('bar');
  });

  it('should attach a default data object to the scope', function () {
    expect(scope.defaultData).toBeDefined();
  });

  it('should initialize live data with default data', function () {
    expect(angular.equals(scope.defaultData, scope.data)).toBe(true);
  });

  it('should have a reset function that resets data to default', function () {
    expect(scope.reset).toBeDefined();
    scope.data.UnitMake = 'Ford';
    scope.reset();
    expect(angular.equals(scope.defaultData, scope.data)).toBe(true);
  });

  describe('submit function', function () {

    it('should exist', function () {
      expect(scope.submit).toBeDefined();
    });

    it('should create a form validity snapshot on the scope', function () {
      scope.form = {
        foo: 'bar'
      };
      scope.submit();
      expect(angular.equals(scope.validity, scope.form)).toBe(true);
    });

    it('should abort (returning false) if form is invalid', function () {
      scope.form = {
        $valid: false
      };
      spyOn(dialogMock, 'dialog').andCallThrough();
      var result = scope.submit();
      expect(result).toBe(false);
      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should open a confirmation dialog if form is valid', function () {
      scope.form = {
        $valid: true
      };
      spyOn(dialogMock, 'dialog').andCallThrough();
      var result = scope.submit();
      expect(result).not.toBeDefined();
      expect(dialogMock.dialog).toHaveBeenCalled();
      expect(dialogMock.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/floorCarConfirm.html');
      expect(dialogMock.dialog.mostRecentCall.args[0].controller).toBe('FloorCarConfirmCtrl');
    });

    it('should stop if dialog promise resolves to anything other than true', function () {
      scope.form = {
        $valid: true
      };
      confirmSetting.resolution = 'I want to edit some more';
      spyOn(scope, 'reallySubmit');
      scope.submit();
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    });

    it('should hand off to reallySubmit if dialog promise resolves to true', function () {
      scope.form = {
        $valid: true
      };
      confirmSetting.resolution = true;
      spyOn(scope, 'reallySubmit');
      scope.submit();
      expect(scope.reallySubmit).toHaveBeenCalled();
    });

  });

  describe('reallySubmit function', function () {

    it('should balk if called directly from view', function () {
      expect(scope.reallySubmit).toThrow();
    });

    it('should work if called with guard', function () {
      expect(function () {
        scope.reallySubmit(protect);
      }).not.toThrow();
    });

    it('should call floorplan create method with form data model', function () {
      spyOn(floorplanMock, 'create').andCallThrough();
      scope.reallySubmit(protect);
      expect(floorplanMock.create).toHaveBeenCalledWith(scope.data);
    })

    it('should open a message box and reset form data on success', function () {
      scope.data.foo = 'bar';
      createSetting.resolution = 'it worked!';
      spyOn(dialogMock, 'messageBox').andCallThrough();

      scope.reallySubmit(protect);

      expect(dialogMock.messageBox).toHaveBeenCalled();
      expect(angular.equals(scope.data, scope.defaultData)).toBe(true);
    });

    it('should publish the error message on error and leave the form as-is', function () {
      scope.data.foo = 'bar';
      createSetting.error = 'problem123';
      spyOn(dialogMock, 'messageBox').andCallThrough();

      scope.reallySubmit(protect);

      expect(scope.submitError).toBe('problem123');
      expect(dialogMock.messageBox).not.toHaveBeenCalled();
      expect(angular.equals(scope.data, scope.defaultData)).toBe(false);
    });

  });

});
