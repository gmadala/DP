'use strict';

describe('Controller: EditTitleCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var EditTitleCtrl,
    scope,
    dialogMock,
    fpMock,
    vDesc,
    floorplanMock,
    userMock,
    formMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    scope.form = { $invalid: false };

    dialogMock = {
      close: angular.noop
    };

    fpMock = {
      FloorplanID: 1234,
      TitleNumber: 1,
      TitleState: { "StateName": "Alaska", "StateId": "AK" },
    };

    vDesc = "This is a vehicle description.";

    userMock = {
      getStatics: function() {
        return {
          states: [
              { "StateName": "Alabama", "StateId": "AL" },
              { "StateName": "Alaska", "StateId": "AK" },
              { "StateName": "Arizona", "StateId": "AZ" },
            ]
        };
      }
    };

    floorplanMock = {
      setTitleInfo: function(){
        return {
          then: function(success) {
            return true;
          }
        };
      }
    };

    EditTitleCtrl = $controller('EditTitleCtrl', {
      $scope: scope,
      dialog: dialogMock,
      floorplan: fpMock,
      vehicleDescription: vDesc,
      User: userMock,
      Floorplan: floorplanMock,
    });

    spyOn(scope, 'submit').andCallThrough();
    spyOn(floorplanMock, 'setTitleInfo').andCallThrough();
  }));

  it('should attach the states list to the scope', function () {
    expect(scope.states).toEqual(userMock.getStatics().states);
  });

  it('should have a function to grab state object from name', function() {
    expect(typeof scope.getStateObjForName).toBe('function');

    var myStateObj = scope.getStateObjForName('foo bar');
    var myStateObj2 = scope.getStateObjForName('Alaska');

    expect(myStateObj).toBe(null);
    expect(myStateObj2).toEqual( { "StateName": "Alaska", "StateId": "AK" } );
  });

  it('should create an inputModel object', function() {
    expect(scope.inputModel).toBeDefined();
  });

  it('should have a submit function to set title info', function() {
    scope.submit();
    expect(floorplanMock.setTitleInfo).toHaveBeenCalled();
  });
});
