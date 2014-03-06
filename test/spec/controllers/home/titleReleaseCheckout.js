'use strict';

describe('Controller: TitleReleaseCheckoutCtrl', function () {

  /*// load the controller's module
  beforeEach(module('nextgearWebApp'));

  var TitleReleaseCheckoutCtrl,
    titleReleasesMock,
    searchResult = {
      data: {}
    },
    scope,
    floorplanMock,
    dialogMock,
    queue = [];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, Floorplan) {
    scope = $rootScope.$new();
    titleReleasesMock = {
      removeFromQueue: function(){},
      getQueue: function(){
        return queue;
      },
      makeRequest: function() {
        return {
          then: function(callback){
            callback();
          }
        };
      }
    };
    floorplanMock = {
      getVehicleDescription: function() {}
    };

    dialogMock = {
      dialog: function() {
        return {
          open: angular.noop
        };
      }
    };

    TitleReleaseCheckoutCtrl = $controller('TitleReleaseCheckoutCtrl', {
      $scope: scope,
      TitleReleases: titleReleasesMock,
      Floorplan: floorplanMock,
      $dialog: dialogMock
    });

  }));

  describe('titleQueue', function() {

    it('should have a contents property of the queue', function() {
      expect(scope.titleQueue.contents).toBe(queue);
    });

    it('should have a sum function', function() {
      expect(typeof scope.titleQueue.sum).toEqual('function');
    });

    it('should sum AmountFinanced values properly', function() {
      queue.length = 0;
      queue.push({AmountFinanced: 10, FloorplanId: 10});
      queue.push({AmountFinanced: 15, FloorplanId: 15});
      queue.push({AmountFinanced: 20, FloorplanId: 20});

      expect(scope.titleQueue.sum()).toBe(45);
    })

    it('should have removeFromQueue method point to TitleReleases method', function() {
      expect(scope.titleQueue.removeFromQueue).toBe(titleReleasesMock.removeFromQueue);
    });

  });

  it('should set getVehicleDescription to point to the Floorplan method', function() {
    expect(scope.getVehicleDescription).toBe(floorplanMock.getVehicleDescription);
  });

  it('should initialize titleReleaseAddress', function() {
    // TODO: HASN'T BEEN DONE YET, SHOULD BE DONE
    expect(scope.titleReleaseAddress).toBeDefined();
  });

  describe('onConfirmRequest method', function() {

    it('should call makeRequest', function(){
      spyOn(titleReleasesMock, 'makeRequest').andCallThrough();
      scope.onConfirmRequest();
      expect(titleReleasesMock.makeRequest).toHaveBeenCalled();
    });

    it('should open dialog once API call is done', function() {
      spyOn(dialogMock, 'dialog').andCallThrough();
      scope.onConfirmRequest();
      expect(dialogMock.dialog).toHaveBeenCalled();
    });

  });
*/

});
