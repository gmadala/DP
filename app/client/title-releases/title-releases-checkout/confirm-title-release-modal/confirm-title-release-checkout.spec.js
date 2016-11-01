'use strict';

describe('Controller: ConfirmTitleReleaseCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ConfirmTitleReleaseCheckoutCtrl,
    scope,
    state,
    stateParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, Floorplan, $state, $stateParams) {
    scope = $rootScope.$new();
    state = $state;
    stateParams = $stateParams;
    
    ConfirmTitleReleaseCheckoutCtrl = $controller('ConfirmTitleReleaseCheckoutCtrl', {
      $scope: scope,
      $stateParams: stateParams
    });

  }));


  describe('Confirm Title Release', function () {
    it('Return to Title Releases page', function () {
      spyOn(state, 'transitionTo');
      scope.backToTitleReleases();
      expect(state.transitionTo).toHaveBeenCalledWith('titlereleases');
    });
  });

});
