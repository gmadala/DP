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
    AddressesMock,
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
      getTitleReleaseEligibility: function () {
        return $q.when({});
      }
    };
    AddressesMock = {
      getTitleAddresses: function(){
        return [
          { AddressId: '1' },
          { AddressId: '2' }
        ];
      },
      getDefaultTitleAddress: function() {
        return {
          AddressId: 'foo'
        };
      }
    };
    floorplanMock = {
      getVehicleDescription: function() {}
    };

    dialogMock = {
      open: function () {
        return {
            result: {
              then: function (callback) {
                callback();
              }
            }
        }
      }
    };

    TitleReleaseCheckoutCtrl = $controller('TitleReleaseCheckoutCtrl', {
      $scope: scope,
      TitleReleases: titleReleasesMock,
      Floorplan: floorplanMock,
      $uibModal: dialogMock,
      Addresses: AddressesMock
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
    });

    it('should have removeFromQueue method point to TitleReleases method', function() {
      expect(scope.titleQueue.removeFromQueue).toBe(titleReleasesMock.removeFromQueue);
    });

  });

  it('should get title release addresses', function() {
    expect(scope.addresses).toBeDefined();
  });

  it('should set getVehicleDescription to point to the Floorplan method', function() {
    expect(scope.getVehicleDescription).toBe(floorplanMock.getVehicleDescription);
  });

  describe('onConfirmRequest method', function() {

    it('should call makeRequest', function(){
      spyOn(titleReleasesMock, 'makeRequest').and.callThrough();
      scope.onConfirmRequest();
      expect(titleReleasesMock.makeRequest).toHaveBeenCalled();
    });

    it('should open dialog once API call is done', function() {
      spyOn(dialogMock, 'open').and.callThrough();
      scope.onConfirmRequest();
      expect(dialogMock.open).toHaveBeenCalled();
    });

    it('should clear queue and redirect to search once dialog closes', function() {
      spyOn(titleReleasesMock, 'clearQueue');
      spyOn(state, 'transitionTo');
      scope.onConfirmRequest();
      expect(titleReleasesMock.clearQueue).toHaveBeenCalled();
      expect(state.transitionTo).toHaveBeenCalledWith('titlereleases');
    });

  });


});
