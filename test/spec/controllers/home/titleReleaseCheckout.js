'use strict';

describe('Controller: TitleReleaseCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var TitleReleaseCheckoutCtrl,
    titleReleasesMock,
    searchResult = {
      data: {}
    },
    scope,
    floorplanMock,
    dialogMock,
    titleAddressesMock,
    state,
    queue = [];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, Floorplan, $state) {
    scope = $rootScope.$new();
    state = $state;
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
      },
      clearQueue: angular.noop,
      getTitleReleaseEligibility: angular.noop
    };
    titleAddressesMock = {
      getAddresses: function(){
        return {
          then: function(callback) {
            callback([{Address: 1}, {Address:2}]);
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
          open: function(){
            return {
              then: function(cb) {
                cb();
              }
            };
          }
        };
      }
    };

    TitleReleaseCheckoutCtrl = $controller('TitleReleaseCheckoutCtrl', {
      $scope: scope,
      TitleReleases: titleReleasesMock,
      Floorplan: floorplanMock,
      $dialog: dialogMock,
      TitleAddresses: titleAddressesMock
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

  it('should get title release addresses in a promise', function() {
    expect(typeof scope.addresses.then).toBe('function');
  });

  describe('toShortAddress', function() {
    it('should join address into string', function() {
      var address = {
        Line1: 'line 1',
        Line2: 'line 2',
        City: 'city',
        State: 'state',
        Zip: 'zip'
      };

      expect(scope.toShortAddress(address)).toEqual('line 1 line 2 / city state zip');
    });
  });

  it('should set getVehicleDescription to point to the Floorplan method', function() {
    expect(scope.getVehicleDescription).toBe(floorplanMock.getVehicleDescription);
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

    it('should clear queue and redirect to search once dialog closes', function() {
      spyOn(titleReleasesMock, 'clearQueue');
      spyOn(state, 'transitionTo');
      scope.onConfirmRequest();
      expect(titleReleasesMock.clearQueue).toHaveBeenCalled();
      expect(state.transitionTo).toHaveBeenCalledWith('home.titlereleases');
    });

  });


});
