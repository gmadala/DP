'use strict';

describe('Controller: EditTitleCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var EditTitleCtrl,
    scope,
    mockStateList,
    dialog,
    floorplan,
    Floorplan,
    User;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _Floorplan_, _User_) {
    scope = $rootScope.$new();

    mockStateList = [
      {
        StateName: 'Alabama',
        StateId: '1'
      },
      {
        StateName: 'Texas',
        StateId: '2'
      }
    ];

    dialog = {
      close: angular.noop
    };

    floorplan = {
      FloorplanId: 'floorplan123',
      TitleNumber: 'title123',
      TitleState: 'Texas'
    };

    Floorplan = _Floorplan_;
    User = _User_;

    spyOn(User, 'getStatics').andReturn({
      states: mockStateList
    });

    EditTitleCtrl = $controller('EditTitleCtrl', {
      $scope: scope,
      dialog: dialog,
      floorplan: floorplan
    });
  }));

  it('should attach the list of available states to the scope', function () {
    expect(scope.states).toBe(mockStateList);
  });

  describe('getStateObjForName function', function () {

    it('should return the state object matching the given state name', function () {
      var result = scope.getStateObjForName('Alabama');
      expect(result.StateName).toBe('Alabama');
      expect(result.StateId).toBe('1');
    });

    it('should return null if the given state name matches no states', function () {
      var result = scope.getStateObjForName('New Brunswick');
      expect(result).toBe(null);
    });

  });

  it('should attach an inputModel to the scope with the current values from the floorplan', function () {
    expect(scope.inputModel).toBeDefined();
    expect(scope.inputModel.titleNumber).toBe('title123');
    expect(scope.inputModel.titleState).toBe(mockStateList[1]);
  });

  describe('submit function', function () {

    var $q;

    beforeEach(inject(function (_$q_) {
      scope.form = {
        $invalid: false
      };

      $q = _$q_;
    }));

    it('should make a snapshot copy of the form controller for validation state display', function () {
      scope.form.$invalid = true;
      scope.submit();
      expect(angular.equals(scope.validity, scope.form)).toBe(true);
      expect(scope.validity).not.toBe(scope.form);
    });

    it('should skip the commit if the form is invalid', function () {
      spyOn(Floorplan, 'setTitleInfo').andReturn($q.when('OK'));
      scope.form.$invalid = true;
      scope.submit();
      expect(Floorplan.setTitleInfo).not.toHaveBeenCalled();
      expect(scope.submitInProgress).not.toBe(true);
    });

    it('should initiate a commit and set submitInProgress flag if the form is valid', function () {
      spyOn(Floorplan, 'setTitleInfo').andReturn($q.when('OK'));
      scope.submit();
      expect(Floorplan.setTitleInfo).toHaveBeenCalled();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should provide the required information to commit', function () {
      spyOn(Floorplan, 'setTitleInfo').andReturn($q.when('OK'));
      scope.inputModel.titleNumber = 'newTitle123';
      scope.inputModel.titleState = {StateName: 'foo', StateId: 'bar'};
      scope.submit();
      expect(Floorplan.setTitleInfo.mostRecentCall.args[0]).toBe('floorplan123');
      expect(Floorplan.setTitleInfo.mostRecentCall.args[1]).toBe('newTitle123');
      expect(Floorplan.setTitleInfo.mostRecentCall.args[2]).toBe(scope.inputModel.titleState);
    });

    it('should set submitInProgress to false on error and leave the dialog open', function () {
      spyOn(Floorplan, 'setTitleInfo').andReturn($q.reject('uh oh'));
      spyOn(dialog, 'close');
      scope.submit();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialog.close).not.toHaveBeenCalled();
    });

    it('should leave the floorplan object unmodified on error', function () {
      spyOn(Floorplan, 'setTitleInfo').andReturn($q.reject('uh oh'));
      scope.submit();
      scope.$apply();
      expect(floorplan.TitleNumber).toBe('title123');
      expect(floorplan.TitleState).toBe('Texas');
    });

    it('should set submitInProgress to false on success and close the dialog', function () {
      spyOn(Floorplan, 'setTitleInfo').andReturn($q.when('OK'));
      spyOn(dialog, 'close');
      scope.submit();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialog.close).toHaveBeenCalled();
    });

    it('should update the floorplan object locally with the new values on success', function () {
      spyOn(Floorplan, 'setTitleInfo').andReturn($q.when('OK'));
      scope.inputModel.titleNumber = 'newTitle123';
      scope.inputModel.titleState = {StateName: 'foo', StateId: 'bar'};
      scope.submit();
      scope.$apply();
      expect(floorplan.TitleNumber).toBe('newTitle123');
      expect(floorplan.TitleState).toBe('foo');
    });

  });

  it('should attach a close function to the scope that closes the dialog', function () {
    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
  });

});
